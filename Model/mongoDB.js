import { MongoClient } from 'mongodb';


const url = 'mongodb+srv://koceilaHk:Mongodb123456$@cluster5.7ouay3s.mongodb.net/';
const dbName = 'ElonMusk';
let db;

/////// Fonction pour établir la connexion à MongoDB
async function connectToDatabase() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connecté à MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
  }
}

export { connectToDatabase};