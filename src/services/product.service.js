import { ProductModel } from '../models/product.model.js'
import {CartModel} from '../models/cart.model.js'

export class ProductService {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {}
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
        }
        const result = await ProductModel.paginate(filter, options)
        return result
    }

    async getProductById(id) {
        return await ProductModel.findById(id)
    }

    async createProduct(data) {
        return await ProductModel.create(data)
    }

    async updateProduct(id, data) {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true })
    }

    async deleteProductAndCleanCarts(id) {
        const deletedProduct = await ProductModel.findByIdAndDelete(id)
        if (!deletedProduct) {
            throw new Error('Producto no encontrado')
        }
        await CartModel.updateMany(
            {},
            { $pull: { products: { product: id } } }
        )
        return { status: 'success', message: 'Producto eliminado y carritos actualizados' }
    }
}
