import React, { useState, useRef} from 'react';
import './App.css'

 export default function Card() {
    const [img, setImg] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEIW9c-rAXxxmLFlXMPtQUR3KNW4AOmQu8XA&s");
    const [effect, setEffect] = useState(0);
    const [comment, setComment] = useState(["very good",'bien', 'j\'aime bien']);
    const inputRef = useRef(null);
    const inputImgRef = useRef(null);

    const like = ()=>{
        if(effect == 0){
            setEffect(1)
        }else{
            setEffect(0)
        }
    }

    // const handleCommentSubmit = async (e) => {
    //     e.preventDefault();
    //     const newComment = inputRef.current.value.trim();
    //     setComment(arrayComment => [...arrayComment, newComment]);
    //     inputRef.current.value = "";
    //     try {
    //         const res = await fetch('http://localhost/comments',{
    //             method: 'POST',
    //             headers: {'Content-Type':'application/json'},
    //             body: JSON.stringify({comment: newComment})
    //         });
    //         const data = await res.json();
    //         console.log(data);
    //     } catch(error){
    //         console.log('Erreur', error);
    //     }
    // };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const newComment = inputRef.current.value.trim();
        if (newComment) {
            setComment(arrayComment => [...arrayComment, newComment]);
            inputRef.current.value = "";
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/comments', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: newComment })
                });
                const data = await res.json();
                console.log('Réponse du serveur:', data);
            } catch (error) {
                console.log('Erreur:', error);
            }
        }
    };


    function handleImgSubmit(e) {
        e.preventDefault();
        const newImg = inputImgRef.current.value;
        setImg(newImg)
    }

    // async function submit(e) {
    //     e.preventDefault();
    //     let data = {
    //         img: img,
    //         effect: effect,
    //         comment: comment
    //     };
    //     try {
    //         const res = await fetch('http://localhost/news',{
    //             method: 'POST',
    //             headers: {'Content-Type':'application/json'},
    //             body: JSON.stringify(data)
    //         });
    //         const data = await res.json();
    //         console.log('recu', data);
    //     } catch (error){
    //         console.log('Erreur', error);
    //     }
    // }


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
            <button onClick={like}>{effect}</button>
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