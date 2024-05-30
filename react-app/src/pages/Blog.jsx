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

        if (response.status === 401) {
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
      <h1>Les articles de </h1>
      {user.map((u) => (
        <h3>{u.firstName} {u.lastName}</h3>
      ))}
    </div>
  );
};

export default Blogs;
