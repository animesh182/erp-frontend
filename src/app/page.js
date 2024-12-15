"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/app/api/auth/login";
import { toast } from "sonner";
import Link from "next/link";
import { useClockify } from "@/context/clockifyContext/ClockifyContext";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(50),
});

export default function Page() {
  const { setClockifyUserData } = useClockify();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await login(values);
      if (response.status === 200) {
        console.log(response, "responese");
        if (response.is_admin) {
          toast.success("Login successful!");

          const res = response.user_details;
          setClockifyUserData(res);

          router.push("/dashboard");
        } else if (response.is_employee) {
          toast.success("Please Login as Employee!");
          router.push("/users");
        }
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
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
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? "Logging in..." : "Sign in"}
              </Button>
              <br />
              <Link href="/users" className="text-sm ">
                <u>Sign in as Employee</u>
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
