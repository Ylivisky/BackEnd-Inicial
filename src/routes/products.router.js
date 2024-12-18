import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/productos.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.json(products);
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send({ error: 'Producto no encontrado' });
    res.json(product);
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    if (!newProduct) return res.status(400).send({ error: 'Campos inválidos' });
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).send({ error: 'Producto no encontrado o datos inválidos' });
    res.json(updatedProduct);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(req.params.pid);
    if (!result) return res.status(404).send({ error: 'Producto no encontrado' });
    res.status(204).send();
});

export default router;
