import React, { useEffect, useState } from "react";
import cloudinary from 'cloudinary';

const Video: React.FC<{ publicId: string }> = ({ publicId }) => {
    const [videoPublicId, setPublicId] = useState(publicId);
    useEffect(() => {
      setPublicId(publicId);
    }, [publicId]);
    if (videoPublicId.length === 0) {
      return <>noVid</>;
    }
    return (
      <video
        className={`${videoPublicId.length === 0 ? "hidden" : "block m-4"}`}
        autoPlay
        controls
        muted
        src={`https://res.cloudinary.com/frontend-blog/video/upload/vc_auto,q_auto,w_800/${videoPublicId}`}
      ></video>
    );
};

export default Video;
