const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
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

app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

app.post('/api/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const newProduct = {
            title,
            description,
            code,
            price: Number(price),
            stock: Number(stock),
            category,
            status: true,
            thumbnails: []
        };

        await productManager.addProduct(newProduct);

        const products = await productManager.getProducts();
        io.emit('products', products);

        res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

io.on('connection', (socket) => {
    productManager.getProducts()
        .then(products => socket.emit('products', products))
        .catch(() => socket.emit('error', 'Error cargando productos'));

    socket.on('addProduct', async (newProduct) => {
        try {
            const { title, description, code, price, stock, category } = newProduct;
            if (!title || !description || !code || !price || !stock || !category) {
                return socket.emit('error', 'Faltan campos obligatorios');
            }

            await productManager.addProduct({
                title,
                description,
                code,
                price: Number(price),
                stock: Number(stock),
                category,
                status: true,
                thumbnails: []
            });

            const products = await productManager.getProducts();
            io.emit('products', products);
        } catch {
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit('products', products);
        } catch {
            socket.emit('error', 'Error al eliminar producto');
        }
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
