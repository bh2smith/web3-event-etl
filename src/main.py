import argparse

from dotenv import load_dotenv

import os

import psycopg
from psycopg import connection, cursor


def connect() -> tuple[connection, cursor]:
    # dsn=f"postgresql://{user}:{password}@{host}:{port}/{database}
    conn = psycopg.connect(conninfo=os.environ["DATABASE_URL"])
    return conn, conn.cursor()


def insert_tx_hash(tx_hash: str, solver: str):
    """Inserts `tx_hash` into event_tx_hashes table"""
    conn, cur = connect()
    cur.execute(
        f"INSERT INTO event_tx_hashes (tx_hash, solver) values ('{tx_hash}', '{solver}')"
    )
    conn.commit()
    print(f"Inserted and committed {tx_hash} to DB")


if __name__ == "__main__":
    load_dotenv()
    parser = argparse.ArgumentParser("Event Processing")
    parser.add_argument(
        "--tx-hash",
        type=str,
        required=True,
    )
    args, _ = parser.parse_known_args()
    insert_tx_hash(args.tx_hash)
