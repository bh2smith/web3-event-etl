import argparse

from dotenv import load_dotenv

from src.db_client import insert_tx_hash

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
