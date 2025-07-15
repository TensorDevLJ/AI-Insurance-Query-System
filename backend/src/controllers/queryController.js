const Query = require('../models/Query');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

const processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const startTime = Date.now();

    try {
      // Call Python AI service
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/process`, { 
        query: query.trim() 
      }, {
        timeout: 25000 // 25 second timeout
      });
      
      const processingTime = Date.now() - startTime;

      // Save to database
      const queryRecord = new Query({
        query_text: query.trim(),
        processed_entities: aiResponse.data.entities,
        result: aiResponse.data.result,
        processing_time: processingTime,
        session_id: req.sessionID || 'anonymous',
        status: 'processed'
      });

      await queryRecord.save();

      res.json({
        success: true,
        data: {
          ...aiResponse.data.result,
          processing_time: processingTime,
          query_id: queryRecord._id
        }
      });

    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      
      // Fallback to mock response if AI service is unavailable
      const mockResult = generateMockResult(query);
      const processingTime = Date.now() - startTime;

      const queryRecord = new Query({
        query_text: query.trim(),
        processed_entities: mockResult.entities,
        result: mockResult.result,
        processing_time: processingTime,
        session_id: req.sessionID || 'anonymous',
        status: 'processed'
      });

      await queryRecord.save();

      res.json({
        success: true,
        data: {
          ...mockResult.result,
          processing_time: processingTime,
          query_id: queryRecord._id
        },
        note: 'Using fallback processing (AI service unavailable)'
      });
    }

  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query',
      error: error.message
    });
  }
};

const generateMockResult = (query) => {
  const queryLower = query.toLowerCase();
  
  let decision = "Rejected";
  let amount = null;
  let confidence = 0.5;
  let justification = "No matching coverage found";
  let sourceClauses = [];

  // Extract entities
  const ageMatch = query.match(/(\d+)[MY]/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : null;

  const durationMatch = query.match(/(\d+)[\s]*[-]?[\s]*(month|year)/i);
  const duration = durationMatch ? {
    value: parseInt(durationMatch[1]),
    unit: durationMatch[2].toLowerCase()
  } : null;

  const entities = {
    age,
    gender: query.match(/\d+M/i) ? "Male" : query.match(/\d+F/i) ? "Female" : null,
    procedure: null,
    location: null,
    policy_duration: duration
  };

  // Extract procedure
  const procedures = ['knee surgery', 'heart surgery', 'cancer', 'eye surgery'];
  for (const proc of procedures) {
    if (queryLower.includes(proc)) {
      entities.procedure = proc;
      break;
    }
  }

  // Business logic
  if (queryLower.includes('knee surgery')) {
    if (duration && duration.unit === 'month' && duration.value >= 3) {
      decision = "Approved";
      amount = age && age > 45 ? 150000 : 120000;
      confidence = 0.85;
      justification = `Knee surgery is covered under day care procedures. Policy duration of ${duration.value} months meets the minimum requirement.`;
      sourceClauses = [
        {
          clause_id: "BAJ-003",
          text: "Day care procedures covered where treatment is less than 24 hours",
          policy_name: "Bajaj Allianz Global Health Care",
          similarity: 0.85
        }
      ];
    } else if (duration && duration.value < 3) {
      decision = "Rejected";
      justification = "Policy duration is less than the required 3-month minimum waiting period.";
      confidence = 0.9;
    }
  } else if (queryLower.includes('heart surgery') || queryLower.includes('cardiac')) {
    decision = "Approved";
    amount = 500000;
    confidence = 0.9;
    justification = "Heart surgery is covered under critical illness benefits.";
    sourceClauses = [
      {
        clause_id: "HDFC-001",
        text: "Critical illness coverage includes cancer, CABG, heart attack, stroke, kidney failure",
        policy_name: "HDFC Ergo Easy Health",
        similarity: 0.9
      }
    ];
  } else if (queryLower.includes('cancer')) {
    decision = "Approved";
    amount = 1000000;
    confidence = 0.95;
    justification = "Cancer treatment is fully covered under critical illness benefits.";
    sourceClauses = [
      {
        clause_id: "HDFC-001",
        text: "Critical illness coverage includes cancer, CABG, heart attack, stroke, kidney failure",
        policy_name: "HDFC Ergo Easy Health",
        similarity: 0.95
      }
    ];
  }

  return {
    entities,
    result: {
      decision,
      amount,
      justification,
      confidence,
      source_clauses: sourceClauses,
      reasoning_steps: [
        `Extracted entities: ${JSON.stringify(entities)}`,
        `Applied business rules for ${entities.procedure || 'unknown procedure'}`,
        `Final decision: ${decision}`
      ]
    }
  };
};

const getQueryHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const queries = await Query.find({ status: 'processed' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('query_text result createdAt processing_time')
      .lean();

    const total = await Query.countDocuments({ status: 'processed' });

    res.json({
      success: true,
      data: queries,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_records: total,
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching query history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch query history',
      error: error.message
    });
  }
};

const getQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = await Query.findById(id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch query',
      error: error.message
    });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, helpful } = req.body;

    const query = await Query.findByIdAndUpdate(
      id,
      {
        user_feedback: {
          rating,
          comment,
          helpful
        }
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: query
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

module.exports = {
  processQuery,
  getQueryHistory,
  getQueryById,
  submitFeedback
};