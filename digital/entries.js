import star from '@/assets/star.svg';
import { Preferences } from '@capacitor/preferences';
import { fetchWithAuth } from '@/auth'; // Ensure the correct path is used


class DigitalEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }
  
  connectedCallback() {
    this.fetchEntries();
  }

  async fetchEntries() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=digital_readings`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      this.entries = await response.json();
      this.render();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  render() {
    const getSecondSentenceOfFirstParagraph = text => {
      // Split by any of the <br> variations followed by another <br> (allowing whitespace in between)
      const paragraphs = text.split(/<br\s*\/?>\s*<br\s*\/?>/i);
      
      // Check if we have at least one paragraph
      if (paragraphs.length < 1) return '';
    
      // Split the first paragraph into sentences
      const sentences = paragraphs[0].match(/[^.!?]*[.!?]/g) || [];
    
      // Return the second sentence if available
      return sentences.length > 1 ? sentences[1].trim() : '';
    };
    
    const entriesHtml = this.entries.map(entry => `
      <li class="flex pb-4 mb-4">
        <button type="button" hx-target="#content" hx-get="/digital-entry.html" class="load-entry text-left flex" data-slug="${entry.slug}">
          <div>
            <div class="w-20 h-20 p-4  flex-shrink-0 flex items-center justify-center rounded-xl bg-translucent">
              <img src="${entry.card_image}" alt="" class="h-[53px] rounded-md">
            </div>
            <p class="w-20 mt-2 text-center opacity-80 text-sm break-words">${entry.card_name}</p>
          </div>
          <div class="flex-grow pl-4 flex-col">
            <h3 class="mb-2">${entry.title}</h3>
            <p class="mt-2 opacity-80 text-sm break-words">${entry.card_description}</p>
            <p class="my-2">${entry.reading ? getSecondSentenceOfFirstParagraph(entry.reading) : ''}</p>
            ${entry.manifested ? `<p class="bg-accent text-black font-serif inline-flex gap-1 px-2 py-[5px] items-center rounded-md text-sm"><img class="h-3" src="${star}" alt=""> Manifested</p>` : ''}
          </div>
        </button>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar class="w-full" title="Entries" data-back-link="/digital-index.html"></title-bar>
    <div class="w-full px-6 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <ul class="">
          ${entriesHtml}
        </ul>
      </div>
    </div>
    `;

    htmx.process(this);

    document.querySelectorAll('.load-entry').forEach(button => {
      button.addEventListener('click', async () => {
        await Preferences.set({
          key: 'digital-slug',
          value: button.dataset.slug
      });
      });
    });
  }
}

customElements.define('digital-entries', DigitalEntries);
