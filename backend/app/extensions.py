from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import redis

db = SQLAlchemy()

jwt = JWTManager()

# Redis / Memurai connection
redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)