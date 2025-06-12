import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import mongoose from 'mongoose'
import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'
import viewsRouter from './src/routes/views.router.js'
import handlebars from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

await mongoose.connect(process.env.MONGO_URI)

app.engine(
    'handlebars',
    handlebars.create({
        helpers: {
            multiply: (a, b) => a * b,
            add: (a, b) => a + b
        }
    }).engine
)

app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'src/views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

io.on('connection', async socket => {
    try {
        const { ProductModel } = await import('./src/models/product.model.js')
        const products = await ProductModel.find()
        socket.emit('products', products)

        socket.on('new-product', async productData => {
            await ProductModel.create(productData)
            const updatedProducts = await ProductModel.find()
            io.emit('products', updatedProducts)
        })
    } catch (error) {
        console.error('Error en conexión Socket.io:', error)
    }
})


const PORT = process.env.PORT || 8080
server.listen(PORT)
console.log(`Servidor corriendo en http://localhost:${PORT}`)

