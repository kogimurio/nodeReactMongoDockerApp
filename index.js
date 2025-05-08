require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

app.use(express.json());


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log('MongoDB connect err:', err));
app.get('/', (req, res) => res.send('Hello from Dockerized Node.js with MongoDB!'));


// Post /products - Add a new product
app.post('/products', async (req, res) => {
    try {
        const { name, price } =req.body;
        const product = new Product({ name, price });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get /products - Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /products/:id - UPDATE products with params(most used for update)
app.put('/products/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).send('Product not found');
        res.json(updated);
    } catch (err) {
        res.status(500).send("err.message");
    }
});

// PUT /products/:id - UPDATE products with query(less used for update)
app.put('/productsquery', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('Product ID is required in query string');

    try {
        const updated = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).send('Product not found');
        res.json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// DELETE /products/:id - DELETE products
app.delete('/products/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('Product not found');
        res.json({ message: 'Product deleted', deleted });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));