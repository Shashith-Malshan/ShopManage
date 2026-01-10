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


    function renderProducts(data) {
        productGrid.innerHTML = '';
        data.forEach(product => {
            const card = `
                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div class="card product-card shadow-sm h-100">
                        <div class="card-img-container">
                            <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge category-badge rounded-pill">${product.category}</span>
                            </div>
                            <h6 class="card-title fw-bold text-truncate">${product.title}</h6>
                            <p class="text-primary fw-bold mb-3">$${product.price.toFixed(2)}</p>
                            <div class="mt-auto d-flex gap-2">
                                <button onclick="openEditModal(${product.id})" class="btn btn-outline-dark btn-sm flex-grow-1">
                                    <i class="bi bi-pencil me-1"></i> Edit
                                </button>
                                <button onclick="deleteProduct(${product.id})" class="btn btn-outline-danger btn-sm">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productGrid.innerHTML += card;
        });
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