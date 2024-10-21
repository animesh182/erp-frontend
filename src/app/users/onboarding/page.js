"use client";
import { CompanyIcon } from '@/components/companyicon';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';
import TeamAvatars from '@/components/TeamAvatars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import imageUrl from '../../../../public/default-avatar.jpg'
import { Upload } from 'lucide-react';
const Onboarding = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center ">   
       <Card className="w-7/12  pt-5 pb-10 h-11/12">
        <CardContent  className="">
    <div className=" grid grid-cols-2">
      
      <div className="flex flex-col justify-center space-y-2 px-16  py-14">
        <div className="text-[#020617] tracking-tight text-xl font-semibold">Enter your basic details</div>
        <br/>
        <div className="flex gap-4 items-center">
        <Avatar >
        <AvatarImage src="/default-avatar.jpg"  className="object-cover  " />
      </Avatar>
      <div className="space-y-3">
        <div className="text-[#020617] font-semibold text-sm">Profile picture</div>
        <div className="flex items-center gap-3 text-[#020617] font-medium  text-sm">
          <Button variant="outline" className="gap-2"><Upload className="" size="15"/>Replace Image</Button>
          <Button variant="outline" className="">Remove</Button>
        </div>
        <div className="text-[#64748B] font-medium text-xs">*.png, *.jpeg files up to 10MB at least 400px by 400px</div>

      </div>
        </div>
    <br/>
        <div className="text-sm text-[#020617] font-medium tracking-tight"> First  Name</div>
        <Input className="" placeholder="Noah"/>
        <br/>
    
        <div className="text-sm text-[#020617] font-medium tracking-tight"> Last  Name</div>
        <Input className="" placeholder="Williams"/>
      <br/>
        <div className="text-sm text-[#020617] font-medium tracking-tight"> Email</div>
        <Input className="" placeholder="noah@avinto.no"/>
        <br/>
        <Button className="w-full text-sm">Continue</Button>
   
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

    </Card>
<EmployeeLoginFooter/>
    </div>

  )
}

export default Onboarding
