import { Router } from 'express'
import { ProductModel } from '../models/product.model.js'
import { CartModel } from '../models/cart.model.js'

const router = Router()

router.get('/products', async (req, res) => {
    const { page = 1, limit = 10, sort, query } = req.query
    const options = {
        page,
        limit,
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    }

    const filter = query
        ? { $or: [{ category: query }, { status: query === 'true' }] }
        : {}

    const result = await ProductModel.paginate(filter, options)
    const products = result.docs.map(p => p.toObject())


    res.render('products', {
        products: products,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
        title: 'Lista de productos'
    })

})

router.get('/products/:pid', async (req, res) => {
    const product = await ProductModel.findById(req.params.pid).lean();
    const carts = await CartModel.find().lean();
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetail', { product, carts });
});


router.get('/carts', async (req, res) => {
    try {
        const carts = await CartModel.find().populate('products.product')
        res.render('carts', { carts: carts.map(cart => cart.toObject()) })
    } catch (error) {
        res.status(500).send('Error al cargar los carritos')
    }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate('products.product')
        if (!cart) {
            return res.status(404).send('Carrito no encontrado')
        }

        cart.products = cart.products.filter(item => item.product !== null);

        const total = cart.products.reduce((acc, item) => {
            return acc + item.quantity * item.product.price
        }, 0)

        res.render('cart', { cart: cart.toObject(), total })
    } catch (error) {
        res.status(500).send('Error al cargar el carrito')
    }
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeProducts')
})

export default router
