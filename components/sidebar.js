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

    return widthOutput
  }

  useEffect(() => {
    window.addEventListener('resize', reportWindowSize)
  }, [])

  return (
    <div
      className={`sidebar flex flex-col items-center absolute right-0 w-full md:w-1/2 bg-white lg:block lg:w-1/3 border-l-4 border-black z-40 h-full ${
        widthOutputNum < 1024 ? 'lg:block ' : ''
      }
       ${active ? '  block ' : ' hidden '} `}
    >
      <div className="logo block">
        <Image src={Logo} height={600} width={600} alt="logo" title="logo" />
      </div>
      <div className="flex flex-column justify-evenly space w-full pb-8">
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
