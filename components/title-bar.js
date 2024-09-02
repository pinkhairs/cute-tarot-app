class TitleBar extends HTMLElement {
  constructor() {
    super();
    this.subtitle = this.getAttribute('subtitle');
    this.title = this.getAttribute('title');
    this.root = this.getAttribute('root') || false;
    this.subDirLink = '/app/tarot';
    this.entries = true;
    this.settings = false;
    this.backArrow = false;
    this.entrySettings = false;

    if (window.location.pathname === '/' || window.location.pathname.startsWith('/app/tarot')) {
      this.subDirLink = '/app/tarot';
    } else if (window.location.pathname.startsWith('/app/vision-boards')) {
      this.subDirLink = '/app/vision-boards';
      if (window.location.pathname.startsWith('/app/vision-boards/entry.html')) {
        this.backArrow = true;
        this.settings = true;
        this.entrySettings = true;
      }
    } else if (window.location.pathname.startsWith('/app/vision-boards/settings.html')) {
    } else if (window.location.pathname.startsWith('/app/you')) {
      this.entries = false;
      this.subDirLink = '/app/you';
    }

    if (window.location.search.includes('settings=true')) {
      this.entrySettings = false;
      this.settings = false;
    }

    this.backLink = this.subDirLink === '/app/tarot' ? '/app/tarot-index.html' : this.subDirLink+'-index.html';
    this.backLinkDisplay = this.subDirLink === '/app/tarot' ? '/app/' : this.subDirLink+'.html';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="flex flex-col gap-2">
      <header class="px-6">
        <div class="flex items-center gap-4 justify-center">
          <div class="w-8">
            ${this.root && this.entries ? `<div>
              <button type="button" hx-target="#content" hx-get="${this.subDirLink}-entries.html" hx-push-url="${this.subDirLink}/entries.html">
                <svg fill="currentColor" class="w-5 h-5" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="20" height="3" rx="1.5" />
                  <rect x="0.5" y="8.5" width="20" height="3" rx="1.5" />
                  <rect x="0.5" y="16.5" width="20" height="3" rx="1.5" />
                </svg>
              </button>
            </div>` : ''}
            ${this.backArrow ? `<div>
              <button type="button" hx-get="${this.backLink}" hx-target="#content" hx-push-url="${this.backLinkDisplay}">
                <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.656059" y="10.2212" width="13.4243" height="3.35608" rx="1.67804" transform="rotate(-45 0.656059 10.2212)" fill="currentColor"/>
                  <rect x="3.02917" y="7.86328" width="13.4243" height="3.35608" rx="1.67804" transform="rotate(45 3.02917 7.86328)" fill="currentColor"/>
                </svg>
              </button>
            </div>` : ''}
          </div>
          <div class="flex-grow text-center">
            <h1>${this.title}</h1>
          </div>
          <div class="flex items-center justify-end w-8">
            ${this.root || this.settings ? `
            <div>
              <button type="button" hx-get="${this.entrySettings ? window.location.pathname.replace('/entry.html', '-entry.html') + window.location.search + '&settings=true' : this.subDirLink + '-settings.html'}" hx-target="#content" hx-push-url="${this.entrySettings ? window.location.pathname + window.location.search + '&settings=true' : this.subDirLink+ '/settings.html'}">
                <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.9452 6.53624C23.3726 6.40496 23.8484 6.52217 24.1349 6.85505C24.5282 7.31451 24.8876 7.80211 25.2081 8.31783L25.4363 8.6976C25.7325 9.21332 25.9899 9.7478 26.2035 10.3057L26.1987 10.3104C26.3541 10.7183 26.2229 11.1731 25.8879 11.4638L23.7853 13.311C23.8387 13.7001 23.8679 14.0987 23.8679 14.5019C23.8679 14.9051 23.8387 15.3036 23.7853 15.6927L25.8879 17.5399C26.2229 17.8306 26.3541 18.2854 26.1987 18.6933C25.985 19.2512 25.7276 19.7857 25.4314 20.3014L25.2032 20.6812C24.8827 21.1969 24.5234 21.6845 24.1301 22.144C23.8436 22.4815 23.3677 22.5941 22.9404 22.4628L20.2357 21.6329C19.585 22.1158 18.8663 22.519 18.0991 22.8238L17.4921 25.5009C17.395 25.9275 17.0551 26.2651 16.6083 26.3354C15.9382 26.4433 15.2487 26.4995 14.5446 26.4995C13.8405 26.4995 13.151 26.4433 12.4809 26.3354C12.0341 26.2651 11.6942 25.9275 11.5971 25.5009L10.9901 22.8238C10.2229 22.519 9.50422 22.1158 8.85353 21.6329L6.15367 22.4675C5.72636 22.5987 5.25048 22.4815 4.96399 22.1487C4.57066 21.6892 4.21133 21.2016 3.89084 20.6859L3.66262 20.3061C3.36641 19.7904 3.10905 19.2559 2.89539 18.698C2.74001 18.2901 2.87111 17.8353 3.20617 17.5446L5.30875 15.6974C5.25534 15.3036 5.22621 14.9051 5.22621 14.5019C5.22621 14.0987 5.25534 13.7001 5.30875 13.311L3.20617 11.4638C2.87111 11.1731 2.74001 10.7183 2.89539 10.3104C3.10905 9.75249 3.36641 9.21801 3.66262 8.70229L3.89084 8.32252C4.21133 7.8068 4.57066 7.3192 4.96399 6.85974C5.25048 6.52217 5.72636 6.40965 6.15367 6.54093L8.85839 7.37078C9.50907 6.88787 10.2277 6.48467 10.995 6.17992L11.6019 3.50283C11.6991 3.07619 12.039 2.73862 12.4857 2.66829C13.1558 2.55577 13.8454 2.49951 14.5495 2.49951C15.2536 2.49951 15.9431 2.55577 16.6132 2.66361C17.0599 2.73393 17.3998 3.0715 17.497 3.49814L18.1039 6.17523C18.8712 6.47998 19.5898 6.88318 20.2405 7.36609L22.9452 6.53624ZM29.1295 10.9558L28.6899 11.3801C28.528 12.146 28.1139 12.8393 27.5339 13.3454L26.3671 14.3706C26.3676 14.4142 26.3679 14.458 26.3679 14.5019C26.3679 14.5457 26.3676 14.5895 26.3671 14.6331L27.5339 15.6583C28.5877 16.5779 29.094 18.1157 28.5349 19.5833L28.5333 19.5874C28.2703 20.2742 27.9559 20.9257 27.5993 21.5465L27.587 21.568L27.3364 21.9849L27.3266 22.0007C26.9367 22.6282 26.5017 23.2178 26.0292 23.7698C25.0177 24.9546 23.4644 25.2387 22.2062 24.8526L20.6241 24.3671C20.5065 24.4357 20.3875 24.5024 20.2673 24.5671L19.9298 26.0558C19.6171 27.4293 18.5053 28.5654 17.0023 28.8042C16.2022 28.9328 15.3809 28.9995 14.5446 28.9995C13.7083 28.9995 12.887 28.9328 12.0869 28.8042C10.5839 28.5654 9.47211 27.4293 9.15945 26.0558L8.82192 24.5671C8.70268 24.5029 8.58469 24.4368 8.468 24.3688L6.88784 24.8572C5.60822 25.2504 4.06716 24.9391 3.06915 23.7795L3.06482 23.7744C2.59233 23.2225 2.15738 22.6329 1.76745 22.0054L1.75762 21.9896L1.50706 21.5727L1.49474 21.5512C1.13818 20.9304 0.823752 20.2789 0.560731 19.5921L0.55917 19.588C7.55787e-05 18.1203 0.506378 16.5825 1.56018 15.6629L2.72705 14.6378C2.72649 14.5926 2.72621 14.5473 2.72621 14.5019C2.72621 14.458 2.72647 14.4142 2.727 14.3706L1.56029 13.3455C0.506413 12.426 5.65052e-05 10.8881 0.559173 9.42042L0.560727 9.41634C0.823752 8.72952 1.13818 8.07799 1.49474 7.45717L1.50706 7.43572L1.75762 7.0188L1.76745 7.00298C2.15665 6.37668 2.59071 5.7881 3.06218 5.23704C4.07361 4.04965 5.62857 3.76464 6.88784 4.15115L8.46997 4.63658C8.5876 4.56799 8.70655 4.50132 8.82677 4.43663L9.1643 2.94795C9.47629 1.57736 10.584 0.443205 12.0821 0.201076C12.891 0.065861 13.7157 -0.000488281 14.5495 -0.000488281C15.3858 -0.000488281 16.2071 0.0662646 17.0073 0.19486C18.5102 0.433708 19.622 1.56977 19.9346 2.94326L20.2721 4.43194C20.3924 4.49663 20.5113 4.5633 20.6289 4.63189L22.2119 4.1462C23.4914 3.75349 25.032 4.0649 26.0298 5.22423L26.0341 5.22926C26.5066 5.78121 26.9415 6.37082 27.3315 6.9983L27.3413 7.01411L27.5918 7.43103L27.6042 7.45248C27.9607 8.0733 28.2752 8.72484 28.5382 9.41166L29.1295 10.9558Z" fill="currentColor"/>
<circle cx="14.7291" cy="14.4995" r="2.375" fill="currentColor"/>
</svg>

              </a>
            </div>` : ``}
            ${!window.location.search.includes('settings=true') && !(this.root || this.settings) ? `
              <div>
              <button type="button" hx-get="${this.backLink}" hx-target="#content" hx-push-url="${this.backLinkDisplay}">
                <svg class="w-4 h-4"" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.430771" y="14.1667" width="20" height="3" rx="1.5" transform="rotate(-45 0.430771 14.1667)" fill="currentColor"/>
<rect x="2.55209" y="0.0246582" width="20" height="3" rx="1.5" transform="rotate(45 2.55209 0.0246582)" fill="currentColor"/>
</svg>

              </button>
            </div>
            ` : ''}
          </div>
        </div>
      </header>
      ${this.subtitle ? `<div class="pt-2 text-center text-xl">${this.subtitle}</div>` : ''}
    </div>`;

    htmx.process(this);
  }
}

customElements.define('title-bar', TitleBar);