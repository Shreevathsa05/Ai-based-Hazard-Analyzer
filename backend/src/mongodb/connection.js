// src/db.js
import mongoose from 'mongoose';

(async () => {
    try {
        await mongoose.connect('mongodb+srv://quadrant593:mubULtnialEeSsxy@quadrant.tewouce.mongodb.net/ieee', {
            useNewUrlParser: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
    }
})();