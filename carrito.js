document.addEventListener("DOMContentLoaded", function() {
    const firebaseConfig = {
      apiKey: "AIzaSyB_Y2M2C3MumuZE8__QHh0-S8mzMZBGIho",
      authDomain: "animenexus-5e636.firebaseapp.com",
      projectId: "animenexus-5e636",
      storageBucket: "animenexus-5e636.firebasestorage.app",
      messagingSenderId: "893164863905",
      appId: "1:893164863905:web:b4f880ffb187ef32b84be0",
      measurementId: "G-HGLLD4Y095"
    };
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const auth = firebase.auth();
    const db = firebase.firestore();

    const listaCarrito = document.getElementById('lista-productos-carrito');
    const totalSpan = document.getElementById('total-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const cartCount = document.getElementById('cart-count');

    let unsubscribeCart = null;

    auth.onAuthStateChanged(user => {
        if (!user) {
            // CARRITO INVITADO
            const carritoLocal = JSON.parse(localStorage.getItem('animeNexus_Guest')) || [];
            if (carritoLocal.length === 0) {
                carritoVacio.style.display = 'block';
                carritoContenido.style.display = 'none';
                cartCount.innerText = '0';
                return;
            }
            carritoVacio.style.display = 'none';
            carritoContenido.style.display = 'block';
            listaCarrito.innerHTML = '';
            let total = 0;
            let totalItems = 0;

            carritoLocal.forEach((item, index) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                totalItems += item.cantidad;
                const descripcion = item.descripcion || 'Producto exclusivo.';

                const div = document.createElement('div');
                div.className = 'item-carrito';
                div.innerHTML = `
                    <img src="${item.img}" alt="${item.nombre}">
                    <div class="info-producto">
                        <h4>${item.nombre}</h4>
                        <div class="descripcion">${descripcion}</div>
                    </div>
                    <div class="precio">$${item.precio.toFixed(2)}</div>
                    <div class="cantidad-control">
                        <button class="restar" data-index="${index}">−</button>
                        <span>${item.cantidad}</span>
                        <button class="sumar" data-index="${index}">+</button>
                    </div>
                    <div class="eliminar-item" data-index="${index}"><i class="fas fa-trash-alt"></i></div>
                `;
                listaCarrito.appendChild(div);
            });

            totalSpan.innerText = `$${total.toFixed(2)}`;
            cartCount.innerText = totalItems;

            document.querySelectorAll('.sumar').forEach(btn => {
                btn.onclick = () => {
                    let cart = JSON.parse(localStorage.getItem('animeNexus_Guest'));
                    cart[parseInt(btn.dataset.index)].cantidad += 1;
                    localStorage.setItem('animeNexus_Guest', JSON.stringify(cart));
                    location.reload();
                };
            });
            document.querySelectorAll('.restar').forEach(btn => {
                btn.onclick = () => {
                    let cart = JSON.parse(localStorage.getItem('animeNexus_Guest'));
                    const idx = parseInt(btn.dataset.index);
                    if (cart[idx].cantidad > 1) { cart[idx].cantidad -= 1; } 
                    else { cart.splice(idx, 1); }
                    localStorage.setItem('animeNexus_Guest', JSON.stringify(cart));
                    location.reload();
                };
            });
            document.querySelectorAll('.eliminar-item').forEach(btn => {
                btn.onclick = () => {
                    if (confirm('¿Seguro que quieres eliminar este producto?')) {
                        let cart = JSON.parse(localStorage.getItem('animeNexus_Guest'));
                        cart.splice(parseInt(btn.dataset.index), 1);
                        localStorage.setItem('animeNexus_Guest', JSON.stringify(cart));
                        location.reload();
                    }
                };
            });
            return;
        }

        // CARRITO USUARIO LOGUEADO
        if (unsubscribeCart) unsubscribeCart();
        unsubscribeCart = db.collection('users').doc(user.uid).collection('cart')
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    carritoVacio.style.display = 'block';
                    carritoContenido.style.display = 'none';
                    cartCount.innerText = '0';
                    return;
                }
                carritoVacio.style.display = 'none';
                carritoContenido.style.display = 'block';
                listaCarrito.innerHTML = '';
                let total = 0;
                let totalItems = 0;

                snapshot.forEach((doc) => {
                    const item = doc.data();
                    const subtotal = item.precio * item.cantidad;
                    total += subtotal;
                    totalItems += item.cantidad;
                    const descripcion = item.descripcion || 'Producto exclusivo.';

                    const div = document.createElement('div');
                    div.className = 'item-carrito';
                    div.innerHTML = `
                        <img src="${item.img}" alt="${item.nombre}">
                        <div class="info-producto">
                            <h4>${item.nombre}</h4>
                            <div class="descripcion">${descripcion}</div>
                        </div>
                        <div class="precio">$${item.precio.toFixed(2)}</div>
                        <div class="cantidad-control">
                            <button class="restar" data-id="${doc.id}">−</button>
                            <span>${item.cantidad}</span>
                            <button class="sumar" data-id="${doc.id}">+</button>
                        </div>
                        <div class="eliminar-item" data-id="${doc.id}"><i class="fas fa-trash-alt"></i></div>
                    `;
                    listaCarrito.appendChild(div);
                });

                totalSpan.innerText = `$${total.toFixed(2)}`;
                cartCount.innerText = totalItems;

                document.querySelectorAll('.sumar').forEach(btn => {
                    btn.onclick = () => {
                        const ref = db.collection('users').doc(user.uid).collection('cart').doc(btn.dataset.id);
                        ref.get().then(doc => {
                            if (doc.exists) ref.update({ cantidad: doc.data().cantidad + 1 });
                        });
                    };
                });
                document.querySelectorAll('.restar').forEach(btn => {
                    btn.onclick = () => {
                        const ref = db.collection('users').doc(user.uid).collection('cart').doc(btn.dataset.id);
                        ref.get().then(doc => {
                            if (doc.exists) {
                                if (doc.data().cantidad > 1) ref.update({ cantidad: doc.data().cantidad - 1 });
                                else ref.delete();
                            }
                        });
                    };
                });
                document.querySelectorAll('.eliminar-item').forEach(btn => {
                    btn.onclick = () => {
                        if (confirm('¿Seguro que quieres eliminar este producto?')) {
                            db.collection('users').doc(user.uid).collection('cart').doc(btn.dataset.id).delete();
                        }
                    };
                });
            });
    });

    // =============================================
    // ¡NUEVO! BOTÓN DE WHATSAPP SIN BLOQUEO
    // =============================================
    document.getElementById('btn-finalizar-compra').addEventListener('click', async function() {
        const user = auth.currentUser;
        let cartItems = [];
        let totalFinal = 0;

        if (user) {
            // Obtener de Firebase
            try {
                const snapshot = await db.collection('users').doc(user.uid).collection('cart').get();
                snapshot.forEach(doc => cartItems.push(doc.data()));
            } catch (e) {
                console.error("Error al cargar carrito de Firebase", e);
            }
        } else {
            // Obtener de LocalStorage (Invitado)
            cartItems = JSON.parse(localStorage.getItem('animeNexus_Guest')) || [];
        }

        if (cartItems.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        let mensaje = "Hola Anime Nexus! Me gustaría comprar los siguientes productos:\n\n";
        cartItems.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            totalFinal += subtotal;
            const desc = item.descripcion || "Sin descripción adicional";
            mensaje += `${index + 1}. ${item.nombre} (${desc}) x${item.cantidad} = $${subtotal.toFixed(2)}\n`;
        });
        mensaje += `\nTotal: $${totalFinal.toFixed(2)}\n\nGracias!`;
        
        const url = `https://wa.me/50364437283?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });
});