import commerce from '@/lib/commerce'

const addToCart = async (
  id,
  setAddToCartStatus,
  setCart,
  generateCheckoutToken,
  setCheckoutToken,
  shippingValues,
  setShippingValues,
  billingValues,
  setBillingValues
) => {
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

    setTimeout(() => {
      setAddToCartStatus({ id, message: 'ADD TO CART' })
    }, 1500)
  } catch (error) {
    console.error(error.message)
  }
}

export default addToCart
