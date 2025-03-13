class IconButton extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("icon-button");
    const templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    const style = document.createElement("style");
    style.textContent = `
        .icon-button {
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background-color: transparent;
          position: relative;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .icon-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          backdrop-filter: blur(0px);
          letter-spacing: 0.8px;
          border-radius: 10px;
          transition: all 0.3s;
          border: 1px solid rgba(156, 156, 156, 0.466);
          font-size: 1.5em;
          color: white;
          line-height: 0;
        }
        .icon-background {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background: var(--small-button-background);
          z-index: -1;
          border-radius: 10px;
          pointer-events: none;
          transition: all 0.3s;
        }
        .icon-button:hover .icon-background {
          transform: rotate(35deg);
          transform-origin: bottom;
        }
        .icon-button:hover .icon-container {
          background-color: rgba(156, 156, 156, 0.466);
          backdrop-filter: blur(4px);
        }
      `;
    shadowRoot.appendChild(style);
  }
}
customElements.define("icon-button", IconButton);
