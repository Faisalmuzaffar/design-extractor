import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';
import { insertElementsSchema } from '../../shared/schema';

export const handler: Handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api/', '');
  
  // Extract elements endpoint
  if (event.httpMethod === 'POST' && path === 'extract') {
    try {
      const body = JSON.parse(event.body || '{}');
      const data = insertElementsSchema.parse(body);
      const result = await storage.saveExtractedElements(data);
      
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request data' }),
      };
    }
  }

  // Get elements by ID endpoint
  if (event.httpMethod === 'GET' && path.startsWith('elements/')) {
    const id = parseInt(path.split('/')[1]);
    const elements = await storage.getExtractedElements(id);
    
    if (!elements) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(elements),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' }),
  };
};
