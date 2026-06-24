// =============================================
// CONFIGURACIÓN DE FIREBASE
// =============================================
const firebaseConfig = {
  apiKey: "AIzaSyB_Y2M2C3MumuZE8__QHh0-S8mzMZBGIho",
  authDomain: "animenexus-5e636.firebaseapp.com",
  projectId: "animenexus-5e636",
  storageBucket: "animenexus-5e636.firebasestorage.app",
  messagingSenderId: "893164863905",
  appId: "1:893164863905:web:b4f880ffb187ef32b84be0",
  measurementId: "G-HGLLD4Y095"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =============================================
// BASE DE DATOS DE PRODUCTOS
// =============================================
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

// Elementos DOM Globales
const grid = document.getElementById('grid-productos');
const buscarInput = document.getElementById('buscador');
let categoriaActiva = 'todo';
let subcategoriaActiva = null;

// =============================================
// INICIALIZACIÓN
// =============================================
window.onload = function() {
    // 1. Solo cargar productos si la grilla existe (Ej: en index.html, no en carrito.html)
    if (grid) {
        mostrarProductos(productos);
    }

    // 2. Evento del botón de búsqueda (solo si existe en el HTML)
    const searchToggle = document.getElementById('searchToggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            document.getElementById('headerSearch').classList.toggle('open');
        });
    }

    // 3. Evento del menú hamburguesa (solo si existe en el HTML)
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            document.getElementById('mobileNav').classList.toggle('open');
            document.getElementById('mobileOverlay').classList.toggle('open');
            this.classList.toggle('open');
        });
    }
};

// =============================================
// FUNCIONES DE PRODUCTOS (Con SALVAGUARDA anti-error)
// =============================================
function mostrarProductos(lista) {
    if (!grid) return; // Si no hay grid, detente para no generar errores
    grid.innerHTML = '';
    lista.forEach(prod => {
        grid.innerHTML += `
            <div class="product-card" data-categoria="${prod.categoria}">
                <div class="card-img-wrap"><img src="${prod.img}" alt="${prod.nombre}"></div>
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
    if (!grid) return;
    const termino = buscarInput.value.toLowerCase();
    let filtrados = productos.filter(p => p.nombre.toLowerCase().includes(termino));
    if (categoriaActiva !== 'todo') {
        filtrados = filtrados.filter(p => p.categoria === categoriaActiva);
        if (subcategoriaActiva) filtrados = filtrados.filter(p => p.subcategoria === subcategoriaActiva);
    }
    mostrarProductos(filtrados);
}

function filtrarPor(categoria, subcategoria) {
    if (!grid) return; // SALVAGUARDA: Protege el carrito.html de crasheos
    categoriaActiva = categoria;
    subcategoriaActiva = subcategoria || null;
    let filtrados = productos;
    if (categoria !== 'todo') {
        filtrados = productos.filter(p => p.categoria === categoria);
        if (subcategoriaActiva) filtrados = filtrados.filter(p => p.subcategoria === subcategoriaActiva);
    }
    mostrarProductos(filtrados);
}

// =============================================
// AGREGAR AL CARRITO
// =============================================
async function agregarAlCarrito(id, nombre, precio, img, btnElement) {
    const user = auth.currentUser;
    if (btnElement) {
        btnElement.innerText = '⏳ Agregando...';
        btnElement.style.pointerEvents = 'none';
        btnElement.style.backgroundColor = '#666';
    }

    if (!user) {
        let carritoLocal = JSON.parse(localStorage.getItem('animeNexus_Guest')) || [];
        const itemExist = carritoLocal.find(p => p.id === id);
        if (itemExist) {
            itemExist.cantidad += 1;
        } else {
            carritoLocal.push({ id, nombre, precio, img, cantidad: 1, descripcion: `¡Excelente pieza de ${nombre}!` });
        }
        localStorage.setItem('animeNexus_Guest', JSON.stringify(carritoLocal));
    } else {
        try {
            const cartRef = db.collection('users').doc(user.uid).collection('cart').doc(id.toString());
            const docSnap = await cartRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                await cartRef.update({ cantidad: data.cantidad + 1 });
            } else {
                await cartRef.set({ id, nombre, precio, img, cantidad: 1, descripcion: `¡Excelente pieza de ${nombre}!` });
            }
        } catch (error) {
            console.error("Error al agregar en Firebase:", error);
        }
    }

    if (btnElement) {
        btnElement.innerText = '✔ Agregado';
        btnElement.style.backgroundColor = '#4caf50';
        setTimeout(() => {
            btnElement.innerText = 'Agregar al carrito';
            btnElement.style.backgroundColor = '#e63946';
            btnElement.style.pointerEvents = 'auto';
        }, 2000);
    }
    actualizarContadorCarrito();
    actualizarVistaPreviaCarrito();
}

// =============================================
// ACTUALIZAR CONTADOR Y VISTA PREVIA
// =============================================
async function actualizarContadorCarrito() {
    const user = auth.currentUser;
    let totalItems = 0;
    if (user) {
        const snapshot = await db.collection('users').doc(user.uid).collection('cart').get();
        snapshot.forEach(doc => { totalItems += doc.data().cantidad; });
    } else {
        const carritoLocal = JSON.parse(localStorage.getItem('animeNexus_Guest')) || [];
        totalItems = carritoLocal.reduce((acc, item) => acc + item.cantidad, 0);
    }
    const contador = document.getElementById('cart-count');
    if (contador) contador.innerText = totalItems;
}

async function actualizarVistaPreviaCarrito() {
    const user = auth.currentUser;
    const previewList = document.getElementById('cart-preview-list');
    if (!user) {
        const carritoLocal = JSON.parse(localStorage.getItem('animeNexus_Guest')) || [];
        previewList.innerHTML = '';
        if (carritoLocal.length === 0) {
            previewList.innerHTML = '<li class="empty-msg"><i class="fas fa-box-open"></i> El carrito está vacío</li>';
            return;
        }
        carritoLocal.slice(0, 3).forEach(item => {
            previewList.innerHTML += `<li><span>${item.nombre}</span> <span>x${item.cantidad}</span></li>`;
        });
        if (carritoLocal.length > 3) {
            previewList.innerHTML += `<li style="border:none; justify-content:center; color:#e63946; font-weight:bold;">y ${carritoLocal.length - 3} más...</li>`;
        }
        return;
    }
    const snapshot = await db.collection('users').doc(user.uid).collection('cart').get();
    previewList.innerHTML = '';
    if (snapshot.empty) {
        previewList.innerHTML = '<li class="empty-msg"><i class="fas fa-box-open"></i> El carrito está vacío</li>';
        return;
    }
    let count = 0;
    snapshot.forEach(doc => {
        if (count < 3) {
            const item = doc.data();
            previewList.innerHTML += `<li><span>${item.nombre}</span> <span>x${item.cantidad}</span></li>`;
            count++;
        }
    });
    if (snapshot.size > 3) {
        previewList.innerHTML += `<li style="border:none; justify-content:center; color:#e63946; font-weight:bold;">y ${snapshot.size - 3} más...</li>`;
    }
}

// =============================================
// CARRUSEL Y FUNCIONES BÁSICAS
// =============================================
function cerrarSearch() { document.getElementById('headerSearch').classList.remove('open'); }
function closeMobile() {
    document.getElementById('mobileNav').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
}
function setActive(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
function showSlide(n) { slides.forEach(s => s.classList.remove('active')); slides[n].classList.add('active'); }
function goToSlide(n) { currentSlide = n; showSlide(n); }
function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
setInterval(nextSlide, 3500);

auth.onAuthStateChanged(() => {
    actualizarContadorCarrito();
    actualizarVistaPreviaCarrito();
});