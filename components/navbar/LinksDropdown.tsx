import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserIcon from './UserIcon';
import { links } from '@/utils/links';
import SignOutLink from './SignOutLink';
import { SignedOut, SignedIn, SignInButton, SignUpButton } from '@clerk/nextjs';

function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-4 max-w-[100px]'>
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-52' align='start' sideOffset={10}>
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode='modal'>
            <Button className='w-full text-left'>Login</Button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* @for register */}
          <DropdownMenuItem>
            <SignUpButton mode='modal'>
            <Button className='w-full text-left'>Register</Button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        <SignedIn>
          {links.map((link) => (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href}>
                <a className='capitalize w-full'>{link.label}</a>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
