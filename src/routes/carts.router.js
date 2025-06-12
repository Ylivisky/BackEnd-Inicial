import { Router } from 'express'
import {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProducts,
    getAllCarts
} from '../controllers/cart.controller.js'

const router = Router()

router.get('/', getAllCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.post('/:cid/products/:pid', addProductToCart)
router.delete('/:cid/products/:pid', removeProductFromCart)
router.put('/:cid', updateCart)
router.put('/:cid/products/:pid', updateProductQuantity)
router.delete('/:cid', deleteAllProducts)

export default router
