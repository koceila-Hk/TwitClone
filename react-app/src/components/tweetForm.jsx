import React from "react";
import { useState } from "react";

const TweetForm = ({onTweetSubmit}) => {
    const [tweetContent, setTweetContent] = useState('');
    const [file, setFile] = useState(null);

    const handleTweetChange = (e) => {
        setTweetContent(e.target.value.trim());
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onTweetSubmit(tweetContent, file);
        setTweetContent('');
        setFile(null)
    }

    return(
        <form onSubmit={handleSubmit} className="App">
            <textarea
            value={tweetContent}
            onChange={handleTweetChange}
            placeholder="What's happening?!"
            rows="3"
            ></textarea>
            <input type="file" onChange={handleFileChange}/>
            <button type="submit">Post</button>
        </form>
    );
};

export default TweetForm;