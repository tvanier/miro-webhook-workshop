import { css, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import { state } from "lit/decorators/state.js";
import {
  createWebhookSubscription,
  deleteWebhookSubscription,
  getAllWebhookSubscriptions,
  getBoards
} from "../miro-api";
import { WebhookSubscription } from "../types";

@customElement("miro-webhook-dashboard")
export class MiroWebhookDashboard extends LitElement {
  static styles = css`
    input {
      min-width: 500px;
    }

    table {
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      border: 1px solid;
      padding: 10px;
    }
  `

  @state() webhookSubscriptions: WebhookSubscription[] = [];

  @state() canCreateSubscription = false

  @query('input') callbackUrlInput!: HTMLInputElement

  boardId = ''

  protected firstUpdated() {
    getBoards()
      .then((boards) => {
        this.boardId = boards?.data?.[0]?.id ?? '';
        this.canCreateSubscription = !!this.boardId && !!this.callbackUrlInput.value;
      })
      .then(() => this.refreshSubscriptions());
  }

  async refreshSubscriptions() {
    this.webhookSubscriptions = (await getAllWebhookSubscriptions()).data;
    this.requestUpdate();
  }

  onCallbackUrlInput() {
    this.canCreateSubscription = !!this.boardId && !!this.callbackUrlInput.value;
  }

  async createSubscription() {
    const subscription = await createWebhookSubscription(this.boardId, this.callbackUrlInput.value);
    console.log('new subscription', subscription);
    this.refreshSubscriptions();
  }

  async deleteSubscription(subscription: WebhookSubscription) {
    await deleteWebhookSubscription(subscription.id);
    this.refreshSubscriptions();
  }

  renderSubscription(subscription: WebhookSubscription) {
    return html`
      <tr>
        <td>${subscription?.id}</td>

        <td>Callback URL: ${subscription?.callbackUrl}</td>

        <td>
          <button
            @click=${() => this.deleteSubscription(subscription)}
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  }

  renderSubscriptions() {
    return html`
      <table>
        <thead>
          <tr>
            <th scope="col">Subscription ID</th>
            <th scope="col">Callback URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.webhookSubscriptions.map(this.renderSubscription.bind(this))}
        </tbody>
      </table>
    `
  }

  render() {
    return html`
      <div>
        <input
          @input=${this.onCallbackUrlInput}
          placeholder="Callback URL"
        />

        <button
          @click=${this.createSubscription}
          ?disabled=${!this.canCreateSubscription}
        >
          Create subscription
        </button>
      </div>

      <h2>${this.webhookSubscriptions.length} webhook subscriptions</h2>

      ${this.webhookSubscriptions.length > 0 ? this.renderSubscriptions() : nothing}
    `;
  }
}
