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

});