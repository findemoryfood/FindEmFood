//login

import React, {userState} from 'react';
import {getUserInfo } from '../firebaseUtils';

const UserLogin =() => {
    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');

    const handleLogin = async (e) =>{
        e.preventDefault();

        if (!email || !password){
            alert("Both fields are required");
            return;
        }

        try {
            const userData = await getUserInfo(email);

            if(userData && userData.password == password){
                alert("Login successful");
            }else{
                alert("Invalid email or password");
            }
        } catch (error){
            console.error("Error during login:", error);
            alert("An error occurred during login");
        }
    };

    return (
        <div>
            <h1>User Login</h1>
            <form onSubmit ={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange ={(e) => setEmail(e.target.value)}
                    placeholder ="Email"
                    required
                    />
                <input
                    type="password"
                    value={password}
                    onChange ={(e) => setPassword(e.target.value)}
                    placeholder ="Password"
                    required
                    />
                <button type = "submit">Login</button>                
            </form>
        </div>
    );
};

export default UserLogin;