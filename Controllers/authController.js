import { connectToDatabase, ObjectId } from '../Model/mongoDB.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/////// Create user /////////
export const createUser = async (req, res) => {
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
        tokens:[],
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
  };


//////// Sign in //////
export const userSignIn = async (req, res) => {
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

        let oldTokens = user.tokens;

        if(oldTokens.length) {
          oldTokens = oldTokens.filter(t => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
            if (timeDiff < 7200){
              return t;
            }
          });
        }

        await collection.updateOne({_id: user._id}, {$set: {
          tokens: [...oldTokens, { token, signedAt: Date.now().toString() }]}})

        res.status(200).json({ token });
      } catch(error) {
        console.error('Error login', error);
    }
};


/////// Sign out ////////
export const signOut = async (req, res) => {
    try {
      if(req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
          return res.status(401).json({message: 'Authorization fail !'})
        }
        ////// Connect to db
        let db = await connectToDatabase();
        const collection = db.collection('users');
  
        await collection.updateOne({ _id: new ObjectId(req.userId)}, { $pull: { tokens: {token}}});
    
      }
      res.status(200).json({message: 'logged out successfully'});
  
    }catch(error) {
      console.error('Error logout', error);
    }
  };