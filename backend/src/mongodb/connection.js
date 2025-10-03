// src/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true,});
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
    }
})();