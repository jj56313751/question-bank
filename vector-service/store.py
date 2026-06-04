from typing import Any

import chromadb
from chromadb.config import Settings

from config import COLLECTION_NAME, DATA_DIR, MIN_SEARCH_SCORE
from embedding import embed_texts


def _doc_id(question_id: int) -> str:
    return f"question_{question_id}"


def build_document_text(title: str) -> str:
    """向量检索仅使用题干（title）。"""
    return (title or "").strip()


class QuestionVectorStore:
    def __init__(self) -> None:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(
            path=str(DATA_DIR),
            settings=Settings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

    def upsert(
        self,
        question_id: int,
        bank_id: int,
        question_type: int | None,
        title: str,
        options: str | None,
        answer: str | None,
        analysis: str | None,
    ) -> None:
        doc_id = _doc_id(question_id)
        document = build_document_text(title)
        embedding = embed_texts([document])[0]
        self._collection.upsert(
            ids=[doc_id],
            embeddings=[embedding],
            documents=[document],
            metadatas=[
                {
                    "question_id": question_id,
                    "bank_id": bank_id,
                    "type": question_type if question_type is not None else -1,
                }
            ],
        )

    def delete(self, question_id: int) -> None:
        self._collection.delete(ids=[_doc_id(question_id)])

    def search(
        self,
        query: str,
        bank_id: int,
        top_k: int = 20,
        min_score: float | None = None,
    ) -> list[dict[str, Any]]:
        threshold = MIN_SEARCH_SCORE if min_score is None else min_score
        # 多召回一些候选，过滤低分后再截取 top_k
        n_results = min(max(top_k * 5, top_k), 100)
        query_embedding = embed_texts([query])[0]
        result = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"bank_id": bank_id},
            include=["metadatas", "distances"],
        )
        items: list[dict[str, Any]] = []
        if not result["ids"] or not result["ids"][0]:
            return items
        for i, doc_id in enumerate(result["ids"][0]):
            metadata = result["metadatas"][0][i] if result["metadatas"] else {}
            distance = result["distances"][0][i] if result["distances"] else 0
            # cosine 距离越小越相似，转为 0~1 相似度分数
            score = round(1 - distance, 4)
            if score < threshold:
                continue
            items.append(
                {
                    "id": int(metadata.get("question_id", 0)),
                    "score": score,
                }
            )
            if len(items) >= top_k:
                break
        return items

    def upsert_batch(self, questions: list[dict[str, Any]]) -> int:
        if not questions:
            return 0
        ids: list[str] = []
        documents: list[str] = []
        metadatas: list[dict[str, Any]] = []
        for q in questions:
            qid = int(q["id"])
            ids.append(_doc_id(qid))
            documents.append(build_document_text(q.get("title") or ""))
            metadatas.append(
                {
                    "question_id": qid,
                    "bank_id": int(q["bank_id"]),
                    "type": int(q["type"]) if q.get("type") is not None else -1,
                }
            )
        embeddings = embed_texts(documents)
        self._collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )
        return len(ids)


_store: QuestionVectorStore | None = None


def get_store() -> QuestionVectorStore:
    global _store
    if _store is None:
        _store = QuestionVectorStore()
    return _store
