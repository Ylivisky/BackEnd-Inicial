import { CartService } from '../services/cart.service.js'
import { CartModel } from '../models/cart.model.js'

const cartService = new CartService()

export const createCart = async (req, res) => {
    const result = await cartService.createCart()
    res.send(result)
}

export const getAllCarts = async (req, res) => {
    try {
        const carts = await CartModel.find().populate('products.product')
        res.json({ status: 'success', carts })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getCartById = async (req, res) => {
    const result = await cartService.getCartById(req.params.cid)
    res.send(result)
}

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const qty = parseInt(quantity)
        if (!qty || qty < 1) {
            return res.status(400).send('Cantidad inválida')
        }

        const cart = await CartModel.findById(cid)
        if (!cart) return res.status(404).send('Carrito no encontrado')

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += qty
        } else {
            cart.products.push({ product: pid, quantity: qty })
        }

        await cart.save()

        res.redirect(`/carts/${cid}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error al agregar producto al carrito')
    }
}

export const removeProductFromCart = async (req, res) => {
    const result = await cartService.removeProductFromCart(req.params.cid, req.params.pid)
    res.send(result)
}

export const updateCart = async (req, res) => {
    const result = await cartService.updateCart(req.params.cid, req.body.products)
    res.send(result)
}

export const updateProductQuantity = async (req, res) => {
    const result = await cartService.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        req.body.quantity
    )
    res.send(result)
}

export const deleteAllProducts = async (req, res) => {
    const result = await cartService.deleteAllProducts(req.params.cid)
    res.send(result)
}
