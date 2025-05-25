const CartManager = require('../services/CartManager');
const cartManager = new CartManager('data/carts.json');

const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

const getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart
};
