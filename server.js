import express from 'express';
import cors from 'cors';
import {connectToDatabase, ObjectId} from './Model/mongoDB.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.urlencoded({ extended: true }));
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
    const { firstName, lastName, email, password} = req.body;
// Generate salt and hash
 const hachedPassword = await bcrypt.hash(password, 10);

    const data = {
      firstName,
      lastName,
      email,
      password: hachedPassword,
      comments: []
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


//////// Route POST pour insérer les données commentaires
app.post('/comments',verifyToken, async (req, res) => {
  const {comment} = req.body;
  try{
    let db = await connectToDatabase();
    const collection = db.collection('users');
    const userIdObject = new ObjectId(req.userId);
    const user = await collection.findOne({_id: userIdObject});
    if(!user){
      return res.status(404).json('user not found');
    }
    const addComment = await collection.updateOne({ _id: userIdObject}, {$push:{comments: comment, date: Date()}},)
   } catch(error) {
    console.log('Erreur comments', error);
    res.status(500).json('Erreur server')
  }
  
});


/////// Route Get pour récupérer les commentaires
app.get('/allcomments', async(req, res) => {
  try {
    let db = await connectToDatabase();
    const collection = db.collection('users');
  
    const comments = await collection.find({},{projection:{comments:1, _id:0}}).toArray();
    const allComments = comments.reduce((acc, user) => {
      return acc.concat(user.comments);
    },[]);
    if (!comments){
      return res.status(404).json('Comment nout found');
    }
    res.status(200).json(allComments)
  } catch(error) {
    console.log('Erreur lors de la récupération des commentaires');
    res.status(404).json('Erreur server')
  }

});


///////// Route Post pour insérer les likes
app.post('/likes',async(req, res) => {
  const {like} = req.body;
  console.log(like);
  try {
    let db = await connectToDatabase();
    const collection = db.collection('users');
    const addLikes = await collection.insertOne({like});
    console.log(addLikes);
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