const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  boxId: { type: String, unique: true },
  fechaPrimerEscaneo: { type: Date, default: Date.now },
  interacciones: [{ type: String }],
  ultimaVisita: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Box', boxSchema);
