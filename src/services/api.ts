// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export interface QueryResult {
//   decision: 'Approved' | 'Rejected' | 'Conditional';
//   amount?: number;
//   justification: string;
//   confidence: number;
//   source_clauses: Array<{
//     clause_id: string;
//     text: string;
//     policy_name: string;
//     similarity: number;
//   }>;
//   timestamp: string;
// }

// export const queryService = {
//   processQuery: async (query: string): Promise<QueryResult> => {
//     try {
//       const response = await api.post('/queries/process', { query });
//       return response.data.data;
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Failed to process query');
//     }
//   },

//   getQueryHistory: async (): Promise<any[]> => {
//     try {
//       const response = await api.get('/queries/history');
//       return response.data.data;
//     } catch (error) {
//       throw new Error('Failed to fetch query history');
//     }
//   },

//   getDocuments: async (): Promise<any[]> => {
//     try {
//       const response = await api.get('/documents');
//       return response.data.data;
//     } catch (error) {
//       throw new Error('Failed to fetch documents');
//     }
//   }
// };

// export default api;
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const queryService = async (query: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/process`, {
      query,
    });
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    return { error: "API error occurred." };
  }
};
