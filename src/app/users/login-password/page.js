"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { Suspense } from "react";
import EmployeeLoginFooter from "@/components/EmployeeLoginFooter";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginTextHeader, {
  LoginTextFooter,
} from "@/components/EmployeeDetails/LoginText";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/app/api/auth/login";
import { useClockify } from "@/components/ClockifyContext";

export default function EmployeeLoginPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeLoginPassword />
    </Suspense>
  );
}

const formSchema = z.object({
  password: z.string(),
  // password:z.string().min(7,"Password must be at least 7 characters long")
});
const EmployeeLoginPassword = () => {
  const { setClockifyUserData } = useClockify();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email");

  const email = rawEmail ? decodeURIComponent(rawEmail) : "";
  const paramEmail = encodeURIComponent(email);
  // const userId=searchParams.get('userId')

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const isValidEmail = (email) => {
    return email && email.includes("@") && email.includes(".");
  };

  const isFormValid = form.watch("password") && isValidEmail(email);

  async function onSubmit(values) {
    setIsSubmitting(true);
    const formData = {
      email: email || "",
      password: values.password,
    };

    try {
      const response = await login(formData);
      // if (response.status === 200 && response.is_employee) {
      if (response.status === 200) {
        toast.success("Login successful!");

        const res = response.user_details;
        setClockifyUserData(res);

        router.push(`/users/dashboard?userId=${response.user_details.id}`);
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
        console.log(error, "error");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-screen w-full flex flex-col justify-center items-center ">
          <Card className="lg:w-7/12 w-10/12  pt-14 pb-2 ">
            <CardContent className="">
              <div className=" lg:grid grid-cols-2">
                <div className="flex flex-col justify-center space-y-2 lg:px-20  pb-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#020617] font-medium tracking-tight">
                          Enter Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a new password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Link
                    href={`/users/email-verify?email=${paramEmail}`}
                    className={`text-[#020617] text-xs tracking-tight ${
                      !isValidEmail(email)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <u>Forgot Password?</u>
                  </Link>
                  <Button
                    className="w-full text-sm"
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? "Logging in..." : "Confirm"}
                  </Button>
                </div>
                <LoginTextHeader />
              </div>
            </CardContent>
            <CardFooter className="w-1/2 pt-20 pl-24 lg:flex items-end justify-end text-justify hidden">
              <CardDescription className="text-xs leading-4 ">
                {/* <LoginTextFooter /> */}
              </CardDescription>
            </CardFooter>
          </Card>
          <EmployeeLoginFooter />
        </div>
      </form>
    </Form>
  );
};
