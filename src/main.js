import "./config/env.config.js";
import app from "./app.bootstrap.js";
import { connectDB } from "./db/connection.db.js";
import { PORT, NODE_ENV } from "./config/env.config.js";

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${NODE_ENV}]`);
  });
};

start();
