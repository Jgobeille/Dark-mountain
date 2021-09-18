import React, { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { formatCurrencyValue } from '@/utils/format-currency-value'
import { useSettingsContext } from '@/context/settings'

import { useCartDispatch } from '@/context/cart'
import generateCheckoutToken from '@/utils/generateCheckoutToken'
import addToCart from '@/utils/addToCart'

function ProductCard({ product }) {
  const [selected, setSelected] = useState('physical')
  const {
    activeCurrency,
    addToCartStatus,
    setAddToCartStatus,
    setCheckoutToken,
    shippingValues,
    setShippingValues,
    billingValues,
    setBillingValues,
    setActive
  } = useSettingsContext()
  const { setCart } = useCartDispatch()

  return (
    <article
      className="border-4 border-black shadow-brutalist-lg transform transition duration-500 lg:hover:shadow-brutalist-xl lg:hover:scale-110"
      key={`${product[0].id}&&${product[1].id}`}
    >
      <>
        <Link
          href={
            selected === 'physical'
              ? `/products/${product[0].permalink}`
              : `/products/${product[1].permalink}`
          }
        >
          <a>
            <div className="text-left ml-2 mt-2 absolute z-10 ">
              <p className="text-black font-bold text-lg lg:text-xl">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: product[0].price.formatted * 100
                })}
              </p>
            </div>

            <div className="bg-gray-50 cursor-pointer w-full overflow-hidden relative">
              {product[0].media ? (
                <div className=" relative text-center">
                  <Image
                    src={product[0].media.source}
                    height={250}
                    width={250}
                    alt={product[0].name}
                    title={product[0].name}
                  />

                  <div
                    onClick={() => setActive(false)}
                    className="flex flex-col content-center justify-center overlay absolute top-0 bottom-0 left-0 right-0 h-full w-full opacity-0 hover:opacity-100 hover:bg-black transition duration-300 ease-in-out"
                  >
                    <p className="text-white">See more details... (;</p>
                  </div>
                </div>
              ) : null}
            </div>
          </a>
        </Link>
        <div className="flex flex-col">
          <select
            name="Select"
            id="select"
            className="text-center border-t-2 font-bold border-black"
            onChange={(e) => {
              setSelected(e.target.value)
            }}
          >
            <option value="physical">PHYSICAL</option>
            <option value="digital">DIGITAL</option>
          </select>
          <button
            onClick={() => {
              if (selected === 'physical') {
                addToCart(
                  product[0].id,
                  setAddToCartStatus,
                  setCart,
                  generateCheckoutToken,
                  setCheckoutToken,
                  shippingValues,
                  setShippingValues,
                  billingValues,
                  setBillingValues
                )
              } else {
                addToCart(
                  product[1].id,
                  setAddToCartStatus,
                  setCart,
                  generateCheckoutToken,
                  setCheckoutToken,
                  shippingValues,
                  setShippingValues,
                  billingValues,
                  setBillingValues
                )
              }
            }}
            className="hover:bg-black hover:text-white transition duration-300 ease-in-out text-center py-2 w-full border-t-2 font-bold border-black"
          >
            {product[0].id === addToCartStatus.id
              ? addToCartStatus.message
              : product[1].id === addToCartStatus.id
              ? addToCartStatus.message
              : 'ADD TO CART'}
          </button>
        </div>
      </>
    </article>
  )
}

export default ProductCard
