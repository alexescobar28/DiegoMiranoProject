const express = require('express');
const router = express.Router();
const Box = require('../models/Box');

router.get('/', async (req, res) => {
  const { boxId } = req.query;

  if (!boxId) return res.status(400).json({ error: 'boxId requerido' });

  let box = await Box.findOne({ boxId });

  const now = new Date();

  if (!box) {
    // Nuevo escaneo
    box = new Box({ boxId });
    await box.save();
    return res.json({
      status: 'nuevo',
      mensaje:
        'Tu camino apenas comienza. ¡Gracias por escanear tu empaque por primera vez!',
    });
  }
  box.ultimaVisita = now;
  box.fechaPrimerEscaneo = new Date('2025-07-01'); // Simulando una fecha fija para pruebas
  // Escaneo recurrente
  const diasTranscurridos = Math.floor(
    (now - box.fechaPrimerEscaneo) / (1000 * 60 * 60 * 24)
  );

  await box.save();

  if (diasTranscurridos <= 2) {
    return res.json({
      status: 'temprano',
      mensaje:
        '¡Aún estás comenzando! ¿Quieres compartir tu primera impresión?',
    });
  } else {
    return res.json({
      status: 'avanzado',
      mensaje:
        '¿Qué historia han contado ya tus zapatos? Elige un símbolo del empaque y empecemos.',
    });
  }
});

module.exports = router;
