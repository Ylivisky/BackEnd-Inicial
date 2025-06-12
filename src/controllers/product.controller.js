import { ProductService } from '../services/product.service.js'

const productService = new ProductService()

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query
    const result = await productService.getProducts({ limit, page, sort, query })
    const { docs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } = result
    res.send({
        status: 'success',
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page: result.page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}` : null
    })
}

export const getProductById = async (req, res) => {
    const result = await productService.getProductById(req.params.pid)
    res.send(result)
}

export const createProduct = async (req, res) => {
    const result = await productService.createProduct(req.body)
    res.send(result)
}

export const updateProduct = async (req, res) => {
    const result = await productService.updateProduct(req.params.pid, req.body)
    res.send(result)
}

export const deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProductAndCleanCarts(req.params.pid)
        res.send(result)
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

