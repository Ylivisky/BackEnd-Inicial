import { CartModel } from '../models/cart.model.js'

export class CartService {
    async createCart() {
        return await CartModel.create({ products: [] })
    }

    async getCartById(cid) {
        return await CartModel.findById(cid).populate('products.product')
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const index = cart.products.findIndex(p => p.product.toString() === pid);
        if (index === -1) {
            cart.products.push({ product: pid, quantity });
        } else {
            cart.products[index].quantity += quantity;
        }
        return await cart.save();
    }


    async removeProductFromCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        return await cart.save();
    }

    async updateCart(cid, products) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = products;
        return await cart.save();
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const index = cart.products.findIndex(p => p.product.toString() === pid);
        if (index !== -1) {
            cart.products[index].quantity = quantity;
        }
        return await cart.save();
    }

    async deleteAllProducts(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        return await cart.save();
    }

}
