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

// /*
  render() {
    return html`
      <div>
        <h3>First Slot:</h3>
        <slot name="first">default first slot</slot>
        <h3>Unnamed Slot:</h3>
        <slot></slot>
        <h3>Third Slot:</h3>
        <slot name="third">default third slot</slot>
        <h3>Fin</h3>
      </div>
    `;
  }
// */

/*
  render() {
    return html`
      <slot></slot>
    `;
  }
*/

  onSlotChange() {
    console.time();
    // Search for all slots provided by the Web Component.
    const slotsArray = this.renderRoot.querySelectorAll('slot');

    // If any slots found
    if (slotsArray.length > 0) {
      const currentElement = this;
      // Go through each slot shadow dom position
      slotsArray.forEach(slot => {
        // Process named slot
        if (slot.name) {
          // Fetch the corresponding named slot in the lightDom
          const slotLightDom = currentElement.querySelector("[slot=" + slot.name + "]");
          // Only if named slot found in light dom - move it into shadow DOM
          if (slotLightDom) {
            slot.before(slotLightDom);
          }
        }
        // Process default (unnamed) slot
        else {
          // Get all content that doesn't have slot as attribute
          const slotLightDomArray = Array.from(currentElement.children).filter(node => {
              return (!node.getAttributeNode('slot'));
          });

          // Move all unnamed slot content to the corresponding position in shadow DOM
          slotLightDomArray.forEach(slotLightDom => {
            slot.before(slotLightDom);
          });
        }
      });
    }
    console.timeEnd();
  }
}
