import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean,
    category: String
})

productSchema.plugin(paginate)

export const ProductModel = mongoose.model('Product', productSchema)
