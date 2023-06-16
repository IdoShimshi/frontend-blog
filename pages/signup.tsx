import { useState } from 'react';
import Layout from "../components/Layout";
import Router from "next/router";

const SignupPage: React.FC = () => {
  const errors_dict = {
    "username_errors":
      { "empty_username": "Username must not remain empty" },
    "password_errors":
      { "empty_password": "Password must not remain empty" },
    "email_errors":
    {
      "empty_email": "Email must not remain empty",
      "invalid_mail_format": "Invalid mail format"
    },
    "name_errors":
      { "empty_name": "Name must not remain empty" }
  };

  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [signupFailMessage, setSignupFailMessage] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);

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

  const validateSignup = () => {
    // username validity
    const username_errors = [];
    if (username === '') {
      username_errors.push("empty_username");
    }
    // email validity
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const email_errors = [];
    if (email === '') {
      email_errors.push("empty_email");
    }
    if (!emailRegex.test(email)) {
      email_errors.push("invalid_mail_format");
    }
    // password validity
    const password_errors = [];
    if (password === '') {
      password_errors.push("empty_password");
    }
    // name validity
    const name_errors = [];
    if (name === '') {
      name_errors.push("empty_name");
    }
    const all_errors = {
      "username_errors": username_errors,
      "email_errors": email_errors,
      "password_errors": password_errors,
      "name_errors": name_errors
    };
    let error_flag = false;
    for (let some_field_errors in all_errors) {
      if (all_errors[some_field_errors].length > 0) {
        console.log(error_flag)
        error_flag = true;
        break;
      }
    }
    return [all_errors, error_flag];
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setErrors({});
    setErrorFlag(false);
    event.preventDefault();
    // TODO: Add your sign-in logic here
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('Name:', name);

    const errors_received = validateSignup();
    if (errors_received[1]) {
      setErrors(errors_received[0]);
      setErrorFlag(true);
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email, name }),
    });


    if (response.status === 200) {
      const data = await response.json();
      console.log('Sign up successful!');
      await Router.push("/login");
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.error;
      console.log('Sign up failed. Error:', errorMessage);
      setSignupFailMessage(errorMessage);
    }

    // Reset form fields
    // do we want to reset at all? 200 status redirects to login page anyway
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
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ marginRight: '0.5rem', width: '80px' }}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className={errorFlag && errors.username_errors && errors.username_errors.length > 0 ? 'error' : ''}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            {errorFlag && errors.username_errors && (
              <span className="error-message">
                {errors.username_errors
                  .map(error => errors_dict.username_errors[error])
                  .join(', ')}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ marginRight: '0.5rem', width: '80px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className={errorFlag && errors.password_errors && errors.password_errors.length > 0 ? 'error' : ''}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            {errorFlag && errors.password_errors && (
              <span className="error-message">
                {errors.password_errors
                  .map(error => errors_dict.password_errors[error])
                  .join(', ')}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ marginRight: '0.5rem', width: '80px' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={errorFlag && errors.email_errors && errors.email_errors.length > 0 ? 'error' : ''}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            {errorFlag && errors.email_errors && (
              <span className="error-message">
                {errors.email_errors
                  .map(error => errors_dict.email_errors[error])
                  .join(', ')}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ marginRight: '0.5rem', width: '80px' }}>Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className={errorFlag && errors.name_errors && errors.name_errors.length > 0 ? 'error' : ''}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            {errorFlag && errors.name_errors && (
              <span className="error-message">
                {errors.name_errors
                  .map(error => errors_dict.name_errors[error])
                  .join(', ')}
              </span>
            )}
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', width: '289px' }}>Sign Up</button>
        </form>
        <div>
          {/* maybe change to alert */}
          {signupFailMessage}
        </div>
      </div>

      <style jsx>{`
        .error {
          border: 1px solid red;
        }
        .error-message {
          color: red;
          margin-left: 0.5rem;
        }
      `}</style>
    </Layout>
  );
};

export default SignupPage;