import React from "react";
import { useState, useEffect } from "react";
import TweetForm from "../components/tweetForm";
import TweetList from "../components/tweetList";
import '../App.css'

const Home = () => {
  const [tweets, setTweets] = useState([]);

  //////// Route Post pour insérer les tweets
  async function handleTweetSubmit(content, file) {  
    const formData = new FormData();
    formData.append('tweets', content);
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/tweets/tweet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json(); 
      // console.log(data.imageUrl);
      setTweets([data, ...tweets])
    } catch (error) {
      console.log('Error inserting tweet', error);
    }
  };

    ////////// Route pour récupérer les tweets 
    useEffect(() => {
      (async () => {
        try {
          const response = await fetch('http://localhost:3000/tweets/allTweets', {
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          console.log(data);
          setTweets(data);
        } catch (error) {
          console.log('Erreur lors de la récupération des tweets', error);
        }
      })();
    }, []); 

      //////// Route Post pour insérer les likes
  async function handleLikeSubmit(tweetId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/tweets/likes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tweetId })
      });
      const data = await response.json();
      // console.log(data);

      const userId = atob(token.split('.')[1]).id;
      if (data === 'Like added') {
        setTweets(prevTweets => prevTweets.map(tweet => 
          tweet._id === tweetId ? { ...tweet, like: [...tweet.like, data.userId] } : tweet
        ));
      } else if (data === 'Like removed'){
        setTweets(prevTweets => prevTweets.map(tweet =>
          tweet._id === tweetId ? { ...tweet, like: tweet.like.filter(like => like !== userId) } : tweet
        ));
      }
    } catch (error) {
      console.log('Error inserting like', error);
    }
  };


  //////// Route POST pour insérer les commentaires
  const handleCommentSubmit = async (e, tweetId) => {
    e.preventDefault();
    const comment = e.target[0].value;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/tweets/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweetId, comment }),
      });
      const data = await response.json();
      setTweets(tweets.map((tweet) =>
        tweet._id === tweetId ? { ...tweet, comment: [...tweet.comment, data.comment] } : tweet
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

////////// Route Delete tweet
async function handleTweetDelete(tweetId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/tweets/tweet',{
      method: 'DELETE',
      headers: { 'Authorization':`Bearer ${token}`,
        'Content-Type':'application/json'},
      body: JSON.stringify({tweetId})
    })
    // console.log(response);
    if(response.ok){
      setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== tweetId))
    }
  } catch(error) {
    console.log('Error delete tweet');
  }
}

  
  return(
  <div className="App">
    <div className="form">
    <TweetForm onTweetSubmit={handleTweetSubmit}/>
    <TweetList tweets={tweets} onLike={handleLikeSubmit} onCommentSubmit={handleCommentSubmit} onDelete={handleTweetDelete} />
  </div> 
  </div>
  )
};
  
  export default Home;