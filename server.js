import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectToDatabase, ObjectId} from './Model/mongoDB.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

app.use(express.json());
app.use(cors());


//////// Function verifyToken
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
   const decoded = jwt.verify(token, 'your-secret-key');
   req.userId = decoded.userId;
   next();
   } catch (error) {
   res.status(401).json({ error: 'Invalid token' });
   }
   };


/////// Route POST pour insérer des données
app.post('/register', async (req, res) => {
  try {
    const { username, email, password} = req.body;
// Generate salt and hash
 const hachedPassword = await bcrypt.hash(password, 10);

    const data = {
      username,
      email,
      password: hachedPassword,
      profilePic: "",
      bio: "",
      followers: [],
      following: [],
      created_at: new Date()
   };

    let db = await connectToDatabase();
    const collection = db.collection('users');
    const emailExist = await collection.findOne({ email: email});
    if (emailExist) {
      return res.status(400).json('Email already exists !')
    }
    const result = await collection.insertOne(data);
    // console.log(result);

    res.status(200).json('Utilisateur ajouté avec succes !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion du document:', error);
    res.status(500).json('Erreur server')
  }
});


//////// Route pour se connecter
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        let db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({email: email});
        if (!user) {
          return res.status(500).json('User not found')
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json('Invalid password');
        }      

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '2h',
        });
        // console.log('Generated Token:', token);
        res.status(200).json({ token });
    } catch(error) {
        console.error('Erreur', error);
    }
})


//////// Route POST pour insérer les tweets
app.post('/tweet',verifyToken, async (req, res) => {
  try {
    const {tweets} = req.body;
    const createdAt = new Date().toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    const dataTweet = {
      user_id: new ObjectId(req.userId),
      tweets,
      comment: [],
      like: [],
      created_at: createdAt
    };

    console.log(dataTweet);
    let db = await connectToDatabase();
    const collection = db.collection('tweets');
    const addTweet = await collection.insertOne(dataTweet);
    
    res.status(200).json({tweetId: addTweet.insertedId, created_at: createdAt});
  } catch(error) {
    console.log('Error adding tweet', error);
    res.status(500).json('Error adding tweet')
  }
});


//////// Route Get pour récupérer tous les tweets
app.get('/allTweets', async (req, res) => {
  try {
    let db = await connectToDatabase();
    const collection = db.collection('tweets');
    const tweet = await collection.find({}).toArray();
    console.log(tweet);

    res.status(200).json(tweet)
  } catch(error) {
    console.log('Erreur lors de la récupération des tweets');
    res.status(404).json('Erreur lors de la récupération des tweets');
  }
})

//////// Route Get pour récupérer des données
app.get('/user',verifyToken, async(req, res) => {
  try {
    let db = await connectToDatabase();
    const collection = db.collection('users');
    const userIdObject = new ObjectId(req.userId);
    const user = await collection.findOne({_id: userIdObject}, {projection: {firstName:1, lastName:1, _id:0}});
    // console.log(user);

    res.status(200).json(user);
  } catch(error) {
    console.error('Erreur lors de la récupération des users', error);
    res.status(500).json('Erreur server')
  }
});


//////// Route POST pour insérer les commentaires
app.post('/comments',verifyToken, async (req, res) => {
  const {comment, tweetId} = req.body;
  console.log(comment);
  console.log(tweetId);
  try{

    if(!comment){
      return res.status(500).json();
    }

    const dataComment = {
      userId: new ObjectId(req.userId),
      comment: comment,
      created_at: new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

    }
    // console.log(dataComment);
    let db = await connectToDatabase();
    const collection = db.collection('tweets');
    const addComment = await collection.updateOne({_id:new ObjectId(tweetId)}, {$push: {comment: dataComment}});

    res.status(200).json({comment: dataComment})
   } catch(error) {
    console.log('Erreur comments', error);
    res.status(500).json('Erreur server')
  }
  
});


///////// Route Post pour insérer les likes
app.post('/likes',verifyToken, async(req, res) => {
  const {tweetId} = req.body;
  const userId = new ObjectId(req.userId);

  try {
    let db = await connectToDatabase();
    const collection = db.collection('tweets');

    const addLikes = await collection.updateOne({_id: new ObjectId(tweetId), like :{$ne : userId}},{$push: {like: userId}});
    // console.log(addLikes);
    if (addLikes.matchedCount === 0){
      return res.status(400).json('I liked this tweet')
    }

    res.status(200).json('I like')
  } catch(error) {
    console.log('Error insert likes', error);
  }
});



// bcrypt
//   .genSalt(workFactor)
//   .then(salt => {
//     console.log(`Salt: ${salt}`);
//     return bcrypt.hash(password, salt);
//   })
  // .then(hash => {
  //   console.log(`Hash: ${hash}`);
  // })
  // .catch(err => console.error(err.message));

connectToDatabase().then(() => {
app.listen(port, () => {
console.log(`Le serveur est en écoute sur le port ${port}`);
});
})