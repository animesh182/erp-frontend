import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Paperclip, Upload } from "lucide-react";

export const AttachmentsSection = ({ handleAddAttachment }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        // Create a synthetic event object with files to match the original handler
        const syntheticEvent = {
          target: {
            files: acceptedFiles,
          },
        };
        handleAddAttachment(syntheticEvent);
      }
    },
    [handleAddAttachment]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Set to true if you want multiple file uploads
  });

  return (
    <div className="mt-4">
      <h4 className="font-medium leading-none flex items-center gap-1">
        <Paperclip className="w-4 h-4" /> Attachments
      </h4>
      <div className="mt-2">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload
              className={`w-6 h-6 ${
                isDragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            {isDragActive ? (
              <p className="text-sm">Drop the files here...</p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload attachments related to this task
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
