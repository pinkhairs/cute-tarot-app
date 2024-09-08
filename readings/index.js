import camera from '@/assets/camera.png';
import { fetchWithAuth } from '@/auth';

class ReadingsIndex extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
      <title-bar root="true" data-entries-link="/readings-entries.html" class="w-full" title="Readings" subtitle="Take a pic and get a reading"></title-bar>
      <div class="p-4 flex-1">
        <label class="h-full w-full flex items-center justify-center  border-dashed border-2 rounded-2xl border-white p-4 flex-col">
          <input type="file" id="reading" name="reading" class="hidden" accept="image/*">
          <img src="${camera}" alt="" class="w-16 h-16 mb-4">
          <h2 class="mb-2">Get a reading</h2>
          <p class="text-sm opacity-80 mb-2">Tap to snap or upload a photo of your cards</p>
          <p class="text-sm opacity-80">Kawaii Tarot and Spoopy Tarot exclusive</p>
        </label>
      </div>
      <img id="image" class="-z-40 invisible absolute">
      <canvas id="canvas" class="-z-50 absolute invisible"></canvas>
    `;
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js'
    script.async = true;
    script.onload = () => {
      document.getElementById('reading').addEventListener('change', async (event) => {
  let src = cv.imread(imageElement);
  let gray = new cv.Mat();
  let opening = new cv.Mat();
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(gray, gray, 120, 255, cv.THRESH_BINARY_INV);
  cv.morphologyEx(gray, opening, cv.MORPH_OPEN, cv.Mat.ones(5, 5, cv.CV_8U), new cv.Point(-1, -1), 1);

  // Find contours
  cv.findContours(opening, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let cards = [];
  const minArea = 5000;  // Minimum area to consider as a card
  const maxArea = 50000; // Maximum area to consider as a card
  const aspectRatio = 1.618; // Typical aspect ratio for cards

  for (let i = 0; i < contours.size(); ++i) {
      let rect = cv.boundingRect(contours.get(i));
      let contourArea = rect.width * rect.height;
      let ratio = rect.width / rect.height;

      // Check if the area and ratio are within expected ranges
      if (contourArea > minArea && contourArea < maxArea && 
          (Math.abs(ratio - aspectRatio) < 0.15 || Math.abs((1 / ratio) - aspectRatio) < 0.15)) {
          cards.push({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
          });
      }
  }

  // Cleanup
  src.delete(); gray.delete(); opening.delete(); contours.delete(); hierarchy.delete();
console.log(cards);
});
    };
    script.onerror = () => {
      console.error('Error loading script.');
    };
  };



    }
customElements.define('readings-index', ReadingsIndex);