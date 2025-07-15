
# AI Insurance Query System

A comprehensive end-to-end AI-powered system for processing natural language insurance queries and providing intelligent decisions based on policy documents.

-----



## 🌟 What is This?

The **AI Insurance Query System** is a real-world application designed to **understand natural language queries** and **extract relevant information from policy documents** (PDFs, DOCs, Emails) to determine the outcome of an insurance request.

It mimics a human-like understanding of insurance policies using LLMs and advanced semantic search to automate decisions and explanations.

---

## 💡 Why Use This Website?

- Manually reviewing insurance documents is time-consuming, error-prone, and inconsistent.
- This system speeds up **claim evaluation**, **pre-authorization queries**, and **policy compliance checks**.
- It empowers users and agents to receive **quick, transparent, and explainable responses** to complex insurance-related queries.

---

## 🧩 Tech Stack Used

| Layer           | Technology                             |
|----------------|----------------------------------------|
| Frontend       | React.js, TypeScript, Tailwind CSS     |
| Backend        | Node.js, Express, MongoDB              |
| AI/NLP Engine  | Python, spaCy, OpenAI Embeddings, FAISS|
| Data Storage   | MongoDB                                |
| Deployment     | Docker, Docker Compose                 |

---

## 🚀 Unique Features

- 🤖 **LLM-Powered NLP**: Extracts meaning, not just keywords
- 🔍 **Semantic Search**: Retrieves contextually relevant clauses
- 📄 **Unstructured Document Support**: PDF, Word, Email inputs
- ⚖️ **AI Decision Engine**: Approves/rejects with logical justification
- 📜 **Clause Referencing**: Points to the exact clause used in decision
- 📈 **Confidence Scoring**: Understand the certainty of each result
- 🕵️‍♀️ **Audit Trail**: All responses are traceable with justifications

---

## 🌐 How It Solves Real-World Problems

| Problem                                           | Solution Provided                                      |
|--------------------------------------------------|--------------------------------------------------------|
| Manual insurance claim analysis takes days       | Real-time automated decision-making                    |
| Lack of transparency in approvals/rejections     | Explains every decision with referenced clauses        |
| Policy documents are hard to understand          | Simplified natural language interface                  |
| Different documents have different terminologies | Semantic understanding across vocabulary differences   |
| Scalability for large insurance companies        | Fast, consistent, and reliable at scale                |

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │  Python AI Model │
│                 │    │                 │    │                 │
│  • Query Input  │◄──►│  • REST API     │◄──►│  • NLP Processing│
│  • Results UI   │    │  • MongoDB      │    │  • Vector Search │
│  • History      │    │  • Validation   │    │  • Decision Logic│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    MongoDB      │
                       │                 │
                       │  • Policies     │
                       │  • Queries      │
                       │  • Results      │
                       └─────────────────┘
```

## 🚀 Features

- **Natural Language Processing**: Understands queries like "46M, knee surgery, Pune, 3-month policy"
- **Intelligent Decision Making**: AI-powered reasoning engine for approval/rejection decisions
- **Policy Document Processing**: Extracts and indexes policy clauses for semantic search
- **Real-time Query Processing**: Fast response times with confidence scoring
- **Query History**: Track and analyze previous queries
- **Responsive UI**: Modern React interface with Tailwind CSS
- **Scalable Architecture**: Microservices design with Docker support

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- MongoDB 4.4+
- Docker (optional, for containerized deployment)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd insurance-ai-system
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/insurance_ai
# AI_SERVICE_URL=http://localhost:5000

# Start backend server
npm run dev
```

### 4. AI Model Setup
```bash
cd ai-model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start AI service
python main.py
```

### 5. Database Setup
```bash
cd database

# Start MongoDB (if not using Docker)
mongod

# Seed database with sample data
node seed_data.js
```

## 🐳 Docker Deployment

For easy deployment, use Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Usage Examples

### Query Examples:
- `"46M, knee surgery, Pune, 3-month policy"`
- `"35F, heart surgery, Mumbai, 6-month policy"`
- `"60F, cancer treatment, Bangalore, 12-month policy"`

### Expected Response:
```json
{
  "decision": "Approved",
  "amount": 150000,
  "justification": "Knee surgery is covered under day care procedures...",
  "confidence": 0.85,
  "source_clauses": [
    {
      "clause_id": "BAJ-003",
      "text": "Day care procedures covered...",
      "policy_name": "Bajaj Allianz Global Health Care",
      "similarity": 0.85
    }
  ]
}
```

## 🧠 AI Model Training

### Training New Models:
```bash
cd ai-model

# Train with custom data
python -c "from src.model_trainer import ModelTrainer; trainer = ModelTrainer(); trainer.train_model()"

# Rebuild embeddings
python -c "from src.vector_store import VectorStore; vs = VectorStore(); vs.create_embeddings()"
```

### Adding New Policy Documents:
1. Place JSON files in `ai-model/data/policies/`
2. Rebuild embeddings: `POST /embeddings/rebuild`
3. Retrain model: `POST /retrain`

## 📁 Project Structure

```
insurance-ai-system/
├── src/                          # React Frontend
│   ├── components/
│   │   └── InsuranceQuerySystem.tsx
│   ├── services/
│   │   └── api.ts
│   └── App.tsx
├── backend/                      # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── ai-model/                     # Python AI Service
│   ├── src/
│   │   ├── query_analyzer.py
│   │   ├── reasoning_engine.py
│   │   ├── vector_store.py
│   │   └── model_trainer.py
│   ├── data/
│   │   └── policies/
│   ├── models/
│   └── main.py
├── database/
│   └── seed_data.js
└── docker-compose.yml
```

## 🔧 Configuration

### Environment Variables:

**Backend (.env):**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/insurance_ai
AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```
REACT_APP_API_URL=http://localhost:3001/api
```

## 📈 Performance & Monitoring

- **Response Time**: < 2 seconds average
- **Accuracy**: 85%+ on test queries
- **Throughput**: 100+ queries/minute
- **Confidence Scoring**: 0.0 - 1.0 scale

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review example queries and responses

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Voice query input
- [ ] Advanced analytics dashboard
- [ ] Integration with more insurance providers
- [ ] Mobile app development
- [ ] Real-time notifications
- [ ] Advanced ML models (GPT integration)
=======
# AI-Insurance-Query-System
likhithaj22@gmail.com
## ❤️😍(❁´◡`❁)❤️💕 Developed By Likhithajagadeesh 
