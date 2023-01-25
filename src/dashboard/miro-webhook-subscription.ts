import { html, LitElement } from 'lit';
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { deleteWebhookSubscription } from '../miro-api';
import { WebhookSubscription } from '../types';

@customElement('miro-webhook-subscription')
export class MiroWFSubscription extends LitElement {

  @property() subscription: WebhookSubscription | undefined

  async deleteSubscription() {
    if (this.subscription) {
      const result = await deleteWebhookSubscription(this.subscription.id)
      console.log('delete result', result)
      this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }));
    }
  }

  render() {
    return html`
      <div>
        Subscription ID ${this.subscription?.id}

        <button
          @click=${this.deleteSubscription}
        >
          Delete
        </button>
      </div>
    `;
  }
}
