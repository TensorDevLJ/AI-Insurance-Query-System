from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from src.query_analyzer import QueryAnalyzer
from src.reasoning_engine import ReasoningEngine
from src.vector_store import VectorStore
from src.document_processor import DocumentProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize components
try:
    document_processor = DocumentProcessor()
    vector_store = VectorStore()
    query_analyzer = QueryAnalyzer()
    reasoning_engine = ReasoningEngine()
    
    # Load processed documents on startup
    vector_store.load_embeddings()
    logger.info("AI components initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize AI components: {e}")
    # Continue with limited functionality

@app.route("/", methods=["GET"])
def index():
    return """
        <h1>🧠 AI Insurance Query System</h1>
        <p>✅ API is running.</p>
        <p>Use <code>/process</code> to POST your insurance queries.</p>
        <p>Health check: <a href="/health">/health</a></p>
    """

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "AI Processing Service",
        "version": "1.0.0"
    })

@app.route('/process', methods=['POST'])
def process_query():
    try:
        data = request.json
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({"error": "No query provided"}), 400
        
        logger.info(f"Processing query: {query}")
        
        # Step 1: Analyze query to extract entities
        entities = query_analyzer.extract_entities(query)
        logger.info(f"Extracted entities: {entities}")
        
        # Step 2: Search for relevant policy clauses
        relevant_clauses = vector_store.search_similar_clauses(query, top_k=5)
        logger.info(f"Found {len(relevant_clauses)} relevant clauses")
        
        # Step 3: Apply reasoning engine
        result = reasoning_engine.make_decision(entities, relevant_clauses)
        logger.info(f"Decision: {result['decision']}")
        
        return jsonify({
            "success": True,
            "entities": entities,
            "result": result
        })
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    try:
        from src.model_trainer import ModelTrainer
        trainer = ModelTrainer()
        trainer.train_model()
        
        logger.info("Model retrained successfully")
        return jsonify({"success": True, "message": "Model retrained successfully"})
    except Exception as e:
        logger.error(f"Error retraining model: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/embeddings/rebuild', methods=['POST'])
def rebuild_embeddings():
    try:
        vector_store.create_embeddings()
        logger.info("Embeddings rebuilt successfully")
        return jsonify({"success": True, "message": "Embeddings rebuilt successfully"})
    except Exception as e:
        logger.error(f"Error rebuilding embeddings: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting AI service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
