// Obtener boxId de la URL
function obtenerBoxId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('boxId') || 'ZBX90234';
}

const boxId = obtenerBoxId();

// Estado del ordenamiento
let currentOrder = {};
let selectedItems = [];
let currentPriority = 1;

// Elementos del DOM
const menuItems = document.querySelectorAll('.menu-item');
const instructionText = document.getElementById('instructionText');
const nextButton = document.getElementById('nextButton');
const clearButton = document.getElementById('clearButton');

// Mapeo de instrucciones según la prioridad
const instructions = {
  1: 'Selecciona el elemento más importante para ti',
  2: 'Ahora selecciona el segundo más importante',
  3: 'Selecciona el tercero en importancia',
  4: 'Finalmente, selecciona el último elemento',
};

// Función para actualizar las instrucciones
function updateInstructions() {
  if (currentPriority <= 4) {
    instructionText.textContent = instructions[currentPriority];
  } else {
    instructionText.textContent =
      '¡Perfecto! Has completado tu orden de importancia';
  }
}

// Función para manejar la selección de elementos
function handleItemSelection(item) {
  const itemKey = item.dataset.item;

  // Si ya está seleccionado, no hacer nada
  if (selectedItems.includes(itemKey)) {
    return;
  }

  // Agregar al orden actual
  currentOrder[itemKey] = currentPriority;
  selectedItems.push(itemKey);

  // Actualizar la visualización
  const badge = document.getElementById(`badge-${itemKey}`);
  badge.textContent = currentPriority;
  badge.style.backgroundColor = '#4CAF50';

  // Marcar como seleccionado
  item.classList.add('selected');
  item.style.pointerEvents = 'none';
  item.style.opacity = '0.7';

  // Avanzar a la siguiente prioridad
  currentPriority++;

  // Actualizar instrucciones
  updateInstructions();

  // Verificar si ya se completó todo
  if (selectedItems.length === 4) {
    nextButton.style.opacity = '1';
    nextButton.style.pointerEvents = 'auto';
    nextButton.style.backgroundColor = '#4CAF50';

    // Ocultar elementos no seleccionados
    menuItems.forEach((menuItem) => {
      if (!selectedItems.includes(menuItem.dataset.item)) {
        menuItem.style.display = 'none';
      }
    });
  }
}

// Función para limpiar selecciones
function clearSelections() {
  currentOrder = {};
  selectedItems = [];
  currentPriority = 1;

  // Resetear visualización
  menuItems.forEach((item) => {
    const itemKey = item.dataset.item;
    const badge = document.getElementById(`badge-${itemKey}`);

    item.classList.remove('selected');
    item.style.pointerEvents = 'auto';
    item.style.opacity = '1';
    item.style.display = 'block';

    badge.style.backgroundColor = '#ddd';

    // Resetear números de badge a su valor original
    const originalNumbers = {
      atencion: 1,
      eficiencia: 2,
      presentacion: 3,
      garantia: 4,
    };
    badge.textContent = originalNumbers[itemKey];
  });

  // Resetear botón siguiente
  nextButton.style.opacity = '0.6';
  nextButton.style.pointerEvents = 'none';
  nextButton.style.backgroundColor = '#ccc';

  // Resetear instrucciones
  updateInstructions();
}

// Función para enviar orden al backend
async function enviarOrden() {
  try {
    const response = await fetch(
      'https://diegomiranoproject.onrender.com/feedback/orden',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxId: boxId,
          atencion: currentOrder.atencion,
          eficiencia: currentOrder.eficiencia,
          presentacion: currentOrder.presentacion,
          garantia: currentOrder.garantia,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('Orden enviado exitosamente:', data);

      // Mostrar mensaje de éxito
      alert('¡Gracias por completar tu orden de importancia!');

      // Redirigir a la página principal o siguiente paso
      window.location.href = 'feedback-calendar.html';
    } else {
      console.error('Error enviando orden:', data);
      alert('Error al enviar el orden. Por favor intenta de nuevo.');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('Error de conexión. Por favor intenta de nuevo.');
  }
}

// Función para cargar orden existente
async function cargarOrdenExistente() {
  try {
    const response = await fetch(
      `https://diegomiranoproject.onrender.com/feedback/orden/${boxId}`
    );
    const data = await response.json();

    if (response.ok && data.orden) {
      const orden = data.orden;

      // Precargar el orden existente
      Object.keys(orden).forEach((key) => {
        if (key !== 'fechaOrden' && orden[key]) {
          currentOrder[key] = orden[key];
          selectedItems.push(key);

          const item = document.querySelector(`[data-item="${key}"]`);
          const badge = document.getElementById(`badge-${key}`);

          if (item && badge) {
            badge.textContent = orden[key];
            badge.style.backgroundColor = '#4CAF50';
            item.classList.add('selected');
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.7';
          }
        }
      });

      // Actualizar estado
      currentPriority = selectedItems.length + 1;
      updateInstructions();

      if (selectedItems.length === 4) {
        nextButton.style.opacity = '1';
        nextButton.style.pointerEvents = 'auto';
        nextButton.style.backgroundColor = '#4CAF50';
      }
    }
  } catch (error) {
    console.error('Error cargando orden existente:', error);
  }
}

// Event listeners
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (currentPriority <= 4) {
      handleItemSelection(item);
    }
  });
});

clearButton.addEventListener('click', clearSelections);

nextButton.addEventListener('click', () => {
  if (selectedItems.length === 4) {
    enviarOrden();
  }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  updateInstructions();
  cargarOrdenExistente();

  // Configurar estado inicial del botón siguiente
  nextButton.style.opacity = '0.6';
  nextButton.style.pointerEvents = 'none';
  nextButton.style.backgroundColor = '#ccc';
});
