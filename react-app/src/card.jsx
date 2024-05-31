import React, { useState, useRef, useEffect} from 'react';
import './App.css'

 export default function Card() {
    const [img, setImg] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEIW9c-rAXxxmLFlXMPtQUR3KNW4AOmQu8XA&s");
    const [like, setLike] = useState(0);
    const [comment, setComment] = useState([]);
    const inputRef = useRef(null);
    const inputImgRef = useRef(null);

    //////// Handle Like submit
    function handleLikeClic() {
        setLike(pvLike=> pvLike === 0 ? 1: 0);
    }

    ////////Route pour insérer les commentaires
    async function handleCommentSubmit(e) {
        e.preventDefault();
        const newComment = inputRef.current.value.trim();
        setComment(arrayComment => [...arrayComment, newComment]);
        inputRef.current.value = "";
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:3000/comments',{
                method: 'POST',
                headers: {'Content-Type':'application/json', 'Authorization':`Bearer ${token}`},
                body: JSON.stringify({comment: newComment})
            });
        } catch(error){
            console.log('Erreur', error);
        }
    };


    function handleImgSubmit(e) {
        e.preventDefault();
        const newImg = inputImgRef.current.value;
        setImg(newImg)
    }

    ////////Route pour récupérer les commentaires
    useEffect(() => {
        (async() => {
            try{
                const token = localStorage.getItem('token')
                const response = await fetch('http://localhost:3000/allcomments',{
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    }
                })
                const data = await response.json();
                // console.log('recu', data);
                setComment( data)
            } catch(error){
                console.log('Erreur lors de la récupération des commentaires', error);
            }
        })()
    },[])

    return (
        <div className='App'>
            <div className='form'>
            <form onSubmit={handleImgSubmit}>
                <input type="url" ref={inputImgRef} placeholder='URL image'/>
                <button type='submit'>Add image</button>
            </form>
            <div className='image'>
            <img src={img} alt="Card" />
            </div>
            <div>
                <button onClick={handleLikeClic}>{like} Like</button>
            </div>
            <div className="comment">
                {comment.map((a, index) => (
                    <p style={{color:'red'}} key={index}>{a}</p>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit}>
                <input type="text" ref={inputRef} placeholder="Add a comment" />
                <button type='submit'>Add</button>
            </form>
        </div>
        </div>
    );
}