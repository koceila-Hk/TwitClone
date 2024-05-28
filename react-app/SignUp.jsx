import React, {useState} from "react";
import validateEmail from "./src/utils";
import { useNavigate } from "react-router-dom";


// Composant pour afficher le message d'erreur pour le mot de passe
const PasswordErrorMessage = () => { 
    return ( 
      <p className="FieldError">Password should have at least 8 characters</p> 
    ); 
  };
  
  
// Composant pour la page d'inscription
const SignUp = () => {
    const [firstName, setFirstName] = useState(""); 
    const [lastName, setLastName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    const navigate = useNavigate();

    const getIsFormValid = () => { 
      return ( 
        firstName && lastName && validateEmail(email) && password.length >= 8); 
    };
  
    const Submit = async (e) => { 
      e.preventDefault();
  
      let dataBody = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      };
  
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(dataBody),
        });
        if (response.status === 200) {
            navigate('/login');
        }
        // const data = await response.json();
      } catch(error) {
        console.error('Error', error);
      }
    };
  
    return (
      <div className="App">
        <div className="form">
        <form onSubmit={Submit}>
          <fieldset>
            <h2>Sign Up</h2>
            <div className="Field">
              <label>
                First name <sup>*</sup>
              </label>
              <input 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="First name" 
              /> 
            </div>
            <div className="Field">
              <label>Last name</label>
              <input 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Last name" 
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