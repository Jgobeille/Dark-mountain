import Image from 'next/image'
import Form from '@/components/form'

import Logo from '../public/DMC-main-logo.jpg'
import { RiInstagramFill } from 'react-icons/ri'
import { RiFacebookBoxFill } from 'react-icons/ri'
import { useSettingsContext } from '@/context/settings'
import { useEffect, useState } from 'react'

import Link from 'next/link'

function Sidebar({ designs }) {
  const { setActive, active, checkoutInitialized } = useSettingsContext()

  console.log(checkoutInitialized)
  const [widthOutputNum, setWidthOutputNum] = useState()

  const reportWindowSize = () => {
    const widthOutput = window.innerWidth

    setWidthOutputNum(widthOutput)

    return widthOutput
  }

  console.log(designs)

  useEffect(() => {
    window.addEventListener('resize', reportWindowSize)
  }, [])

  return (
    <div
      className={`sidebar items-center border-l-4 border-black absolute right-0 w-full md:w-1/2 bg-white lg:block lg:w-1/3 z-40 ${
        widthOutputNum < 1024 ? 'lg:block ' : ''
      }
       ${active ? '  block ' : ' hidden '} 
       ${checkoutInitialized ? '  h-full ' : ' h-auto '} 
       `}
    >
      <div className=" border-black">
        <div className="logo block">
          <Image src={Logo} height={600} width={600} alt="logo" title="logo" />
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
          {designs.map((design) => (
            <div className="bg-gray-50  w-full overflow-hidden relative">
              {design.image ? (
                <div className=" relative text-center">
                  <Image
                    src={design.image.url}
                    height={250}
                    width={250}
                    alt={''}
                    title={''}
                  />

                  <div
                    // onClick={() => setModal(true)}
                    className="flex flex-col content-center justify-center overlay absolute top-0 bottom-0 left-0 right-0 h-full w-full opacity-0 hover:opacity-100 hover:bg-black transition duration-300 ease-in-out"
                  >
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
