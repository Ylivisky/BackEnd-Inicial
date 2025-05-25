const fs = require('fs').promises;
const { randomUUID } = require('crypto');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this.readFile();
        const newCart = {
            id: randomUUID(),
            products: []
        };
        carts.push(newCart);
        await this.writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readFile();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.writeFile(carts);
        return cart;
    }
}

module.exports = CartManager;
