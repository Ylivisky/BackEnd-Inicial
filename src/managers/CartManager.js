const fs = require('fs').promises;
const path = './data/carts.json';

class CartManager {
    constructor() {
        this.path = path;
    }

    async getAll() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const carts = await this.getAll();
        return carts.find(c => c.id === id);
    }

    async createCart() {
        const carts = await this.getAll();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getAll();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;
