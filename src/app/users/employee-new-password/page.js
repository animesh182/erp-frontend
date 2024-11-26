"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { Suspense } from 'react'
import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LoginTextHeader, { LoginTextFooter } from '@/components/EmployeeDetails/LoginText';
import { useRouter, useSearchParams } from 'next/navigation';
import { createNewPassword } from '@/app/api/auth/newPassword';
import { toast } from 'sonner';

  const formSchema = z.object({
    password:z.string().min(7,"Password must be at least 7 characters long"),
    confirmPassword:z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });


  export default function EmployeeNewPasswordPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeeNewPassword />
      </Suspense>
    );
  }

const EmployeeNewPassword = () => {
  const router=useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
     password:"",
     confirmPassword:""
    },
  });

  const searchParams = useSearchParams(); 
  const rawEmail = searchParams.get('email');

  const email = rawEmail ? decodeURIComponent(rawEmail) : "";
  



  async function onSubmit(values) {
    const  password  = values.password; 
    const formData={email,password}
    console.log(formData,"form")
    
    // if (document.referrer.endsWith("/users")) {
    try {
      const response = await createNewPassword(formData);
      // if (response.status === 200 && response.is_employee) {
      if (response.status === 200 ) {
        toast.success(response.message);
     
        router.push(`/users`);
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
        console.log(error,"error")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error,"error")
    }
  // }
//   else
// {
//     sessionStorage.setItem("password", values.password);
// router.push("/users/onboarding");
// }

  }



  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="h-screen w-full flex flex-col justify-center items-center ">   
    <Card className="lg:w-7/12 w-fit  pt-14 pb-2 h-11/12">
        <CardContent  className="">
    <div className=" lg:grid grid-cols-2">
      
      <div className="flex flex-col justify-center space-y-2 px-20  pb-6">
   

<FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#020617] font-medium tracking-tight">Enter Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a new password" {...field} type="password"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
 
         <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#020617] font-medium tracking-tight">Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a new password" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        <Button className="w-full text-sm" type="submit">Confirm</Button>
  
    
      
   
      </div>
      <LoginTextHeader/>
    </div>
    </CardContent>
    <CardFooter className="w-1/2 pt-20 pl-24 flex items-end justify-end text-justify">
      <CardDescription className="text-xs leading-4  hidden lg:block">
      <LoginTextFooter/>
      </CardDescription>
    </CardFooter>
    </Card>
<EmployeeLoginFooter/>
    </div>
    </form>
</Form>

  )
}


