from document_processor import DocumentProcessor
import os
import json

# Initialize processor
processor = DocumentProcessor()

# Input list: (input path, provider name, output json filename)
inputs = [
    ("data/raw/dataset1.pdf", "Bajaj", "bajaj_policy.json"),
    ("data/raw/dataset3.pdf", "ICICI", "icici_policy.json"),
]

# Process each PDF
for file_path, provider, output_file in inputs:
    print(f"📄 Processing: {file_path}")
    doc = processor.process_document(file_path)

    # Reformat clauses
    clauses = []
    for i, c in enumerate(doc['clauses']):
        clauses.append({
            "clause_id": c["clause_id"],
            "content": c["text"],
            "metadata": {
                "source": doc["provider"],
                "category": c["category"]
            }
        })

    # Save to policies directory
    output_path = os.path.join("data", "policies", output_file)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(clauses, f, indent=2)

    print(f"✅ Saved {output_path} with {len(clauses)} clauses")
