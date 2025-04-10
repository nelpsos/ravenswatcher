class FancyButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'background-color'];
  }

  constructor() {
    super();
    const template = document.getElementById("fancy-button");
    const templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    this.styleElement = document.createElement("style");
    this.styleElement.textContent = this.getStyle();
    shadowRoot.appendChild(this.styleElement);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' || name === 'background-color') {
      this.styleElement.textContent = this.getStyle();
    }
  }

  getStyle() {
    const variant = this.getAttribute('variant');
    const backgroundColor = this.getAttribute('background-color');
    const styles = [];

    styles.push(`
      .fancy-button {
        position: relative;
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
        outline-offset: 4px;
        transition: filter 250ms;
        user-select: none;
        touch-action: manipulation;
      }
    `);

    styles.push(`
      .fancy-button-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background: hsl(0deg 0% 0% / 0.25);
        will-change: transform;
        transform: translateY(2px);
        transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
      }
    `);

    styles.push(`
      .fancy-button-edge {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(
          to left,
          hsl(115deg 50% 16%) 0%,
          hsl(115deg 50% 32%) 8%,
          hsl(115deg 50% 32%) 92%,
          hsl(115deg 50% 16%) 100%
        );
      }
    `);

    styles.push(`
      .fancy-button-front {
        display: block;
        position: relative;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 1.1rem;
        color: white;
        background: hsl(120deg 50% 47%);
        will-change: transform;
        transform: translateY(-3px);
        transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
      }
    `);

    styles.push(`
      .fancy-button:hover {
        filter: brightness(110%);
      }

      .fancy-button:hover .fancy-button-front {
        transform: translateY(-4px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }

      .fancy-button:active .fancy-button-front {
        transform: translateY(-2px);
        transition: transform 34ms;
      }

      .fancy-button:hover .fancy-button-shadow {
        transform: translateY(4px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }

      .fancy-button:active .fancy-button-shadow {
        transform: translateY(1px);
        transition: transform 34ms;
      }

      .fancy-button:focus:not(:focus-visible) {
        outline: none;
      }
    `);

    if (variant === 'icon') {
      styles.push(`
        .fancy-button-front {
          padding: 4px;
          width: 24px;
          height: 24px;
        }
      `);
    }

    switch (backgroundColor) {
      case 'red':
        styles.push(`
          .fancy-button-front {
            background: hsl(350deg 50% 47%);
          }
        `);
        styles.push(`
          .fancy-button-edge {
            background: linear-gradient(
              to left,
              hsl(345deg 50% 16%) 0%,
              hsl(345deg 50% 32%) 8%,
              hsl(345deg 50% 32%) 92%,
              hsl(345deg 50% 16%) 100%
            );
          }
        `);
        break;
      case 'blue':
        styles.push(`
          .fancy-button-front {
            background: hsl(245deg 50% 47%);
          }
        `);
        styles.push(`
          .fancy-button-edge {
            background: linear-gradient(
              to left,
              hsl(240deg 50% 16%) 0%,
              hsl(240deg 50% 32%) 8%,
              hsl(240deg 50% 32%) 92%,
              hsl(240deg 50% 16%) 100%
            );
          }
        `);
        break;
      case 'green':
      default:
        styles.push(`
          .fancy-button-front {
            background: hsl(120deg 50% 47%);
          }
        `);
        styles.push(`
          .fancy-button-edge {
            background: linear-gradient(
              to left,
              hsl(115deg 50% 16%) 0%,
              hsl(115deg 50% 32%) 8%,
              hsl(115deg 50% 32%) 92%,
              hsl(115deg 50% 16%) 100%
            );
          }
        `);
        break;
    }

    return styles.join('\n');
  }
}

customElements.define('fancy-button', FancyButton);
