import React, { useEffect, useRef, useState } from 'react'

import commerce from '@/lib/commerce'

import { useSettingsContext } from '@/context/settings'
import useForm from '@/utils/useForm'
import { useCartDispatch, useCartState } from '@/context/cart'
import fetchShippingOptionsAndSubdivisions from '@/utils/fetchShippingOptionsAndSubdivisions'

import { useFormik, Field } from 'formik'
const CheckoutForm = () => {
  const {
    checkoutToken,
    shippingValues,
    setShippingValues,
    billingValues,
    setBillingValues
  } = useSettingsContext()
  const { setCart } = useCartDispatch()
  const { line_items } = useCartState()

  const [order, setOrder] = useState()

  const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
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

  const handleCaptureCheckout = (values) => {
    // e.preventDefault()

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
        name: values.billingName,
        street: values.billingStreet,
        town_city: values.billingCity,
        county_state: values.billingStateProvince,
        postal_zip_code: values.billingPostalZipCode,
        country: values.billingCountry
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

  // Set up Formik
  // copy values into formik use
  const formik = useFormik({
    initialValues: {
      // Customer details
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@email.com',
      // Shipping details
      shippingName: 'Jane Doe',
      shippingStreet: '123 Fake St',
      shippingApartment: '',
      shippingCity: 'San Francisco',
      shippingStateProvince: 'CA',
      shippingPostalZipCode: '94107',
      shippingCountry: '',
      billingName: 'Jane Doe',
      billingStreet: '123 Fake St',
      billingApartment: '',
      billingCity: 'San Francisco',
      billingStateProvince: 'CA',
      billingPostalZipCode: '94107',
      billingCountry: '',
      // Payment details
      cardNum: '4242 4242 4242 4242',
      expMonth: '11',
      expYear: '2023',
      ccv: '123',
      billingPostalZipcode: '94107',
      billingAddress: ''
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
      handleCaptureCheckout(values)
    }
  })

  const handleShippingCountryChange = (e) => {
    const currentValue = e.target.value
    fetchShippingOptionsAndSubdivisions(
      checkoutToken?.id,
      currentValue,
      null,
      shippingValues,
      setShippingValues,
      'shipping'
    )
  }
  const handleBillingCountryChange = (e) => {
    const currentValue = e.target.value
    fetchShippingOptionsAndSubdivisions(
      checkoutToken?.id,
      currentValue,
      null,
      billingValues,
      setBillingValues,
      'billing'
    )
  }

  const prevShipping = usePrevious(formik.values.shippingCountry)

  // useEffect(() => {
  //   if (prevShipping !== formik.values.shippingCountry) {
  //     fetchShippingOptions(checkoutToken?.id, formik.values.shippingCountry)
  //   }
  // }, [formik.values.shippingCountry])

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
                <form onSubmit={formik.handleSubmit}>
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <p className="font-bold text-lg">CUSTOMER DETAILS</p>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="firstName">First name</label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            autoComplete="given-name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="lastName">Last name</label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            autoComplete="family-name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="email">Email address</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6">
                          <p className="font-bold text-lg">SHIPPING ADDRESS</p>
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="shippingStreet">Street address</label>
                          <input
                            type="text"
                            name="shippingStreet"
                            id="shippingStreet"
                            autoComplete="shippingStreet"
                            value={formik.values.shippingStreet}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6 lg:col-span-3">
                          <label htmlFor="apartment">
                            Apartment, Suite, etc. *Optional
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            id="apartment"
                            value={formik.values.apartment}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="shippingCity">City</label>
                          <input
                            type="text"
                            name="shippingCity"
                            id="shippingCity"
                            value={formik.values.shippingCity}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label
                            className="checkout__label"
                            htmlFor="shippingCountry"
                          >
                            Country
                          </label>
                          <select
                            value={formik.values.shippingCountry}
                            name="shippingCountry"
                            type="text"
                            id=""
                            autoComplete=""
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                            onChange={(e) => {
                              formik.handleChange(e)
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

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            className="checkout__label"
                            htmlFor="shippingStateProvince"
                          >
                            State/province
                          </label>
                          <select
                            value={formik.values.shippingStateProvince}
                            name="shippingStateProvince"
                            type="text"
                            id="shippingStateProvince"
                            autoComplete="shippingStateProvince"
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          >
                            <option className="checkout__option" disabled>
                              State / Province
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

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label htmlFor="shippingPostalZipCode">
                            ZIP / Postal
                          </label>
                          <input
                            type="text"
                            name="shippingPostalZipCode"
                            id="shippingPostalZipCode"
                            autoComplete="shippingPostalZipCode"
                            value={formik.values.shippingPostalZipCode}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6">
                          <p className="font-bold text-lg">BILLING ADDRESS</p>
                        </div>
                        <div className="col-span-6">
                          <div id="my-radio-group">
                            {' '}
                            Select the address that matches your card or payment
                            method.
                          </div>
                          <div
                            className="flex flex-col"
                            role="group"
                            aria-labelledby="my-radio-group"
                          >
                            <label htmlFor="billingAddress">
                              <input
                                onChange={formik.handleChange}
                                type="radio"
                                name="billingAddress"
                                value="same"
                              />
                              Same as shipping address
                            </label>
                            <label htmlFor="billingAddress">
                              <input
                                onChange={formik.handleChange}
                                type="radio"
                                name="billingAddress"
                                value="different"
                              />
                              Different from shipping address
                            </label>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="billingStreet">Street address</label>
                          <input
                            type="text"
                            name="billingStreet"
                            id="billingStreet"
                            autoComplete="billingStreet"
                            value={formik.values.billingStreet}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6 lg:col-span-3">
                          <label htmlFor="apartment">
                            Apartment, Suite, etc. *Optional
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            id="apartment"
                            value={formik.values.apartment}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="billingCity">City</label>
                          <input
                            type="text"
                            name="billingCity"
                            id="billingCity"
                            value={formik.values.billingCity}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label
                            className="checkout__label"
                            htmlFor="billingCountry"
                          >
                            Country
                          </label>
                          <select
                            value={formik.values.billingCountry}
                            name="billingCountry"
                            type="text"
                            id=""
                            autoComplete=""
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                            onChange={(e) => {
                              formik.handleChange(e)
                              handleBillingCountryChange(e)
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

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            className="checkout__label"
                            htmlFor="billingStateProvince"
                          >
                            State/province
                          </label>
                          <select
                            value={formik.values.billingStateProvince}
                            name="billingStateProvince"
                            type="text"
                            id="billingStateProvince"
                            autoComplete="billingStateProvince"
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          >
                            <option className="checkout__option" disabled>
                              State / Province
                            </option>
                            {Object.keys(billingValues.billingSubdivisions).map(
                              (index) => {
                                return (
                                  <option value={index} key={index}>
                                    {billingValues.billingSubdivisions[index]}
                                  </option>
                                )
                              }
                            )}
                            ;
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label htmlFor="billingPostalZipCode">
                            ZIP / Postal
                          </label>
                          <input
                            type="text"
                            name="billingPostalZipCode"
                            id="billingPostalZipCode"
                            autoComplete="billingPostalZipCode"
                            value={formik.values.billingPostalZipCode}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6">
                          <p className="font-bold text-lg">SHIPPING METHOD</p>
                        </div>
                        <div className="col-span-6 ">
                          <label
                            className="checkout__label"
                            htmlFor="shippingOption"
                          ></label>
                          <select
                            value={shippingValues.shippingOption.id}
                            name="shippingOption"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                            type="text"
                            id="shippingOption"
                            autoComplete="shippingOption"
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
                          <p className="font-bold text-lg">PAYMENT</p>
                        </div>
                        <div className="lg:col-span-5">
                          <label htmlFor="cardNum">Card Number</label>
                          <input
                            type="text"
                            name="cardNum"
                            id="cardNum"
                            autoComplete="cardNum"
                            value={formik.values.cardNum}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className=" col-span-6 sm:col-span-1">
                          <label htmlFor="ccv">CCV</label>
                          <input
                            type="number"
                            name="ccv"
                            id="ccv"
                            autoComplete="ccv"
                            value={formik.values.ccv}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label htmlFor="expMonth">Month</label>
                          <input
                            type="number"
                            name="expMonth"
                            id="expMonth"
                            min="1"
                            max="12"
                            autoComplete="expMonth"
                            value={formik.values.expMonth}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label htmlFor="expYear">Year</label>
                          <input
                            type="number"
                            name="expYear"
                            id="expYear"
                            value={formik.values.expYear}
                            onChange={formik.handleChange}
                            autoComplete="expYear"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label htmlFor="billingPostalZipcode">Zip Code</label>
                          <input
                            type="number"
                            name="billingPostalZipcode"
                            id="billingPostalZipcode"
                            autoComplete="billingPostalZipcode"
                            value={formik.values.billingPostalZipcode}
                            onChange={formik.handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-6 lg:col-span-2">
                    <button
                      type="submit"
                      className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
                    >
                      COMPLETE PURCHASE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutForm
