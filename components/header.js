import Link from 'next/link'
import { useCart } from 'react-use-cart'

import { formatCurrencyValue } from '@/utils/format-currency-value'
import { GraphCMSSVG } from '@/svgs'
import { ShoppingCartIcon } from '@/icons'

import { GiHamburgerMenu } from 'react-icons/gi'

import { useSettingsContext } from '@/context/settings'
import Sidebar from './sidebar'
import { useEffect, useState } from 'react'

function Header({ pages = [] }) {
  const { setActive, active, setModal, designs } = useSettingsContext()

  const [widthOutputNum, setWidthOutputNum] = useState()

  const reportWindowSize = () => {
    const widthOutput = window.innerWidth

    setWidthOutputNum(widthOutput)

    return widthOutput
  }

  useEffect(() => {
    window.addEventListener('resize', reportWindowSize)
  }, [])

  useEffect(() => {
    reportWindowSize()
  }, [])

  return (
    <>
      <header className="max-w-full  mx-auto font-bold border-b-4 border-black px-4 sm:px-6 ">
        <div className="py-3 w-full">
          <nav className="grid grid-cols-header-2-cols md:grid-cols-header-3-cols items-end justify-items-center">
            {widthOutputNum > 767 ? <div className="filler"></div> : ''}
            <Link href="/">
              <a className="title-link text-lg md:text-2xl lg:text-3xl ">
                <h1 className="title-link">DARK MOUNTAIN CULT</h1>
              </a>
            </Link>
            {pages.length ? (
              <ul className="hidden md:mx-auto md:block md:flex-grow">
                {pages.map((page) => (
                  <li
                    key={page.id}
                    className="block my-4 md:inline-block md:my-0"
                  >
                    <Link href={`/${page.type.toLowerCase()}/${page.slug}`}>
                      <a className="text-lightgray hover:text-slategray hover:bg-gainsboro rounded-full py-2 px-3 font-medium">
                        {page.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="ml-auto flex flex-row justify-evenly">
              <div onClick={() => setModal(true)} className="">
                <ShoppingCartIcon
                  className="h-8 w-8 text-black"
                  aria-hidden="true"
                />
              </div>

              <div>
                <GiHamburgerMenu
                  onClick={() => setActive(!active)}
                  className="lg:hidden cursor-pointer h-8 w-8 ml-4 text-black"
                />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
