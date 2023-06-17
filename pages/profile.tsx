import React, { useEffect, useState } from "react";
import Layout from "../components/Layout"
import { getLoginDetails, loginDetailsProp } from "../pages/_app";
import Cookies from 'js-cookie';
import UploadImage from "../components/UploadImage";
import prisma from '../lib/prisma'
import Image from "../components/Image";


const ProfilePage: React.FC = (props) => {

    const [editName, setEditName] = useState(false)
    const [formData, setFormData] = useState<FormData | null>(null);

    const handleUploadImage = (imageFormData : FormData) => setFormData(imageFormData);
    const [name, setName] = useState('');
    const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const uploadImage = async (event: React.FormEvent, formData : FormData, userId : string) =>{
        event.preventDefault();
        formData.append('userId', userId);
        await fetch('/api/uploadimage', {
          method: 'POST',
          body: formData,
        }); 
      }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(name==''){
            console.log("name cannot be empty!")
            return;
        }
        if (!loginDetails){
            console.log("not logged in!")
            return;
        }
        const email = loginDetails.email
        const response = await fetch('/api/auth/editprofile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name }),
          });
          if (response.status === 200) {
            const data = await response.json();
            if(formData){
                uploadImage(event, formData,data.id);
              }
            console.log('Edit profile successful!');
            Cookies.set('loginDetails',JSON.stringify({...loginDetails, name: name}));
            window.location.href = `/profile`;
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.error;
            console.log('Edit profile failed. Error:', errorMessage);
            // setSignupFailMessage(errorMessage);
          }
    }
    useEffect(() => {
        const loginDetails = getLoginDetails();
        if (loginDetails){
            setLoginDetails(loginDetails);
            if(loginDetails.name)
                setName(loginDetails.name)
        }
      }, []);

    if(!loginDetails){
        return <div></div>;
    }
    return(
        <Layout>
            <div>
                <h1>My Profile Page</h1>
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
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <label htmlFor="name" style={{ marginRight: '0.5rem', width: '80px' }}>Image:</label>
                        <div>
                            <Image publicId={String(loginDetails.userId)} />
                        </div>
                        <UploadImage onUploadImage={handleUploadImage} />
                        
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem', width: '289px' }}>Save</button>
                </form>
            </div>
        </Layout>
    )
}

export default ProfilePage;