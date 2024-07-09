"use client"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
const Sidebar = () => {
  const pathname=usePathname()
  return (
    <aside className='sidebar'>
   <div className=' flex flex-col size-full gap-4'>
    <Link href={'/'} className='side'>
    <Image src={"/assets/images/logo-text.svg"} alt='' width={150} height={50}/>
    </Link>
    <nav className='nav'>
     <SignedIn>
      <ul className='nav-elements'>
       {navLinks.slice(0,6).map((link)=>{
        const isActive=link.route===pathname
        return(
          <li key={link.route} className={`nav-nav_element group ${isActive? 'bg-purple-gradient text-white rounded-3xl':'text-gray-700 group hover:bg-[rgba(244,247,254,1)] hover:shadow-[inset_0_2px_4px_0_rgba(188,182,255,0.5)] rounded-3xl'}`}>
            <Link href={link.route} className='nav-link flex gap-2 p-3 font-semibold'>
            <Image src={link.icon} alt='' height={18} width={18} />
            {link.label}
            </Link> 
          </li> 
        )
       })}
       </ul>
       <ul className='nav-elements mt-20'>
       {navLinks.slice(6).map((link)=>{
        const isActive=link.route===pathname
        return(
          <li key={link.route} className={`nav-nav_element group ${isActive? 'bg-purple-gradient text-white rounded-3xl':'text-gray-700 group hover:bg-[rgba(244,247,254,1)] hover:shadow-[inset_0_2px_4px_0_rgba(188,182,255,0.5)] rounded-3xl'}`}>
            <Link href={link.route} className='nav-link flex gap-2 p-3 font-semibold'>
            <Image src={link.icon} alt='' height={18} width={18} />
            {link.label}
            </Link> 
          </li> 
        )
       })}
       <li className='flex cursor-pointer p-2 gap-2'>
        <UserButton afterSignOutUrl='/' showName/>
       </li>
      </ul>
     </SignedIn>
     <SignedOut>
      <Button asChild className='button bg-purple-gradient bg-cover'>
        <Link href={'/sign-in'}>Login</Link>
      </Button>
     </SignedOut>
    </nav>
   </div>
    </aside>
  )
}

export default Sidebar