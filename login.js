document.addEventListener("DOMContentLoaded", function() {
    const bgUrl = 'img/fondo-login.jpg';
    const imgChecker = new Image();
    imgChecker.onload = () => { document.body.classList.add('has-bg-image'); };
    imgChecker.onerror = () => { console.log("ℹ️ Fondo oscuro estándar activado."); };
    imgChecker.src = bgUrl;

    const firebaseConfig = { /* TU CONFIGURACIÓN DE FIREBASE, IGUAL QUE ANTES */ 
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

    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const toggleMode = document.getElementById('toggleMode');
    const toggleText = document.getElementById('toggle-text');
    const mensaje = document.getElementById('mensaje');
    let isRegisterMode = false;

    toggleMode.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            submitBtn.textContent = "Crear Cuenta";
            toggleText.innerHTML = `¿Ya tienes cuenta? <a href="#" id="toggleMode">Inicia sesión aquí</a>`;
            document.querySelector('h2').textContent = "Crear Cuenta";
        } else {
            submitBtn.textContent = "Iniciar Sesión";
            toggleText.innerHTML = `¿No tienes cuenta? <a href="#" id="toggleMode">Regístrate aquí</a>`;
            document.querySelector('h2').textContent = "¡Bienvenido, Otaku!";
        }
        document.getElementById('toggleMode').addEventListener('click', arguments.callee);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) { mensaje.textContent = "Completa todos los campos"; return; }

        try {
            let userCred;
            if (isRegisterMode) {
                userCred = await auth.createUserWithEmailAndPassword(email, password);
                mensaje.textContent = "Cuenta creada. Cargando carrito...";
                mensaje.style.color = "green";
            } else {
                userCred = await auth.signInWithEmailAndPassword(email, password);
                mensaje.textContent = "¡Bienvenido! Cargando carrito...";
                mensaje.style.color = "green";
            }

            // --- LÓGICA PARA FUSIONAR EL CARRITO DE INVITADO CON FIREBASE ---
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
            
            setTimeout(() => { window.location.href = "carrito.html"; }, 1000);

        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.style.color = "red";
        }
    });
});