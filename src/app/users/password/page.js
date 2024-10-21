"use client";
import { CompanyIcon } from '@/components/companyicon';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';
const EmployeePassword = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center ">   
       <Card className="w-7/12  pt-14 pb-2 h-11/12">
        <CardContent  className="">
    <div className=" grid grid-cols-2">
      
      <div className="flex flex-col justify-center space-y-2 px-20  pb-6">
        <div className="text-sm text-[#020617] font-medium tracking-tight"> Enter Password</div>
        <Input className="" placeholder="Enter a new password"/>
        <div className="text-sm text-[#020617] font-medium tracking-tight"> Confirm Password</div>
        <Input className="" placeholder="Enter a new password"/>
        <Button className="w-full text-sm">Confirm</Button>
  
    
      
   
      </div>
      <div className="flex flex-col justify-center space-y-2 pr-20 pb-6 pt-20">
        
    
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CompanyIcon size={40} color="#1169C4" />
            <span className="text-[#2563EB] text-xl">Avinto AS</span>
          </Link>
    
        <div className="text-[#020617]  text-2xl font-semibold">Welcome to Avinto ERP.</div>
        <div className="text-[#64748B] text-sm leading-5">
        Avinto ERP is a software dedicated to Avinto and their employees. It is a radically new type of CRM. Built on an entirely new
<br/>type of data architecture, you&apos;ll have profiles and records <br/>of
every interaction within your network in minutes, always
updated in real-time.
<br/>
<br/>
You&apos;ll be able to track your performance and attendance in
the company.
<br/>
<br/>
Let&apos;s begin.
        </div>
      </div>
    </div>
    </CardContent>
    <CardFooter className="w-1/2 pt-20 pl-24 flex items-end justify-end text-justify">
      <CardDescription className="text-xs leading-4 ">
      By inserting your email you confirm you agree to Avinto contacting you about our
product and services. You can opt out at any time by clicking unsubscribe in our
emails. Find out more about how we use data in our  <Link href="/"><u>privacy policy</u></Link>.
      </CardDescription>
    </CardFooter>
    </Card>
<EmployeeLoginFooter/>
    </div>

  )
}

export default EmployeePassword
