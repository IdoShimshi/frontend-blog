import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getPublicIds } from "../mongoDB/videoCollection";
import { getLoginDetails, loginDetailsProp } from "./_app";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const loggedUserJSON = req.cookies.loginDetails
  let loginDetails:loginDetailsProp;
  if (!loggedUserJSON) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }else{
    loginDetails = JSON.parse(loggedUserJSON);
  }


  const drafts = await prisma.post.findMany({
    where: {
      author: { email: loginDetails.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  const postIdToPublicId = await getPublicIds(drafts.map((post) => post.id));
  const enrichedDrafts = drafts.map((post) =>({
    ...post,
    videoPublicId: postIdToPublicId[post.id],
  }));
  return {
    props: { enrichedDrafts },
  };
};

type Props = {
  enrichedDrafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null);
  useEffect(() => {
    const loginDetails = getLoginDetails();
    if (loginDetails)
    setLoginDetails(loginDetails);
  }, []);

  if (!loginDetails) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be logged in to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.enrichedDrafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
