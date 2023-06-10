import { useState } from 'react';
import Router from "next/router";
import Cookies from 'js-cookie';


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
    
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
    if (response.status === 200) {
        const data = await response.json();
        const loginDetails = {token: data.token,
                              username: data.username,
                              name: data.name,
                              userId: data.id,
                              email: data.email
        }
        Cookies.set('loginDetails',JSON.stringify(loginDetails));
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
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        {loginFail ? "invalid username or password" : ""}
      </div>
    </div>
  );
};

export default LoginPage;
