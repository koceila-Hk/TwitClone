import express from 'express';
import cors from 'cors';
import {connectToDatabase} from './Model/mongoDB.js';
import authRoute from './Routes/authRoute.js';
import userRoute from './Routes/userRoute.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = 3000;

app.use('/auth', authRoute);
app.use('/tweets', userRoute);


//////// Le dossier ou les fichiers static seront servis 
app.use('/images',express.static('images'));


///////// Route Get images
// app.get('/images/:filename', (req, res) => {
//   const { filename } = req.params;
//   res.sendFile(filename);
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
console.log(`I'm here kouss ${port}`);
});
})