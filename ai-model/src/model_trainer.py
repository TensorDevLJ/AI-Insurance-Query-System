import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import pickle
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self):
        """Initialize the model trainer"""
        self.model = RandomForestClassifier(
            n_estimators=100, 
            random_state=42,
            max_depth=10,
            min_samples_split=5
        )
        self.label_encoder = LabelEncoder()
        self.training_data_path = 'data/training/query_response_pairs.json'
        self.model_path = 'models/trained_model.pkl'
        self.encoder_path = 'models/label_encoder.pkl'
        
    def load_training_data(self):
        """Load training data from JSON file"""
        try:
            if not os.path.exists(self.training_data_path):
                logger.info("Creating sample training data...")
                self.create_sample_training_data()
            
            with open(self.training_data_path, 'r') as f:
                data = json.load(f)
            
            logger.info(f"Loaded {len(data)} training examples")
            return data
            
        except Exception as e:
            logger.error(f"Error loading training data: {e}")
            raise
    
    def create_sample_training_data(self):
        """Create sample training data for the model"""
        sample_data = [
            {
                "query": "46M, knee surgery, Pune, 3-month policy",
                "expected_decision": "Approved",
                "expected_amount": 150000,
                "relevant_clauses": ["BAJ-003"],
                "reasoning": "Waiting period satisfied, procedure covered",
                "confidence": 0.85
            },
            {
                "query": "35F, heart surgery, Mumbai, 6-month policy",
                "expected_decision": "Approved", 
                "expected_amount": 500000,
                "relevant_clauses": ["HDFC-001"],
                "reasoning": "Critical illness coverage applies",
                "confidence": 0.9
            },
            {
                "query": "25M, eye surgery, Delhi, 1-month policy",
                "expected_decision": "Rejected",
                "expected_amount": None,
                "relevant_clauses": [],
                "reasoning": "Waiting period not satisfied",
                "confidence": 0.9
            },
            {
                "query": "60F, cancer treatment, Bangalore, 12-month policy",
                "expected_decision": "Approved",
                "expected_amount": 1000000,
                "relevant_clauses": ["HDFC-001"],
                "reasoning": "Critical illness coverage, no waiting period",
                "confidence": 0.95
            },
            {
                "query": "40M, day care procedure, Chennai, 4-month policy",
                "expected_decision": "Approved",
                "expected_amount": 80000,
                "relevant_clauses": ["BAJ-003"],
                "reasoning": "Day care procedure covered",
                "confidence": 0.8
            },
            {
                "query": "30F, knee surgery, Kolkata, 2-month policy",
                "expected_decision": "Rejected",
                "expected_amount": None,
                "relevant_clauses": [],
                "reasoning": "Waiting period not satisfied",
                "confidence": 0.85
            },
            {
                "query": "55M, heart attack, Hyderabad, 8-month policy",
                "expected_decision": "Approved",
                "expected_amount": 500000,
                "relevant_clauses": ["HDFC-001"],
                "reasoning": "Critical illness coverage",
                "confidence": 0.9
            },
            {
                "query": "28F, eye surgery, Pune, 2-month policy",
                "expected_decision": "Approved",
                "expected_amount": 60000,
                "relevant_clauses": ["BAJ-003"],
                "reasoning": "Eye surgery waiting period satisfied",
                "confidence": 0.8
            },
            {
                "query": "65M, cancer surgery, Mumbai, 18-month policy",
                "expected_decision": "Approved",
                "expected_amount": 1200000,
                "relevant_clauses": ["HDFC-001"],
                "reasoning": "Critical illness, senior citizen adjustment",
                "confidence": 0.95
            },
            {
                "query": "22F, knee replacement, Delhi, 6-month policy",
                "expected_decision": "Approved",
                "expected_amount": 108000,
                "relevant_clauses": ["BAJ-003"],
                "reasoning": "Waiting period satisfied, young adult discount",
                "confidence": 0.85
            }
        ]
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.training_data_path), exist_ok=True)
        
        with open(self.training_data_path, 'w') as f:
            json.dump(sample_data, f, indent=2)
        
        logger.info(f"Created sample training data with {len(sample_data)} examples")
    
    def prepare_features(self, data):
        """Extract features from training data"""
        features = []
        labels = []
        
        for item in data:
            query = item['query']
            
            # Extract feature vector
            feature_vector = self.extract_feature_vector(query)
            features.append(feature_vector)
            
            # Label encoding
            decision = item['expected_decision']
            labels.append(decision)
        
        return np.array(features), np.array(labels)
    
    def extract_feature_vector(self, query):
        """Extract numerical features from query"""
        import re
        
        features = []
        
        # Age
        age_match = re.search(r'(\d+)[MF]', query, re.IGNORECASE)
        age = int(age_match.group(1)) if age_match else 0
        features.append(age)
        
        # Gender (1 for Male, 0 for Female)
        gender = 1 if re.search(r'\d+M', query, re.IGNORECASE) else 0
        features.append(gender)
        
        # Policy duration in days
        duration_match = re.search(r'(\d+)[\s]*[-]?[\s]*(month|year)', query, re.IGNORECASE)
        if duration_match:
            value = int(duration_match.group(1))
            unit = duration_match.group(2).lower()
            duration_days = value * 30 if unit == 'month' else value * 365
        else:
            duration_days = 0
        features.append(duration_days)
        
        # Age groups (one-hot encoding)
        age_groups = [
            (0, 25),    # Young adult
            (25, 45),   # Adult
            (45, 60),   # Middle-aged
            (60, 100)   # Senior
        ]
        
        for min_age, max_age in age_groups:
            features.append(1 if min_age <= age < max_age else 0)
        
        # Procedure type (one-hot encoding)
        procedures = ['knee surgery', 'heart surgery', 'cancer', 'eye surgery']
        query_lower = query.lower()
        for proc in procedures:
            features.append(1 if proc in query_lower else 0)
        
        # Location type (metro vs non-metro)
        metro_cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad']
        is_metro = any(city in query_lower for city in metro_cities)
        features.append(1 if is_metro else 0)
        
        # Policy duration categories
        duration_categories = [
            (0, 90),      # Less than 3 months
            (90, 365),    # 3 months to 1 year
            (365, 730),   # 1-2 years
            (730, float('inf'))  # More than 2 years
        ]
        
        for min_days, max_days in duration_categories:
            features.append(1 if min_days <= duration_days < max_days else 0)
        
        return features
    
    def train_model(self):
        """Train the decision model"""
        try:
            logger.info("Starting model training...")
            
            # Load training data
            training_data = self.load_training_data()
            
            # Prepare features and labels
            features, labels = self.prepare_features(training_data)
            
            # Encode labels
            encoded_labels = self.label_encoder.fit_transform(labels)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features, encoded_labels, test_size=0.2, random_state=42, stratify=encoded_labels
            )
            
            logger.info(f"Training set size: {len(X_train)}, Test set size: {len(X_test)}")
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Get feature importance
            feature_names = self.get_feature_names()
            feature_importance = list(zip(feature_names, self.model.feature_importances_))
            feature_importance.sort(key=lambda x: x[1], reverse=True)
            
            # Generate detailed report
            report = classification_report(
                y_test, y_pred, 
                target_names=self.label_encoder.classes_,
                output_dict=True
            )
            
            # Save model and encoder
            os.makedirs('models', exist_ok=True)
            
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            
            with open(self.encoder_path, 'wb') as f:
                pickle.dump(self.label_encoder, f)
            
            # Save training report
            training_report = {
                'timestamp': datetime.now().isoformat(),
                'accuracy': accuracy,
                'classification_report': report,
                'feature_importance': feature_importance,
                'training_size': len(X_train),
                'test_size': len(X_test),
                'model_parameters': self.model.get_params()
            }
            
            with open('models/training_report.json', 'w') as f:
                json.dump(training_report, f, indent=2, default=str)
            
            logger.info(f"Model training completed. Accuracy: {accuracy:.3f}")
            logger.info("Top 5 important features:")
            for feature, importance in feature_importance[:5]:
                logger.info(f"  {feature}: {importance:.3f}")
            
            return training_report
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def get_feature_names(self):
        """Get feature names for interpretability"""
        return [
            'age',
            'gender',
            'policy_duration_days',
            'age_young_adult',
            'age_adult',
            'age_middle_aged',
            'age_senior',
            'procedure_knee_surgery',
            'procedure_heart_surgery',
            'procedure_cancer',
            'procedure_eye_surgery',
            'location_metro',
            'duration_less_3_months',
            'duration_3_months_1_year',
            'duration_1_2_years',
            'duration_more_2_years'
        ]
    
    def load_trained_model(self):
        """Load trained model for prediction"""
        try:
            if not os.path.exists(self.model_path) or not os.path.exists(self.encoder_path):
                logger.warning("Trained model not found, training new model...")
                self.train_model()
            
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(self.encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)
            
            logger.info("Trained model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading trained model: {e}")
            raise
    
    def predict(self, query: str):
        """Make prediction using trained model"""
        try:
            # Extract features
            features = self.extract_feature_vector(query)
            features_array = np.array([features])
            
            # Make prediction
            prediction = self.model.predict(features_array)[0]
            prediction_proba = self.model.predict_proba(features_array)[0]
            
            # Decode prediction
            decision = self.label_encoder.inverse_transform([prediction])[0]
            confidence = max(prediction_proba)
            
            return {
                'decision': decision,
                'confidence': confidence,
                'probabilities': dict(zip(self.label_encoder.classes_, prediction_proba))
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise
    
    def evaluate_model(self):
        """Evaluate model performance on test data"""
        try:
            # Load training data
            training_data = self.load_training_data()
            features, labels = self.prepare_features(training_data)
            encoded_labels = self.label_encoder.transform(labels)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features, encoded_labels, test_size=0.2, random_state=42, stratify=encoded_labels
            )
            
            # Make predictions
            y_pred = self.model.predict(X_test)
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            report = classification_report(
                y_test, y_pred, 
                target_names=self.label_encoder.classes_,
                output_dict=True
            )
            
            confusion_mat = confusion_matrix(y_test, y_pred)
            
            return {
                'accuracy': accuracy,
                'classification_report': report,
                'confusion_matrix': confusion_mat.tolist(),
                'class_names': self.label_encoder.classes_.tolist()
            }
            
        except Exception as e:
            logger.error(f"Error evaluating model: {e}")
            raise