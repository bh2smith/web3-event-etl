import axios from "axios";
async function invokeLambda(
  functionUrl: string,
  txHash: string,
  solver: string
) {
  console.log(`Invoking AWS Lambda Pipeline for (${txHash}, ${solver})`);
  try {
    const response = await axios.post(
      functionUrl,
      {
        txHash: txHash,
        solver: solver,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(`Lambda response: ${response.data}`);
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.status);
      console.log(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else if (error.message) {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    } else {
      console.log(error);
    }
  }
}

export { invokeLambda };
