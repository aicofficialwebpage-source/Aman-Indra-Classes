import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aman_indra_classes";

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

async function run() {
  try {
    console.log(`Connecting to database at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    const updates = [
      { key: "contactPhone", value: "+91 91400 64194" },
      { key: "contactEmail", value: "aicofficialwebpage@gmail.com" },
      {
        key: "contactAddress",
        value: "Ratanlal Nagar Main Road, High Income Grade, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Kanpur, Uttar Pradesh – 208022"
      },
      { key: "whatsappNumber", value: "919140064194" },
      { key: "seoMetaTitle", value: "Aman Indra Classes (AIC) - Best Coaching in Ratan Lal Nagar, Kanpur" }
    ];

    for (const update of updates) {
      const doc = await Setting.findOneAndUpdate(
        { key: update.key },
        { value: update.value },
        { upsert: true, new: true }
      );
      console.log(`Updated setting: [${doc.key}] => "${doc.value}"`);
    }

    console.log("Database update completed successfully.");
  } catch (error) {
    console.error("Error updating database settings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
