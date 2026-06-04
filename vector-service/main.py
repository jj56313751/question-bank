from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from config import HOST, MIN_SEARCH_SCORE, PORT
from store import get_store

app = FastAPI(title="题库向量检索服务", version="1.0.0")


class QuestionIndexBody(BaseModel):
    id: int
    bank_id: int = Field(..., alias="bankId")
    type: int | None = None
    title: str
    options: str | None = None
    answer: str | None = None
    analysis: str | None = None

    model_config = {"populate_by_name": True}


class SearchBody(BaseModel):
    query: str
    bank_id: int = Field(..., alias="bankId")
    top_k: int = Field(20, alias="topK")
    min_score: float | None = Field(None, alias="minScore")

    model_config = {"populate_by_name": True}


class BatchIndexBody(BaseModel):
    questions: list[QuestionIndexBody]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/questions/index")
def index_question(body: QuestionIndexBody) -> dict[str, Any]:
    store = get_store()
    store.upsert(
        question_id=body.id,
        bank_id=body.bank_id,
        question_type=body.type,
        title=body.title,
        options=body.options,
        answer=body.answer,
        analysis=body.analysis,
    )
    return {"ok": True, "id": body.id}


@app.delete("/api/questions/{question_id}")
def delete_question(question_id: int) -> dict[str, Any]:
    store = get_store()
    store.delete(question_id)
    return {"ok": True, "id": question_id}


@app.post("/api/questions/search")
def search_questions(body: SearchBody) -> dict[str, Any]:
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="query 不能为空")
    min_score = body.min_score if body.min_score is not None else MIN_SEARCH_SCORE
    if min_score < 0 or min_score > 1:
        raise HTTPException(status_code=400, detail="minScore 须在 0~1 之间")
    store = get_store()
    results = store.search(
        query=body.query.strip(),
        bank_id=body.bank_id,
        top_k=body.top_k,
        min_score=min_score,
    )
    return {"results": results, "minScore": min_score}


@app.post("/api/questions/batch-index")
def batch_index(body: BatchIndexBody) -> dict[str, Any]:
    store = get_store()
    payload = [
        {
            "id": q.id,
            "bank_id": q.bank_id,
            "type": q.type,
            "title": q.title,
            "options": q.options,
            "answer": q.answer,
            "analysis": q.analysis,
        }
        for q in body.questions
    ]
    count = store.upsert_batch(payload)
    return {"ok": True, "count": count}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=False)
