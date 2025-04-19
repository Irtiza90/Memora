from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import Dict, List
import json
import logging
import time

from api import GeminiAPI, GeminiAPIError, GeminiRateLimitError, GeminiTokenLimitError

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('FlashcardServer')

app = Flask(__name__)
CORS(app, origins=["https://irtiza90.github.io", "http://localhost:*"], supports_credentials=True, methods=["GET", "POST", "OPTIONS"])
api = GeminiAPI()

@app.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.url}")
    logger.debug(f"Headers: {dict(request.headers)}")
    if request.is_json:
        logger.debug(f"Body: {request.get_json()}")

@app.after_request
def log_response_info(response):
    logger.info(f"Response: {response.status}")
    logger.debug(f"Response data: {response.get_data(as_text=True)[:200]}...")
    return response

@app.route('/api/flashcards', methods=['POST'])
def get_flashcards():
    start_time = time.time()
    try:
        data = request.get_json()
        if not data or 'topic' not in data or 'level' not in data:
            logger.error("Missing required fields in request")
            return jsonify({
                'error': 'Missing required fields: topic and level'
            }), 400

        count = data.get('count', 15)
        logger.info(f"Generating {count} flashcards for topic: {data['topic']}, level: {data['level']}")
        
        questions = api.generate_flashcards(
            topic=data['topic'],
            level=data['level'],
            count=count
        )
        
        duration = time.time() - start_time
        logger.info(f"Successfully generated flashcards in {duration:.2f} seconds")
        return jsonify({
            'questions': questions
        })
    except GeminiTokenLimitError as e:
        logger.error(f"Token limit exceeded: {str(e)}")
        return jsonify({
            'error': str(e),
            'error_type': 'token_limit_exceeded'
        }), 413  # Payload Too Large
    except GeminiRateLimitError as e:
        logger.error(f"Rate limit exceeded: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 429
    except GeminiAPIError as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate_answer():
    start_time = time.time()
    try:
        data = request.get_json()
        if not data or 'question' not in data or 'answer' not in data:
            logger.error("Missing required fields in request")
            return jsonify({
                'error': 'Missing required fields: question and answer'
            }), 400

        logger.info(f"Evaluating answer for question: {data['question'][:50]}...")
        
        result = api.evaluate_answer(
            question=data['question'],
            answer=data['answer']
        )
        
        duration = time.time() - start_time
        logger.info(f"Successfully evaluated answer in {duration:.2f} seconds")
        return jsonify(result)
    except GeminiTokenLimitError as e:
        logger.error(f"Token limit exceeded: {str(e)}")
        return jsonify({
            'error': str(e),
            'error_type': 'token_limit_exceeded'
        }), 413  # Payload Too Large
    except GeminiRateLimitError as e:
        logger.error(f"Rate limit exceeded: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 429
    except GeminiAPIError as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flashcard Server")
    app.run(debug=True)

