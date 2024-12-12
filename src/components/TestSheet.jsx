import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DatePicker } from "./DatePicker";

export default function TestSheet() {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <h1>Hello</h1>
        <DatePicker />
      </SheetContent>
    </Sheet>
  );
}
