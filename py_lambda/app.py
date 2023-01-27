import json

import src.db_client as db


def handler(event, context):
    print("Received Event", json.dumps(event))
    print("Context", context)
    """
    Strange issue where locally and when testing in 
    AWS Console posted `data = {'txHash': 'Hello2', 'solver': 'World2'}`
    results in `event = data`.
    However, when called via function lambda it results in 
    this big ridiculous and misleading JSON file with json content inside "body"
    `event = { "body": data, "other_stuff": {...} }` 
    """
    # TODO - this is a hacky way of handling both event types.
    if "body" in event:
        event = json.loads(event["body"])
    print("Body", event)

    db.insert_tx_hash(tx_hash=event["txHash"], solver=event["solver"])

    return {"statusCode": 200, "body": json.dumps(event)}
