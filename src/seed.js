import "./config/env.config.js";
import mongoose from "mongoose";
import Site from "./models/Site.model.js";
import { connectDB } from "./db/connection.db.js";
import { sites } from "./sites.seed.js";

const seed = async () => {
  await connectDB();

  for (const site of sites) {
    await Site.findOneAndUpdate(
      { key: site.key },
      { $set: site },
      { upsert: true, returnDocument: "after", runValidators: true }
    );
    console.log(`✅ Site ready: ${site.key} → ${site.receiverEmail}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
