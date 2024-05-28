import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const url = 'mongodb+srv://koceilaHk:Mongodb123456$@cluster5.7ouay3s.mongodb.net/';
const dbName = 'ElonMusk';
let db;

// Fonction pour établir la connexion à MongoDB
async function connectToDatabase() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connecté à MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
  }
}

// Route POST pour insérer des données
app.post('/register', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const collection = db.collection('users');
    const result = await collection.insertMany([data]);
    console.log(result);

    res.status(200).json('Utilisateur ajouté avec succes !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion du document:', error);
    res.status(500).json('Erreur server')
  }
});

app.post('/login', async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        console.log(password);

        const collection = db.collection('users');
        const user = await collection.findOne({email: email});

        if (user && user.password === password) {
            res.status(200).json('user found');
            console.log('good');
        } else {
            res.status(500).json('user not found');
            console.log('bad');
        }
    } catch(error) {
        console.error('Erreur', error);
    }
})


connectToDatabase().then(() => {
app.listen(port, () => {
console.log(`Le serveur est en écoute sur le port ${port}`);
});
})