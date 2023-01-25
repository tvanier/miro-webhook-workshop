import { css, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import { state } from "lit/decorators/state.js";
import { createWebhookSubscription, getAllWebhookSubscriptions, getBoards } from "../miro-api";
import "./miro-webhook-subscription.js";
import { WebhookSubscription } from "../types";

@customElement("miro-webhook-dashboard")
export class MiroWFDashboard extends LitElement {
  static styles = css`
    input {
      min-width: 500px;
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

  renderSubscriptions() {
    return html`
      ${this.webhookSubscriptions.map(
        (subscription) =>
          html`
            <miro-webhook-subscription
              .subscription=${subscription}
              @remove=${this.refreshSubscriptions}
            >
            </miro-webhook-subscription>`
      )}
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
