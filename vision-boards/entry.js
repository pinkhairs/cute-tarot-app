class VisionBoardEntry extends HTMLElement {
  constructor() {
    super();
    this.queries = Object.fromEntries(new URLSearchParams(window.location.search));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="${this.queries.title}"></title-bar>
    `;
  }
}

customElements.define('vision-board-entry', VisionBoardEntry);