from functools import lru_cache

from sentence_transformers import SentenceTransformer

from config import EMBEDDING_MODEL


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """加载句子嵌入模型（进程内单例）。"""
    return SentenceTransformer(EMBEDDING_MODEL)


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    vectors = model.encode(texts, normalize_embeddings=True)
    return vectors.tolist()
