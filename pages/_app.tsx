import { AppProps } from "next/app";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export type loginDetailsProp = {
  token?: string,
  email?: string,
  username?: string,
  name?: string,
  userId?: Number,
  image?: string
}

export const getLoginDetails = () => {
  let loginDetails: loginDetailsProp | undefined;
  const loggedUserJSON = Cookies.get("loginDetails");
  if (loggedUserJSON) {      
    loginDetails = JSON.parse(loggedUserJSON);
  }
  return loginDetails;
}

const App = ({ Component, pageProps }: AppProps) => {
  const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null)

  useEffect(() => {  
    const loggedUserJSON = Cookies.get('loginDetails');
    if (loggedUserJSON) {      
      const userDetails: loginDetailsProp = JSON.parse(loggedUserJSON);   
      console.log("signed in:",userDetails.username, userDetails.userId, userDetails.name)
      setLoginDetails(userDetails);
    }
    else{
      console.log("not signed in")
      setLoginDetails(null);
    }  
  }, [])

  return (
      <Component {...{...pageProps, loginDetails: loginDetails}} />
  );
};

export default App;
