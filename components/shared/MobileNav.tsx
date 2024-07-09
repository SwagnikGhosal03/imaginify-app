"use client"
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
  
const MobileNav = () => {
    const pathname=usePathname()
  return (
    <header className='header'>
        <Link href={'/'} className='flex items-center md:py-2 gap-2'>
        <Image src={'/assets/images/logo-text.svg'} height={20} width={150} alt='logo'></Image>
        </Link>
        <nav className='flex gap-2'>
            <SignedIn>
           <UserButton afterSignOutUrl='/'/>
           <Sheet>
  <SheetTrigger>
    <Image src={'/assets/icons/menu.svg'} width={30} height={30} alt='menu' className='cursor-pointer'></Image>
  </SheetTrigger>
  <SheetContent className='sheet-content sm:w-64' >
    <>
    <Image src={'/assets/images/logo-text.svg'} width={150} height={25} alt='logo' className='mb-3'></Image>
    </>
  <ul className='nav-elements'>
       {navLinks.map((link)=>{
        const isActive=link.route===pathname
        return(
          <li key={link.route} className={`${isActive &&'gradient-text'} flex p-17 whitespace-nowrap text-dark-700`}>
            <Link href={link.route} className='nav-link flex gap-2 p-3 font-semibold cursor-pointer'>
            <Image src={link.icon} alt='' height={18} width={18} />
            {link.label}
            </Link> 
          </li> 
        )
       })}
       </ul>
  </SheetContent>
</Sheet>

            </SignedIn>
         <SignedOut>
        <Button className='button bg-purple-gradient bg-cover'>
            <Link href={'sign-in'}>Login</Link>
        </Button>
         </SignedOut>
        </nav>
    </header>
  )
}

export default MobileNav