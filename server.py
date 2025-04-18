from flask import Flask, request, jsonify
from api import GeminiAPI, GeminiAPIError, GeminiRateLimitError
from typing import Dict, List
import json

app = Flask(__name__)
api = GeminiAPI()

@app.route('/api/flashcards', methods=['POST'])
def get_flashcards():
    try:
        data = request.get_json()
        if not data or 'topic' not in data or 'level' not in data:
            return jsonify({
                'error': 'Missing required fields: topic and level'
            }), 400

        count = data.get('count', 15)
        questions = api.generate_flashcards(
            topic=data['topic'],
            level=data['level'],
            count=count
        )
        
        return jsonify({
            'questions': questions
        })
    except GeminiRateLimitError as e:
        return jsonify({
            'error': str(e)
        }), 429
    except GeminiAPIError as e:
        return jsonify({
            'error': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate_answer():
    try:
        data = request.get_json()
        if not data or 'question' not in data or 'answer' not in data:
            return jsonify({
                'error': 'Missing required fields: question and answer'
            }), 400

        result = api.evaluate_answer(
            question=data['question'],
            answer=data['answer']
        )
        
        return jsonify(result)
    except GeminiRateLimitError as e:
        return jsonify({
            'error': str(e)
        }), 429
    except GeminiAPIError as e:
        return jsonify({
            'error': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)

