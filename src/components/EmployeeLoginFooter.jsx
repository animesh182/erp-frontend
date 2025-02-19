// import Link from "next/link";
import React from "react";

function EmployeeLoginFooter() {
  return (
    <div className="flex  gap-4 text-[#64748B] text-xs font-medium absolute bottom-5">
      <div>© {new Date().getFullYear()} Avinto AS</div>
      {/* <Link href="/"><u>Privacy Policy</u></Link>
    <Link href="/"><u>Support</u></Link> */}
    </div>
  );
}

export default EmployeeLoginFooter;
