// BASE DE DATOS DE PRODUCTOS DE ANIME NEXUS
const productos = [
    { id: 1, nombre: "Figura Miku Sirena", categoria: "figuras", subcategoria: "anime", precio: 35.00, img: "img/animenexusfigura1.webp" },
    { id: 2, nombre: "Figura Gojo Satoru", categoria: "figuras", subcategoria: "anime", precio: 35.00, img: "img/animenexusfigura2.webp" },
    { id: 3, nombre: "Figura Marin Diablo", categoria: "figuras", subcategoria: "anime", precio: 40.00, img: "img/animenexusfigura3.webp" },
    { id: 4, nombre: "Figura 2B Nendoroid", categoria: "figuras", subcategoria: "anime", precio: 45.00, img: "img/animenexusfigura4.webp" },
    { id: 5, nombre: "Figura Pikachu x Gengar", categoria: "figuras", subcategoria: "pokemon", precio: 38.00, img: "img/animenexusfigura5.webp" },
    { id: 6, nombre: "Set Figuras Evangelion", categoria: "figuras", subcategoria: "anime", precio: 120.00, img: "img/animenexusfigura6.webp" },
    { id: 7, nombre: "Figura Ace Flame", categoria: "figuras", subcategoria: "onepiece", precio: 35.00, img: "img/animenexusfigura7.webp" },
    { id: 8, nombre: "Figura Superb Collection", categoria: "figuras", subcategoria: "anime", precio: 40.00, img: "img/animenexusfigura8.webp" },
    { id: 9, nombre: "Figura Marin Diablo (Acostada)", categoria: "figuras", subcategoria: "anime", precio: 40.00, img: "img/animenexusfigura10.jpeg" },
    { id: 10, nombre: "Figura Sabito", categoria: "figuras", subcategoria: "anime", precio: 25.00, img: "img/animenexusfigura11.jpeg" },
    { id: 11, nombre: "Figura Miku (Banner)", categoria: "figuras", subcategoria: "anime", precio: 30.00, img: "img/animenexusfigura12.jpeg" },
    { id: 12, nombre: "Figura Gojo Purple", categoria: "figuras", subcategoria: "anime", precio: 45.00, img: "img/animenexusfigura13.jpeg" },
    { id: 13, nombre: "Figura Miku Conejita", categoria: "figuras", subcategoria: "anime", precio: 35.00, img: "img/animenexusfigura14.jpeg" },
    { id: 14, nombre: "Figura Chica Rubia", categoria: "figuras", subcategoria: "anime", precio: 30.00, img: "img/animenexusfigura15.jpeg" },
    { id: 15, nombre: "Figura Rias Gremory", categoria: "figuras", subcategoria: "anime", precio: 55.00, img: "img/animenexusfigura16.jpeg" },
    { id: 16, nombre: "Figura Gojo Chibi", categoria: "figuras", subcategoria: "anime", precio: 20.00, img: "img/animenexusfigurachibi.webp" },
    { id: 17, nombre: "Figura Miku Cat", categoria: "figuras", subcategoria: "anime", precio: 20.00, img: "img/animenexusfiguramiku.jpg" },
    { id: 18, nombre: "Set Figuras Miku", categoria: "figuras", subcategoria: "anime", precio: 80.00, img: "img/animenexusfiguras.jpeg" },
    { id: 19, nombre: "Almohada Anime", categoria: "accesorios", precio: 25.00, img: "img/animenexusalmohada.jpg" },
    { id: 20, nombre: "Gorra Demon Slayer", categoria: "accesorios", precio: 15.00, img: "img/animenexusgorra.webp" },
    { id: 21, nombre: "Gorra Chopper", categoria: "accesorios", precio: 15.00, img: "img/animenexusgorra2.webp" },
    { id: 22, nombre: "Monedero Rana", categoria: "accesorios", precio: 10.00, img: "img/animenexusmonedero.webp" },
    { id: 23, nombre: "Thousand Sunny Blocks", categoria: "juguetes", precio: 80.00, img: "img/animenexuslego.webp" }
];

const grid = document.getElementById('grid-productos');
const buscarInput = document.getElementById('buscador');
let categoriaActiva = 'todo';
let subcategoriaActiva = null;

window.onload = function() {
    mostrarProductos(productos);
    actualizarContadorCarrito();
    actualizarVistaPreviaCarrito();
    
    // Evento para abrir y cerrar el buscador
    document.getElementById('searchToggle').addEventListener('click', function() {
        document.getElementById('headerSearch').classList.toggle('open');
    });
};

function mostrarProductos(lista) {
    grid.innerHTML = '';
    lista.forEach(prod => {
        grid.innerHTML += `
            <div class="product-card" data-categoria="${prod.categoria}">
                <div class="card-img-wrap">
                    <img src="${prod.img}" alt="${prod.nombre}">
                </div>
                <div class="card-body">
                    <h4 class="card-name">${prod.nombre}</h4>
                    <p class="card-price">$${prod.precio.toFixed(2)}</p>
                    <button class="btn-add-cart" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.img}', this)">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
    });
}

function buscarProducto() {
    const termino = buscarInput.value.toLowerCase();
    let filtrados = productos.filter(p => p.nombre.toLowerCase().includes(termino));
    if (categoriaActiva !== 'todo') {
        filtrados = filtrados.filter(p => p.categoria === categoriaActiva);
        if (subcategoriaActiva) filtrados = filtrados.filter(p => p.subcategoria === subcategoriaActiva);
    }
    mostrarProductos(filtrados);
}

function filtrarPor(categoria, subcategoria) {
    categoriaActiva = categoria;
    subcategoriaActiva = subcategoria || null;
    let filtrados = productos;
    if (categoria !== 'todo') {
        filtrados = productos.filter(p => p.categoria === categoria);
        if (subcategoriaActiva) filtrados = filtrados.filter(p => p.subcategoria === subcategoriaActiva);
    }
    mostrarProductos(filtrados);
}

let carrito = JSON.parse(localStorage.getItem('carritoAnimeNexus')) || [];

function agregarAlCarrito(id, nombre, precio, img, btnElement) {
    const item = carrito.find(p => p.id === id);
    if (item) { item.cantidad += 1; } 
    else { carrito.push({ id, nombre, precio, img, cantidad: 1 }); }
    
    localStorage.setItem('carritoAnimeNexus', JSON.stringify(carrito));
    actualizarContadorCarrito();
    actualizarVistaPreviaCarrito();

    if (btnElement) {
        const originalText = btnElement.innerText;
        btnElement.innerText = '✔ Agregado';
        btnElement.style.backgroundColor = '#4caf50';
        btnElement.style.color = '#ffffff';
        btnElement.style.pointerEvents = 'none';

        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.backgroundColor = '#e63946';
            btnElement.style.color = '#ffffff';
            btnElement.style.pointerEvents = 'auto';
        }, 2000);
    }
}

function actualizarContadorCarrito() {
    const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contador = document.getElementById('cart-count');
    if (contador) contador.innerText = count;
}

function actualizarVistaPreviaCarrito() {
    const previewList = document.getElementById('cart-preview-list');
    previewList.innerHTML = '';
    if (carrito.length === 0) {
        previewList.innerHTML = '<li class="empty-msg">El carrito está vacío.</li>';
        return;
    }
    carrito.forEach(item => {
        previewList.innerHTML += `<li><span>${item.nombre}</span> <span>x${item.cantidad}</span></li>`;
    });
}

// Nuevas funciones para evitar errores en los onclick del HTML
function cerrarSearch() {
    document.getElementById('headerSearch').classList.remove('open');
}

function closeMobile() {
    document.getElementById('mobileNav').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
}

function setActive(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Carrusel automático
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
function showSlide(n) { slides.forEach(s => s.classList.remove('active')); slides[n].classList.add('active'); }
function goToSlide(n) { currentSlide = n; showSlide(n); }
function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
setInterval(nextSlide, 3500);