Instructions borrowed from: https://docs.aws.amazon.com/lambda/latest/dg/typescript-image.html
Instructions are very similar to our [python lambda](../py_lambda/README.md).

This project also shares code with the [tenderly action](../tenderly/actions).
So it looks a lot like the project would be quite succinct/compact if it were entirely in NodeJS.

## Local e2e Test
```shell
docker build -t ${IMAGE_NAME} .
docker run -p 9000:8080 ${IMAGE_NAME}
 export FUNCTION_URL=http://localhost:9000/2015-03-31/functions/function/invocations
curl -XPOST ${FUNCTION_URL} -d '{}'
```

