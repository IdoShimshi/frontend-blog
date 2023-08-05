import React, { useEffect, useState } from "react";

const Video: React.FC<{ publicId: string }> = ({ publicId }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (publicId?.length > 0) {
      setShouldRender(true);
    }
  }, [publicId]);

  if (!shouldRender) {
    return null;
  }
  return (
    <video
      className={`${publicId.length === 0 ? "hidden" : "block m-4"}`}
      autoPlay
      controls
      muted
      src={`https://res.cloudinary.com/frontend-blog/video/upload/vc_auto,q_auto,w_800/${publicId}`}
    ></video>
  );
};

export default Video;
