# AWS Lambda Function (Container Image of Python Handler)

# Build

```shell
docker build -t test-lambda .
```

## Local E2E Test

Assuming you have a local postgres instance running at:

```shell
export DB_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

Run the lambda locally

```shell
docker run -p 9000:8080 -env DATABASE_URL=$DB_URL test-lambda
```

Post to handler

```shell
 export LAMBDA_URL=http://localhost:9000/2015-03-31/functions/function/invocations
curl -XPOST ${LAMBDA_URL} -d '{"txHash": "Hello2", "solver": "World2"}'
```

# Create & Publish to Container Registry

```shell
export AWS_REGION=
export AWS_ID=
export IMAGE_NAME=test-lambda
export AWS_URL=${AWS_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
```

```shell
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_URL}
aws ecr create-repository --repository-name ${IMAGE_NAME} --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE
docker tag ${IMAGE_NAME}:latest ${AWS_URL}/${IMAGE_NAME}:latest
docker push ${AWS_URL}/${IMAGE_NAME}:latest 
```

# Create Lambda from Image

Via AWS Console this can now be selected. Set relevant environment variables. In the configuration settings, you can
enable `functionURL`. Once the functionURL is acquired try to invoke it as following:

```shell
export FUNCTION_URL=
```

then

```shell
curl -XPOST \
      ${FUNCTION_URL} \
      -H 'content-type: application/json' \
      -d '{"txHash": "Hello2", "solver": "World2"}'
```