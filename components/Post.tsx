import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Video from "./Video";
import Image from "./Image";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
    image: string | null,
    id: string
  } | null;
  content: string;
  published: boolean;
  videoPublicId: string
};


const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2 style={{ display: 'flex', alignItems: 'center' }}>
        {post.title}
        {post.author?.image && <div style={{width: '100px', height: '100px'}}><Image publicId={String(post.author.id)}/></div>}
        {post.videoPublicId && <img src="./video.png" alt="logo" style={{height: '30px', width: '30px', marginLeft: 'auto'}}/>}
      </h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <Video publicId={post.videoPublicId} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
