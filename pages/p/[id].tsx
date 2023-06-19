import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from '../../lib/prisma'
import { getPublicIds } from "../../mongoDB/videoCollection";
import Video from "../../components/Video";
import { getLoginDetails, loginDetailsProp } from "../_app";
import Image from "../../components/Image";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true, id: true, image: true },
      },
    },
  });
  if (post){
    const postIdToPublicId = await getPublicIds([post].map((post) => post.id));
    const enrichedpost = [post].map((post) =>({
    ...post,
    videoPublicId: postIdToPublicId[post.id],
    }))[0];
    return {
      props: enrichedpost ?? { author: { name: "Me" } }
    }
  }
  

  return {
    props: post ?? { author: { name: "Me" } }
  };
};

async function publishPost(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/")
}

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/")
}

const Post: React.FC<PostProps> = (props) => {
  const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null);
  useEffect(() => {
    const loginDetails = getLoginDetails();
    if (loginDetails)
    setLoginDetails(loginDetails);
  }, []);
  
  const userLoggedIn = Boolean(loginDetails);
  const postBelongsToUser = loginDetails?.email === props.author?.email;
  let title = props.title;
  console.log(props);
  if (!props.published) {
    title = `${title} (Draft)`;
  }
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        {props.author?.image && <div style={{width: '100px', height: '100px'}}><Image publicId={String(props.author.id)}/></div>}
        <ReactMarkdown children={props.content} />
        <div><Video publicId={props.videoPublicId} /></div>
        {!props.published && userLoggedIn && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userLoggedIn && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
