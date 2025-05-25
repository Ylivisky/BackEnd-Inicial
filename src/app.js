const express = require('express');
const app = express();
const PORT = 8080;

const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});