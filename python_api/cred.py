import pymongo
import logging
import time
from flask import Flask, request, jsonify

app = Flask(__name__)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://aishureddy:root321@cluster0.dwoumuu.mongodb.net/")
db = client["mydatabase"]
collection = db["users"]

# Setup logging
logging.basicConfig(filename='cred_logs.txt', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Function to handle MongoDB errors
def handle_mongodb_error(e):
    logging.error(f"MongoDB Error: {str(e)}")
    return jsonify({"error": "An error occurred while accessing the database."}), 500

# Function to create a new user
@app.route('/create', methods=['POST'])
def create_user():
    try:
        user_data = request.json  # assuming JSON data is sent in the request body
        result = collection.insert_one(user_data)
        logging.info(f"User created: {user_data}, Status code: 200")
        return "User created", 200
    except Exception as e:
        return handle_mongodb_error(e)

# Function to retrieve a user by ID
@app.route('/get/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = collection.find_one({"_id": user_id})
        if user:
            logging.info(f"User retrieved with ID {user_id}: {user}, Status code: 200")
            return jsonify(user), 200
        else:
            logging.warning(f"User not found with ID {user_id}, Status code: 404")
            return jsonify({"error": "User not found."}), 404
    except Exception as e:
        return handle_mongodb_error(e)

# Function to update a user
@app.route('/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        update_data = request.json  # assuming JSON data is sent in the request body
        result = collection.update_one({"_id": user_id}, {"$set": update_data})
        if result.modified_count > 0:
            logging.info(f"User updated with ID {user_id}, Status code: 200")
            return "User updated", 200
        else:
            logging.warning(f"User not found with ID {user_id}, Status code: 404")
            return jsonify({"error": "User not found."}), 404
    except Exception as e:
        return handle_mongodb_error(e)

# Function to delete a user
@app.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = collection.delete_one({"_id": user_id})
        if result.deleted_count > 0:
            logging.info(f"User deleted with ID {user_id}, Status code: 200")
            return "User deleted", 200
        else:
            logging.warning(f"User not found with ID {user_id}, Status code: 404")
            return jsonify({"error": "User not found."}), 404
    except Exception as e:
        return handle_mongodb_error(e)

if __name__ == '__main__':
    logging.info("cred app listening at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000)
