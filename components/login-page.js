class LoginPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div></div>
    `;
  }
}

customElements.define('login-page', LoginPage);
