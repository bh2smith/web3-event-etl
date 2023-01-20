import os

import psycopg
from psycopg import connection, cursor


def connect() -> tuple[connection, cursor]:
    # dsn=f"postgresql://{user}:{password}@{host}:{port}/{database}
    conn = psycopg.connect(conninfo=os.environ["DB_URL"])
    return conn, conn.cursor()


def insert_tx_hash(tx_hash: str):
    """Inserts `tx_hash` into event_tx_hashes table"""
    conn, cur = connect()
    cur.execute(f"INSERT INTO event_tx_hashes (tx_hash) values ('{tx_hash}')")
    conn.commit()
    print(f"Inserted and committed {tx_hash} to DB")
