import React, { useEffect, useRef, useState } from 'react'

import commerce from '@/lib/commerce'

import { useSettingsContext } from '@/context/settings'
import useForm from '@/utils/useForm'
import { useCartDispatch, useCartState } from '@/context/cart'

const CheckoutForm = () => {
  const {
    checkoutToken,
    shippingValues,
    setShippingValues
  } = useSettingsContext()
  const { setCart } = useCartDispatch()
  const { line_items } = useCartState()
  const { values, updateValue } = useForm({
    // Customer details
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@email.com',
    // Shipping details
    shippingName: 'Jane Doe',
    shippingStreet: '123 Fake St',
    shippingCity: 'San Francisco',
    shippingStateProvince: 'CA',
    shippingPostalZipCode: '94107',
    shippingCountry: '',
    // Payment details
    cardNum: '4242 4242 4242 4242',
    expMonth: '11',
    expYear: '2023',
    ccv: '123',
    billingPostalZipcode: '94107',
    order: ''
  })

  const [order, setOrder] = useState()

  /**
   * Fetches the subdivisions (provinces/states) in a country which
   * can be shipped to for the current checkout
   * https://commercejs.com/docs/sdk/checkout#list-subdivisions
   *
   * @param {string} countryCode
   */
  const fetchSubdivisions = (countryCode) => {
    commerce.services
      .localeListSubdivisions(countryCode)
      .then((subdivisions) => {
        setShippingValues({
          ...shippingValues,
          shippingSubdivisions: subdivisions.subdivisions
        })
      })
      .catch((error) => {
        console.log('There was an error fetching the subdivisions', error)
      })
  }

  /**
   * Fetches the available shipping methods for the current checkout
   * https://commercejs.com/docs/sdk/checkout#get-shipping-methods
   *
   * @param {string} checkoutTokenId
   * @param {string} country
   * @param {string} stateProvince
   */
  const fetchShippingOptions = (
    checkoutToken,
    country,
    stateProvince = null
  ) => {
    commerce.checkout
      .getShippingOptions(checkoutToken, {
        country: country,
        region: stateProvince
      })
      .then((options) => {
        const shippingOption = options[0] || null
        setShippingValues({
          ...shippingValues,
          shippingOptions: options,
          shippingOption: shippingOption
        })
      })
      .catch((error) => {
        console.log('There was an error fetching the shipping methods', error)
      })
  }

  const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const prevShipping = usePrevious(values.shippingCountry)

  useEffect(() => {
    fetchShippingOptions(checkoutToken?.id, values.shippingCountry)
  }, [prevShipping])

  const handleShippingCountryChange = (e) => {
    const currentValue = e.target.value
    console.log(currentValue)
    fetchSubdivisions(currentValue)
  }

  const sanitizedLineItems = (lineItems) => {
    return lineItems.reduce((data, lineItem) => {
      const item = data
      let variantData = null
      if (lineItem.selected_options.length) {
        variantData = {
          [lineItem.selected_options[0].group_id]:
            lineItem.selected_options[0].option_id
        }
      }
      item[lineItem.id] = {
        quantity: lineItem.quantity,
        variants: variantData
      }
      return item
    }, {})
  }

  const handleCaptureCheckout = (e) => {
    e.preventDefault()
    const orderData = {
      line_items: sanitizedLineItems(line_items),
      customer: {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email
      },
      shipping: {
        name: values.shippingName,
        street: values.shippingStreet,
        town_city: values.shippingCity,
        county_state: values.shippingStateProvince,
        postal_zip_code: values.shippingPostalZipCode,
        country: values.shippingCountry
      },
      billing: {
        name: values.shippingName,
        street: values.shippingStreet,
        town_city: values.shippingCity,
        county_state: values.shippingStateProvince,
        postal_zip_code: values.shippingPostalZipCode,
        country: values.shippingCountry
      },
      fulfillment: {
        shipping_method: shippingValues.shippingOption.id
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: values.cardNum,
          expiry_month: values.expMonth,
          expiry_year: values.expYear,
          cvc: values.ccv,
          postal_zip_code: values.billingPostalZipcode
        }
      }
    }
    onCaptureCheckout(checkoutToken.id, orderData)
  }

  const refreshCart = () => {
    commerce.cart
      .refresh()
      .then((newCart) => {
        setCart(newCart)
      })
      .catch((error) => {
        console.log('There was an error refreshing your cart', error)
      })
  }

  /**
   * Captures the checkout
   * https://commercejs.com/docs/sdk/checkout#capture-order
   *
   * @param {string} checkoutTokenId The ID of the checkout token
   * @param {object} newOrder The new order object data
   */
  const onCaptureCheckout = (checkoutTokenId, newOrder) => {
    commerce.checkout
      .capture(checkoutTokenId, newOrder)
      .then((order) => {
        // Save the order into state
        setOrder(order)
        // Clear the cart
        refreshCart()
        // Send the user to the receipt
        window.sessionStorage.setItem('order_receipt', JSON.stringify(order))
      })
      .catch((error) => {
        console.log('There was an error confirming your order', error)
      })
  }

  return (
    <>
      <div className="w-full lg:w-2/3 border-black">
        <div className="border-b-4  border-t-4 border-black w-full ">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold  ml-8 m-2">
            CHECKOUT
          </h1>
        </div>
        <div className="px-10 md:px-20 py-10">
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-6">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form action="#" method="POST">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <p>CUSTOMER DETAILS</p>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            First name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            autoComplete="given-name"
                            value={values.firstName}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Last name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            autoComplete="family-name"
                            value={values.lastName}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email address
                          </label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6">
                          <p>SHIPPING ADDRESS</p>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            className="checkout__label"
                            htmlFor="shippingCountry"
                          >
                            Country
                          </label>
                          <select
                            value={values.shippingCountry}
                            name="shippingCountry"
                            className="checkout__select"
                            onChange={(e) => {
                              updateValue(e)
                              handleShippingCountryChange(e)
                            }}
                          >
                            <option disabled>Country</option>
                            {Object.keys(shippingValues.shippingCountries).map(
                              (index) => {
                                return (
                                  <option value={index} key={index}>
                                    {shippingValues.shippingCountries[index]}
                                  </option>
                                )
                              }
                            )}
                            ;
                          </select>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            className="checkout__label"
                            htmlFor="shippingStateProvince"
                          >
                            State/province
                          </label>
                          <select
                            value={values.shippingStateProvince}
                            name="shippingStateProvince"
                            className="checkout__select"
                            onChange={updateValue}
                          >
                            <option className="checkout__option" disabled>
                              State/province
                            </option>
                            {Object.keys(
                              shippingValues.shippingSubdivisions
                            ).map((index) => {
                              return (
                                <option value={index} key={index}>
                                  {shippingValues.shippingSubdivisions[index]}
                                </option>
                              )
                            })}
                            ;
                          </select>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            className="checkout__label"
                            htmlFor="shippingOption"
                          >
                            Shipping method
                          </label>
                          <select
                            value={shippingValues.shippingOption.id}
                            name="shippingOption"
                            className="checkout__select"
                            // onChange={setShippingValues({ shippingOption })}
                          >
                            <option
                              className="checkout__select-option"
                              disabled
                            >
                              Select a shipping method
                            </option>
                            {shippingValues.shippingOptions.map(
                              (method, index) => {
                                return (
                                  <option
                                    className="checkout__select-option"
                                    value={method.id}
                                    key={index}
                                  >{`${method.description} - $${method.price.formatted_with_code}`}</option>
                                )
                              }
                            )}
                            ;
                          </select>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="shippingStreet"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Street address
                          </label>
                          <input
                            type="text"
                            name="shippingStreet"
                            id="shippingStreet"
                            autoComplete="shippingStreet"
                            value={values.shippingStreet}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                          <label
                            htmlFor="shippingCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            name="shippingCity"
                            id="shippingCity"
                            value={values.shippingCity}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            htmlFor="shippingStateProvince"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State / Province
                          </label>
                          <input
                            type="text"
                            name="shippingStateProvince"
                            id="shippingStateProvince"
                            value={values.shippingStateProvince}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            htmlFor="shippingPostalZipCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            ZIP / Postal
                          </label>
                          <input
                            type="text"
                            name="shippingPostalZipCode"
                            id="shippingPostalZipCode"
                            autoComplete="shippingPostalZipCode"
                            value={values.shippingPostalZipCode}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6">
                          <p>PAYMENT</p>
                        </div>
                        <div className="lg:col-span-5">
                          <label
                            htmlFor="cardNum"
                            className="block text-sm font-medium text-gray-700"
                          ></label>
                          <input
                            type="text"
                            name="cardNum"
                            id="cardNum"
                            autoComplete="cardNum"
                            value={values.cardNum}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="lg:col-span-1">
                          <label
                            htmlFor="ccv"
                            className="block text-sm font-medium text-gray-700"
                          ></label>
                          <input
                            type="number"
                            name="ccv"
                            id="ccv"
                            autoComplete="ccv"
                            value={values.ccv}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label
                            htmlFor="expMonth"
                            className="block text-sm font-medium text-gray-700"
                          ></label>
                          <input
                            type="number"
                            name="expMonth"
                            id="expMonth"
                            min="1"
                            max="12"
                            autoComplete="expMonth"
                            value={values.expMonth}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label
                            htmlFor="expYear"
                            className="block text-sm font-medium text-gray-700"
                          ></label>
                          <input
                            type="number"
                            name="expYear"
                            id="expYear"
                            value={values.expYear}
                            onChange={updateValue}
                            autoComplete="expYear"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label
                            htmlFor="billingPostalZipcode"
                            className="block text-sm font-medium text-gray-700"
                          ></label>
                          <input
                            type="number"
                            name="billingPostalZipcode"
                            id="billingPostalZipcode"
                            autoComplete="billingPostalZipcode"
                            value={values.billingPostalZipcode}
                            onChange={updateValue}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="py-6 lg:col-span-2">
                  <button
                    onClick={handleCaptureCheckout}
                    type="submit"
                    className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
                  >
                    COMPLETE PURCHASE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutForm
