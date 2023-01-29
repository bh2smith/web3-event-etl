# AWS Lambda Function (Container Image of Python Handler)

The following is adapted from these [AWS Docs]([Docs here](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html))

Setup environment

```shell
cp .env_sample .env
source .env
```

which should consist of things like

```shell
# Container Image Build and Publish env
export IMAGE_NAME=
export AWS_REGION=
export AWS_ID=
export AWS_URL=${AWS_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Run time env
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
export FUNCTION_URL=http://localhost:9000/2015-03-31/functions/function/invocations
```

# Build

```shell
docker build -t ${IMAGE_NAME} .
```

## Local E2E Test

Assuming you have a local postgres instance running at:

Run the lambda locally at `postgresql://postgres:postgres@localhost:5432/postgres`

```shell
docker run -p 9000:8080 -env DATABASE_URL=${DATABASE_URL} ${IMAGE_NAME}
```

Post to handler

```shell
curl -XPOST ${FUNCTION_URL} -d '{"txHash": "Hello", "solver": "World"}'
```

# Create & Publish to Container Registry

```shell
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_URL}
aws ecr create-repository --repository-name ${IMAGE_NAME} --region ${AWS_REGION} --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE
docker tag ${IMAGE_NAME}:latest ${AWS_URL}/${IMAGE_NAME}:latest
docker push ${AWS_URL}/${IMAGE_NAME}:latest 
```

# Create Lambda from Image

Via AWS Console this can now be selected. Set relevant environment variables. In the configuration settings, you can
enable `functionURL`. Once the functionURL is acquired try to invoke it as following:

then

```shell
export REMOTE_URL=

curl -XPOST \
      ${REMOTE_URL} \
      -H 'content-type: application/json' \
      -d '{"txHash": "Hello", "solver": "World"}'
```


### Notes & Issues

- Role/Permissions were wrong (cf [slack](https://cowservices.slack.com/archives/D04J9FVJHEG/p1674822913397879))
- Test (event) input does not agree with input coming from functionURL (must append some SSL stuff).
