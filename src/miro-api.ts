import { WebhookSubscription, WebhookStatus } from "./types";

const defaultHeaders = {
    'Authorization': `Bearer ${import.meta.env.VITE_MIRO_ACCESS_TOKEN}`
}

export const getBoards = () =>
  fetch(`${import.meta.env.VITE_MIRO_API_URL}/boards`, {
    headers: defaultHeaders
  })
  .then((response) => response.json());

export type GetWebhookSubscriptionsResponse = {
  cursor: string
  limit: number
  size: number
  total: number
  data: WebhookSubscription[]
}

export const getAllWebhookSubscriptions = (
  limit = 10,
  cursor?: string
): Promise<GetWebhookSubscriptionsResponse> => {
  const url = new URL(`${import.meta.env.VITE_MIRO_API_URL_EXPERIMENTAL}/webhooks/subscriptions`)
  url.searchParams.set('limit', String(limit));
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }

  return fetch(url, {
    method: 'GET',
    headers: defaultHeaders
  })
  .then((response) => response.json());
}

export const getWebhookSubscription = (
  subscriptionId: string
): Promise<WebhookSubscription> =>
  fetch(`${import.meta.env.VITE_MIRO_API_URL_EXPERIMENTAL}/webhooks/subscription/${subscriptionId}`, {
    method: 'GET'
  })
  .then((response) => response.json());

export const createWebhookSubscription = (
  boardId: string,
  callbackUrl: string,
  status: WebhookStatus = 'enabled'
): Promise<WebhookSubscription> =>
  fetch(`${import.meta.env.VITE_MIRO_API_URL_EXPERIMENTAL}/webhooks/board_subscriptions`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ boardId, callbackUrl, status })
  })
  .then((response) => response.json());

export const deleteWebhookSubscription = (subscriptionId: string) =>
  fetch(`${import.meta.env.VITE_MIRO_API_URL_EXPERIMENTAL}/webhooks/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      'Accept': 'application/json'
    },
  });
