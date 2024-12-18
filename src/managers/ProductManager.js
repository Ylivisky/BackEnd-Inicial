import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit) {
        const data = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return limit ? products.slice(0, limit) : products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((p) => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: this.generateId(products), ...product, status: true };
        if (!this.validateProduct(newProduct)) return null;
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updates, id };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter((p) => p.id !== id);
        if (products.length === filteredProducts.length) return null;
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        return true;
    }

    generateId(products) {
        return products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    }

    validateProduct(product) {
        const { title, description, code, price, stock, category } = product;
        return title && description && code && price && stock && category;
    }
}

export default ProductManager;
