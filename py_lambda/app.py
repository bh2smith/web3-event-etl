import json

import src.db_client as db


def handler(event, context):
    print("Received Event", event)
    print("Context", context)

    db.insert_tx_hash(tx_hash=event["txHash"], solver=event["solver"])

    return {"statusCode": 200, "body": json.dumps(event)}
