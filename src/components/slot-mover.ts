import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { theme } from '../styles/theme';

@customElement('slot-mover')
export class SlotMover extends LitElement {
  static styles =
  css`
    * {
      background-color: white;
    }

    ::slotted(*) {
      text-transform: uppercase;
      border: 3px solid green;
    };
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('slotchange', this.onSlotChange);
    setTimeout(() => this.onSlotChange(), 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('slotchange', this.onSlotChange);
  }

  render() {
    return html`
      <div>
        <h3>First Slot:</h3>
        <slot name="first"></slot>
        <h3>Default Slot:</h3>
        <slot></slot>
        <h3>Third Slot:</h3>
        <slot name="third"></slot>
        <h3>Fin</h3>
      </div>
    `;
  }

  onSlotChange() {
    const slotsArray = this.renderRoot.querySelectorAll('slot');
    const currentElement = this;
    // Go through each slot shadowdom position
    slotsArray.forEach(slot => {
      // Fetch the corresponding slot in the lightDom
      // Named slot should move to their corresponding named slot
      if (slot.name) {
        const slotLightDom = currentElement.querySelector("[slot=" + slot.name + "]");
        slot.appendChild(slotLightDom);
      }
      // Default slot should move to their corresponding position
      else {
      // Get all content that doesn't have slot as attribute
        const slotLightDomArray = Array.from(currentElement.children).filter(
          node => {
            return (!node.getAttributeNode('slot'))
          }
        )

        // Move all default slot content to its corresponding position
        slotLightDomArray.forEach(slotLightDom=>
          {
          slot.previousElementSibling.appendChild(slotLightDom);
          }
        );
      }
    });
  }
}
