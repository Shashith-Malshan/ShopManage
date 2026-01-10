document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let products = [];
    const API_URL = 'https://dummyjson.com/products';
    
    // UI Elements
    const productGrid = document.getElementById('productGrid');
    const loader = document.getElementById('loader');
    const productForm = document.getElementById('productForm');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('modalTitle');
    const yearSpan = document.getElementById('year');
    
    // Initialize
    yearSpan.textContent = new Date().getFullYear();
    fetchProducts();

    async function fetchProducts() {
        showLoader();
        try {
            const response = await fetch(`${API_URL}?limit=10`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            products = data.products;
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = `<div class="alert alert-danger">Failed to load inventory. Please try again later.</div>`;
        } finally {
            hideLoader();
        }
    }



    function showLoader() {
        loader.innerHTML = Array(4).fill(0).map(() => `
            <div class="col-12 col-md-3 mb-4">
                <div class="skeleton" style="height: 300px; width: 100%;"></div>
            </div>
        `).join('');
        loader.classList.remove('d-none');
        productGrid.classList.add('d-none');
    }
    function hideLoader() {
        loader.classList.add('d-none');
        productGrid.classList.remove('d-none');
    }

});