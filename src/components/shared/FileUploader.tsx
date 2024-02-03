import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";   // ye line aur iske uuper waali line hamne react-dopzone ke doc se exect copy karke yaha likhi h
// ye file hamari kisi bhi photo ko upload karne ke liye use ho rahi h aur is uploading function ko use karne ke liye hame react ka ak function use karna hoga jise install karme ke liye ham code likhenge 
// npm install react-dropzone
// ye code se ham drag drop karke apni photos ko upload kar sakte h add photo ke section me  
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  // filedchange files ko file naam ke array se get karega aur ye fieldChange hamne ak function banaya h to hame ye batana hoga ki ye kuch return karega ya nahi to ye return me (void) mean kuch bhi return nahi karega 
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  //{ fieldChange, mediaUrl } ye varaible hamne postform file se yaha prop ke through pass karaye h aur in dono file ka type hoga ( FileUploaderProps is function me hamne in dono file ka type define kar rakha h ) type dena bahut jarruri h nahi to error show kar dega varaible ki varaible define nahi h

  const [file, setFile] = useState<File[]>([]);  // jo file as input a rahe h uploader me wo is varaible me aakar store hogi array ki form me  aur uska url neeche ke varaible me 
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);   // jo file hamne upload ki h uska url ham is mediaurl varaible se get kar rahe jo postform file se passs kiya gaya h jisse agar us post ka image pahlse hi hamare bacend me store h to wo waha se fetch hoke initially is us image form section me render hone lage form me aur agara koi post ka data store nahi mena koi image store nahi h to koi image render nahi hogi us image form section me 

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // jo files ham accept kar rahe h as input unka type (FileWithPath[])ye function define kar raha h jo ki khud react-dropzone ka defined function h isko import kar lenege website se 
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);   // pending to understand
      setFileUrl(convertFileToUrl(acceptedFiles[0]));   // (acceptedFiles[0])uploaded file me jo first file hogi image ki usko file se (url) me convert karo aur (setFileUrl)me store kara do
          //convertFileToUrl ye function hamne import karaya h utils.ts file se 
    },
    [file]   // is function ki dependency hogi hamari uploaded file file cahange than its properties get change 
  );

  const { getRootProps, getInputProps } = useDropzone({  // ye line dropzone website se copy ki h 
    onDrop,
    accept: {   // image me kis tarike ki files acccept karna chhahte to wo khud likhni padegi
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 border-dashed border-2 border-sky-500 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer " />
       {/* ye uuper ki lines hamne react-dropzone site ke doc se copy ki h  */}
      {fileUrl ? (    // ye ak usestate h jisme hamne ternary operator lagaya h jo ye batayega ki agar fileurl mean jo file hamne drag karke upload ki thi wo upload ho gayi to ye just neeche wala code cahalo
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
             {/* agar hamare dragdrop option me koi file upload ho jaati to wo is (fileUrl)varaible me aake save hogi to yahi se ham us image ko leke is dragdrag waale option me upload ki hui file ko render kar sakte h  */}
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (   // aur agar file upload nahi hui to ye neeche ka code chalo // ye neeche waali line me bas hamne kuch text likha hua h aur ak image icon ki pho render ho rahi h jo always render hoti  rahegi jab tak is dragdraop waale opption me koi file na upload ki jaaye 
        <div className="file_uploader-box border-dashed ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;