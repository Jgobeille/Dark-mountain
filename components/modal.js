const { useSettingsContext } = require('@/context/settings')

import { useCartDispatch, useCartState } from '@/context/cart'
import commerce from '@/lib/commerce'

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
    <div className="flex flex-row justify-start my-4 mx-6">
      <div>
        <img className="h-32 w-32 mr-4" src={media.source} alt="" />
      </div>
      <div className="flex flex-col justify-around">
        <p className="text-2xl font-bold">{name.toUpperCase()}</p>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <p className="mr-2">{quantity}</p>
            <p className="mr-2">X </p>
            <p>{line_total.formatted_with_symbol}</p>
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
      <div className="flex flex-col justify-center text-2xl font-bold text-right flex-grow">
        <p>{line_total.formatted_with_symbol}</p>
      </div>
    </div>
  )
}

const Modal = () => {
  const { modal, setModal, setAddToCartStatus } = useSettingsContext()
  const { line_items, subtotal } = useCartState()
  const { setCart } = useCartDispatch()

  const handleUpdateCart = ({ cart }) => setCart(cart)

  const isEmpty = line_items.length === 0

  const showHideClassName = modal ? 'modal block' : 'modal hidden'

  const emptyCart = () => {
    setAddToCartStatus('ADD TO CART')

    commerce.cart.empty().then(handleUpdateCart)
  }

  return (
    <div
      className={`${showHideClassName} fixed top-2 right-8 w-4/12 h-full z-50`}
    >
      {isEmpty ? (
        <section className="bg-white border-4 border-black shadow-brutalist-lg">
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
        <section className="bg-white border-4 border-black shadow-brutalist-lg">
          <div className="flex flex-column justify-between border-b-2 border-black">
            <h1 className="text-3xl font-bold p-2">YOUR CART</h1>
            <button onClick={() => setModal(false)} className="mx-4 text-xl">
              X
            </button>
          </div>

          {line_items.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}

          <div className=" flex flex-col border-t-2 border-black text-3xl font-bold pl-4 pr-6 py-4">
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
