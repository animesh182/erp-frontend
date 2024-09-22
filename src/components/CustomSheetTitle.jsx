import react from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
const CustomSheetTitle = ({ title, subtitle }) => {
  return (
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
      <SheetDescription>{subtitle}</SheetDescription>
    </SheetHeader>
  );
};

export default CustomSheetTitle;
