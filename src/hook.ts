import type { Webhook } from './types';

export const hook: Webhook = async (req) => {
  if (req.body) {
    try {
      const { challenge } = JSON.parse(req.body);

      if (challenge) {
        // return identical challenge
        return {
          statusCode: 200,
          statusMessage: 'OK',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ challenge })
        };
      }
    } catch (error) {
      console.log('hook error', error);
      return {
        statusCode: 500,
        statusMessage: 'Internal Error',
        body: String(error)
      };
    }
  }

  // https://developers.miro.com/reference/webhooks-overview#webhooks-event-workflow

  // should handle hook here
  return {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: "Hello World" }),
    };
};
