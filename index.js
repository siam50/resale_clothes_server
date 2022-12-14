const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = client.db('resaleClothes').collection('users');

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

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            let query = {};
            if (email) {
                query = { email: email }
            }
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        })

        // Booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            let query = {};
            if (email) {
                query = { email: email }
            }
            const booking = await bookingsCollection.find(query).toArray();
            res.send(booking)
        });

        // Users API
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        });

        app.get('/users/buyers', async (req, res) => {
            const query = { role: "buyer" };
            const buyers = await usersCollection.find(query).toArray();
            res.send(buyers)
        });

        app.get('/users/sellers', async (req, res) => {
            const query = { role: "seller" };
            const sellers = await usersCollection.find(query).toArray();
            res.send(sellers)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
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