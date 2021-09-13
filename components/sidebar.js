import Image from 'next/image'
import Form from '@/components/form'

import Logo from '../public/DMC-main-logo.png'
import { RiInstagramFill } from 'react-icons/ri'
import { RiFacebookBoxFill } from 'react-icons/ri'
import { useSettingsContext } from '@/context/settings'
import { useEffect, useState } from 'react'

import Link from 'next/link'

function Sidebar() {
  const {
    designs,
    setActive,
    active,
    checkoutInitialized
  } = useSettingsContext()

  const [widthOutputNum, setWidthOutputNum] = useState()

  const reportWindowSize = () => {
    const widthOutput = window.innerWidth

    setWidthOutputNum(widthOutput)

    return widthOutput
  }

  useEffect(() => {
    window.addEventListener('resize', reportWindowSize)

    if (widthOutputNum > 1024) {
      setActive(false)
    }

    return () => {
      window.removeEventListener('resize', reportWindowSize)
    }
  }, [widthOutputNum])

  return (
    <div
      className={`sidebar  overflow-y-scroll scrollbar-hide items-center border-l-4 border-black right-0 w-full md:w-1/2 bg-white lg:block lg:w-1/3 
      ${widthOutputNum < 1024 ? 'lg:block ' : ''}
      ${active ? 'absolute h-98.2' : ' hidden '}
      ${checkoutInitialized && widthOutputNum > 1024 ? ' ' : ' h-98.2'} 
       `}
    >
      <div className="border-black">
        <div className="logo ">
          <img src={Logo} alt="Dark Mountain Cult Logo" />
        </div>

        <div className="flex flex-column justify-evenly space w-full pb-8">
          <a
            href="https://www.instagram.com/darkmountaincult/"
            rel="noreferrer"
            target="_blank"
          >
            <RiInstagramFill className="text-3xl" />
          </a>
          <a
            href="https://www.facebook.com/Dark-Mountain-Cult-107346627630353"
            rel="noreferrer"
            target="_blank"
          >
            <RiFacebookBoxFill className="text-3xl" />
          </a>
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
        <div>
          {designs.map((design, i) => (
            <div key={i} className="bg-gray-50  w-full  ">
              {design.image ? (
                <div className=" relative text-center">
                  <Image
                    src={design.image.url}
                    height={400}
                    width={400}
                    alt={design.altText}
                    title={design.title}
                  />

                  <div className="flex flex-col content-center justify-center overlay absolute top-0 bottom-0 left-0 right-0 h-full w-full opacity-0 hover:opacity-100 hover:bg-black transition duration-300 ease-in-out">
                    <p className="text-white">{design.description}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
