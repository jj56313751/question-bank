"""
从 MySQL 全量重建向量索引。需配置 DATABASE_URL（与 Next 项目相同）。
用法：cd vector-service && python scripts/reindex_all.py
"""
import os
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT.parent / ".env")

import pymysql  # noqa: E402

from store import get_store  # noqa: E402

BATCH_SIZE = 100


def parse_database_url(database_url: str) -> dict:
    """解析 Prisma 风格的 DATABASE_URL（支持 ?connection_limit 等查询参数）。"""
    normalized = database_url.strip()
    if normalized.startswith("mysql2://"):
        normalized = "mysql://" + normalized[len("mysql2://") :]
    elif not normalized.startswith("mysql://"):
        raise ValueError("DATABASE_URL 须为 mysql:// 或 mysql2:// 开头")

    parsed = urlparse(normalized)
    database = (parsed.path or "").lstrip("/")
    if not database:
        raise ValueError("DATABASE_URL 中缺少数据库名")

    return {
        "host": parsed.hostname or "127.0.0.1",
        "port": parsed.port or 3306,
        "user": unquote(parsed.username or ""),
        "password": unquote(parsed.password or ""),
        "database": database,
    }


def fetch_questions(conn) -> list[dict]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, bank_id, type, title, options, answer, analysis
            FROM questions
            WHERE deleted_at IS NULL
            ORDER BY id ASC
            """
        )
        rows = cur.fetchall()
    result = []
    for row in rows:
        result.append(
            {
                "id": row[0],
                "bank_id": row[1],
                "type": row[2],
                "title": row[3] or "",
                "options": row[4],
                "answer": row[5],
                "analysis": row[6],
            }
        )
    return result


def main() -> None:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("请设置环境变量 DATABASE_URL")
        sys.exit(1)
    try:
        db_config = parse_database_url(database_url)
    except ValueError as e:
        print(f"DATABASE_URL 解析失败: {e}")
        sys.exit(1)
    conn = pymysql.connect(
        host=db_config["host"],
        port=db_config["port"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
    )
    questions = fetch_questions(conn)
    conn.close()
    store = get_store()
    total = 0
    for i in range(0, len(questions), BATCH_SIZE):
        batch = questions[i : i + BATCH_SIZE]
        total += store.upsert_batch(batch)
        print(f"已索引 {total}/{len(questions)}")
    print(f"完成，共 {total} 条题目")


if __name__ == "__main__":
    main()
