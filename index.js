const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1obyivv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('resaleClothes').collection('categories');
        const productsCollection = client.db('resaleClothes').collection('products');
        const bookingsCollection = client.db('resaleClothes').collection('bookings');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        });

        // Products API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        // Booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('resale clothes server is running');
})

app.listen(port, () => console.log(`resale clothes running on ${port}`))