"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
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
import { useRouter } from 'next/navigation';

  const formSchema = z.object({
    password:z.string().min(7,"Password must be at least 7 characters long"),
    confirmPassword:z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
const EmployeeNewPassword = () => {
  const router=useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
     password:"",
     confirmPassword:""
    },
  });

  
  function onSubmit(values) {
    const { password } = values; 
    console.log(values,"values")

    // window.location.href="/users/onboarding"
    // router.push(`/users/onboarding?password=${password}`);
    sessionStorage.setItem("password", values.password);
router.push("/users/onboarding");

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

export default EmployeeNewPassword
