import intentions from '@/assets/intentions.png';
import inspired from '@/assets/inspired.png';
import vision from '@/assets/vision.png';

class YouPentacles extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/you-settings.html" class="w-full" title="Pentacles" subtitle="You get 1 free credit per reading!"></title-bar>
     <form id="account-form" method="post" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
     
     <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="40" cy="40" r="40" fill="#F6D072"/>
<circle cx="40" cy="40" r="32" stroke="#EEF4FF" stroke-width="4"/>
<path d="M29.2861 52.4982L30.2615 46.0258C30.395 45.1366 30.0828 44.2387 29.4282 43.625L24.6482 39.1508C22.9968 37.6048 23.8344 34.8337 26.0672 34.4634L32.5245 33.3911C33.4116 33.2447 34.1695 32.6698 34.5506 31.8559L37.3303 25.9283C38.2906 23.8785 41.1844 23.8204 42.2266 25.8293L45.241 31.6406C45.6544 32.4394 46.436 32.982 47.3274 33.0918L53.8234 33.9014C56.0692 34.1813 57.0187 36.9158 55.4297 38.5285L50.8349 43.1923C50.204 43.8317 49.9284 44.7425 50.0985 45.6253L51.3344 52.0546C51.7629 54.2767 49.4547 56.025 47.4307 55.0131L41.5763 52.0848C40.7732 51.6821 39.8215 51.7015 39.0356 52.1364L33.3039 55.2973C31.323 56.3911 28.9481 54.7375 29.2861 52.4982Z" fill="#EEF4FF"/>
</svg>
    <div class="w-full grid grid-cols-3 gap-2" id="pentacles">
      <div class="flex items-center flex-col justify-center rounded-2xl bg-brand text-center p-2">
        <p class="text-white text-2xl font-serif">22</p>
        <h2 class="text-white font-sans text-sm opacity-80 mb-2">Pentacles</h2>
        <button hx-get="/you-pentacles.html" hx-target="#content" type="button" class="w-full mx-auto transition-opacity origin-top duration-1000 bg-accent font-serif text-black rounded-xl px-4 py-2">Buy $6</button>
        </div>
      <div class="flex items-center flex-col justify-center rounded-2xl bg-brand text-center p-2">
        <p class="text-white text-2xl font-serif">111</p>
        <h2 class="text-white font-sans text-sm opacity-80 mb-2">Pentacles</h2>
        <button hx-get="/you-pentacles.html" hx-target="#content" type="button" class="w-full mx-auto transition-opacity origin-top duration-1000 bg-accent font-serif text-black rounded-xl px-4 py-2">Buy $10</button>
        </div>
      <div class="flex items-center flex-col justify-center rounded-2xl bg-brand text-center p-2">
        <p class="text-white text-2xl font-serif">333</p>
        <h2 class="text-white font-sans text-sm opacity-80 mb-2">Pentacles</h2>
        <button hx-get="/you-pentacles.html" hx-target="#content" type="button" class="w-full mx-auto transition-opacity origin-top duration-1000 bg-accent font-serif text-black rounded-xl px-4 py-2">Buy $30</button>
        </div>
    </div>
  

  
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
    <h3 class="text-center">What can I redeem with Pentacles?</h3>
    <p class="text-center">Personalized to your aesthetics, lifestyle, personality, and vision:</p><div class="flex flex-col gap-6 w-full">


<div class="w-full flex text-left items-center gap-3">
<div class="w-20 h-20 p-1.5  bg-accent flex items-center justify-center rounded-2xl flex-shrink-0"><img src="${intentions}" alt=""></div>
<div class="flex flex-col gap-1.5"><h3>Set intentions</h3><p>Manifest daily intentions and watch life sparkle.</p>
<div class="inline-flex items-center gap-1">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
</svg>

<div class="opacity-80 font-serif text-sm">1 pentacle per day</div>

</div></div>
</div>


    <div class="w-full flex text-left items-center gap-3">
    <div class="w-20 h-20 p-3  bg-[#C0EFFF] flex items-center justify-center rounded-2xl flex-shrink-0"><img src="${inspired}" alt=""></div>
    <div class="flex flex-col gap-1.5"><h3>Inspired action</h3><p>Intention and vision board ideas.</p>
    <div class="inline-flex items-center gap-1">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
</svg>

<div class="opacity-80 font-serif text-sm">11 ideas for 1 pentacle</div>
    
    </div></div>
</div>


<div class="w-full flex text-left items-center gap-3">
<div class="w-20 h-20 p-3  bg-[#FFDEF6] flex items-center justify-center rounded-2xl flex-shrink-0"><img src="${vision}" alt=""></div>
<div class="flex flex-col gap-1.5"><h3>New sights</h3><p>Create new vision boards.</p>
<div class="inline-flex items-center gap-1">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
</svg>

<div class="opacity-80 font-serif text-sm">1 pentacle per board</div>

</div></div>
</div>
</div>
</div>



      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
    <h3>What are pentacles?</h3>
    <p class="text-center">Pentacles are credits you can use around the app. No subscription—just a pay-as-you-go system so you can invest more in your manifestations.</p>
      




      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
    <h3 class="text-center">Do Pentacles expire?</h3>
    <p class="text-center">They do not! However, our policy does not cover refunds.</p>
      </div>
      <div class="h-4"></div>
      </div>`;

    
    document.getElementById('pentacles').addEventListener('click', async (e) => {
      trackEvent('pentacles', 'Pentacles click', '🪙', false);
      alert('Pentacles are coming soon!');
    });
  }
}

customElements.define('you-pentacles', YouPentacles);
