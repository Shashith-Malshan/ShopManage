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

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('productId').value;
        const productData = {
            title: document.getElementById('title').value,
            price: parseFloat(document.getElementById('price').value),
            category: document.getElementById('category').value,
            thumbnail: document.getElementById('thumbnail').value
        };

        if (id) {
            // UPDATE Logic
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const updatedProduct = await res.json();
                
                // Update local state and UI
                products = products.map(p => p.id == id ? { ...p, ...productData } : p);
                renderProducts(products);
                alert('Product Updated Successfully!');
            } catch (err) {
                console.error('Update failed:', err);
            }
        } else {
            // CREATE Logic
            try {
                const res = await fetch(`${API_URL}/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const newProduct = await res.json();
                
                // DummyJSON returns a static ID 101, so we simulate uniqueness for UI
                const displayProduct = { ...newProduct, id: Date.now() };
                products.unshift(displayProduct);
                renderProducts(products);
                alert('Product Added Successfully!');
            } catch (err) {
                console.error('Add failed:', err);
            }
        }
        
        productModal.hide();
        productForm.reset();
    });

    window.deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                products = products.filter(p => p.id != id);
                renderProducts(products);
                alert('Product Deleted');
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };


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

    window.openEditModal = (id) => {
        const product = products.find(p => p.id == id);
        if (!product) return;

        modalTitle.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('thumbnail').value = product.thumbnail;
        
        productModal.show();
    };

    document.getElementById('btnAddNew').addEventListener('click', () => {
        modalTitle.textContent = 'Add New Product';
        productForm.reset();
        document.getElementById('productId').value = '';
        productModal.show();
    });



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