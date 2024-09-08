document.addEventListener('deviceready', initializeStore, false);

function initializeStore() {
    if (!window.store) {
        alert("Store not available");
    }

    store.verbosity = store.DEBUG;

    // Register your products
    store.register({
        id: "226",
        alias: "22 credits for $6",
        type: store.CONSUMABLE
    });

    store.when("226").updated(function(product) {
        if (product.loaded && product.valid && product.state === store.APPROVED) {
            product.finish();
        }
        updateProductStatus(product);
    });

    store.error(function(error) {
        alert("Store Error " + error.code + ": " + error.message);
    });

    store.ready(function() {
        alert("Store is ready");
        updateProductStatus(store.get("226"));
    });

    store.refresh();
}

function updateProductStatus(product) {
    if (product.owned) {
        alert("Product is owned");
        // Product is owned: unlock full features
    } else {
        alert("Product is not owned");
        // Product not owned: show purchase button
    }
}

export { initializeStore, updateProductStatus };