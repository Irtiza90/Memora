import re
import json
import logging
from google import genai
from dotenv import dotenv_values
from typing import List, Dict, Union, Any, cast
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('GeminiAPI')

# Constants
GENAI_MODEL = "gemini-2.0-flash"
INPUT_TOKEN_LIMIT = 500

@dataclass
class Flashcard:
    question: str
    answer: str|None = None
    rating: float|None = None
    feedback: str|None = None

class GeminiAPI:
    def __init__(self):
        logger.info("Initializing GeminiAPI client")
        env = dotenv_values('.env')
        try:
            self.client = genai.Client(api_key=env.get('GEMINI_API_KEY'))
            logger.info("Successfully initialized Gemini client")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")
            raise GeminiAPIError(f"Failed to initialize Gemini client: {str(e)}")

    def generate_flashcards(self, topic: str, level: str, count: int = 15) -> List[str]:
        logger.info(f"Generating flashcards for topic: {topic}, level: {level}, count: {count}")
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
            # Check token count
            token_count_response = self.client.models.count_tokens(model=GENAI_MODEL, contents=prompt)
            token_count = getattr(token_count_response, 'total_tokens', 0)
            if token_count == 0 or token_count is None:
                logger.warning("Could not determine token count, proceeding with caution")
            else:
                logger.info(f"Token count for prompt: {token_count}")
            
            if token_count >= INPUT_TOKEN_LIMIT:
                logger.warning(f"Token count ({token_count}) exceeds limit ({INPUT_TOKEN_LIMIT})")
                raise GeminiTokenLimitError(f"Input size of {token_count} tokens exceeds the limit of {INPUT_TOKEN_LIMIT} tokens. Please reduce your input.")
            
            logger.debug(f"Sending prompt to Gemini API: {prompt[:100]}...")
            resp = self.client.models.generate_content(model=GENAI_MODEL, contents=prompt)
            
            if resp.text is None:
                logger.error("Received empty response from Gemini API")
                raise GeminiAPIError("Received empty response from Gemini API")
                
            logger.debug(f"Received response from Gemini API: {resp.text[:100]}...")
            
            questions = self._extract_json(resp.text)
            if not isinstance(questions, list):
                logger.error("Expected list of questions but got different format")
                raise GeminiAPIError("Received invalid response format from the API")
                
            questions_list = cast(List[str], questions)
            logger.info(f"Successfully generated {len(questions_list)} flashcards")
            return questions_list
        except GeminiTokenLimitError:
            # Re-raise token limit errors
            raise
        except Exception as e:
            if "rate limit" in str(e).lower():
                logger.error("API rate limit exceeded")
                raise GeminiRateLimitError("API rate limit exceeded. Please try again later.")
            logger.error(f"Failed to generate flashcards: {str(e)}")
            raise GeminiAPIError(f"Failed to generate flashcards: {str(e)}")

    def evaluate_answer(self, question: str, answer: str) -> Dict[str, Union[float, str]]:
        logger.info(f"Evaluating answer for question: {question[:50]}...")
        prompt = f'''You are an expert tutor.
For the question "{question}" this is my answer
"{answer}"

Now rate the answer with a rating between 0-5, and feedback

Only give me the JSON data and nothing else, return it in the following structure:
{{"rating": 0, "feedback": "The answer ..."}}'''
        try:
            # Check token count
            token_count_response = self.client.models.count_tokens(model=GENAI_MODEL, contents=prompt)
            token_count = getattr(token_count_response, 'total_tokens', 0)
            if token_count == 0 or token_count is None:
                logger.warning("Could not determine token count for evaluation, proceeding with caution")
            else:
                logger.info(f"Token count for evaluation prompt: {token_count}")
            
            if token_count >= INPUT_TOKEN_LIMIT:
                logger.warning(f"Token count ({token_count}) exceeds limit ({INPUT_TOKEN_LIMIT})")
                raise GeminiTokenLimitError(f"Input size of {token_count} tokens exceeds the limit of {INPUT_TOKEN_LIMIT} tokens. Please reduce your input.")
            
            logger.debug(f"Sending evaluation prompt to Gemini API: {prompt[:100]}...")
            resp = self.client.models.generate_content(model=GENAI_MODEL, contents=prompt)
            
            if resp.text is None:
                logger.error("Received empty evaluation response from Gemini API")
                raise GeminiAPIError("Received empty response from Gemini API")
                
            logger.debug(f"Received evaluation response: {resp.text[:100]}...")
            
            result = self._extract_json(resp.text)
            if not isinstance(result, dict):
                logger.error("Expected dictionary result but got different format")
                raise GeminiAPIError("Received invalid response format from the API")
                
            result_dict = cast(Dict[str, Union[float, str]], result)
            logger.info(f"Successfully evaluated answer with rating: {result_dict.get('rating')}")
            return result_dict
        except GeminiTokenLimitError:
            # Re-raise token limit errors
            raise
        except Exception as e:
            if "rate limit" in str(e).lower():
                logger.error("API rate limit exceeded during evaluation")
                raise GeminiRateLimitError("API rate limit exceeded. Please try again later.")
            logger.error(f"Failed to evaluate answer: {str(e)}")
            raise GeminiAPIError(f"Failed to evaluate answer: {str(e)}")

    def _extract_json(self, text: str) -> Union[List[Any], Dict[str, Any]]:
        logger.debug("Attempting to extract JSON from response")
        try:
            m = re.search(r"```json\s*(\{.*?\}|\[.*?\])\s*```", text, re.DOTALL)
            if not m:
                m = re.search(r"(\[\s*\".*?\"(?:,\s*\".*?\")*\])", text, re.DOTALL)
            if m:
                json_str = m.group(1)
                logger.debug(f"Found JSON string: {json_str[:100]}...")
                return json.loads(json_str)
            logger.error("JSON block not found in response")
            raise ValueError("JSON block not found in response")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON: {str(e)}")
            raise GeminiAPIError(f"Failed to parse JSON: {str(e)}")
        except Exception as e:
            logger.error(f"Failed to extract JSON: {str(e)}")
            raise GeminiAPIError(f"Failed to extract JSON: {str(e)}")

class GeminiAPIError(Exception):
    """Base exception for Gemini API errors"""
    pass

class GeminiRateLimitError(GeminiAPIError):
    """Exception raised when API rate limit is exceeded"""
    pass

class GeminiTokenLimitError(GeminiAPIError):
    """Exception raised when input token limit is exceeded"""
    pass
