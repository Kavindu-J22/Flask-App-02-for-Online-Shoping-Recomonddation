from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId  # Handle MongoDB ObjectId conversion

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Establish a connection to the MongoDB database
client = MongoClient(os.getenv("MONGO_URI"))
db = client['fashion_store']  # Use a more specific database name

# Route to fetch all products from the database
@app.route('/api/products', methods=['GET'])
def fetch_all_products():
    products_collection = db['products']  # Access the 'products' collection
    products = list(products_collection.find({}))  # Fetch all documents
    for product in products:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string
    return jsonify(products)

# Route to fetch a single product by its ID, including reviews
@app.route('/api/products/<product_id>', methods=['GET'])
def fetch_product_by_id(product_id):
    products_collection = db['products']
    product = products_collection.find_one({"_id": ObjectId(product_id)})  # Query the product by ID
    if product:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string
        
        # Fetch all reviews linked to this product
        reviews_collection = db['product_reviews']
        reviews = list(reviews_collection.find({"product_id": product_id}))
        for review in reviews:
            review['_id'] = str(review['_id'])  # Convert review ObjectId to string
        product['reviews'] = reviews  # Attach reviews to the product data
        return jsonify(product)  # Return product with reviews
    else:
        return jsonify({"error": "Product not found"}), 404  # If product doesn't exist

# Route to add a new product to the collection
@app.route('/api/products', methods=['POST'])
def add_new_product():
    product_data = request.json  # Capture request payload
    db['products'].insert_one(product_data)  # Insert product into the 'products' collection
    return jsonify({"message": "Product successfully added!"}), 201

# Route to submit a new review for a specific product
@app.route('/api/products/<product_id>/review', methods=['POST'])
def submit_review(product_id):
    reviews_collection = db['product_reviews']
    review_data = request.json
    review_data['product_id'] = product_id  # Link review to the product ID

    # Insert the new review into the 'product_reviews' collection
    result = reviews_collection.insert_one(review_data)
    review_id = str(result.inserted_id)  # Store the inserted review's ID

    # Update the product's reviews field with the new review ID
    products_collection = db['products']
    products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$push": {"reviews": review_id}}  # Add the new review to the product
    )

    return jsonify({"message": "Review added successfully!"}), 201

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
