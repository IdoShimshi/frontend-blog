import React, { useEffect, useState } from "react";
import Layout from "../components/Layout"
import { getLoginDetails, loginDetailsProp } from "../pages/_app";
import Router from "next/router";

const ProfilePage: React.FC = () => {

    const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null);
    const [editName, setEditName] = useState(false)
    const [name, setName] = useState();
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const handleSubmit = async (event: React.FormEvent) => {
        if(name==''){
            console.log("name cannot be empty!")
            return
        }
        const username = loginDetails?.username
        const email = loginDetails.email
        console.log(name)
        const response = await fetch('/api/auth/editprofile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, name }),
          });
          console.log(response)
          if (response.status === 200) {
            const data = await response.json();
            console.log('Sign up successful!');
            // await Router.push("/")
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.error;
            console.log('Sign up failed. Error:', errorMessage);
            // setSignupFailMessage(errorMessage);
          }
    }
    useEffect(() => {
        const loginDetails = getLoginDetails();
        if (loginDetails)
        setLoginDetails(loginDetails);
        setName(loginDetails.name)
      }, []);

    if(!loginDetails){
        return;
    }
    return(
        <Layout>
            <div>
                <h1>My Profile Page</h1>{console.log(loginDetails)}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <label htmlFor="username" style={{ marginRight: '0.5rem', width: '80px' }}>Username:</label>
                        <input
                        type="text"
                        id="username"
                        value={loginDetails?.username}
                        style={{ flex: 1, maxWidth: '200px' }}
                        readOnly
                        />
                    </div>
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ marginRight: '0.5rem', width: '80px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={loginDetails?.email}
                        style={{ flex: 1, maxWidth: '200px' }}
                        readOnly
                    />
                    </div>
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
                    <label htmlFor="name" style={{ marginRight: '0.5rem', width: '80px' }}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        style={{ flex: 1, maxWidth: '200px' }}
                    />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem', width: '289px' }}>Save</button>
                </form>
            </div>
        </Layout>
    )
}

export default ProfilePage;