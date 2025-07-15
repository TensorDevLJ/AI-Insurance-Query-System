// MongoDB seed data for insurance AI system
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/insurance_ai';

const samplePolicies = [
  {
    name: "Bajaj Allianz Global Health Care",
    provider: "Bajaj Allianz General Insurance Co. Ltd",
    uin: "BAJHLIP23020V012223",
    clauses: [
      {
        clause_id: "BAJ-001",
        text: "Accident means sudden, external, violent, and visible event causing bodily injury",
        category: "definitions",
        keywords: ["accident", "injury", "sudden", "external"]
      },
      {
        clause_id: "BAJ-002",
        text: "Any one illness includes relapse within 45 days of previous treatment",
        category: "definitions",
        keywords: ["illness", "relapse", "treatment"]
      },
      {
        clause_id: "BAJ-003",
        text: "Day care procedures covered where treatment is less than 24 hours",
        category: "coverage",
        keywords: ["day care", "procedures", "coverage", "24 hours"]
      },
      {
        clause_id: "BAJ-004",
        text: "Pre-hospitalization covered up to 60 days, post-hospitalization up to 90 days",
        category: "coverage",
        keywords: ["pre-hospitalization", "post-hospitalization", "coverage"]
      },
      {
        clause_id: "BAJ-005",
        text: "Hospital must have minimum 10-15 beds, nursing, operation theater",
        category: "eligibility",
        keywords: ["hospital", "beds", "nursing", "operation theater"]
      }
    ],
    metadata: {
      version: "1.0",
      last_updated: new Date(),
      document_path: "/data/policies/bajaj_policy.json"
    },
    status: "active"
  },
  {
    name: "HDFC Ergo Easy Health",
    provider: "HDFC ERGO General Insurance Co. Ltd",
    uin: "HDFHLIP23024V072223",
    clauses: [
      {
        clause_id: "HDFC-001",
        text: "Critical illness coverage includes cancer, CABG, heart attack, stroke, kidney failure",
        category: "coverage",
        keywords: ["critical illness", "cancer", "heart attack", "stroke"]
      },
      {
        clause_id: "HDFC-002",
        text: "Cumulative bonus increases sum insured without premium hike",
        category: "benefits",
        keywords: ["cumulative bonus", "sum insured", "premium"]
      },
      {
        clause_id: "HDFC-003",
        text: "Domiciliary care covered when hospital not available or patient unfit to move",
        category: "coverage",
        keywords: ["domiciliary care", "hospital", "patient"]
      },
      {
        clause_id: "HDFC-004",
        text: "Medical expenses must be reasonable, medically necessary, and verified by practitioner",
        category: "eligibility",
        keywords: ["medical expenses", "reasonable", "necessary", "practitioner"]
      }
    ],
    metadata: {
      version: "1.0",
      last_updated: new Date(),
      document_path: "/data/policies/hdfc_policy.json"
    },
    status: "active"
  }
];

const sampleQueries = [
  {
    query_text: "46M, knee surgery, Pune, 3-month policy",
    processed_entities: {
      age: 46,
      gender: "Male",
      procedure: "knee surgery",
      location: "Pune",
      policy_duration: {
        value: 3,
        unit: "month"
      }
    },
    result: {
      decision: "Approved",
      amount: 150000,
      justification: "Knee surgery is covered under day care procedures. Policy duration of 3 months meets the minimum requirement.",
      confidence: 0.85,
      source_clauses: [
        {
          clause_id: "BAJ-003",
          text: "Day care procedures covered where treatment is less than 24 hours",
          policy_name: "Bajaj Allianz Global Health Care",
          similarity: 0.85
        }
      ]
    },
    processing_time: 1250,
    session_id: "sample_session_1",
    status: "processed"
  },
  {
    query_text: "35F, heart surgery, Mumbai, 6-month policy",
    processed_entities: {
      age: 35,
      gender: "Female",
      procedure: "heart surgery",
      location: "Mumbai",
      policy_duration: {
        value: 6,
        unit: "month"
      }
    },
    result: {
      decision: "Approved",
      amount: 500000,
      justification: "Heart surgery is covered under critical illness benefits.",
      confidence: 0.9,
      source_clauses: [
        {
          clause_id: "HDFC-001",
          text: "Critical illness coverage includes cancer, CABG, heart attack, stroke, kidney failure",
          policy_name: "HDFC Ergo Easy Health",
          similarity: 0.9
        }
      ]
    },
    processing_time: 980,
    session_id: "sample_session_2",
    status: "processed"
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('policies').deleteMany({});
    await db.collection('queries').deleteMany({});
    
    // Insert sample policies
    const policiesResult = await db.collection('policies').insertMany(samplePolicies);
    console.log(`Inserted ${policiesResult.insertedCount} policies`);
    
    // Insert sample queries
    const queriesResult = await db.collection('queries').insertMany(sampleQueries);
    console.log(`Inserted ${queriesResult.insertedCount} queries`);
    
    // Create indexes
    await db.collection('policies').createIndex({ name: 'text', provider: 'text' });
    await db.collection('policies').createIndex({ 'clauses.keywords': 1 });
    await db.collection('policies').createIndex({ uin: 1 });
    
    await db.collection('queries').createIndex({ createdAt: -1 });
    await db.collection('queries').createIndex({ 'result.decision': 1 });
    await db.collection('queries').createIndex({ session_id: 1 });
    
    console.log('Database seeded successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, samplePolicies, sampleQueries };