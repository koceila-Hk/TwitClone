import React, {useState} from "react";
import validateEmail from "../utils";
import { useNavigate } from "react-router-dom";


// Composant pour afficher le message d'erreur pour le mot de passe
const PasswordErrorMessage = () => { 
    return ( 
      <p className="FieldError">Password should have at least 8 characters</p> 
    ); 
  };
  
  
// Composant pour la page d'inscription
const SignUp = () => {
    const [username, setUsername] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [errorMessage, setEroorMessage] = useState('');

    const navigate = useNavigate();

    const getIsFormValid = () => { 
      return ( 
        username && validateEmail(email) && password.length >= 8); 
    };
  
    const Submit = async (e) => { 
      e.preventDefault();
  
      let dataBody = {
        username: username,
        email: email,
        password: password,
      };
  
      try {
        const response = await fetch('http://localhost:3000/auth/create-user', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(dataBody),
        });
        const data = await response.json();
        if (response.status === 400) {
            setEroorMessage(data);
        } else if (response.status === 200) {
          navigate('/login');
        }
      } catch(error) {
        console.error('Error', error);
      }
    };
  
    return (
      <div className="App">
        <div className="form-register">
        <form onSubmit={Submit}>
          <fieldset>
            <h2>Sign Up</h2>
            <div className="Field">
              <label>
                User name<sup>*</sup>
              </label>
              <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="User name" 
              /> 
            </div>
            <div className="Field">
              <label>
                Email address <sup>*</sup>
              </label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
              /> 
            </div>
            <div className="Field">
              <label>
                Password <sup>*</sup>
              </label>
              <input 
                value={password} 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
              /> 
              {password.length < 8 ? <PasswordErrorMessage /> : null}
            </div>
            <p style={{color:'red'}}>{errorMessage}</p>
            <button type="submit" disabled={!getIsFormValid()}> 
              Create account 
            </button>
          </fieldset>
        </form>
        <button onClick={()=>navigate('/login')}>Login</button>
      </div>
      </div>
    );
  };

export default SignUp;