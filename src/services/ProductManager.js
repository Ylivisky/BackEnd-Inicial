const fs = require('fs').promises;
const { randomUUID } = require('crypto');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async getProducts() {
        return await this.readFile();
    }

    async addProduct(product) {
        const products = await this.readFile();
        const newProduct = {
            id: randomUUID(),
            status: true,
            thumbnails: [],
            ...product
        };
        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;
    }

    async deleteProduct(id) {
        const products = await this.readFile();
        const filtered = products.filter(p => p.id !== id);
        if (filtered.length === products.length) throw new Error('Producto no encontrado');
        await this.writeFile(filtered);
    }
}

module.exports = ProductManager;
