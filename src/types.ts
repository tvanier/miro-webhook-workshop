import type { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'node:http';

export type WebhookSubscription = {
    id: string
    callbackUrl: string
    createdAt: string
    data: {
      boardId: string
    }
    modifiedAt: string
    status: WebhookStatus
};

export type WebhookStatus = 'enabled' | 'disabled' | 'lost_access';

export type WebhookRequest = Pick<IncomingMessage, 'url' | 'headers'> & {
  body?: string
}

export type WebhookResponse = Pick<ServerResponse, | 'statusCode' | 'statusMessage'> & {
  headers?: OutgoingHttpHeaders
  body?: string
}

export type Webhook = (req: WebhookRequest) => Promise<WebhookResponse>
