// import React, { useState, useRef, useEffect} from 'react';
// import '../App.css'

//  export default function Card() {
//     const [tweets, setTweets] = useState([]);
//     const [tweetId, setTweetId] = useState(null);
//     const [comment, setComment] = useState({});
//     const [file, setFile] = useState(null);
//     const inputTweetRef = useRef(null);


//  //////// Route Post pour insérer les tweets
//  async function handleTweetSubmit(e) {
//     e.preventDefault();
//     const nwTweet = inputTweetRef.current.value.trim();

//     const formData = new FormData();
//     formData.append('tweets', nwTweet);
//     formData.append('file', file);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3000/tweets/tweet', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });
//       const data = await response.json(); 
//       // console.log(data.imageUrl);

//       setTweetId(data.tweetId);
//       setTweets((prevTweets) => [...prevTweets, {_id:data.tweetId, tweets: nwTweet, like: [], comment:[], created_at: data.created_at, imageUrl: data.imageUrl}]);
//       inputTweetRef.current.value = '';
//       setFile(null);
//     } catch (error) {
//       console.log('Error inserting tweet', error);
//     }
//   };

//   function handleImgChange(e) {
//     setFile(e.target.files[0]);
//   }

//   ////////// Route pour récupérer les tweets 
//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await fetch('http://localhost:3000/tweets/allTweets', {
//           headers: { 'Content-Type': 'application/json' }
//         });
//         const data = await response.json();
//         setTweets(data);
//       } catch (error) {
//         console.log('Erreur lors de la récupération des tweets', error);
//       }
//     })();
//   }, []); 


//   //////// Route Post pour insérer les likes
//   async function handleLikeSubmit(e, tweetId) {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3000/tweets/likes', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ tweetId })
//       });
//       const data = await response.json();
//       // console.log(data);

//       const userId = atob(token.split('.')[1]).id;
//       if (data === 'Like added') {
//         setTweets(prevTweets => prevTweets.map(tweet => 
//           tweet._id === tweetId ? { ...tweet, like: [...tweet.like, data.userId] } : tweet
//         ));
//       } else if (data === 'Like removed'){
//         setTweets(prevTweets => prevTweets.map(tweet =>
//           tweet._id === tweetId ? { ...tweet, like: tweet.like.filter(like => like !== userId) } : tweet
//         ));
//       }
//     } catch (error) {
//       console.log('Error inserting like', error);
//     }
//   };

//   const handleCommentChange = (tweetId, value) => {
//     setComment(prevComments => ({ ...prevComments, [tweetId]: value }));
//   };
  
//   //////// Route POST pour insérer les commentaires
//   async function handleCommentSubmit(e, tweetId) {
//     e.preventDefault();
//     const newComment = comment[tweetId]?.trim();
//     // console.log(newComment);  
//     if (!newComment) return;
//     try {
//         const token = localStorage.getItem('token');
//         const res = await fetch('http://localhost:3000/tweets/comments', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ comment: newComment, tweetId })
//         });
//         const data = await res.json();
//         // console.log(data.comment);
//         setTweets(prevTweets => prevTweets.map(tweet =>
//             tweet._id === tweetId ? { ...tweet, comment: [...tweet.comment, data.comment] } : tweet
//         ));

//         setComment(prevComments => ({ ...prevComments, [tweetId]: '' }));
//       } catch (error) {
//         console.log('Erreur', error);
//     }
// };

// ////////// Route Delete tweet
// async function handleTweetDelete(e, tweetId) {
//   e.preventDefault();
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:3000/tweets/tweet',{
//       method: 'DELETE',
//       headers: { 'Authorization':`Bearer ${token}`,
//         'Content-Type':'application/json'},
//       body: JSON.stringify({tweetId})
//     })
//     // console.log(response);
//     if(response.ok){
//       setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== tweetId))
//     }
//   } catch(error) {
//     console.log('Error delete tweet');
//   }
// }

//   return (
//     <div className='App'>
//       <div className='form'>
//         <div className='form-tweet'>
//           <form className='form-tweet' onSubmit={handleTweetSubmit}>
//             <input type="text" ref={inputTweetRef} placeholder='What is happening?' />
//             <input type="file" onChange={handleImgChange}/>
//             <button type='submit'>Tweet</button>
//             {file && <img src={URL.createObjectURL(file)} alt="" />}
//           </form>
//         </div>

//       <div className='tweets'>
//         {tweets.map((tweet) => (
//           <div key={tweet._id} className='tweet'>
//             <button 
//             onClick={(e) => handleTweetDelete(e, tweet._id)}>Delete</button>
//             <div className='tweetTime'>
//               <span>{tweet.created_at}</span>
//             </div>
//             <div className='tweetContent'>
//               <h1>{tweet.tweets}</h1>
//                 {tweet.imageUrl && (
//                   <div className='tweetImg'>
//                     <img src={`http://localhost:3000/images/${tweet.imageUrl}`} alt="Tweet Image" />
//                   </div>
//                 )}
//               <div className='tweetLikes'>
//                 <button onClick={(e) => handleLikeSubmit(e, tweet._id)}> 
//                 <span style={{padding:'5px'}}> {tweet.like.length}</span> Like</button>
//               </div>
//                   <form onSubmit={(e) => handleCommentSubmit(e, tweet._id)}>
//                       <input type="text" value={comment[tweet._id] || ''} onChange={(e) => handleCommentChange(tweet._id, e.target.value)}
//                        placeholder="Add a comment" />
//                       <button type='submit'>Comment</button>
//                   </form>
//               <div className='tweetComments'>
//                 {tweet.comment.map((comment, index) => (
//                   <p key={`${comment.userId}-${index}`} style={{ color: 'green' }}> {comment.comment}</p>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       </div>
//     </div>
//   );
// }
