import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find((c) => c.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: this.generateId(carts), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) return null;

        const productInCart = cart.products.find((p) => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    generateId(carts) {
        return carts.length ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    }
}

export default CartManager;
