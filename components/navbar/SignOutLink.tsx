'use client';

import { useToast } from "@/components/ui/use-toast";
import { SignOutButton } from "@clerk/nextjs";

function SignOutLink() {
  const {toast} = useToast();
  const handleLogout = () => {
    toast({description: 'You has successfully signout'});
  }
  return (
    <SignOutButton redirectUrl='/'>
      <button className="w-full text-left" onClick={handleLogout}>Logout</button>
      </SignOutButton>
  );
};

export default SignOutLink;
