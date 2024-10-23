"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
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

  const formSchema = z.object({
    password:z.string().min(7,"Password must be at least 7 characters long")
  })
const EmployeeLoginPassword = () => {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
     password:""
    },
  });

  function onSubmit(values) {
    console.log(values,"values")


    //here the condition to check password lies


    window.location.href="/users/dashboard"
  }
  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="h-screen w-full flex flex-col justify-center items-center ">   
    <Card className="lg:w-7/12 w-10/12  pt-14 pb-2 ">
        <CardContent  className="">
    <div className=" lg:grid grid-cols-2">
      
      <div className="flex flex-col justify-center space-y-2 lg:px-20  pb-6">
   

<FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#020617] font-medium tracking-tight">Enter Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a new password" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
 

            <Link href="/" className='text-[#020617] text-xs tracking-tight'><u>Forgot Password?</u></Link>
        <Button className="w-full text-sm" type="submit">Confirm</Button>
  
    
      
   
      </div>
                  <LoginTextHeader/>
    </div>
    </CardContent>
    <CardFooter className="w-1/2 pt-20 pl-24 lg:flex items-end justify-end text-justify hidden">
      <CardDescription className="text-xs leading-4 ">
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

export default EmployeeLoginPassword
