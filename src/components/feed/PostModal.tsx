"use client"
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "../../utils/shadcn/utils"
import { buttonVariants } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const ModalOpen = ({ closeModal }) => {
  return (
    <AlertDialogPrimitive.Root>
      <AlertDialogPrimitive.Trigger asChild>
        <button onClick={closeModal}>Open Modal</button>
      </AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/80  w-full sm:w-4/5 md:w-3/5 max-w-[60%]")} />
        <AlertDialogPrimitive.Content className={cn("fixed inset-0 z-50 bg-white p-4 m-auto rounded w-full sm:w-4/5 md:w-3/5 max-w-[60%]")}>
          <AlertDialogPrimitive.Title>Modal Title</AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description>
            
          </AlertDialogPrimitive.Description>
          <div className="flex justify-end space-x-2 mt-4">
            <AlertDialogPrimitive.Cancel asChild>
              <button onClick={closeModal} className={buttonVariants({ variant: "outline" })}>Cancel</button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <button className={buttonVariants()}>Confirm</button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};

export { ModalOpen };

const PostModalDialog = AlertDialogPrimitive.Root

const PostModalDialogTrigger = AlertDialogPrimitive.Trigger

const PostModalDialogPortal = AlertDialogPrimitive.Portal

const PostModalOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
PostModalOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const PostModalDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PostModalDialogPortal>
    <PostModalOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full w-full sm:w-4/5 md:w-3/5 max-w-[50%] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </PostModalDialogPortal>
))
PostModalDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const PostModalDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
PostModalDialogHeader.displayName = "PostModalDialogHeader"

const PostModalDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
PostModalDialogFooter.displayName = "PostModalDialogFooter"

const PostModalDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
PostModalDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const PostModalDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
PostModalDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const PostModalDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
PostModalDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const PostModalDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}

    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
PostModalDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  PostModalDialog,
  PostModalDialogPortal,
  PostModalOverlay,
  PostModalDialogTrigger,
  PostModalDialogContent,
  PostModalDialogHeader,
  PostModalDialogFooter,
  PostModalDialogTitle,
  PostModalDialogDescription,
  PostModalDialogAction,
  PostModalDialogCancel,
}

