const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  boxId: { type: String, unique: true },
  fechaPrimerEscaneo: { type: Date, default: Date.now },
  interacciones: [{ type: String }],
  ultimaVisita: { type: Date, default: Date.now },
  // Nuevos campos para guardar feedback
  feedbackExperiencia: {
    entrada: { type: String, enum: ['😊', '😐', '😞'] },
    busqueda: { type: String, enum: ['😊', '😐', '😞'] },
    pago: { type: String, enum: ['😊', '😐', '😞'] },
    entrega: { type: String, enum: ['😊', '😐', '😞'] },
    fechaFeedback: { type: Date },
  },

  // Campo para guardar el orden de importancia
  ordenImportancia: {
    atencion: { type: Number, min: 1, max: 4 },
    eficiencia: { type: Number, min: 1, max: 4 },
    presentacion: { type: Number, min: 1, max: 4 },
    garantia: { type: Number, min: 1, max: 4 },
    fechaOrden: { type: Date },
  },
  // Campo para guardar información del calendario
  calendarioExpectativas: {
    fechaEsperada: { type: Date },
    fechaLlegada: { type: Date },
    llegadaATiempo: { type: Boolean },
    diasDiferencia: { type: Number }, // Positivo = tardío, Negativo = temprano
    fechaRegistro: { type: Date },
  },
});

module.exports = mongoose.model('Box', boxSchema);
