# Web3 Event ETL

Following this diagram

![Diagram](./static/GrandScheme.png)

1. Some Web3 Event occurs (`SettlementEvent`)
2. An independent/external service (such as [Tenderly Web3 Actions](https://tenderly.co/web3-actions)) triggers script
   defined by `docker/Dockerfile.script` passing the relevant arguments.
3. Script Processes Event Data and Inserts into DB.

Note that:

- script image will have ENV vars "baked" in (API keys & DB credentials). So this image would have to be private.

## Build & Run

### Database

```shell
# Build
docker build -f docker/Dockerfile.db -t db-image .
# Run
docker run -d --network=host db-image
```

### Script Container

```shell
# Build
docker build -f ./docker/Dockerfile.script -t script-image .
# Run (requires DB running on localhost)!
docker run -d --network=host script-image --tx-hash 0x1
```

Alternatively, you can use the bash script:

```shell
./process_tx.sh 0x5
```

You can now run the script-image as many times as you like with whatever string you'd like to insert.

## Triggering Script Image

The database and script from above would exist in our AWS cluster as a database & AWS lambda function respectively.

According to [this documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html) it is possible to
invoke a lambda function via POST request.
This would imply that the above services are independent of the options explorer made below

Tenderly Web3 Actions provides a serverless Smart Contract event listener from which one can execute actions defined in
Typescript. In particular, from within the web3 action we could trigger an AWS lambda
via [function URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html). In particular, see

- [creating and managing function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
- [invoking function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

## WebHooks

### Alchemy

Doesn't work. See `alchemy` directory

### Tenderly

Works wonders. Version found in `tenderly` deployed at
https://dashboard.tenderly.co/bh2smith/project/action/6e0a113b-39e3-44cb-b5b2-3b4e8c7db365

Parses Settlement Transfers and currently logs meaningful parsed data.

Nearly all methods are tested.

#### Testing Trigger

```shell
cd tenderly/actions && npm install
yarn test
```

#### Deployment

```shell
cd tenderly
tenderly login
tenderly actions deploy
```

# Deployment Ideas

In kubernetes we might have the following setup:

- [Postgres Instance](https://gist.github.com/anaisbetts/2244d6517dc2cc09b4470e6f68c2bec1)
- [Optional] [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html) for ETL Process
- [Webhook](https://dashboard.tenderly.co/bh2smith/project/action/6e0a113b-39e3-44cb-b5b2-3b4e8c7db365) invoking
  the Lambda or writing directly to the database.

With all of the above setup, one would then deploy a [dune-sync](https://github.com/cowprotocol/dune-sync) cronjob which
reads the DB and uploads to Dunes AWS bucket

### Connect to AWS DB

Generate types

```shell
npx @databases/pg-schema-cli --database $DB_URL --directory src/__generated__
```
where `DB_URL` takes the form `postgresql://{user}:{password}@{host}:{port}/{database}`