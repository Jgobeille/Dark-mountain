const { useSettingsContext } = require('@/context/settings')

import { useCartDispatch, useCartState } from '@/context/cart'
import commerce from '@/lib/commerce'
import { useCallback, useState } from 'react'

const CartItem = ({ id, name, quantity, line_total, media }) => {
  const { setCart } = useCartDispatch()

  const handleUpdateCart = ({ cart }) => setCart(cart)

  const removeItem = () => commerce.cart.remove(id).then(handleUpdateCart)
  const decrementQuantity = () => {
    quantity > 1
      ? commerce.cart
          .update(id, { quantity: quantity - 1 })
          .then(handleUpdateCart)
      : removeItem()
  }

  const incrementQuantity = () =>
    commerce.cart.update(id, { quantity: quantity + 1 }).then(handleUpdateCart)
  return (
    <div className="flex xs:flex-col flex-row md:justify-start my-4 mx-6">
      <div>
        <img className="h-32 w-32 mr-4" src={media.source} alt="" />
      </div>
      <div className="flex flex-col flex-grow justify-around">
        <p className="sm:text-xl md:text-2xl lg:text-3xl break-words font-bold">
          {name.toUpperCase()}
        </p>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <p className="mr-2">{quantity}</p>
            <p className="mr-2">X </p>
            <p>{line_total.formatted_with_symbol}</p>

            <p className="w-full text-right">
              {line_total.formatted_with_symbol}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-start">
          <button
            onClick={decrementQuantity}
            className="border-2 border-black py-px px-1"
          >
            -
          </button>
          <span className="border-2 border-black py-px px-1">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="border-2 border-black py-px px-1"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

const Modal = () => {
  const {
    modal,
    setModal,
    setAddToCartStatus,
    setCheckoutToken,
    shippingValues,
    setShippingValues
  } = useSettingsContext()
  const { line_items, subtotal, id } = useCartState()
  const { setCart } = useCartDispatch()

  const handleUpdateCart = ({ cart }) => setCart(cart)

  /**
   * Fetches a list of countries available to ship to checkout token
   * https://commercejs.com/docs/sdk/checkout#list-available-shipping-countries
   *
   * @param {string} dId
   */
  const fetchShippingCountries = (checkoutTokenId) => {
    commerce.services
      .localeListShippingCountries(checkoutTokenId)
      .then((countries) => {
        console.log(countries.countries)
        setShippingValues({
          ...shippingValues,
          shippingCountries: countries.countries
        })
      })
      .catch((error) => {
        console.log(
          'There was an error fetching a list of shipping countries',
          error
        )
      })
  }

  const generateCheckoutToken = () => {
    if (line_items.length) {
      console.log(id)
      //TODO: Rewrite as Async function
      commerce.checkout
        .generateToken(id, { type: 'cart' })
        .then((token) => {
          setCheckoutToken(token)
          fetchShippingCountries(token.id)
        })

        .catch((error) => {
          console.log('There was an error in generating a token', error)
        })
    }
  }

  const isEmpty = line_items.length === 0

  const showHideClassName = modal ? 'modal block' : 'modal hidden'

  const emptyCart = () => {
    setAddToCartStatus('ADD TO CART')

    commerce.cart.empty().then(handleUpdateCart)
  }

  return (
    <div
      className={`${showHideClassName} absolute w-full right-0 md:fixed top-0 md:top-2 md:right-8 sm:w-auto  z-50`}
    >
      {isEmpty ? (
        <section className="bg-white border-4 border-black md:shadow-brutalist-lg">
          <div className="flex flex-column justify-between border-b-2 border-black p">
            <h1 className="text-3xl font-bold p-2">YOUR CART</h1>
            <button onClick={() => setModal(false)} className="mx-4 text-xl">
              X
            </button>
          </div>
          <div className="p-28">
            <p className="text-2xl text-center mb-4">
              {`Your cart is empty ${';('}`}
            </p>
            <p className=" text-2xl text-center">
              Why don't you go ahead and buy something already?
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-white border-4 border-black md:shadow-brutalist-lg">
          <div className="flex flex-column justify-between border-b-2 border-black">
            <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-bold p-2">
              YOUR CART
            </h1>
            <button onClick={() => setModal(false)} className="mx-4 text-xl">
              X
            </button>
          </div>

          {line_items.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}

          <div className=" flex flex-col border-t-2 border-black sm:text-xl md:text-2xl lg:text-3xl font-bold pl-4 pr-6 py-4">
            <div className="flex flex-row justify-between">
              <p>
                <strong>SUB TOTAL:</strong>
              </p>
              <p>{subtotal.formatted_with_symbol}</p>
            </div>
            <div className="flex flex-row justify-between py-4">
              <button
                type="button"
                onClick={emptyCart}
                className="text-lg border-4 p-1 bg-black text-white border-black hover:bg-white hover:text-black transition duration-300 ease-in-out"
              >
                CLEAR CART
              </button>
              <button
                onClick={generateCheckoutToken}
                type="button"
                className="text-lg border-4 p-1 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Modal