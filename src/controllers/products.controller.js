const ProductManager = require('../services/ProductManager');
const manager = new ProductManager('src/data/products.json');

const getProducts = async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await manager.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

const createProduct = async (req, res, io) => {
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

        await manager.addProduct(newProduct);

        const products = await manager.getProducts();
        io.emit('products', products);

        res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updated = await manager.updateProduct(req.params.pid, req.body);
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleted = await manager.deleteProduct(req.params.pid);
        res.json(deleted);
    } catch {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
