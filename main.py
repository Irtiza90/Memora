import re
import json
from google import genai
from dotenv import dotenv_values

env = dotenv_values('.env')
GENAI_MODEL = "gemini-2.0-flash"

client = genai.Client(api_key=env.get('GEMINI_API_KEY'))
token_count = client.models.count_tokens(model=GENAI_MODEL, contents=f'''You are an expert tutor.
The user wants to study the topic: "Python" at a advanced level.

Generate a list of [3] flashcards, with a list of questions

Only give me the questions and nothing else.
Format it as JSON like this:
[
"What is a web framework?",
"What is CSS for"
]''')

# token_count = model.count_tokens()
print("Total tokens:", token_count.total_tokens)

exit()

try:
    client = genai.Client(api_key=env.get('GEMINI_API_KEY'))
except Exception as e:
    print(f"[ERROR] Failed to initialize Gemini client: {e}")
    exit(1)

def get_topic_level():
    try:
        topic = input("Enter the topic you'd like to learn: ")
        level = input("Enter the level (e.g., beginner, intermediate, advanced): ")
        return topic, level
    except Exception as e:
        print(f"[ERROR] Failed to get topic and level: {e}")
        exit(1)

def generate_flashcards(topic, level, count=15):
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
        print("[DEBUG] Sending flashcard generation prompt to Gemini API...")
        resp = client.models.generate_content(model=GENAI_MODEL, contents=prompt)
        print("[DEBUG] Received response from Gemini API.")
        return resp.text
    except Exception as e:
        print(f"[ERROR] Failed to generate flashcards: {e}")
        exit(1)

def extract_json(text):
    try:
        print("[DEBUG] Extracting JSON from Gemini response...")
        m = re.search(r"```json\s*(\{.*?\}|\[.*?\])\s*```", text, re.DOTALL)
        if not m:
            m = re.search(r"(\[\s*\".*?\"(?:,\s*\".*?\")*\])", text, re.DOTALL)
        if m:
            return json.loads(m.group(1))
        raise ValueError("JSON block not found in response")
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON: {e}")
        exit(1)
    except Exception as e:
        print(f"[ERROR] Failed to extract JSON: {e}")
        exit(1)

def evaluate_answer(question, answer):
    prompt = f'''You are an expert tutor.
For the question "{question}" this is my answer
"{answer}"

Now rate the answer with a rating between 0-5, and feedback

Only give me the JSON data and nothing else, return it in the following structure:
{{"rating": 0, "feedback": "The answer ..."}}'''
    try:
        print(f"[DEBUG] Evaluating answer for question: {question}")
        resp = client.models.generate_content(model=GENAI_MODEL, contents=prompt)
        result = extract_json(resp.text)
        print(f"Rating: {result['rating']}\nFeedback: {result['feedback']}\n")
    except Exception as e:
        print(f"[ERROR] Failed to evaluate answer: {e}")

def ask_questions(questions):
    for q in questions:
        try:
            answer = input(f"AI: {q}\nYour answer: ")
            evaluate_answer(q, answer)
        except Exception as e:
            print(f"[ERROR] Error during question loop: {e}")

def main():
    try:
        topic, level = get_topic_level()
        raw = generate_flashcards(topic, level)
        questions = extract_json(raw)
        ask_questions(questions)
    except Exception as e:
        print(f"[ERROR] Unexpected error in main(): {e}")

if __name__ == '__main__':
    main()
