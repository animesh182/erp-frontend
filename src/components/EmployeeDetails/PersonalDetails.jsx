import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from '../DatePicker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
    gender: z.string().min(1, "Please select your gender"),
    maritalStatus: z.string().min(1, "Please select your marital status"),
    country: z.string().min(1, "Please select your country"),
    phoneNumber: z.string().length(10, "Phone number must be exactly 10 digits"),
    dateOfBirth:z.string().date()
  });

function PersonalDetails({onSubmission,defaultValues}) {

    const genderOptions = ["Male", "Female", "Other"];
    const countryOptions = ["Nepal","Norway","USA", "Canada", "India"];
    const phoneCodes = {
        USA: "+1",
        Canada: "+1",
        India: "+91",
        Nepal: "+977",
        Norway:"+47"
      };
      const maritalStatusOptions=["Single","Married","Divorced","Widowed"];
      
    
        const [selectedPhoneCode, setSelectedPhoneCode] = useState(phoneCodes[defaultValues?.country] || "");
      
        const handleCountryChange = (country) => {
          setSelectedPhoneCode(phoneCodes[country] || "");
        }


        const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: defaultValues || {
              gender: "",
              maritalStatus: "",
              country: "",
              phoneNumber: "",
              dateOfBirth:""
            },
          });
    
    
           function onSubmit(values) {
            console.log(values,"values")
            onSubmission(values)
          }


        
  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="text-[#020617] tracking-tight text-xl font-semibold">Enter your personal details</div>
    <br/>
   <div className='grid grid-cols-2 justify-between gap-5'>
    <div className="col-span-1">
           <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border rounded p-2">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


</div>
<div className="col-span-1">

<FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              {/* <Popover> */}
                    {/* <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {field.value ? format(field.value, "MMM dd yyyy") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger> */}
                    {/* <PopoverContent align="start" className="p-0"> */}
                     
                    <DatePicker
        value={field.value}
        onChange={field.onChange}
      // optional: specify if needed
      />
                
              <FormMessage />
            </FormItem>
          )}
        />
</div>
   
              </div>
            
    <br />
    <FormField
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border rounded p-2">
                  <SelectValue placeholder="Select your marital status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCountryChange(value);
                }}
                value={field.value}
              >
                <SelectTrigger className="border rounded p-2">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
    <br/>
    
     
        <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="flex gap-2">
                      <Input className="lg:w-1/6 w-3/12" value={selectedPhoneCode} placeholder="+XXX" readOnly />
                      <FormControl className="flex gap-2">
                        <Input placeholder="981234567532" className="lg:w-5/6 w-9/12" {...field} />
                      </FormControl>
                      </div>
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

export default PersonalDetails
