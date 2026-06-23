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
// Inicializar Firebase
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

const grid = document.getElementById('grid-productos');
const buscarInput = document.getElementById('buscador');
let categoriaActiva = 'todo';
let subcategoriaActiva = null;

window.onload = function() {
    mostrarProductos(productos);
    
    document.getElementById('searchToggle').addEventListener('click', function() {
        document.getElementById('headerSearch').classList.toggle('open');
    });
};

function mostrarProductos(lista) {
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

// =============================================
// AGREGAR AL CARRITO CON FIREBASE
// =============================================
async function agregarAlCarrito(id, nombre, precio, img, btnElement) {
    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        window.location.href = "login.html";
        return;
    }

    if (btnElement) {
        btnElement.innerText = '⏳ Agregando...';
        btnElement.style.pointerEvents = 'none';
        btnElement.style.backgroundColor = '#666';
    }

    try {
        const cartRef = db.collection('users').doc(user.uid).collection('cart').doc(id.toString());
        const docSnap = await cartRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            await cartRef.update({ cantidad: data.cantidad + 1 });
        } else {
            await cartRef.set({
                id: id,
                nombre: nombre,
                precio: precio,
                img: img,
                cantidad: 1,
                descripcion: `¡Excelente pieza de ${nombre} para tu colección!`
            });
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
        actualizarVistaPreviaCarrito(); // Actualiza el desplegable en tiempo real

    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        alert("Ocurrió un error al agregar el producto.");
        if (btnElement) {
            btnElement.innerText = 'Agregar al carrito';
            btnElement.style.backgroundColor = '#e63946';
            btnElement.style.pointerEvents = 'auto';
        }
    }
}

// =============================================
// ACTUALIZAR EL CONTADOR ROJO DEL CARRITO
// =============================================
async function actualizarContadorCarrito() {
    const user = auth.currentUser;
    if (!user) return;
    try {
        const snapshot = await db.collection('users').doc(user.uid).collection('cart').get();
        let totalItems = 0;
        snapshot.forEach(doc => { totalItems += doc.data().cantidad; });
        const contador = document.getElementById('cart-count');
        if (contador) contador.innerText = totalItems;
    } catch (e) { console.log("Error calculando contador", e); }
}

// =============================================
// ACTUALIZAR LA VISTA PREVIA (EL DESPLEGABLE AL PASAR EL MOUSE)
// =============================================
async function actualizarVistaPreviaCarrito() {
    const user = auth.currentUser;
    const previewList = document.getElementById('cart-preview-list');
    if (!user) {
        previewList.innerHTML = '<li class="empty-msg"><i class="fas fa-user-lock"></i> Inicia sesión</li>';
        return;
    }
    try {
        const snapshot = await db.collection('users').doc(user.uid).collection('cart').get();
        previewList.innerHTML = '';
        if (snapshot.empty) {
            previewList.innerHTML = '<li class="empty-msg"><i class="fas fa-box-open"></i> El carrito está vacío</li>';
            return;
        }
        let count = 0;
        snapshot.forEach(doc => {
            if (count < 3) { // Mostramos solo los primeros 3 productos
                const item = doc.data();
                previewList.innerHTML += `<li><span>${item.nombre}</span> <span>x${item.cantidad}</span></li>`;
                count++;
            }
        });
        if (snapshot.size > 3) {
            previewList.innerHTML += `<li style="border:none; justify-content:center; color:#e63946; font-weight:bold;">y ${snapshot.size - 3} más...</li>`;
        }
    } catch (e) { console.error("Error en vista previa", e); }
}

// =============================================
// CARRUSEL Y OTRAS FUNCIONES
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

// Cada vez que el usuario cambia (inicia sesión o cierra sesión), actualizamos todo
auth.onAuthStateChanged(() => {
    actualizarContadorCarrito();
    actualizarVistaPreviaCarrito();
});