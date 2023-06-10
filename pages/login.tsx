import { useState } from 'react';
import Router from "next/router";
import Layout from "../components/Layout";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginFail, setloginFail] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
    if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        console.log('Login successful! Token:', token, data.username, data.name);
        const loginDetails = {
          token: data.token,
          username: data.username,
          name: data.name,
          userId: data.id
        }
        window.localStorage.setItem('loginDetails', JSON.stringify(loginDetails));
        await Router.push("/");
    }
    else {
        const errorData = await response.json();
        const errorMessage = errorData.error;
        console.log('Login failed. Error:', errorMessage);
        setloginFail(true);
        // TODO: Handle login failure
    }

    // Reset form fields
    setUsername('');
    setPassword('');
  };

  return (
    <Layout>
      <div>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: '1rem', width: '25%' }}>
            <label htmlFor="username" style={{ marginRight: '0.5rem', width: '80px' }}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem', width: '25%' }}>
            <label htmlFor="password" style={{ marginRight: '0.5rem', width: '80px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              style={{ flex: 1 }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', width: '25%' }}>Login</button>
        </form>
        <div>
          {loginFail ? "Invalid username or password" : ""}
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;