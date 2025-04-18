import re
import json
from google import genai
from dotenv import dotenv_values
from typing import List, Dict, Union
from dataclasses import dataclass

@dataclass
class Flashcard:
    question: str
    answer: str|None = None
    rating: float|None = None
    feedback: str|None = None

class GeminiAPI:
    def __init__(self):
        env = dotenv_values('.env')
        try:
            self.client = genai.Client(api_key=env.get('GEMINI_API_KEY'))
        except Exception as e:
            raise GeminiAPIError(f"Failed to initialize Gemini client: {str(e)}")

    def generate_flashcards(self, topic: str, level: str, count: int = 15) -> List[str]:
        prompt = f'''You are an expert tutor.
The user wants to study the topic: "{topic}" at a {level} level.

Generate a list of [{count}] flashcards, with a list of questions

Only give me the questions and nothing else.
Format it as JSON like this:
[
"What is a web framework?",
"What is CSS for"
]'''
        try:
            resp = self.client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            return self._extract_json(resp.text)
        except Exception as e:
            if "rate limit" in str(e).lower():
                raise GeminiRateLimitError("API rate limit exceeded. Please try again later.")
            raise GeminiAPIError(f"Failed to generate flashcards: {str(e)}")

    def evaluate_answer(self, question: str, answer: str) -> Dict[str, Union[float, str]]:
        prompt = f'''You are an expert tutor.
For the question "{question}" this is my answer
"{answer}"

Now rate the answer with a rating between 0-5, and feedback

Only give me the JSON data and nothing else, return it in the following structure:
{{"rating": 0, "feedback": "The answer ..."}}'''
        try:
            resp = self.client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            return self._extract_json(resp.text)
        except Exception as e:
            if "rate limit" in str(e).lower():
                raise GeminiRateLimitError("API rate limit exceeded. Please try again later.")
            raise GeminiAPIError(f"Failed to evaluate answer: {str(e)}")

    def _extract_json(self, text: str) -> Union[List, Dict]:
        try:
            m = re.search(r"```json\s*(\{.*?\}|\[.*?\])\s*```", text, re.DOTALL)
            if not m:
                m = re.search(r"(\[\s*\".*?\"(?:,\s*\".*?\")*\])", text, re.DOTALL)
            if m:
                return json.loads(m.group(1))
            raise ValueError("JSON block not found in response")
        except json.JSONDecodeError as e:
            raise GeminiAPIError(f"Failed to parse JSON: {str(e)}")
        except Exception as e:
            raise GeminiAPIError(f"Failed to extract JSON: {str(e)}")

class GeminiAPIError(Exception):
    """Base exception for Gemini API errors"""
    pass

class GeminiRateLimitError(GeminiAPIError):
    """Exception raised when API rate limit is exceeded"""
    pass
