"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddClientDialog({ onAddClient }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [open, setOpen] = useState(false);

  const onSubmit = (data) => {
    onAddClient(data);
    reset();
    setOpen(false);
  };
  // console.log(watch());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" /> Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the details of the new client here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                className={cn(errors.name && "ring-2 ring-red-500")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                className={cn(errors.email && "ring-2 ring-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="website">Website</label>
              <Input
                id="website"
                {...register("website", {
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: "Invalid website URL",
                  },
                })}
                className={cn(errors.website && "ring-2 ring-red-500")}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
            {/* <div className="flex flex-col">
              <label htmlFor="website">Contact Number</label>
              <div className="w-full flex gap-2 items-center">
                <div className="w-1/4">
                  <label htmlFor="countryCode" className="sr-only">
                    Country Code
                  </label>
                  <Input
                    id="countryCode"
                    {...register("countryCode", {
                      required: "Country code is required",
                      pattern: {
                        value: /^\+?[1-9]\d{1,4}$/, // A basic regex to validate country codes
                        message: "Invalid code",
                      },
                    })}
                    className={cn(errors.countryCode && "ring-2 ring-red-500")}
                    placeholder="+977"
                  />
                  {errors.countryCode && (
                    <p className="text-sm text-red-500">
                      {errors.countryCode.message}
                    </p>
                  )}
                </div> */}
            <div className="flex-1">
              <label htmlFor="contactNumber" className="">
                Contact Number
              </label>
              <Input
                id="contactNumber"
                {...register("contactNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{7,15}$/, // A basic regex to validate phone numbers
                    message: "Invalid phone number",
                  },
                })}
                className={cn(errors.contactNumber && "ring-2 ring-red-500")}
                placeholder=""
              />
              {errors.contactNumber && (
                <p className="text-sm text-red-500">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
            {/* </div>
            </div> */}
          </div>
          <DialogFooter>
            <Button type="submit">Save Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
