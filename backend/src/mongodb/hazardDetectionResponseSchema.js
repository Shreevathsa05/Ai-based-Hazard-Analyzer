import mongoose from 'mongoose';

const hazardDetectionResponseSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['safe', 'hazard_detected'],
    required: true
  },
  emergencyServicesRequired: {
    type: [String],
    enum: [
      'police',
      'ambulance',
      'fire_brigade',
      'traffic_control',
      'hazmat_team',
      'rescue_team',
      'others'
    ],
    required: false,
    default: undefined, // So nullable arrays can be saved as null or undefined
  },
  trafficCondition: {
    type: String,
    required: false,
  },
  dangerLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: false
  },
  detectedHazards: {
    type: [String],
    required: false,
    default: undefined
  },
  location: {
    type: String,
    required: false
  },
  additionalNotes: {
    type: String,
    required: false
  }
}, { timestamps: true });

// The exported model name can differ from the schema object name
export const HazardDetectionResponseModel = mongoose.model('HazardDetectionResponse', hazardDetectionResponseSchema);
