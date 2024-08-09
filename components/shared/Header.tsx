import React from 'react'

const Header = ({title,subtitle}:{title:string,subtitle?:string}) => {
  return (
    <>
    <h2 className='text-dark-700 font-bold text-2xl'>{title}</h2>
    {subtitle && <p className=' mt-4'>{subtitle}</p>}
    </>
  )
}

export default Header