// Adapted from shadcn/ui (MIT), https://ui.shadcn.com/docs/components/button
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  { variants: { variant: { default: "bg-[#6534c1] text-white hover:bg-[#7543cd] border border-[#9d70ec66]", outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground" }, size: { default: "px-4 py-2", sm: "px-3 py-2 text-xs" } }, defaultVariants: { variant: "default", size: "default" } }
);
type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
