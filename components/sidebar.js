import Image from 'next/image'
import Form from '@/components/form'

import Logo from '../public/DMC-main-logo.jpg'
import { RiInstagramFill } from 'react-icons/ri'
import { RiFacebookBoxFill } from 'react-icons/ri'

function Sidebar() {
  return (
    <div className="sidebar absolute right-0 w-full md:w-1/2 bg-white lg:block lg:w-1/4 border-l-4 border-black z-50 h-full transform translate-x-full lg:transform active:translate-x-0 ">
      <Image src={Logo} height={500} width={500} alt="logo" title="logo" />
      <div className="flex flex-column justify-around space px-24 pb-8">
        <RiInstagramFill className="text-3xl" />
        <RiFacebookBoxFill className="text-3xl" />
      </div>
      <div className="border-b-4  border-t-4 border-black w-full ">
        <h1 className="text-lg md:text-2xl lg:text-3xl text-center font-bold  ml-8 m-2 ">
          COMMISSIONS
        </h1>
      </div>
      <Form />
      <div className="border-b-4  border-t-4 border-black w-full ">
        <h1 className="text-lg md:text-2xl lg:text-3xl text-center font-bold  ml-8 m-2 ">
          DESIGNS
        </h1>
      </div>
    </div>
  )
}

export default Sidebar
