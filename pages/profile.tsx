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
        await formData.append('userId', userId);
        await fetch('/api/uploadimage', {
          method: 'POST',
          body: formData,
        }); 
      }

    const deleteImage = async (event: React.FormEvent) =>{
        event.preventDefault();
        const requestBody = {
            email: loginDetails?.email,
            name: loginDetails?.name,
            hasFormData: null
          };
        const response = await fetch('/api/auth/editprofile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });

          const response_delete_image = await fetch(`/api/image/${loginDetails?.userId}`, {
            method: "DELETE",
          });
          if(response){
            Cookies.set('loginDetails',JSON.stringify({...loginDetails, image: null}));
            window.location.href = `/profile`;
          }
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
        const requestBody = {
            email: email,
            name: name,
            hasFormData: Boolean(formData)
          };
        const response = await fetch('/api/auth/editprofile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });
          if (response.status === 200) {
            const data = await response.json();
            if(formData){
                uploadImage(event, formData,data.id);
                Cookies.set('loginDetails',JSON.stringify({...loginDetails, name: name, image: "1"}));
              }
            else{
                Cookies.set('loginDetails',JSON.stringify({...loginDetails, name: name}));
            }
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
                        <label htmlFor="name" style={{ marginRight: '0.5rem', width: '80px'}}>Image:</label>
                        {loginDetails?.image && <div style={{ display: 'flex' }}>
                            <div style={{width: '30px', height: '30px'}}>
                                <Image publicId={String(loginDetails.userId)}/>
                            </div>
                            <div style={{ marginLeft: '50px'}}>
                                <button onClick={deleteImage}>Delete image</button>
                            </div>
                        </div>}
                        {!loginDetails?.image && <UploadImage onUploadImage={handleUploadImage} />}
                        
                    </div>
                    <button data-testid="save-button" type="submit" style={{ padding: '0.5rem 1rem', width: '289px' }}>Save</button>
                </form>
            </div>
        </Layout>
    )
}

export default ProfilePage;