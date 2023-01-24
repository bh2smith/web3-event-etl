import os

import requests
from dotenv import load_dotenv
from eth_typing import HexStr
from web3 import Web3

load_dotenv()
ALCHEMY_API_KEY = os.environ['ALCHEMY_API_KEY']
ALCHEMY_APP_ID = os.environ["ALCHEMY_APP_ID"]
alchemy_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"
w3 = Web3(Web3.HTTPProvider(alchemy_url))


def test_it():
    # Print if web3 is successfully connected
    print(w3.isConnected())

    # Get the latest block number
    latest_block = w3.eth.block_number
    print(latest_block)

    # Get the balance of an account
    balance = w3.eth.get_balance("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
    print(balance)

    # Get the information of a transaction
    tx = w3.eth.get_transaction(
        HexStr("0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060")
    )
    print(tx)


def create_webhook():

    url = "https://dashboard.alchemy.com/api/create-webhook"

    payload = {
        "network": "ETH_MAINNET",
        "addresses": ["0x9008D19f58AAbD9eD0D60971565AA8510560ab41"],
        "app_id": ALCHEMY_APP_ID,
        "webhook_url": "www.xyz.com",
    }
    headers = {
        "accept": "application/json",
        "X-Alchemy-Token": ALCHEMY_API_KEY,
        "content-type": "application/json",
    }
    response = requests.post(url, json=payload, headers=headers)

    print(response.text)


if __name__ == "__main__":
    # test_it()
    create_webhook()
