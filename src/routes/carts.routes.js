const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const manager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await manager.getById(req.params.cid);
    cart ? res.json(cart.products) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updated = await manager.addProductToCart(req.params.cid, req.params.pid);
    updated ? res.json(updated) : res.status(404).send('Carrito no encontrado');
});

module.exports = router;
