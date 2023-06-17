import { useState } from "react";



interface UploadImageProps {
    onUploadImage: (formData: FormData) => void;
    
  }

const UploadImage: React.FC<UploadImageProps> = ({onUploadImage}) => {
    const [imageName, setimageName] = useState('');

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const formData = new FormData();
        const file = event.target.files?.[0];
        
        if (file) {
            formData.append('inputFile', file);
            onUploadImage(formData);
            setimageName(file.name);
          }
      };

    let UploadImageer;
    if (imageName === ''){
        UploadImageer = 
        <div>
          <span className="mt-2 text-base text-black leading-normal">
            Select an image
          </span>
          <input type="file" onChange={onChange} className="hidden" />
        </div>
    }
    else{
        UploadImageer =
        <div>
          <span className="mt-2 text-base text-black leading-normal">
            Selected image: {imageName}
            {/* <div><Video publicId={publicId} /></div> */}
          </span>
        </div>
    }

      return (
        UploadImageer
      )
};

export default UploadImage;
