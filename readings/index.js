import camera from '@/assets/camera.png';
import cv from "@techstark/opencv-js";
import { fetchWithAuth } from '@/auth';

class ReadingsIndex extends HTMLElement {
  constructor() {
    super();
    this.cards = [];
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    if (typeof hideLoadingScreen === 'function') {
      hideLoadingScreen();
    }
  }

  render() {
    this.innerHTML = `
      <title-bar root="true" data-entries-link="/readings-entries.html" class="w-full" title="Readings" subtitle="Take a pic and get a reading"></title-bar>
      <div class="p-4 flex-1">
        <label class="h-full w-full flex items-center justify-center border-dashed border-2 rounded-2xl border-white p-4 flex-col">
          <input type="file" id="reading" name="reading" class="hidden" accept="image/*">
          <img src="${camera}" alt="" class="w-16 h-16 mb-4">
          <h2 class="mb-2">Past / Present / Future</h2>
          <p class="opacity-80 mb-2 text-center">3 cards max • Light background • Kawaii Tarot and Spoopy Tarot exclusive</p>
        </label>
      </div>
      <div class="relative">
        <img id="image" class="w-full absolute -z-50 opacity-0">
        <canvas id="canvas" class="absolute top-0 -z-50 left-0 w-full h-full opacity-0"></canvas>
      </div>
    `;
  }

  setupEventListeners() {
    const fileInput = this.querySelector('#reading');
    fileInput.addEventListener('change', this.handleImageUpload.bind(this));
  }

  handleImageUpload(event) {
    const image = this.querySelector('#image');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target.result;
      image.onload = () => this.processImage(image, file);
    };

    reader.readAsDataURL(file);
  }

  processImage(image, file) {
    const canvas = this.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match the image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Process the image with OpenCV
    let src = cv.imread(canvas);
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
    });

    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();

    console.log('Found cards:', this.cards);
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