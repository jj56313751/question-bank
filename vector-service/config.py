import os
from pathlib import Path

from dotenv import load_dotenv

# 读取项目根目录 .env（与 Next 共用 VECTOR_MIN_SCORE 等配置）
load_dotenv(Path(__file__).parent.parent / ".env")

# 向量库持久化目录
DATA_DIR = Path(os.getenv("VECTOR_DATA_DIR", str(Path(__file__).parent / "data")))
# 嵌入模型（支持中文语义检索）
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL", "shibing624/text2vec-base-chinese"
)
# Chroma 集合名
COLLECTION_NAME = os.getenv("VECTOR_COLLECTION_NAME", "questions")
# 服务监听
HOST = os.getenv("VECTOR_HOST", "0.0.0.0")
PORT = int(os.getenv("VECTOR_PORT", "8001"))
# 语义检索最低相关度（0~1），低于此值的结果不返回，默认 0.5 即 50%
MIN_SEARCH_SCORE = float(os.getenv("VECTOR_MIN_SCORE", "0.5"))
