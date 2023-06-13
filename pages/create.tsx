import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Upload from "../components/Upload";
import Router from "next/router";
import { getLoginDetails, loginDetailsProp } from "./_app";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loginDetails, setLoginDetails] = useState<loginDetailsProp | null>(null);
  useEffect(() => {
    const loginDetails = getLoginDetails();
    if (loginDetails)
    setLoginDetails(loginDetails);
  }, []);

  const [formData, setFormData] = useState(new FormData());
  const handleUpload = (videoFormData : FormData) => setFormData(videoFormData);

  const uploadVideo = async (formData : FormData, postId : string) =>{
    formData.append('postId', postId);
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    }); 
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, loginDetails };
      const response = await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      uploadVideo(formData,data.id);

      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
            autoFocus
          />
          
          <Upload onUpload={handleUpload} />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
