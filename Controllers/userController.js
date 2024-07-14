import { connectToDatabase, ObjectId } from '../Model/mongoDB.js';
import multer from 'multer';

////////// Configuration multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
    
export const upload = multer({ storage: storage });


//////// Post tweet ///////
export const postTweet = async (req, res) => {
    try {
      const {tweets} = req.body;
      const file = req.file;
  
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
        imageUrl: file ? file.filename : null,
        comment: [],
        like: [],
        created_at: createdAt
      };
      // console.log(dataTweet);
  
      let db = await connectToDatabase();
      const collection = db.collection('tweets');
      const addTweet = await collection.insertOne(dataTweet);
      
      res.status(200).json({tweetId: addTweet.insertedId, created_at: createdAt, imageUrl: dataTweet.imageUrl});
    } catch(error) {
      console.log('Error adding tweet', error);
      res.status(500).json('Error adding tweet')
    }
  };


//////// Get all tweets //////
export const getAllTweets = async (req, res) => {
    try {
      let db = await connectToDatabase();
      const collection = db.collection('tweets');
      const tweet = await collection.find({}).toArray();
      // console.log(tweet);
  
      res.status(200).json(tweet)
    } catch(error) {
      console.log('Erreur lors de la récupération des tweets');
      res.status(404).json('Erreur lors de la récupération des tweets');
    }
  };


//////// Delete tweet ////////
export const deleteTweet = async (req, res) => {
    const tweetId = new ObjectId(req.body.tweetId);
    // console.log(tweetId);
    try {
      let db = await connectToDatabase();
      const collection = db.collection('tweets');
  
      const deleteTweet = await collection.deleteOne({_id: tweetId});
      console.log(deleteTweet);
      if(deleteTweet.deletedCount === 1){
        res.status(200).json('Tweet deleted successefully');
      } else {
        res.status(404).json('Tweet not found')
      }
    } catch(error) {
      console.log('Error delete from db');
      res.status(500).json('Error delete tweet from')
    }
  };


//////// Post comments ////////
export const postComment = async (req, res) => {
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
    
  };


///////// Toggle like ///////
export const toggleLike = async(req, res) => {
    const {tweetId} = req.body;
    const userId = new ObjectId(req.userId);
  
    try {
      let db = await connectToDatabase();
      const collection = db.collection('tweets');
  
      const addLike = await collection.updateOne({_id: new ObjectId(tweetId), like :{$ne : userId}},{$push: {like: userId}});
      // console.log(addLike);
  
      if (addLike.matchedCount === 1){
        return res.status(200).json('Like added');
        } else {
        const removeLike = await collection.updateOne({_id: new ObjectId(tweetId), like: {$eq: userId}}, {$pull: {like: userId}})
        return res.status(200).json('Like removed');
      }
  
      } catch(error) {
        console.log('Error insert likes', error);
        res.status(404).json('Error insert likes');
    }
  };


//////// User's info
export const getUser = async(req, res) => {
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
  };


