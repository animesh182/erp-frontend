"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import google from "../../../public/google.svg";
import Image from "next/image";
import EmployeeLoginFooter from "@/components/EmployeeLoginFooter";
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
import LoginTextHeader, {
  LoginTextFooter,
} from "@/components/EmployeeDetails/LoginText";
import { getEmployees } from "../api/employees/getEmployees";

const formSchema = z.object({
  email: z.string().email(),
});
const EmployeeLogin = () => {
  const [existingUser, setExistingUser] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const { status, data } = await getEmployees();
        if (status === 200) {
          setEmployeeDetails(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getEmployeeDetails();
  }, []);
  console.log(employeeDetails, "employeedetails");

  function onEmailSubmit(values) {
    console.log(values, "values");

    const userExists = employeeDetails.some(
      (employee) => employee.email === values.email
    );

    setExistingUser(userExists);

    const matchedEmployee = employeeDetails.find(
      (employee) => employee.email === values.email
    );
    if (matchedEmployee) {
      const userId = matchedEmployee.id;
      const email = encodeURIComponent(values.email);

      if (userExists && matchedEmployee) {
        window.location.href = `/users/login-password?email=${email}&userId=${userId}`;
      } else {
        window.location.href = `/users/email-verify?email=${email}`;
      }
    } else {
      console.log("employee not found");
      window.location.href = `/users/email-verify?email=${values.email}`;
    }
  }

  function onGoogleEmailSubmit() {
    form.clearErrors();
    if (existingUser) window.location.href = "/users/login-password";
    else window.location.href = "/users/email-verify";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onEmailSubmit)}>
        <div className="h-screen w-full flex flex-col justify-center items-center ">
          <Card className="lg:w-7/12 w-10/12  pt-14 pb-2 h-11/12">
            <CardContent className="">
              <div className=" lg:grid grid-cols-2">
                <div className="flex flex-col justify-center space-y-2 lg:px-20  pb-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#020617] font-medium tracking-tight">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your work email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full text-sm" type="submit">
                    Sign in with Email
                  </Button>
                  <br />
                  <div className="flex text-[#64748B] justify-center text-xs ">
                    OR CONTINUE WITH
                  </div>
                  <br />
                  <Button
                    className="w-full shadow-md text-sm"
                    variant="outline"
                    type="button"
                    onClick={onGoogleEmailSubmit}
                  >
                    <Image src={google} alt="google" /> Sign in with Google
                  </Button>
                </div>
                <LoginTextHeader />
              </div>
            </CardContent>
            <CardFooter className="w-1/2 pt-20 pl-24 flex items-end justify-end text-justify">
              <CardDescription className="text-xs leading-4 hidden lg:block">
                <LoginTextFooter />
              </CardDescription>
            </CardFooter>
          </Card>
          <EmployeeLoginFooter />
        </div>
      </form>
    </Form>
  );
};

export default EmployeeLogin;
