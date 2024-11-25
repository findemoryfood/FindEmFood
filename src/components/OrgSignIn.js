// OrgSignIn.js
import React, { useState } from 'react';
import { writeUserInfo, getAllUsers } from '../firebaseUtils';

const OrgSignIn = ({ onLogin, isLoggedIn, user, onLogout }) => {
  const [username, setUsername] = useState(''); // Separate username field
  const [email, setEmail] = useState(''); // Separate email field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState(''); // For login only

  const toggleForm = () => setShowLogin(!showLogin);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check that all fields are filled out
    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }
    if (!email.endsWith('@emory.edu')) {
      alert('Please use an @emory.edu email to sign up.');
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and include at least one special character.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Check if the email already exists
      const allUsers = await getAllUsers();
      const emailExists = Object.values(allUsers).some((user) => user.email === email);

      if (emailExists) {
        alert('An account with this email already exists.');
        return;
      }

      // Create new user if email does not exist
      const userId = Math.random().toString(36).substr(2, 9);
      const userData = { username, email, password };
      await writeUserInfo(userId, userData);

      alert('Sign-up successful! Please log in.');
      setShowLogin(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred during sign-up. Please try again later.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      alert('Both fields are required');
      return;
    }

    try {
      const allUsers = await getAllUsers();
      const userData = Object.values(allUsers).find(
        (user) => user.email === usernameOrEmail || user.username === usernameOrEmail
      );

      if (userData && userData.password === password) {
        alert('Login successful');
        onLogin(userData);
      } else {
        alert('Invalid username/email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div>
      <h1>{showLogin ? 'User Login' : 'User Sign Up'}</h1>
      {isLoggedIn ? (
        <div>
          <p>You are logged in as <strong>{user.username}</strong>.</p>
          <button onClick={onLogout}>Log Out</button>
        </div>
      ) : (
        <form onSubmit={showLogin ? handleLogin : handleSignUp}>
          {!showLogin ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (@emory.edu)"
                required
              />
            </>
          ) : (
            <input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Email or Username"
              required
            />
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {!showLogin && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          )}
          <button type="submit">{showLogin ? 'Login' : 'Sign Up'}</button>
        </form>
      )}
      {!isLoggedIn && (
        <button onClick={toggleForm}>
          {showLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      )}
    </div>
  );
};

export default OrgSignIn;
