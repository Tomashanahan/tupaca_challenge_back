import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./db";
import app from "./app";

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    await AppDataSource.initialize();
    app.listen(PORT);
    console.log("Server on port", PORT);
  } catch (error) {
    console.error(error);
  }
}

main();
