import React, { useEffect, useState } from "react";

const Video: React.FC<{ publicId: string }> = ({ publicId }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const handleVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };
  useEffect(() => {
    if (publicId.length > 0) {
      setShouldRender(true);
    }
  }, [publicId]);

  if (!shouldRender) {
    return null;
  }
  return (<>
    {/* {videoLoading && "Loading............................"} Render the spinner if videoLoading is true */}
    <video
      className={`${publicId.length === 0 ? "hidden" : "block m-4"}`}
      autoPlay
      controls
      muted
      src={`https://res.cloudinary.com/frontend-blog/video/upload/vc_auto,q_auto,w_800/${publicId}`}
      onLoadedData={handleVideoLoad}
      onLoadedMetadata={handleVideoLoad}
      onLoadStart={handleVideoLoadStart}
    ></video>
    </>
  );
};

export default Video;
