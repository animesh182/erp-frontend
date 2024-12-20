"use client";
import React, { useState } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Upload } from 'lucide-react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  
  const formSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
  });
  function BasicDetails({onSubmission,defaultValues}) {
    
    const [selectedImage, setSelectedImage] = useState(null);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:defaultValues || {
            firstName: "",
            lastName:"",
            email: "",
        },
      });



       function onSubmit(values) {
        console.log(values,"values")
        onSubmission(values)
      }





  
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 10 * 1024 * 1024) { // Ensure file size is within 10MB
          const imageUrl = URL.createObjectURL(file);
          setSelectedImage({ file, preview: imageUrl });
        } else {
          alert("Please select an image under 10MB.");
        }
      };

      const handleRemoveImage = () => {
        setSelectedImage(null);
      };
  return (
  
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="text-[#020617] tracking-tight text-xl font-semibold">Enter your basic details</div>
        <br/>


        
        {/* <div className="flex gap-4 items-center">
        <Avatar className="w-16 h-16">
  <AvatarImage src="/default-avatar.jpg" className="object-cover w-16 h-16" />
</Avatar>
      <div className="space-y-3">
        <div className="text-[#020617] font-semibold text-sm">Profile picture</div>
        <div className="lg:flex md:flex items-center gap-3 text-[#020617] font-medium  text-sm lg:space-y-0 md:space-y-0 space-y-1">
          <Button variant="outline" className="gap-2"><Upload className="" size="15"/>Replace Image</Button>
          <Button variant="outline" className="">Remove</Button>
        </div>
        <div className="text-[#64748B] font-medium text-xs">*.png, *.jpeg files up to 10MB at least 400px by 400px</div>

      </div>
        </div> */}


<div className="flex gap-4 items-center">
      <Avatar className="w-16 h-16">
        <AvatarImage 
          src={selectedImage ? selectedImage.preview : "/default-avatar.jpg"} 
          className="object-cover w-16 h-16" 
          alt="Profile Picture" 
        />
      </Avatar>
      <div className="space-y-3">
        <div className="text-[#020617] font-semibold text-sm">Profile picture</div>
        <div className="lg:flex md:flex items-center gap-3 text-[#020617] font-medium text-sm lg:space-y-0 md:space-y-0 space-y-1">
          <Button variant="outline" className="gap-2" type="button">
            <label className="flex items-center cursor-pointer">
              <Upload className="" size="15" />
             {!selectedImage?"Upload Image" :"Replace Image"} 
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleImageChange} 
                className="hidden"
              />
            </label>
          </Button>
          {selectedImage && (
            <Button variant="outline" type="button" className="" onClick={handleRemoveImage}>
              Remove
            </Button>
          )}
        </div>
        <div className="text-[#64748B] font-medium text-xs">
          *.png, *.jpeg files up to 10MB at least 400px by 400px
        </div>
      </div>
    </div>

        <br/>
        <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Noah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        <br/>
        <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Williams" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <br/>
        <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@avinto.no" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br/>
        <Button className="w-full text-sm" type="submit">Continue</Button>
        </form>
    </Form> 

 

  
  )
}

export default BasicDetails
