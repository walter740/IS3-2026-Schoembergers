const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Sistema de eventos funcionando bien al fin !!!');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});