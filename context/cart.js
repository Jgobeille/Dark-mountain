import { createContext, useContext, useReducer, useEffect } from 'react'

import commerce from '@/lib/commerce'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

const SET_CART = 'SET_CART'

const initialState = {
  total_items: 0,
  total_unique_items: 0,
  line_items: []
}

//TODO : research useReducer

// reducer takes the state of the cart and the action( which could be add/remove) then combines/reduces it all together
const reducer = (state, action) => {
  // Checks the action type, if action type spread in new state and action payload
  switch (action.type) {
    case SET_CART:
      return { ...state, ...action.payload }
    default:
      throw new Error(`unknown action: ${action.type}`)
  }
}

export const CartProvider = ({ children }) => {
  // Step 4: Take the
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getCart()
  }, [])

  // Step 3: Take the payload info from the cart and pass it into the dispatch function along with the action type of set cart
  const setCart = (payload) => dispatch({ type: SET_CART, payload })

  const getCart = async () => {
    try {
      // Step 1: get the cart
      const cart = await commerce.cart.retrieve()
      // Step 2: Set the cart
      setCart(cart)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <CartDispatchContext.Provider value={{ setCart }}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  )
}

export const useCartState = () => useContext(CartStateContext)
export const useCartDispatch = () => useContext(CartDispatchContext)
