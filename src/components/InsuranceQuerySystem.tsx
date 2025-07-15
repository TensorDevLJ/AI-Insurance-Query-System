import React, { useState, useEffect } from 'react';
import { Search, FileText, Brain, Database, CheckCircle, XCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { queryService } from '../services/api';

interface QueryResult {
  decision: 'Approved' | 'Rejected' | 'Conditional';
  amount?: number;
  justification: string;
  confidence: number;
  source_clauses: Array<{
    clause_id: string;
    text: string;
    policy_name: string;
    similarity: number;
  }>;
  timestamp: string;
}

interface HistoryItem {
  query: string;
  result: QueryResult;
  timestamp: Date;
}

const InsuranceQuerySystem: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('query');

  const exampleQueries = [
    "46M, knee surgery, Pune, 3-month policy",
    "35F, heart surgery, Mumbai, 6-month policy", 
    "25M, eye surgery, Delhi, 1-month policy",
    "60F, cancer treatment, Bangalore, 12-month policy",
    "40M, day care procedure, Chennai, 4-month policy"
  ];

  useEffect(() => {
    loadQueryHistory();
  }, []);

  const loadQueryHistory = async () => {
    try {
      const historyData = await queryService.getQueryHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const processQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await queryService.processQuery(query);
      setResults(result);
      
      // Add to history
      const historyItem: HistoryItem = {
        query,
        result,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Error processing query:', error);
      // Show error state or fallback to mock data
      const mockResult = generateMockResult(query);
      setResults(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResult = (query: string): QueryResult => {
    const queryLower = query.toLowerCase();
    
    let decision: 'Approved' | 'Rejected' | 'Conditional' = "Rejected";
    let amount: number | undefined = undefined;
    let confidence = 0.5;
    let justification = "No matching coverage found";
    let sourceClauses: QueryResult['source_clauses'] = [];

    // Extract age
    const ageMatch = query.match(/(\d+)[MY]/i);
    const age = ageMatch ? parseInt(ageMatch[1]) : null;

    // Extract policy duration
    const durationMatch = query.match(/(\d+)[\s]*[-]?[\s]*(month|year)/i);
    const duration = durationMatch ? {
      value: parseInt(durationMatch[1]),
      unit: durationMatch[2].toLowerCase()
    } : null;

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
      decision,
      amount,
      justification,
      confidence,
      source_clauses: sourceClauses,
      timestamp: new Date().toISOString()
    };
  };

  const DecisionBadge: React.FC<{ decision: string }> = ({ decision }) => {
    const getDecisionStyle = (decision: string) => {
      switch (decision.toLowerCase()) {
        case 'approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'conditional':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getIcon = (decision: string) => {
      switch (decision.toLowerCase()) {
        case 'approved':
          return <CheckCircle className="w-4 h-4 mr-1" />;
        case 'rejected':
          return <XCircle className="w-4 h-4 mr-1" />;
        case 'conditional':
          return <AlertCircle className="w-4 h-4 mr-1" />;
        default:
          return <Clock className="w-4 h-4 mr-1" />;
      }
    };

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDecisionStyle(decision)}`}>
        {getIcon(decision)}
        {decision}
      </div>
    );
  };

  const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
      <div 
        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-700"
        style={{ width: `${confidence * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Insurance Query System</h1>
                <p className="text-gray-600">Natural Language Processing for Insurance Claims & Coverage</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>MongoDB</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Python AI</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Node.js API</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'query' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Query Processing
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Query History
          </button>
        </div>

        {activeTab === 'query' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Query Input Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Submit Your Query
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your insurance query:
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 46M, knee surgery, Pune, 3-month policy"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={4}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Example Queries:</h3>
                  <div className="space-y-2">
                    {exampleQueries.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example)}
                        className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={processQuery}
                  disabled={loading || !query.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Process Query
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Results
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Processing your query...</p>
                </div>
              ) : results ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <DecisionBadge decision={results.decision} />
                    <span className="text-sm text-gray-500">
                      Confidence: {Math.round(results.confidence * 100)}%
                    </span>
                  </div>

                  <ConfidenceBar confidence={results.confidence} />

                  {results.amount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700 font-medium">Coverage Amount</p>
                      <p className="text-2xl font-bold text-green-800">₹{results.amount.toLocaleString('en-IN')}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium mb-2">Justification</p>
                    <p className="text-gray-800">{results.justification}</p>
                  </div>

                  {results.source_clauses && results.source_clauses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Relevant Policy Clauses:</h3>
                      <div className="space-y-2">
                        {results.source_clauses.map((clause, index) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{clause.clause_id}</span>
                              <span className="text-xs text-green-600">{Math.round(clause.similarity * 100)}% match</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{clause.policy_name}</p>
                            <p className="text-sm text-gray-800">{clause.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter a query to see results here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Query History
            </h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No query history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.query}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <DecisionBadge decision={item.result.decision} />
                      {item.result.amount && (
                        <span className="text-sm font-medium text-green-600">
                          ₹{item.result.amount.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {Math.round(item.result.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceQuerySystem;