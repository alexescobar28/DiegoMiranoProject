require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const feedbackRoutes = require('./routes/Feedback');

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error(err));

app.use('/feedback', feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
