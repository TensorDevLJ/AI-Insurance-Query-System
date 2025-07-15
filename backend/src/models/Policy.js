const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  clause_id: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  keywords: [String],
  embeddings: [Number]
});

const policySchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  uin: { type: String, required: true, unique: true },
  clauses: [clauseSchema],
  metadata: {
    version: String,
    last_updated: { type: Date, default: Date.now },
    document_path: String,
    total_clauses: Number
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft'], 
    default: 'active' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for clause count
policySchema.virtual('clauseCount').get(function() {
  return this.clauses ? this.clauses.length : 0;
});

// Index for better search performance
policySchema.index({ name: 'text', provider: 'text' });
policySchema.index({ 'clauses.keywords': 1 });
policySchema.index({ uin: 1 });

module.exports = mongoose.model('Policy', policySchema);