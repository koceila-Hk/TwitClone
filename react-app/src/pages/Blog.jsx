import { useState, useEffect } from 'react';
import '../App.css';

const Blogs = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response) {
          console.log('Unauthorized');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className='Home'>
      <h1>Les articles de {user.firstName} {user.lastName}</h1>
    </div>
  );
};

export default Blogs;
