import { store } from 'cordova-plugin-purchase';
import { fetchWithAuth } from '@/auth';

let products = [
  { id: "11credits", alias: "11 pentacles", amount: 11, type: "consumable" },
  { id: "111credits", alias: "111 credits", amount: 111, type: "consumable" },
  { id: "999credits", alias: "999 credits", amount: 999, type: "consumable" },
];

document.addEventListener('deviceready', initializeStore, false);

function initializeStore() {
    if (!store) {
        console.error("Store not available");
        return;
    }

    store.verbosity = store.DEBUG;

    // Register your products
    store.register(products);

    // Setup the store
    store.when("product").updated(function(product) {
        console.log("Product updated: ", product.id);
        updateProductStatus(product);
    });

    store.when("product").approved(function(product) {
        console.log("Product approved: ", product.id);
        product.finish();
    });

    store.when("product").finished(function(product) {
        console.log("Product finished: ", product.id);
        updateProductStatus(product);
        const amount = products.find(p => p.id === product.id).amount;

        fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=add_pentacle&amount=${amount}`, {}, true);
    });

    store.error(function(error) {
        console.error("Store Error " + error.code + ": " + error.message);
    });

    // Initialize the store
    store.ready(() => {
        console.log("Store is ready");
        products.forEach(product => {
            console.log("Product: ", store.get(product.id));
            updateProductStatus(store.get(product.id));
        });
    });

    store.refresh();
}

function updateProductStatus(product) {
    if (product.owned) {
        console.log(`Product ${product.id} is owned`);
        // Product is owned: unlock full features
    } else {
        console.log(`Product ${product.id} is not owned`);
        // Product not owned: show purchase button
    }
}

function handleOrder(productId) {
    console.log("Ordering product: ", productId);
    store.order(productId);
}

export { updateProductStatus, handleOrder, products };