import type { Webhook, WebhookRequest, WebhookResponse } from './types';
import { createHmac, timingSafeEqual } from 'node:crypto';

const respondChallenge = (req: WebhookRequest): WebhookResponse | undefined => {
  const { challenge } = JSON.parse(req.body ?? '{}');

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

  return undefined
}

const verifyHook = (req: WebhookRequest) => {
  const hmac = createHmac('sha256', process.env.MIRO_CLIENT_SECRET ?? '');
  hmac.update(req.body ?? '');
  const digest = hmac.digest('base64');

  let digestHeader = req.headers['x-miro-hmac-sha256'] ?? '';
  if (Array.isArray(digestHeader)) {
    digestHeader = digestHeader[0];
  }

  return timingSafeEqual(Buffer.from(digestHeader), Buffer.from(digest));
}

const processHook = (req: WebhookRequest): WebhookResponse => {
  // re-implement this function with your own logic
  // the webhook input data is in req.body
  console.log('hook request body', req.body);

  return {
    statusCode: 501,
    statusMessage: 'Not Implemented'
  };
}

/**
 * This handler is called by the /webhook endpoint of the dev server (see vite.config.ts)
 * It implements the webhook event flow
 * https://developers.miro.com/reference/webhooks-overview#webhooks-event-workflow
 *
 * @param req {WebhookRequest}
 * @returns {WebhookResponse}
 */
export const handleHook: Webhook = async (req) => {
  let response;

  try {
    response = respondChallenge(req);

    if (!response) {
      if (!verifyHook(req)) {
        response = {
          statusCode: 401,
          statusMessage: 'Unauthorized'
        };
      } else {
        response = processHook(req);
      }
    }
  } catch (error) {
    response = {
      statusCode: 500,
      statusMessage: 'Internal Error',
      body: String(error)
    };
  }

  console.log('hook response', response);
  return response;
}
