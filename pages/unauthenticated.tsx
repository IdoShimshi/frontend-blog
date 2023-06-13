import React from "react";
import Layout from "../components/Layout";


const Unauthenticated: React.FC = () => {
      return (
        <Layout>
          <div>You need to be logged in to view this page.</div>
        </Layout>
      );
}

export default Unauthenticated;
