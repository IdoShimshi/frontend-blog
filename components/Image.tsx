import React, { useEffect, useState } from "react";

const Image: React.FC<{ publicId: string }> = ({ publicId }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    console.log(String(publicId).length)
    if (publicId.length > 0) {
      setShouldRender(true);
    }
  }, [publicId]);

  if (!shouldRender) {
    console.log("shouldnt render")
    return null;
  }
  return (
    <><img
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className={`${publicId.length === 0 ? "hidden" : "block m-4"}`}
        src={`https://res.cloudinary.com/frontend-blog/image/upload/vc_auto,q_auto,w_800/${publicId}`}
    />{console.log(publicId)}</>
  );
};

export default Image;
