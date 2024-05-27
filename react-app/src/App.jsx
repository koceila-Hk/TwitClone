import React, { useState } from 'react';
import './App.css';
import { validateEmail } from './utils';

// Composant pour afficher le message d'erreur pour le mot de passe
const PasswordErrorMessage = () => { 
  return ( 
    <p className="FieldError">Password should have at least 8 characters</p> 
  ); 
};

// Composant pour la page d'inscription
const SignUp = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState({ 
    value: "", 
    isTouched: false, 
  }); 
  const [role, setRole] = useState("role");

  const getIsFormValid = () => { 
    return ( 
      firstName && 
      validateEmail(email) && 
      password.value.length >= 8 && 
      role !== "role" 
    ); 
  };

  const clearForm = () => { 
    setFirstName(""); 
    setLastName(""); 
    setEmail(""); 
    setPassword({ 
      value: "", 
      isTouched: false, 
    }); 
    setRole("role"); 
  };

  const Submit = async (e) => { 
    e.preventDefault();

    let dataBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password.value,
      role: role
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(dataBody),
      });
      const data = await response.json();
      console.log(data);
      clearForm();
    } catch(error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="App">
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
              value={password.value} 
              type="password" 
              onChange={(e) => setPassword({ ...password, value: e.target.value })} 
              onBlur={() => setPassword({ ...password, isTouched: true })} 
              placeholder="Password" 
            /> 
            {password.isTouched && password.value.length < 8 ? <PasswordErrorMessage /> : null}
          </div>
          <div className="Field">
            <label>
              Role <sup>*</sup>
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)}> 
              <option value="role">Role</option> 
              <option value="individual">Individual</option> 
              <option value="business">Business</option> 
            </select>
          </div>
          <button type="submit" disabled={!getIsFormValid()}> 
            Create account 
          </button>
        </fieldset>
      </form>
      <button onClick={onSwitchToLogin}>Login</button>
    </div>
  );
};

// Composant pour la page de connexion
const Login = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  const Submit = async (e) => { 
    e.preventDefault();

    let dataBody = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(dataBody),
      });
      const data = await response.json();
      console.log(data);
    } catch(error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={Submit}>
        <fieldset>
          <h2>Login</h2>
          <div className="Field">
            <label>Email address</label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email address" 
            /> 
          </div>
          <div className="Field">
            <label>Password</label>
            <input 
              value={password} 
              type="password" 
              onChange={(e) => setPassword
                (e.target.value.staus )}

              placeholder="Password" 
            />
          </div>
          <button type="submit">Login</button>
        </fieldset>
      </form>
      <button onClick={onSwitchToSignUp}>Sign Up</button>
    </div>
  );
};

// Composant principal pour gérer l'affichage des pages
const App = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);

  return isLoginPage ? (
    <Login onSwitchToSignUp={() => setIsLoginPage(false)} />
  ) : (
    <SignUp onSwitchToLogin={() => setIsLoginPage(true)} />
  );
};

export default App;
