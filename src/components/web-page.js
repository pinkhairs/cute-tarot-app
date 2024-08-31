class WebPage extends HTMLElement {
  constructor() {
    super();
    this.path = this.getAttribute('path');
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <main id="main" hx-get="${path}" class="flex-1" hx-trigger="load"></main>
    <tab-dock class="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center"></tab-dock>`;
  }
}

customElements.define('web-page', WebPage);