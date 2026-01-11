import app from "./server";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 3333;

app.listen(PORT, () => {
  console.info(`Server rodando em http://localhost:${PORT}`);
});
