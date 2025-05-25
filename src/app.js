const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');

const ProductManager = require('./services/ProductManager');
const productManager = new ProductManager('data/products.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

io.on('connection', (socket) => {
    productManager.getProducts().then(products => {
        socket.emit('products', products);
    });

    socket.on('addProduct', async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            const products = await productManager.getProducts();
            io.emit('products', products);
        } catch (error) {
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit('products', products);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
