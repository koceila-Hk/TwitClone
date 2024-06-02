import React, { useState, useRef, useEffect} from 'react';
import './App.css'

 export default function Card() {
    const [img, setImg] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEIW9c-rAXxxmLFlXMPtQUR3KNW4AOmQu8XA&s");
    const [like, setLike] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [comment, setComment] = useState([]);
    const inputRef = useRef(null);
    const inputImgRef = useRef(null);


    //////// Route Post pour insérer les likes
    async function handleLikeSubmit(e) {
        e.preventDefault();
        if (!hasLiked) {
            const nwLike = like + 1;
            setLike(nwLike)
            setHasLiked(true);
        }
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/likes',{
                method: 'POST',
                headers:{'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
                body: JSON.stringify({like: nwLike})
            })
            const data = await response.json();
            // console.log({'recu': data});
        } catch(error){
            console.log('Error insert like');
        }
    };

    ////// Route Get pour récupérer les likes
    useEffect(() => {
        (async() => {
            try {
                const response = await fetch('http://localhost:3000/allLikes',{
                    headers:{'Content-Type':'application/json'},
                })
                const data = await response.json();
                console.log('allLikes',data);
                setLike(data);
            } catch(error){
                console.log('Erreur lors de la récupérations des likes', error);
            }
        })();
    },[]);

    //////// Handle img submit
    function handleImgSubmit(e) {
        e.preventDefault();
        const newImg = inputImgRef.current.value;
        setImg(newImg)
    }


    ////////Route POST pour insérer les commentaires
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

    ////////Route pour récupérer les commentaires
    useEffect(() => {
        (async() => {
            try{
                const response = await fetch('http://localhost:3000/allcomments',{
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                const data = await response.json();
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
                <form onSubmit={handleLikeSubmit}>
                    <button type='submit'><span style={{padding:'5px'}}>{like}</span>like</button>
                </form>
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