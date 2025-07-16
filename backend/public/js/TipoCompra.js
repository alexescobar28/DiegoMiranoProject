var tipoCompra;
let videoWatched = false;
let countdown = 30; // 30 segundos mínimos de visualización
let countdownInterval;

// Función para manejar la transición inicial
function startWelcomeTransition() {
  setTimeout(() => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const videoPage = document.getElementById('videoPage');

    // Ocultar pantalla de bienvenida
    welcomeScreen.style.animation = 'slideOut 0.8s ease forwards';

    // Mostrar página de video
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      mainPage.classList.add('show');
    }, 800);
  }, 4000); // 4 segundos de duración para el mensaje de bienvenida
}

// Función para inicializar el temporizador del video
function initializeVideoTimer() {
  const countdownDisplay = document.getElementById('countdown');
  const circleCountdown = document.getElementById('circleCountdown');
  const restrictionOverlay = document.getElementById('restrictionOverlay');

  // Actualizar contador cada segundo
  countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = countdown;
    //circleCountdown.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      videoWatched = true;

      // Ocultar overlay de restricción
      restrictionOverlay.style.opacity = '100%';
      restrictionOverlay.style.transition = 'none';

      setTimeout(() => {
        restrictionOverlay.style.display = 'none';
        showContinueButton();
      }, 500);
    }
  }, 1000);
}

// Función para mostrar botón de continuar
function showContinueButton() {
  const videoInfo = document.querySelector('.video-info');
  videoInfo.innerHTML = `
                <div class="video-status">
                    <span>✅ Video completado</span>
                </div>
                <button onclick="transitionToMainPage()" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1.1rem;
                    margin-top: 10px;
                    animation: pulse 2s infinite;
                ">
                    ✨ Continuar
                </button>
            `;
}

// Función para transición a página principal
function transitionToMainPage() {
  if (!videoWatched) {
    alert('⚠️ Debes esperar a que termine el video para continuar');
    return;
  }

  const videoPage = document.getElementById('videoPage');
  const mainPage = document.getElementById('mainPage');
  const facebookVideo = document.getElementById('facebookVideo');

  // Ocultar página de video
  videoPage.style.animation = 'slideOut 0.8s ease forwards';
  // Pausar el video al ocultar la página
  // Ocultar el iframe de Facebook para "detener" el video
  if (facebookVideo) {
    facebookVideo.style.display = 'none';
    // También puedes limpiar el src para detener la carga:
    // facebookVideo.src = '';
  }
  // Mostrar página principal
  setTimeout(() => {
    videoPage.style.display = 'none';
    mainPage.classList.add('show');
  }, 800);
}
// Función para manejar opciones
function handleOption(option) {
  tipoCompra = option;
  localStorage.setItem('tipoCompra', tipoCompra);
  console.log('Tipo de compra seleccionado:', tipoCompra);
  window.location.href = 'menu.html';
}
// Prevenir navegación accidental durante el video
window.addEventListener('beforeunload', function (e) {
  if (!videoWatched) {
    e.preventDefault();
    e.returnValue = '';
    return 'El video aún no ha terminado. ¿Estás seguro de que quieres salir?';
  }
});

// Prevenir teclas de navegación durante el video
document.addEventListener('keydown', function (e) {
  if (!videoWatched) {
    // Bloquear teclas específicas
    if (
      e.key === 'F5' ||
      (e.ctrlKey && e.key === 'r') ||
      (e.ctrlKey && e.key === 'R') ||
      e.key === 'Escape' ||
      e.key === 'Tab' ||
      (e.altKey && e.key === 'ArrowLeft') ||
      (e.altKey && e.key === 'ArrowRight')
    ) {
      e.preventDefault();
      return false;
    }
  }
});

// Detectar cuando el usuario intenta salir del video
document.addEventListener('visibilitychange', function () {
  if (!videoWatched && document.hidden) {
    // Pausar countdown si el usuario cambia de pestaña
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  } else if (!videoWatched && !document.hidden) {
    // Reanudar countdown cuando regrese
    initializeVideoTimer();
  }
});

// Iniciar el flujo cuando se carga la página
document.addEventListener('DOMContentLoaded', startWelcomeTransition);
