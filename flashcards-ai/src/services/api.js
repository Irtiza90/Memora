const API_URL = 'http://localhost:5000/api';

export const generateFlashcards = async (data) => {
  try {
    const response = await fetch(`${API_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      // Handle specific error types
      if (response.status === 413 || result.error_type === 'token_limit_exceeded') {
        throw {
          message: result.error || 'Input exceeds token limit',
          type: 'token_limit_exceeded'
        };
      }
      // Handle rate limit errors
      if (response.status === 429) {
        throw {
          message: result.error || 'Rate limit exceeded, please try again later',
          type: 'rate_limit'
        };
      }
      throw new Error(result.error || 'Failed to generate flashcards');
    }
    
    return result.questions;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

export const evaluateAnswer = async (question, answer) => {
  try {
    const response = await fetch(`${API_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      // Handle specific error types
      if (response.status === 413 || result.error_type === 'token_limit_exceeded') {
        throw {
          message: result.error || 'Input exceeds token limit',
          type: 'token_limit_exceeded'
        };
      }
      // Handle rate limit errors
      if (response.status === 429) {
        throw {
          message: result.error || 'Rate limit exceeded, please try again later',
          type: 'rate_limit'
        };
      }
      throw new Error(result.error || 'Failed to evaluate answer');
    }
    
    return result;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
}; 
