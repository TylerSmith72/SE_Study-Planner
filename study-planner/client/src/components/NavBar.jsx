import React from 'react'
import { useState } from 'react';

import { close, menu, profile } from '../assets';
import { navLinks } from '../constants'
import { Link } from 'react-router-dom'

import {ProfileDropDown} from ".";

const NavBar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    // Desktop Nav
    <nav className='bg-dark bg-opacity-40 w-full flex py-6 px-10 justify-between items-center navbar'>
      <div className='list-none sm:flex hidden justify-normal items-center flex-1'>
        {navLinks.map((nav, index) => (
          <li
            key = {nav.id}
            className= {`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10`}
          >
            <Link to={`/${nav.id}`}>
              {nav.title}
            </Link>
          </li>
        ))}
      </div>
      <div className='list-none sm:flex hidden justify-end items-center flex-1'>
        {/* Profile and Close */}
        <li className='flex justify-end items-center cursor-pointer'>
          <img 
            src={toggle ? close : profile}
            alt="profile"
            className='w-[28px] h-[28px] object-contain'
            onClick={() => setToggle((prev) => !prev)}
          />
        
          {/* Profile Nav*/}
          <div className={`${toggle ? 'flex' : 'hidden'} absolute top-20 mx-4 my-2 sidebar duration-75`}>
            <ProfileDropDown />
          </div>
        </li>
      </div>


      {/* Menu and Close */}
      <div className='sm:hidden flex flex-1 justify-end items-center'>
        <img 
          src={toggle ? close : menu}
          alt="menu"
          className='w-[28px] h-[28px] object-contain'
          onClick={() => setToggle((prev) => !prev)}
        />
        
        {/* Mobile Nav */}
        <div className={`${toggle ? 'flex' : 'hidden'} p-6 z-[10] bg-gray-700 absolute top-20 right-0 min-w-full m-h-fit rounded-xl sidebar duration-100`}>
          <ul className='list-none flex flex-col justify-start items-center flex-1'>
            {navLinks.map((nav, index) => (
              <li
                key = {nav.id}
                className= {`font-poppins font-normal cursor-pointer text-[16px] text-white ${index === navLinks.length - 1 ? "mb-5" : "mb-10"}`}
              >
                <Link to={`/${nav.id}`}>
                  {nav.title}
                </Link>
              </li>
            ))}
          </ul> 
        </div>
      </div> 
    </nav>
  )
}

export default NavBar