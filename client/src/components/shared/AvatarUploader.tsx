import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type AvatarUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const AvatarUploader = ({ fieldChange, mediaUrl }: AvatarUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setfileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setfileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()} className="flex  flex-col">
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex items-center gap-4 lg:gap-8 justify-st w-full">
            <img
              src={fileUrl}
              alt="avatar"
              className="rounded-full cursor-pointer object-cover aspect-square"
              width={100}
              height={100}
            />
            <a className="cursor-pointer text-sky-400 h5">
              Change profile photo
            </a>
          </div>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
