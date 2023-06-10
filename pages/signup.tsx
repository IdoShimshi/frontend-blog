import { useState } from 'react';
import Layout from "../components/Layout";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add your sign-in logic here
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('Name:', name);
    // Reset form fields
    setUsername('');
    setPassword('');
    setEmail('');
    setName('');
  };

  return (
    <Layout>
      <div>
        <h1>Sign Up Page</h1>
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
          <div style={{ display: 'flex', marginBottom: '1rem', width: '25%'  }}>
            <label htmlFor="password" style={{ marginRight: '0.5rem', width: '80px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem', width: '25%'  }}>
            <label htmlFor="email" style={{ marginRight: '0.5rem', width: '80px' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem', width: '25%'  }}>
            <label htmlFor="name" style={{ marginRight: '0.5rem', width: '80px' }}>Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              style={{ flex: 1 }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', width: '25%'  }}>Sign Up</button>
        </form>
      </div>
    </Layout>
  );
};

export default SignupPage;