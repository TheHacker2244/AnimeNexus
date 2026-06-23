document.addEventListener("DOMContentLoaded", function() {
    // VERIFICACIÓN DE IMAGEN DE FONDO (EFECTO CRISTAL)
    const bgUrl = 'img/fondo-login.jpg';
    const imgChecker = new Image();
    imgChecker.onload = function() {
        document.body.classList.add('has-bg-image');
        console.log("✅ Efecto cristal activado por imagen de fondo.");
    };
    imgChecker.onerror = function() {
        console.log("ℹ️ Fondo oscuro estándar activado.");
    };
    imgChecker.src = bgUrl;

    // CONFIGURACIÓN DE FIREBASE (Usa la misma configuración que en script.js)
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

    // LÓGICA DE LOGIN/REGISTRO
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
            document.querySelector('.subtitulo').textContent = "Únete a la comunidad";
            mensaje.textContent = "";
        } else {
            submitBtn.textContent = "Iniciar Sesión";
            toggleText.innerHTML = `¿No tienes cuenta? <a href="#" id="toggleMode">Regístrate aquí</a>`;
            document.querySelector('h2').textContent = "¡Bienvenido, Otaku!";
            document.querySelector('.subtitulo').textContent = "Inicia sesión para guardar tu carrito";
            mensaje.textContent = "";
        }
        // Re-asignar evento para evitar duplicados
        document.getElementById('toggleMode').addEventListener('click', arguments.callee);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mensaje.textContent = "Completa todos los campos";
            return;
        }

        if (isRegisterMode) {
            // REGISTRO CON FIREBASE
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    mensaje.textContent = "Registro exitoso. Ahora inicia sesión.";
                    mensaje.style.color = "green";
                    toggleMode.click(); // Cambia a modo Login
                })
                .catch((error) => {
                    mensaje.textContent = error.message;
                    mensaje.style.color = "red";
                });
        } else {
            // LOGIN CON FIREBASE
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    mensaje.textContent = "¡Bienvenido/a de vuelta! Redirigiendo...";
                    mensaje.style.color = "green";
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                })
                .catch((error) => {
                    mensaje.textContent = "Correo o contraseña incorrectos";
                    mensaje.style.color = "red";
                });
        }
    });
});