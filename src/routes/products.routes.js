const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

module.exports = (io) => {
    const router = express.Router();

    router.get('/', getProducts);
    router.get('/:pid', getProductById);
    router.post('/', (req, res) => createProduct(req, res, io));
    router.put('/:pid', updateProduct);
    router.delete('/:pid', deleteProduct);

    return router;
};
