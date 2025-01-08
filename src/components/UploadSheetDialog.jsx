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
import { createPayroll } from "@/app/api/finances/payroll/createPayroll";
import { uploadExpense } from "@/app/api/expense/uploadExpense";
import { uploadRevenue } from "@/app/api/revenue/uploadRevenue";

export function UploadSheetDialog({
  isExpense=false,
  isRevenue=false,
  onRefresh
}) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  

  const handleUploadPayroll = async () => {
    if (file) {
      // console.log(file, "file");
      setIsUploading(true);
      try {
        const response = await createPayroll(file);

        toast.success("Payroll sheet uploaded successfully");
        if (onRefresh) {
          onRefresh(); // Trigger the refresh function passed as a prop
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error.message || "Failed to upload payroll sheet");
      } finally {
        setIsUploading(false);
        setIsOpen(false)
      }
    }
  };
  const handleUploadExpense = async () => {
    if (file) {
      // console.log(file, "file");
      setIsUploading(true);
      try {
        const response = await uploadExpense(file);

        toast.success(response.message ||"Expense sheet uploaded successfully");
        if (onRefresh) {
          onRefresh(); // Trigger the refresh function passed as a prop
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error( error.message  || "Failed to upload expense sheet");
      } finally {
        setIsUploading(false);
        setIsOpen(false)
      }
    }
  };
  const handleUploadRevenue = async () => {
    if (file) {
      // console.log(file, "file");
      setIsUploading(true);
      try {
        const response = await uploadRevenue(file);

        toast.success(response.message ||"Revenue sheet uploaded successfully");
        if (onRefresh) {
          onRefresh(); // Trigger the refresh function passed as a prop
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error.message || "Failed to upload revenue sheet");
      } finally {
        setIsUploading(false);
        setIsOpen(false)
      }
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
          {isExpense?"Upload Expense Sheet":isRevenue?"Upload Revenue Sheet":"Upload Payroll Sheet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isExpense?"Upload Expense Sheet":isRevenue?"Upload Revenue Sheet":"Upload Payroll Sheet"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
          <Input
              id="picture"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors text-black"
            />
            <Button
              onClick={isExpense ? handleUploadExpense :isRevenue? handleUploadRevenue: handleUploadPayroll}
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
