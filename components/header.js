import Link from 'next/link'
import { useCart } from 'react-use-cart'

import { formatCurrencyValue } from '@/utils/format-currency-value'
import { GraphCMSSVG } from '@/svgs'
import { ShoppingCartIcon } from '@/icons'
import { useSettingsContext } from '@/context/settings'

function Header({ pages = [] }) {
  const { cartTotal } = useCart()
  const { activeCurrency } = useSettingsContext()

  return (
    <header className="max-w-full mx-auto font-bold border-b-4 border-black px-4 sm:px-6">
      <div className="py-3 w-full">
        <nav className="grid grid-cols-header items-end justify-items-center">
          <div className="filler"></div>
          <Link href="/">
            <a className="text-xl md:text-2xl lg:text-3xl">
              <h1 className="title">DARK MOUNTAIN CULT</h1>
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
          <div className="ml-auto">
            <Link href="/cart">
              <a className="">
                <ShoppingCartIcon
                  className="h-8 w-8 text-black"
                  aria-hidden="true"
                />
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
