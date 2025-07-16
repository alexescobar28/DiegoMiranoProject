const express = require('express');
const router = express.Router();
const Box = require('../models/Box');
module.exports = router;

// Ruta existente para verificar estado
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
  box.fechaPrimerEscaneo = new Date('2025-07-16'); // Simulando una fecha fija para pruebas

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

// Nueva ruta para guardar feedback de experiencia
router.post('/experiencia', async (req, res) => {
  try {
    const { boxId, entrada, busqueda, pago, entrega } = req.body;

    if (!boxId || !entrada || !busqueda || !pago || !entrega) {
      return res.status(400).json({
        error:
          'Faltan datos requeridos: boxId, entrada, busqueda, pago, entrega',
      });
    }

    // Buscar el box existente
    let box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    // Actualizar el feedback de experiencia
    box.feedbackExperiencia = {
      entrada,
      busqueda,
      pago,
      entrega,
      fechaFeedback: new Date(),
    };

    // Agregar a las interacciones
    box.interacciones.push('experiencia_feedback');

    await box.save();

    res.json({
      success: true,
      mensaje: '¡Gracias por tu feedback!',
      feedback: box.feedbackExperiencia,
    });
  } catch (error) {
    console.error('Error guardando feedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para obtener feedback guardado
router.get('/experiencia/:boxId', async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    res.json({
      feedback: box.feedbackExperiencia || null,
    });
  } catch (error) {
    console.error('Error obteniendo feedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para guardar orden de importancia
router.post('/orden', async (req, res) => {
  try {
    const { boxId, atencion, eficiencia, presentacion, garantia } = req.body;

    if (!boxId || !atencion || !eficiencia || !presentacion || !garantia) {
      return res.status(400).json({
        error:
          'Faltan datos requeridos: boxId, atencion, eficiencia, presentacion, garantia',
      });
    }

    // Validar que todos los números sean únicos y estén entre 1-4
    const valores = [atencion, eficiencia, presentacion, garantia];
    const valoresUnicos = [...new Set(valores)];

    if (valoresUnicos.length !== 4 || !valores.every((v) => v >= 1 && v <= 4)) {
      return res.status(400).json({
        error: 'Los valores deben ser únicos y estar entre 1 y 4',
      });
    }

    // Buscar el box existente
    let box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    // Actualizar el orden de importancia
    box.ordenImportancia = {
      atencion,
      eficiencia,
      presentacion,
      garantia,
      fechaOrden: new Date(),
    };

    // Agregar a las interacciones
    box.interacciones.push('orden_importancia');

    await box.save();

    res.json({
      success: true,
      mensaje: '¡Orden de importancia guardado exitosamente!',
      orden: box.ordenImportancia,
    });
  } catch (error) {
    console.error('Error guardando orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para guardar calendario de expectativas
router.post('/calendario', async (req, res) => {
  try {
    const { boxId, fechaEsperada, fechaLlegada } = req.body;

    if (!boxId || !fechaEsperada || !fechaLlegada) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: boxId, fechaEsperada, fechaLlegada',
      });
    }

    // Validar formato de fechas
    const fechaEsperadaDate = new Date(fechaEsperada);
    const fechaLlegadaDate = new Date(fechaLlegada);

    if (
      isNaN(fechaEsperadaDate.getTime()) ||
      isNaN(fechaLlegadaDate.getTime())
    ) {
      return res.status(400).json({
        error: 'Formato de fecha inválido',
      });
    }

    // Buscar el box existente
    let box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    // Calcular diferencia en días
    const diferenciaTiempo =
      fechaLlegadaDate.getTime() - fechaEsperadaDate.getTime();
    const diasDiferencia = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    const llegadaATiempo = diasDiferencia === 0;

    // Actualizar el calendario de expectativas
    box.calendarioExpectativas = {
      fechaEsperada: fechaEsperadaDate,
      fechaLlegada: fechaLlegadaDate,
      llegadaATiempo: llegadaATiempo,
      diasDiferencia: diasDiferencia,
      fechaRegistro: new Date(),
    };

    // Agregar a las interacciones
    box.interacciones.push('calendario_expectativas');

    await box.save();

    res.json({
      success: true,
      mensaje: '¡Calendario guardado exitosamente!',
      calendario: box.calendarioExpectativas,
      resumen: {
        llegadaATiempo: llegadaATiempo,
        diasDiferencia: diasDiferencia,
        estado: llegadaATiempo
          ? 'A tiempo'
          : diasDiferencia > 0
          ? `${diasDiferencia} días tarde`
          : `${Math.abs(diasDiferencia)} días temprano`,
      },
    });
  } catch (error) {
    console.error('Error guardando calendario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para obtener calendario guardado
router.get('/calendario/:boxId', async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    res.json({
      calendario: box.calendarioExpectativas || null,
    });
  } catch (error) {
    console.error('Error obteniendo calendario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para obtener todo el feedback completo
router.get('/completo/:boxId', async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    res.json({
      boxId: box.boxId,
      fechaPrimerEscaneo: box.fechaPrimerEscaneo,
      ultimaVisita: box.ultimaVisita,
      interacciones: box.interacciones,
      feedbackExperiencia: box.feedbackExperiencia || null,
      ordenImportancia: box.ordenImportancia || null,
      calendarioExpectativas: box.calendarioExpectativas || null,
    });
  } catch (error) {
    console.error('Error obteniendo feedback completo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para obtener orden guardado
router.get('/orden/:boxId', async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findOne({ boxId });

    if (!box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    res.json({
      orden: box.ordenImportancia || null,
    });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
