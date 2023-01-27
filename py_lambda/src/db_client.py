import os

import psycopg
from psycopg import connection, cursor

DEFAULT_DB_URL = "postgresql://postgres:postgres@localhost:5432/postgres"


def connect() -> tuple[connection, cursor]:
    # dsn=f"postgresql://{user}:{password}@{host}:{port}/{database}
    conn = psycopg.connect(conninfo=os.environ.get("DATABASE_URL", DEFAULT_DB_URL))
    print("acquired database connection!")
    return conn, conn.cursor()


def insert_tx_hash(tx_hash: str, solver: str):
    """Inserts (`tx_hash`, `solver`) into event_tx_hashes table"""
    conn, cur = connect()
    cur.execute(
        f"INSERT INTO event_tx_hashes (tx_hash, solver) values ('{tx_hash}', '{solver}')"
    )
    conn.commit()
    print(f"insert success: ({tx_hash},{solver})!")
