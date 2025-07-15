const mongoose = require('mongoose');

const sourceClauseSchema = new mongoose.Schema({
  clause_id: String,
  text: String,
  policy_name: String,
  similarity: Number
});

const querySchema = new mongoose.Schema({
  query_text: { type: String, required: true },
  processed_entities: {
    age: Number,
    gender: String,
    procedure: String,
    location: String,
    policy_duration: {
      value: Number,
      unit: String
    },
    amount: Number
  },
  result: {
    decision: { 
      type: String, 
      enum: ['Approved', 'Rejected', 'Conditional'],
      required: true
    },
    amount: Number,
    justification: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1 },
    source_clauses: [sourceClauseSchema],
    reasoning_steps: [String]
  },
  processing_time: { type: Number, required: true }, // in milliseconds
  session_id: String,
  user_feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    helpful: Boolean
  },
  status: {
    type: String,
    enum: ['processed', 'failed', 'pending'],
    default: 'processed'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for processing time in seconds
querySchema.virtual('processingTimeSeconds').get(function() {
  return this.processing_time ? (this.processing_time / 1000).toFixed(2) : 0;
});

// Index for better query performance
querySchema.index({ createdAt: -1 });
querySchema.index({ 'result.decision': 1 });
querySchema.index({ session_id: 1 });

module.exports = mongoose.model('Query', querySchema);