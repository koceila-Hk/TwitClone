import React from "react";

const TweetList = ({tweets = [], onLike, onCommentSubmit, onDelete}) => {
    return(
        <div className="App">
                {tweets.map((t) => (
                    <div key={t._id} className="tweet">
                    <div className="tweet-header">
                        {/* <span className="tweet-author">{tweet.username}</span> */}
                        <span className="tweet-date">{t.created_at}</span>
                    </div>
                    <div className="tweet-content">
                        <p>{t.tweets}</p>
                        {t.imageUrl && <img src={`http://localhost:3000/images/${t.imageUrl}`} alt="Tweet" />}
                    </div>
                    <div className="tweet-actions">
                        <button onClick={() => onLike(t._id)}>Like </button>
                        <button onClick={() => onDelete(t._id)}>Delete</button>
                    </div>
                    <div className="tweet-comment">
                        {t.comment.map((c, index) => (
                            <p key={index}>{c.comment}</p>
                        ))}
                        <form onSubmit={(e) => onCommentSubmit(e, t._id)}>
                            <input type="text" placeholder="Add a comment"/>
                            <button type="submit">Comment</button>
                        </form>
                    </div>
                </div>
            ))};
        </div>
    );
};

export default TweetList;

