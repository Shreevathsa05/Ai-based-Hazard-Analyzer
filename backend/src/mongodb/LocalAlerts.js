import mongoose from "mongoose";
const LocalAlertsSchema = new mongoose.Schema({
    message: {
        type: String,        
        required: true
    },
    description: {
        type: String,       
        required: false
    },
    date: {
        type: Date,         
        required: true
    },
    location: {
        type: String,      
        required: true
    },
}, { timestamps: true });

export const LocalAlerts = mongoose.model('LocalAlerts', LocalAlertsSchema);
