import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
      hover: {
        true: {
          default: "hover:bg-primary/80",
          secondary: "hover:bg-secondary/80",
          destructive: "hover:bg-destructive/80",
        },
        false: {},
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    },
    compoundVariants: [
      {
        variant: "default",
        hover: true,
        class: "hover:bg-primary/80",
      },
      {
        variant: "secondary",
        hover: true,
        class: "hover:bg-secondary/80",
      },
      {
        variant: "destructive",
        hover: true,
        class: "hover:bg-destructive/80",
      },
    ],
  }
);

function Badge({ className, variant, hover, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant, hover }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
