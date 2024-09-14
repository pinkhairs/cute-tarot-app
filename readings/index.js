import cards from '@/assets/cards.svg';
import cv from "@techstark/opencv-js";
import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';

class ReadingsIndex extends HTMLElement {
  constructor() {
    super();
    this.cards = [];
    this.pentacles = 0;
  }

  async getPentacles() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_pentacles`);
    return await response.text();
  }

  async requestCameraPermissions() {
    // Check camera permissions first
    const permissions = await navigator.permissions.query({ name: 'camera' });
    
    // If permissions are denied or prompt, request permissions
    if (permissions.state === 'denied') {
        alert('Camera access was denied. Please enable it in settings.');
        return;
    } else if (permissions.state === 'prompt') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream once access is granted
            console.log('Camera access granted.');
        } catch (error) {
            console.error('Camera access denied:', error);
            alert('Camera access was denied. Please enable it in settings.');
        }
    }
  } 
  
  async handleImageCapture() {
    // Check camera permissions first
    const permissions = await Camera.checkPermissions();
    
    // If permissions are denied or prompt, request permissions
    if (permissions.camera === 'denied' || permissions.camera === 'prompt') {
      const requestedPermissions = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
      if (requestedPermissions.camera === 'denied') {
        alert('Camera access was denied. Please enable it in settings.');
        return;
      }
    }
  
    // If permissions are granted, proceed to open the camera
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,  // Ensure camera source is used
      });
  
      const imageUrl = image.webPath;
      const imageElement = this.querySelector('#image');
      imageElement.src = imageUrl;
  
      // Process the image after capturing it
      this.processImage(imageUrl);
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  }

  connectedCallback() {
    this.getPentacles().then(pentacles => {
      this.pentacles = pentacles;
      this.render();
    });
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <title-bar root="true" data-entries-link="/readings-entries.html" class="w-full" title="IRL Readings" subtitle="Take a pic and get a reading"></title-bar>

      <img id="image" class="-z-50 absolute opacity-0">
      <canvas id="canvas" class="-z-50 absolute opacity-0"></canvas>
      
      <div class="p-4 flex-1">
        <div class="h-full w-full flex items-center justify-between border-dashed border-2 rounded-2xl border-white p-4 flex-col">
        <div></div>
        <label id="file-label" class="flex flex-col items-center justify-center">
          ${this.pentacles > 0 ? `<input type="file" id="reading" name="reading" class="hidden" accept="image/*">` :``}
          <img src="${cards}" alt="" class="h-16 mb-4">
          <h2 class="mb-2 flex items-center justify-center gap-1.5">
          Tap for photo</h2>
          <p class="opacity-80 mb-2 text-center">3 card spread • Light background • Kawaii Tarot and Spoopy Tarot exclusive</p>
        </label>

        <div class="mt-4 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
          </svg>

        <div class="opacity-80 font-serif">You will spend 1 pentacle</div>
      </div>
        </div>
      </div>
    `;

    document.getElementById('file-label').addEventListener('click', async (e) => {
      await this.requestCameraPermissions();

      if (this.pentacles < 1) {
        if (confirm('You do not have enough pentacles to get a reading. Click OK to purchase more.')) {
          htmx.ajax('GET', '/you-pentacles.html', '#content');
        }
        return false;
      }
    })
  }
  setupEventListeners() {
    if (this.pentacles < 1) return;
    const fileInput = this.querySelector('#reading');
    fileInput.addEventListener('change', this.handleImageUpload.bind(this));
  }

  handleImageUpload(event) {
    const image = this.querySelector('#image');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target.result;
      image.onload = () => {
        const canvas = this.querySelector('#canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.processImage(image, file);
      }
    };

    reader.readAsDataURL(file);
  }

  processImage(image, file) {
    // Process the image with OpenCV
    let src = cv.imread('canvas');
    this.detectCards(src, file);
    src.delete();
  }

  
  detectCards(src, file) {
    let gray = new cv.Mat();
    let binary = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, binary, 120, 255, cv.THRESH_BINARY_INV);
    cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let potentialCards = [];
    const minArea = 2222;  // Adjust based on your image size
    const maxArea = src.rows * src.cols / 3; // Max 1/3 of image size

    for (let i = 0; i < contours.size(); ++i) {
        let rect = cv.boundingRect(contours.get(i));
        let contourArea = rect.width * rect.height;
        let ratio = rect.height / rect.width; // Notice the inversion here for height/width

        // Check if the rectangle is square or taller than wide
        if (ratio >= .88 && ratio < 2 &&
            minArea < contourArea && 
            contourArea < maxArea) {
            potentialCards.push({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            });
        }
    }

    // Group close contours
    this.cards = this.groupCloseContours(potentialCards, src.cols, src.rows);

    const formData = new FormData();
    formData.append('reading', file);
    formData.append('cards', JSON.stringify(this.cards));
    
    const create_new_reading = fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=create_custom_reading`, {
      method: 'POST',
      body: formData
    }, false);

    create_new_reading.then(async response => {
      if (response.ok) {
        const result = await response.text();
        await Preferences.set({ key: 'reading-slug', value: result });
        htmx.ajax('GET', `/readings-entry.html`, { target: '#content' });
      } else {
        alert('Sorry, we had trouble reading your cards. Please try again.');
      }
    });

    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
}


  groupCloseContours(potentialCards, imgWidth, imgHeight) {
    const groupedCards = [];
    const distanceThreshold = Math.min(imgWidth, imgHeight) * 0.25;
    for (const card of potentialCards) {
      let grouped = false;
      for (const groupedCard of groupedCards) {
        if (this.areContoursClose(card, groupedCard, distanceThreshold)) {
          // Merge the contours
          groupedCard.x = Math.min(groupedCard.x, card.x);
          groupedCard.y = Math.min(groupedCard.y, card.y);
          groupedCard.width = Math.max(groupedCard.x + groupedCard.width, card.x + card.width) - groupedCard.x;
          groupedCard.height = Math.max(groupedCard.y + groupedCard.height, card.y + card.height) - groupedCard.y;
          grouped = true;
          break;
        }
      }
      if (!grouped) {
        groupedCards.push({...card});
      }
    }

    
    //sort by size
    groupedCards.sort((a, b) => (a.width * a.height) - (b.width * b.height));
    // Only keep the 3 largest cards
    groupedCards.splice(3);

    // Convert to percentage-based coordinates
    return groupedCards.map(card => ({
      x: (card.x / imgWidth) * 100,
      y: (card.y / imgHeight) * 100,
      width: (card.width / imgWidth) * 100,
      height: (card.height / imgHeight) * 100
    }));
  }

  areContoursClose(card1, card2, threshold) {
    const center1 = {x: card1.x + card1.width / 2, y: card1.y + card1.height / 2};
    const center2 = {x: card2.x + card2.width / 2, y: card2.y + card2.height / 2};
    const distance = Math.sqrt(Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2));
    return distance < threshold;
  }
}

customElements.define('readings-index', ReadingsIndex);