// import { useState, useEffect } from 'react';
// import '../App.css';

// const Blogs = () => {
//   const [user, setUser] = useState([]);

//   useEffect(() => {
//     ( async () => {
//       const response = await fetch('http://localhost:3000/user',{
//         headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`, 'content-Type': 'application/json'}
//       })
//       const data = await response.json()
//       // setUser(response[0].firstName)
//       setUser(data)

//       console.log(response);
//     })()
//   },[])

//     return(
//       <div className='Home'>
//         <h1>Les articles de </h1>
//        {
//         user.map((u) => (
//           <h3>{u.firstName} {u.lastName}</h3>
//         ))}
//     </div>
//   );
// };

  
//   export default Blogs;


import { useState, useEffect } from 'react';
import '../App.css';

const Blogs = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);

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
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    })();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='Home'>
      <h1>Les articles de </h1>
      {user.map((u) => (
        <h3 key={u._id}>{u.firstName} {u.lastName}</h3>
      ))}
    </div>
  );
};

export default Blogs;
