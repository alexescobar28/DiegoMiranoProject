var tipoCompra;
function handleOption(option) {
  tipoCompra = option;
  window.location.href = 'menu.html';
  localStorage.setItem('tipoCompra', tipoCompra);
  console.log('Tipo de compra seleccionado:', tipoCompra);
  // Puedes guardar la selección o redirigir según sea necesario
}
