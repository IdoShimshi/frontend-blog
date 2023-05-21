import { useState } from "react";
import Video from "../components/Video";



interface UploadProps {
    onUpload: (formData: FormData) => void;
    
  }

const Upload: React.FC<UploadProps> = ({onUpload}) => {
    const [videoName, setvideoName] = useState('');

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const formData = new FormData();
        const file = event.target.files?.[0];
        
        if (file) {
            formData.append('inputFile', file);
            onUpload(formData);
            setvideoName(file.name);
          }
      };

    let uploader;
    if (videoName === ''){
        uploader = 
        <div>
          <span className="mt-2 text-base text-black leading-normal">
            Select a video
          </span>
          <input type="file" onChange={onChange} className="hidden" />
        </div>
    }
    else{
        uploader =
        <div>
          <span className="mt-2 text-base text-black leading-normal">
            Selected  video: {videoName}
            {/* <div><Video publicId={publicId} /></div> */}
          </span>
        </div>
    }

      return (
        uploader
      )
};

export default Upload;
