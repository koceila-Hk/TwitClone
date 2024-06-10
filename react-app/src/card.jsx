import React, { useState, useRef, useEffect} from 'react';
import './App.css'

 export default function Card() {
    const [tweets, setTweets] = useState([]);
    const [tweetId, setTweetId] = useState(null);
    const [comment, setComment] = useState({});
    const inputTweetRef = useRef(null);

 //////// Route Post pour insérer les tweets
 async function handleTweetSubmit(e) {
    e.preventDefault();
    const nwTweet = inputTweetRef.current.value.trim();
    if (!nwTweet) return;  // Check if tweet is empty
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/tweet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tweets: nwTweet })
      });
      const data = await response.json(); 
      // console.log(data);

      setTweetId(data.tweetId);
      setTweets((prevTweets) => [...prevTweets, {_id:data.tweetId, tweets: nwTweet, like: [], comment:[], created_at: data.created_at}]);
      inputTweetRef.current.value = '';
    } catch (error) {
      console.log('Error inserting tweet', error);
    }
  };

  ////////// Route pour récupérer les tweets 
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/allTweets', {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setTweets(data);
      } catch (error) {
        console.log('Erreur lors de la récupération des tweets', error);
      }
    })();
  }, []); 

  //////// Route Post pour insérer les likes
  async function handleLikeSubmit(e, tweetId) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tweetId })
      });
      const data = await response.json();
      setTweets(prevTweets => prevTweets.map(tweet => 
        tweet._id === tweetId ? { ...tweet, like: [...tweet.like, data.userId] } : tweet
      ));
    } catch (error) {
      console.log('Error inserting like', error);
    }
  };

  //////// Handle img submit
//   function handleImgSubmit(e) {
//     e.preventDefault();
//     const newImg = inputImgRef.current.value;
//     setImg(newImg);
//   }

  const handleCommentChange = (tweetId, value) => {
    setComment(prevComments => ({ ...prevComments, [tweetId]: value }));
  };
  //////// Route POST pour insérer les commentaires
  async function handleCommentSubmit(e, tweetId) {
    e.preventDefault();
    const newComment = comment[tweetId]?.trim();
    // console.log(newComment);  
    if (!newComment) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: newComment, tweetId })
        });
        const data = await res.json();
        // console.log(data.comment);
        setTweets(prevTweets => prevTweets.map(tweet =>
            tweet._id === tweetId ? { ...tweet, comment: [...tweet.comment, data.comment] } : tweet
        ));

        setComment(prevComments => ({ ...prevComments, [tweetId]: '' }));
      } catch (error) {
        console.log('Erreur', error);
    }
};

  return (
    <div className='App'>
      <div className='form'>
        <div className='form-tweet'>
          <form className='form-tweet' onSubmit={handleTweetSubmit}>
            <input type="text" ref={inputTweetRef} placeholder='What is happening?' />
            <button type='submit'>Tweet</button>
          </form>
        </div>

      <div className='tweets'>
        {tweets.map((tweet) => (
          <div key={tweet._id} className='tweet'>
            <div className='tweetTime'>
              <span>{tweet.created_at}</span>
            </div>
            <div className='tweetContent'>
              <h1>{tweet.tweets}</h1>
              <div className='tweetLikes'>
                <button onClick={(e) => handleLikeSubmit(e, tweet._id)}> 
                <span style={{padding:'5px'}}> {tweet.like.length}</span> Like</button>
              </div>
                  <form onSubmit={(e) => handleCommentSubmit(e, tweet._id)}>
                      <input type="text" value={comment[tweet._id] || ''} onChange={(e) => handleCommentChange(tweet._id, e.target.value)}
                       placeholder="Add a comment" />
                      <button type='submit'>Add</button>
                  </form>
              <div className='tweetComments'>
                {tweet.comment.map((comment, index) => (
                  <p key={`${comment.userId}-${index}`} style={{ color: 'green' }}> {comment.comment}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}


// import React, { useState, useRef, useEffect } from 'react';
// import './App.css';

// export default function Card() {
//     const [tweets, setTweets] = useState([]);
//     const [tweetId, setTweetId] = useState(null);
//     const [comment, setComment] = useState({});
//     const inputTweetRef = useRef(null);

//     //////// Route Post pour insérer les tweets
//     async function handleTweetSubmit(e) {
//         e.preventDefault();
//         const nwTweet = inputTweetRef.current.value.trim();
//         if (!nwTweet) return;  // Check if tweet is empty
//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch('http://localhost:3000/tweet', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ tweets: nwTweet })
//             });
//             const data = await response.json();

//             const formattedDate = new Date().toLocaleString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });
//             setTweetId(data.tweetId);
//             setTweets((prevTweets) => [...prevTweets, { _id: data.tweetId, tweets: nwTweet, like: [], comment: [], created_at: formattedDate }]);
//             inputTweetRef.current.value = '';
//         } catch (error) {
//             console.log('Error inserting tweet', error);
//         }
//     };

//     ////////// Route pour récupérer les tweets
//     useEffect(() => {
//         (async () => {
//             try {
//                 const response = await fetch('http://localhost:3000/allTweets', {
//                     headers: { 'Content-Type': 'application/json' }
//                 });
//                 const data = await response.json();
//                 const formattedData = data.map(tweet => ({
//                     ...tweet,
//                     created_at: new Date(tweet.created_at).toLocaleString('fr-FR', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                     })
//                 }));
//                 setTweets(formattedData);
//             } catch (error) {
//                 console.log('Erreur lors de la récupération des tweets', error);
//             }
//         })();
//     }, []);

//     //////// Route Post pour insérer les likes
//     async function handleLikeSubmit(e, tweetId) {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch('http://localhost:3000/likes', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ tweetId })
//             });
//             const data = await response.json();
//             setTweets(prevTweets => prevTweets.map(tweet =>
//                 tweet._id === tweetId ? { ...tweet, like: [...tweet.like, data.userId] } : tweet
//             ));
//         } catch (error) {
//             console.log('Error inserting like', error);
//         }
//     };

//     const handleCommentChange = (tweetId, value) => {
//         setComment(prevComments => ({ ...prevComments, [tweetId]: value }));
//     };

//     //////// Route POST pour insérer les commentaires
//     async function handleCommentSubmit(e, tweetId) {
//         e.preventDefault();
//         const newComment = comment[tweetId]?.trim();
//         if (!newComment) return;
//         try {
//             const token = localStorage.getItem('token');
//             const res = await fetch('http://localhost:3000/comments', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ comment: newComment, tweetId })
//             });
//             const data = await res.json();
//             setTweets(prevTweets => prevTweets.map(tweet =>
//                 tweet._id === tweetId ? { ...tweet, comment: [...tweet.comment, data.comment] } : tweet
//             ));
//             setComment(prevComments => ({ ...prevComments, [tweetId]: '' }));
//         } catch (error) {
//             console.log('Erreur', error);
//         }
//     };

//     return (
//         <div className='App'>
//             <div className='form'>
//                 <div className='form-tweet'>
//                     <form className='form-tweet' onSubmit={handleTweetSubmit}>
//                         <input type="text" ref={inputTweetRef} placeholder='What is happening?' />
//                         <button type='submit'>Tweet</button>
//                     </form>
//                 </div>

//                 <div className='tweets'>
//                     {tweets.map((tweet) => (
//                         <div key={tweet._id} className='tweet'>
//                             <div className='tweetTime'>
//                                 <span>{tweet.created_at}</span>
//                             </div>
//                             <div className='tweetContent'>
//                                 <h1>{tweet.tweets}</h1>
//                                 <div className='tweetLikes'>
//                                     <button onClick={(e) => handleLikeSubmit(e, tweet._id)}>
//                                         <span style={{ padding: '5px' }}>{tweet.like.length}</span> Like
//                                     </button>
//                                 </div>
//                                 <form onSubmit={(e) => handleCommentSubmit(e, tweet._id)}>
//                                     <input
//                                         type="text"
//                                         value={comment[tweet._id] || ''}
//                                         onChange={(e) => handleCommentChange(tweet._id, e.target.value)} placeholder="Add a comment"/>
//                                     <button type='submit'>Add</button>
//                                 </form>
//                                 <div className='tweetComments'>
//                                     {tweet.comment.map((comment, index) => (
//                                         <p key={`${comment.userId}-${index}`} style={{ color: 'green' }}>
//                                             {comment.comment}
//                                         </p>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
