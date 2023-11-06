import { startServer } from "./mock-idp";

startServer(4220)
  .then()
  .catch((error) => {
    console.error("Failed to start mock idp with error: " + error);
  });
