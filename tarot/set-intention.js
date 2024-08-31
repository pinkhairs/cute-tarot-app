class SetIntention extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    const todayCard = async () => {
      const response = await fetch(`/pwa.php?action=today_card`);
      const json = await response.json();
      return json;
    }

    todayCard().then(data => {
      const card = JSON.parse(data);
      document.getElementById('card-title-text').textContent = card.card_title;
      document.getElementById('card-content').textContent = card.card_content;
      document.getElementById('card').setAttribute('src', card.card_image);
    });

    const todayIntention = async () => {
      const response = await fetch(`/pwa.php?action=intention`);
      const json = await response.json();
      return JSON.parse(json);
    };

    todayIntention().then(data => {
      document.getElementById('intention-text').value = data.intention;
    });
  }

  render() {
    const saveReading = async (intention) => {
      await fetch(`/pwa.php?action=save_reading&card=0&intention=${intention}`);
    }

    this.innerHTML = `
      <title-bar class="w-full pb-6 short:pb-0" title="Set Intention"></title-bar>
      <div class="w-full px-4 flex-1 flex items-start justify-center">
        <img id="card" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-32 lg:h-48" alt="">
      </div>
      <div class="px-4 mt-8 short:mt-4 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2 id="card-title-text"></h2>
        </div>
        <div class="text-center items-center justify-center">
          <p id="card-content"></p>
        </div>
        <form class="max-w-80 flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl text-center">
          <div class="field flex flex-col items-center justify-between gap-2 w-full rounded-2xl text-center">
            <label class="label opacity-80 font-serif">Today's intention</label>
            <textarea id="intention-text" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
          </div>
          <button id="save_intention" type="button" class="transition-opacity origin-top duration-1000 bg-brand text-lg font-serif text-white rounded-xl px-4 py-3">Save Intention</a>
        </form>
      </div>
    `;

    document.getElementById('save_intention').addEventListener('click', async () => {
      const intentionText = document.getElementById('intention-text').value;
      saveReading(intentionText).then(() => {
        window.location.href = '/app/';
      });
    });
  }
}

customElements.define('set-intention', SetIntention);