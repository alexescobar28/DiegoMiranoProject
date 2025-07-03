// Estado del ordenamiento
let selectionOrder = [];
let currentStep = 1;
const totalSteps = 4;

// Elementos del DOM
const menuItems = document.querySelectorAll('.menu-item');
const nextButton = document.getElementById('nextButton');
const clearButton = document.getElementById('clearButton');
const instructionText = document.getElementById('instructionText');

// Textos de instrucciones
const instructions = {
  1: 'Selecciona el elemento más importante para ti',
  2: 'Ahora selecciona el segundo más importante',
  3: 'Selecciona el tercer elemento en importancia',
  4: 'Finalmente, selecciona el último elemento',
};

// Función para manejar la selección de elementos
function handleItemSelection(event) {
  const clickedItem = event.currentTarget;
  const itemData = clickedItem.dataset.item;

  // Verificar si ya fue seleccionado
  if (selectionOrder.includes(itemData)) {
    return;
  }

  // Agregar al orden de selección
  selectionOrder.push(itemData);

  // Marcar como ordenado y actualizar el número
  clickedItem.classList.add('ordered');
  clickedItem.classList.remove('selected');

  const badge = document.getElementById(`badge-${itemData}`);
  badge.textContent = currentStep;

  // Remover event listener para evitar re-selección
  clickedItem.removeEventListener('click', handleItemSelection);
  clickedItem.style.cursor = 'default';

  // Incrementar paso
  currentStep++;

  // Actualizar instrucciones y UI
  updateUI();
}

// Función para actualizar la interfaz
function updateUI() {
  // Remover selección anterior de todos los elementos
  menuItems.forEach((item) => {
    item.classList.remove('selected');
  });

  // Si no hemos terminado, marcar los elementos disponibles
  if (currentStep <= totalSteps) {
    // Actualizar texto de instrucciones
    instructionText.textContent = instructions[currentStep];

    // Marcar elementos disponibles como seleccionables
    menuItems.forEach((item) => {
      if (!selectionOrder.includes(item.dataset.item)) {
        item.classList.add('selected');
      }
    });
  } else {
    // Completado
    instructionText.textContent = '¡Perfecto! Has ordenado todos los elementos';
    instructionText.style.color = '#32CD32';

    // Activar botón siguiente
    nextButton.classList.add('active');
  }
}

// Función para reiniciar el ordenamiento
function resetSelection() {
  selectionOrder = [];
  currentStep = 1;

  menuItems.forEach((item) => {
    item.classList.remove('ordered', 'selected');
    item.style.cursor = 'pointer';
    item.addEventListener('click', handleItemSelection);

    // Resetear números
    const itemData = item.dataset.item;
    const badge = document.getElementById(`badge-${itemData}`);
    const originalNumbers = {
      atencion: '1',
      eficiencia: '2',
      presentacion: '3',
      garantia: '4',
    };
    badge.textContent = originalNumbers[itemData];
  });

  nextButton.classList.remove('active');
  instructionText.style.color = '#DAA520';
  updateUI();
}

// Event listeners iniciales
menuItems.forEach((item) => {
  item.addEventListener('click', handleItemSelection);
});

// Event listener para el botón limpiar
clearButton.addEventListener('click', () => {
  // Animación de confirmación visual
  clearButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    clearButton.style.transform = '';
    resetSelection();
  }, 150);
});

// Event listener para el botón siguiente
nextButton.addEventListener('click', () => {
  if (selectionOrder.length === totalSteps) {
    // Crear resultado final
    const finalOrder = selectionOrder.map((item, index) => {
      const itemElement = document.querySelector(`[data-item="${item}"]`);
      const itemText = itemElement.querySelector('span').textContent;
      return {
        priority: index + 1,
        item: item,
        text: itemText,
      };
    });

    console.log('Orden final de prioridades:', finalOrder);

    // Mostrar resultado
    const resultText = finalOrder
      .map((item) => `${item.priority}. ${item.text}`)
      .join('\n');

    //   alert('¡Gracias por ordenar tus prioridades!\n\n' + resultText);

    // Opcional: reiniciar para otra selección
    resetSelection();
    if (localStorage.getItem('tipoCompra') === 'Tienda física') {
      window.location.href = 'thanks.html'; // Redirigir a la página de feedback
    } else {
      window.location.href = 'feedback-calendar.html'; // Redirigir al menú principal
    }
  }
});

// Doble clic para reiniciar (funcionalidad oculta ahora innecesaria)
// document.addEventListener('dblclick', (e) => {
//     if (e.target.closest('.logo')) {
//         resetSelection();
//     }
// });

// Inicializar la interfaz
updateUI();
