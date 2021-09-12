import Link from 'next/link'
import Image from 'next/image'

import { formatCurrencyValue } from '@/utils/format-currency-value'
import { useSettingsContext } from '@/context/settings'

import commerce from '@/lib/commerce'
import { useCartDispatch } from '@/context/cart'
import generateCheckoutToken from '@/utils/generateCheckoutToken'

function ProductCard({ id, media, name, price, permalink }) {
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

  const addToCart = async (id) => {
    try {
      setAddToCartStatus({ id, message: 'ADDING TO CART...' })
      const { cart } = await commerce.cart.add(id)

      setAddToCartStatus({ id, message: 'ADDED TO CART!' })
      setCart(cart)
      generateCheckoutToken(
        setCheckoutToken,
        shippingValues,
        setShippingValues,
        billingValues,
        setBillingValues,
        cart.line_items,
        cart.id
      )
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <article
      className="border-4 border-black shadow-brutalist-lg transform transition duration-500 lg:hover:shadow-brutalist-xl lg:hover:scale-110"
      key={id}
    >
      <>
        <Link href={`/products/${permalink}`}>
          <a>
            <div className="text-left ml-2 mt-2 absolute z-10 ">
              <p className="text-black font-bold text-lg lg:text-xl">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: price.formatted * 100
                })}
              </p>
            </div>

            <div className="bg-gray-50 cursor-pointer w-full overflow-hidden relative">
              {media ? (
                <div className=" relative text-center">
                  <Image
                    src={media.source}
                    height={250}
                    width={250}
                    alt={name}
                    title={name}
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
          {/* <select
            name="Select"
            id="select"
            className="text-center border-t-2 font-bold border-black"
          >
            <option value="physical">PHYSICAL</option>
            <option value="digital">DIGITAL</option>
          </select> */}
          <button
            onClick={() => addToCart(id)}
            className="hover:bg-black hover:text-white transition duration-300 ease-in-out text-center py-2 w-full border-t-2 font-bold border-black"
          >
            {id === addToCartStatus.id
              ? addToCartStatus.message
              : 'ADD TO CART'}
          </button>
        </div>
      </>
    </article>
  )
}

export default ProductCard
