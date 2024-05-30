import express from 'express';
import cors from 'cors';
import {connectToDatabase} from './Model/mongoDB.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


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
      password: hachedPassword
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


app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        let db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({email: email});
        console.log(user);
        if (!user) {
          return res.status(500).json('User not found')
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json('Invalid password');
        }      

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h',
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
    const users = await collection.find().toArray();
    console.log(users);
    res.status(200).json(users);
  } catch(error) {
    console.error('Erreur lors de la récupération des users', error);
    res.status(500).json('Erreur server')
  }
})


// var password2 = "Bcrypt@123";
// var hash = "$2b$08$ihbrrTtUeKlPe3inaQ4Nm..Ylc7BZ.p9PNU80hoSPnTkvNK9MkVLO";

// bcrypt.compare(password2, hash, function(err, result) {
//   // Password matched
//   if (result) {
//     console.log("Password verified");
//   }
//   // Password not matched
//   else {
//     console.log("Password not verified");
//   }
// });

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