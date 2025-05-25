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
        return this.readFile();
    }

    async getProductById(id) {
        const products = await this.readFile();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.readFile();
        const newProduct = { id: randomUUID(), ...product };
        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        const updatedProduct = { ...products[index], ...updates, id };
        products[index] = updatedProduct;
        await this.writeFile(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.readFile();
        const newProducts = products.filter(p => p.id !== id);
        await this.writeFile(newProducts);
        return { success: true };
    }
}

module.exports = ProductManager;
