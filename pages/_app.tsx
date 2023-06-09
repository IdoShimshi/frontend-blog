import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useState } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const [token, setToken] = useState(null)
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...{...pageProps, token: token, setToken: setToken}} />
    </SessionProvider>
  );
};

export default App;
