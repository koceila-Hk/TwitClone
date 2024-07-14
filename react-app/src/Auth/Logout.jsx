import React from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/auth/sign-out', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`},
            });
            const data = await response.json();
            console.log(data.message);
            if (response.ok) { 
                localStorage.removeItem('token');
                setTimeout(() => {
                    navigate('/login');
                },3000)
            }
        } catch (error) {
            console.log('Error logging out', error);
        }
    };

    React.useEffect(() => {
        handleLogout();
    }, []);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;
