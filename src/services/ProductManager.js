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

    async getProductById(id) {
    const products = await this.readFile();
    return products.find(p => p.id === id);
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

    async updateProduct(id, updatedFields) {
    const products = await this.readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    products[index] = { ...products[index], ...updatedFields };
    await this.writeFile(products);
    return products[index];
}


    async deleteProduct(id) {
        const products = await this.readFile();
        const filtered = products.filter(p => p.id !== id);
        if (filtered.length === products.length) throw new Error('Producto no encontrado');
        await this.writeFile(filtered);
    }
}

module.exports = ProductManager;
