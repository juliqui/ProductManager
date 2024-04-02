const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
                this.lastId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }
        } catch (err) {
            console.error('Error al cargar los productos:', err);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error al guardar los productos:', err);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(p => p.code === product.code)) {
            console.log("Ya existe un producto con el código proporcionado.");
            return;
        }

        product.id = ++this.lastId;
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.log("Producto no encontrado.");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
        } else {
            console.log("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
        } else {
            console.log("Producto no encontrado.");
        }
    }
}

const manager = new ProductManager('productos.json');
manager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 100,
    thumbnail: "ruta/imagen1.jpg",
    code: "001",
    stock: 10
});

manager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 150,
    thumbnail: "ruta/imagen2.jpg",
    code: "002",
    stock: 5
});

console.log(manager.getProducts());
console.log(manager.getProductById(1));
console.log(manager.getProductById(3));
