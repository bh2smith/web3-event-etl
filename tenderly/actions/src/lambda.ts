import axios from 'axios';
export async function invokeLambda(
  functionUrl: string,
  txHash: string,
  solver: string
) {
  console.log(`Invoking AWS Lambda Pipeline for (${txHash}, ${solver})`);
  const response = await axios.post("https://reqres.in/api/users", {
    method: "POST",
    body: JSON.stringify({
      txHash: txHash,
      solver: solver,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.log(response.status)
}
