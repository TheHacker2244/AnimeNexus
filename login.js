document.addEventListener("DOMContentLoaded", function() {
    // --- Fondo con imagen ---
    const bgUrl = 'img/fondo-login.jpg';
    const imgChecker = new Image();
    imgChecker.onload = () => { document.body.classList.add('has-bg-image'); };
    imgChecker.onerror = () => { console.log("ℹ️ Fondo oscuro estándar activado."); };
    imgChecker.src = bgUrl;

    // --- Firebase ---
    const firebaseConfig = {
        apiKey: "AIzaSyB_Y2M2C3MumuZE8__QHh0-S8mzMZBGIho",
        authDomain: "animenexus-5e636.firebaseapp.com",
        projectId: "animenexus-5e636",
        storageBucket: "animenexus-5e636.firebasestorage.app",
        messagingSenderId: "893164863905",
        appId: "1:893164863905:web:b4f880ffb187ef32b84be0",
        measurementId: "G-HGLLD4Y095"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- Elementos del DOM ---
    const loginBox = document.getElementById('loginBox');
    const toggleLinks = document.querySelectorAll('.toggle-mode-link');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const mensaje = document.getElementById('mensaje');

    // --- Toggle de animación (Deslizar el formulario sin estirar la caja) ---
    toggleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que vaya a "#"
            loginBox.classList.toggle('show-register'); // Activa el intercambio de posiciones
            mensaje.textContent = ""; // Limpiamos mensajes
        });
    });

    // --- Función general para manejar autenticación (Intacta) ---
    async function handleAuth(email, password, isRegister) {
        if (!email || !password) {
            mensaje.textContent = "Completa todos los campos";
            mensaje.style.color = "red";
            return;
        }
        if (isRegister && password.length < 6) {
            mensaje.textContent = "La contraseña debe tener al menos 6 caracteres";
            mensaje.style.color = "red";
            return;
        }

        try {
            let userCred;
            if (isRegister) {
                userCred = await auth.createUserWithEmailAndPassword(email, password);
                mensaje.textContent = "Cuenta creada. Cargando carrito...";
                mensaje.style.color = "green";
            } else {
                userCred = await auth.signInWithEmailAndPassword(email, password);
                mensaje.textContent = "¡Bienvenido! Cargando carrito...";
                mensaje.style.color = "green";
            }

            // --- Fusión del carrito de invitado ---
            const guestCart = JSON.parse(localStorage.getItem('animeNexus_Guest'));
            if (guestCart && guestCart.length > 0) {
                const userRef = db.collection('users').doc(userCred.user.uid).collection('cart');
                for (const item of guestCart) {
                    const docRef = userRef.doc(item.id.toString());
                    const docSnap = await docRef.get();
                    if (docSnap.exists) {
                        await docRef.update({ cantidad: docSnap.data().cantidad + item.cantidad });
                    } else {
                        await docRef.set(item);
                    }
                }
                localStorage.removeItem('animeNexus_Guest');
            }

            setTimeout(() => {
                window.location.href = "carrito.html";
            }, 1000);

        } catch (error) {
            let errorMsg = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMsg = "Este correo ya está registrado. Inicia sesión.";
            } else if (error.code === 'auth/user-not-found') {
                errorMsg = "Usuario no encontrado. Regístrate primero.";
            } else if (error.code === 'auth/wrong-password') {
                errorMsg = "Contraseña incorrecta.";
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = "Correo electrónico inválido.";
            }
            mensaje.textContent = errorMsg;
            mensaje.style.color = "red";
        }
    }

    // --- Eventos de los formularios ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        handleAuth(email, password, false);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-reg').value.trim();
        const password = document.getElementById('password-reg').value.trim();
        handleAuth(email, password, true);
    });
});