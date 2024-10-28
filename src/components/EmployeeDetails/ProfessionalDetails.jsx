import React from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


const formSchema = z.object({
    department: z.string().min(1, "Please select your department"),
    jobTitle: z.string().min(1,"Please provide your job title"),
    level: z.string().min(1),
    panNumber: z.string().min(1,"Please provide your PAN number"),
  });
function ProfessionalDetails({onSubmission,defaultValues}) {

    const departmentOption=["IT","Management"]

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:defaultValues|| {
            department:"",
            jobTitle:"",
            level:"",
            panNumber:""
        },
      });



       function onSubmit(values) {
        console.log(values,"values")
        onSubmission(values)
      }

    return (
  
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="text-[#020617] tracking-tight text-xl font-semibold">Enter your professional details</div>
        <br/>

    <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
        <FormItem>
            <FormLabel>Department</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="border rounded p-2">
                <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
                {departmentOption.map((department) => (
                <SelectItem key={department} value={department}>
                    {department}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
        )}
    />
    <br />
    <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    <br />

    <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your job level" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    <br/>


    <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pan Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your PAN number" {...field} />
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

export default ProfessionalDetails
