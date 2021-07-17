import Image from 'next/image'
import Form from '@/components/form'

import Logo from '../public/DMC-main-logo.jpg'
import { RiInstagramFill } from 'react-icons/ri'
import { RiFacebookBoxFill } from 'react-icons/ri'
import { useSettingsContext } from '@/context/settings'
import { useEffect, useState } from 'react'

function Sidebar() {
  const { setActive, active } = useSettingsContext()
  const [widthOutputNum, setWidthOutputNum] = useState()

  const reportWindowSize = () => {
    const widthOutput = window.innerWidth

    setWidthOutputNum(widthOutput)

    if (widthOutput > 1020) {
      setActive(true)
    }

    return widthOutput
  }

  useEffect(() => {
    window.addEventListener('resize', reportWindowSize)
  }, [])

  return (
    <div
      className={`sidebar absolute right-0 w-full md:w-1/2 bg-white lg:block lg:w-1/3 border-l-4 border-black z-50 h-full ${
        widthOutputNum < 1024 ? 'lg:block ' : ''
      }
       ${
         active
           ? '  transform translate-x-0 transition-transform duration-500 '
           : '  transform translate-x-full transition-transform duration-500 '
       } `}
    >
      <div>
        <Image src={Logo} height={700} width={700} alt="logo" title="logo" />
      </div>
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
