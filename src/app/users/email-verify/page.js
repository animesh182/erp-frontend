"use client";
import { CompanyIcon } from '@/components/companyicon';
import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'



export default function EmailVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeEmailVerify />
    </Suspense>
  );
}
function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  
  const maskedLocalPart = localPart.slice(0, 2) + "****";
  
  return `${maskedLocalPart}@${domain}`;
}





function EmployeeEmailVerify() {

  const searchParams = useSearchParams(); 
  const rawEmail = searchParams.get('email');

  const email = rawEmail ? maskEmail(decodeURIComponent(rawEmail)) : "";
  
  function onSubmit(){
    //if the email is verified forward to next page

    window.location.href="/users/employee-new-password"



  }
  return (

    <div className="h-screen w-full flex flex-col justify-center items-center px-2 ">   
    <Card className="lg:w-[37.7%] w-10/12   lg:pt-32 pt-20 lg:pb-44 pb-20  lg:px-7 ">

     <CardContent  className="flex flex-col justify-center items-center space-y-4 lg:px-20 py-10 ">
           <Link href="/" className="flex items-center gap-2 font-semibold">
            <CompanyIcon size={40} color="#1169C4" />
            <span className="text-[#2563EB] text-xl">Avinto AS</span>
          </Link>
          <div className="text-[#020617] font-semibold text-2xl tracking-tight text-center">Please Verify your email</div>
          <CardDescription className="text-center leading-5">You&apos;re almost there! We sent an email to <b>{email}</b> <br/><br/>

Just click on the link in that email to complete you signup. If you don&apos;t see it, you may need to check your spam folder.</CardDescription>
            <Button className="w-full" onClick={onSubmit}>Verify your email</Button>
            <div className="text-[#64748B] font-medium text-sm"><Link href="/">Need help? <u>Contact Us</u></Link></div>
          </CardContent>
          </Card>
          <EmployeeLoginFooter/>
    </div>

  )
}

// export default EmployeeEmailVerify

