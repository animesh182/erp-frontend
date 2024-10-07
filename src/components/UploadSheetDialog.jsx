"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import { useGeneratePayroll } from "@/sevices/usePayrollServices";

export function UploadSheetDialog() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const { mutate: uploadPayroll } = useGeneratePayroll();
  // const handleUpload = async () => {
  //   if (file) {
  //     setIsUploading(true);
  //     try {
  //       // Simulating file upload process
  //       const formData = new FormData();
  //       formData.append('file', file);
  
  //       // Call the upload function from the mutation
  //        uploadPayroll(formData); 

  //       // Process the file here
  //       console.log("Processing file:", file.name);

  //       // Show success message
  //       toast.success("Payroll sheet uploaded successfully");

  //       setIsOpen(false);
  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //       toast.error("Failed to upload payroll sheet");
  //     } finally {
  //       setIsUploading(false);
  //     }
  //   }
  // };


  const handleUpload = () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file); // Make sure this key matches what the API expects
  
      // Call the upload function from the mutation
      uploadPayroll(formData, {
        onSuccess: (newData) => {
          console.log("Upload successful:", newData);
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          toast.error("Failed to upload payroll sheet");
        },
        onSettled: () => {
          setIsUploading(false);
        },
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsOpen(true)}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Upload Payroll Sheet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Payroll Sheet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              id="picture"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
            />
            <Button
              onClick={handleUpload}
              className="gap-2"
              disabled={!file || isUploading}
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
