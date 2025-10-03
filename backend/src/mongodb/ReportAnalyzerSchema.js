import mongoose from 'mongoose';

const reportAnalyzerSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    threatLevel: {
        type: [String],
        enum: ["low", "medium", "high"],
        required: false
    },
    servicesRequired: {
        type: [String],
        required: false
    },
    location: {
        type: String,
        required: false
    },
    describe: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Rename the model export to avoid using 'ReportAnalyzer'
export const ReportModel = mongoose.model('ReportAnalyzer', reportAnalyzerSchema);
