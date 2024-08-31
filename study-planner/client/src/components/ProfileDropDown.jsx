import React from 'react'
import { Dropdown, Nav } from 'rsuite';
import ProfileIcon from '@rsuite/icons/legacy/User'

const ProfileDropDown = () => {

  const onLogOut = async (e) =>{
    if (localStorage.getItem("token")){
      localStorage.removeItem("token")
    }

    location.reload()
  }

  return (
    <ul className="list-none flex flex-col justify-end items-center flex-1">
      <li><a className={`font-poppins font-normal cursor-pointer text-[16px] text-white hover:text-gray-300`} onClick={onLogOut}>Log Out</a></li>
    </ul>
  )
}

export default ProfileDropDown