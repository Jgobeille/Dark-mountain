import React, { useState } from 'react'

import commerce from '@/lib/commerce'

import { useSettingsContext } from '@/context/settings'

import { useCartDispatch, useCartState } from '@/context/cart'
import fetchShippingOptionsAndSubdivisions from '@/utils/fetchShippingOptionsAndSubdivisions'

import { useFormik } from 'formik'
// import * as Yup from 'yup'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import StripeLogo from 'components/stripeLogo.js'

import { useRouter } from 'next/router'

const ThankyouPage = () => {
  const {
    checkoutRef,
    order,
    setOrder,
    setCheckoutInitialized
  } = useSettingsContext()

  return (
    <>
      <div
        ref={checkoutRef}
        className="border-b-4 border-t-4 border-black w-full "
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold  ml-8 m-2">
          CHECKOUT
        </h1>
      </div>
      <div className="px-10 md:px-20 py-10 w-full ">
        <h2 className="text-xl mb-4">Thank you for your order! </h2>
        <p className="text-xl mb-4">
          your order has been placed. You should be receiving a confirmation
          email soon.
        </p>

        <div className="my-4 p-4  w-full border-4  border-black">
          <div className="flex flex-row justify-between mb-2 ">
            <p className="text-lg">ORDER REF </p>
            <p className="text-lg">{order.id}</p>
          </div>

          <div>
            {order.order.line_items.map((lineItem) => (
              <div className="flex flex-row justify-between mb-2 ">
                <p className="text-lg">{lineItem.product_name}</p>
                <p className="text-lg">
                  {lineItem.price.formatted_with_symbol}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-row border-t-2 border-black justify-between my-2 ">
            <h3 className="text-lg uppercase">Shipping</h3>
            <p className="text-lg">
              {order.order.shipping.price.formatted_with_symbol}
            </p>
          </div>
          <div className="flex flex-row  justify-between ">
            <h3 className="text-lg uppercase font-bold ">total</h3>
            <p className="text-lg font-bold">
              {`${order.order.total.formatted_with_symbol}`}
            </p>
          </div>
        </div>

        <button
          className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
          onClick={() => {
            setOrder()
            setCheckoutInitialized()
          }}
        >
          BUY AGAIN
        </button>
      </div>
    </>
  )
}

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const {
    checkoutToken,
    shippingValues,
    setShippingValues,
    billingValues,
    setBillingValues,
    checkoutInitialized,
    setCheckoutInitialized,
    checkoutRef,
    order,
    setOrder
  } = useSettingsContext()
  const { setCart } = useCartDispatch()
  const { line_items, subtotal } = useCartState()

  const [errors, setErrors] = useState()

  const [purchaseButtonMessage, setPurchaseButtonMessage] = useState(
    'COMPLETE PURCHASE'
  )

  const isProductsPage = router.pathname.includes('products') ? true : false

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

  const handleCaptureCheckout = async (values) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })

    if (error) {
      setErrors()
      setErrors([error.message])
      return
    } else {
      setErrors()
    }
    let orderData
    if (values.billingAddress === 'same') {
      orderData = {
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
          shipping_method: shippingValues?.shippingOption?.id || null
        },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id
          }
        }
      }
    } else {
      orderData = {
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
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id
          }
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
    setPurchaseButtonMessage('PURCHASING...')
    commerce.checkout
      .capture(checkoutTokenId, newOrder)
      .then((order) => {
        // Save the order into state
        setOrder(order)

        // Clear the cart
        refreshCart()
        setPurchaseButtonMessage('COMPLETE PURCHASE')
      })
      .catch((error) => {
        const allErrors = []

        // Loop through object properties
        if (error.data.error.errors) {
          for (const [key, value] of Object.entries(error.data.error.errors)) {
            allErrors.push(value[0])
          }

          if (error.data.error.message) {
            allErrors.push(error.data.error.message)
          }

          setErrors([...allErrors])
          setPurchaseButtonMessage('COMPLETE PURCHASE')
        }
      })
  }

  // Set up Formik
  // copy values into formik use
  const formik = useFormik({
    initialValues: {
      // Customer details
      firstName: '',
      lastName: '',
      email: '',
      // Shipping details
      shippingName: '',
      shippingStreet: '',
      shippingApartment: '',
      shippingCity: '',
      shippingStateProvince: '',
      shippingPostalZipCode: '',
      shippingCountry: 'US',
      billingAddress: 'same',
      billingName: '',
      billingStreet: '',
      billingApartment: '',
      billingCity: '',
      billingStateProvince: '',
      billingPostalZipCode: '',
      billingCountry: 'US'
    },

    onSubmit: (values) => {
      values.shippingName = `${values.firstName} ${values.lastName}`
      values.billingName = `${values.firstName} ${values.lastName}`
      if (checkoutToken) {
        handleCaptureCheckout(values)
      } else {
        setErrors(['There are no items in your cart!'])
      }
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

  return (
    <>
      {order ? (
        <ThankyouPage />
      ) : checkoutInitialized ? (
        <div className="w-full border-black">
          <div
            ref={checkoutRef}
            className="border-b-4  border-t-4 border-black w-full "
          >
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold ml-5 md:ml-8 m-2">
              CHECKOUT
            </h1>
          </div>
          <div
            className={
              isProductsPage
                ? `px-10 md:px-40 lg:px-64 py-10 w-full `
                : `px-10 md:px-20 py-10 w-full `
            }
          >
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="shadow overflow-hidden sm:rounded-md">
                      <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <p className="font-bold text-lg">
                              CUSTOMER DETAILS
                            </p>
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
                              onBlur={formik.handleBlur}
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.firstName
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.firstName &&
                            formik.errors.firstName ? (
                              <div className="text-red-500">
                                {formik.errors.firstName}
                              </div>
                            ) : null}
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
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.lastName
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.lastName &&
                            formik.errors.lastName ? (
                              <div className="text-red-500">
                                {formik.errors.lastName}
                              </div>
                            ) : null}
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
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.email
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <div className="text-red-500">
                                {formik.errors.email}
                              </div>
                            ) : null}
                          </div>
                          <div className="col-span-6">
                            <p className="font-bold text-lg">
                              SHIPPING ADDRESS
                            </p>
                          </div>

                          <div className="col-span-6">
                            <label htmlFor="shippingStreet">
                              Street address
                            </label>
                            <input
                              type="text"
                              name="shippingStreet"
                              id="shippingStreet"
                              autoComplete="street-address"
                              value={formik.values.shippingStreet}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.shippingStreet
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.shippingStreet &&
                            formik.errors.shippingStreet ? (
                              <div className="text-red-500">
                                {formik.errors.shippingStreet}
                              </div>
                            ) : null}
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
                              onBlur={formik.handleBlur}
                              className={
                                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                              }
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
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.shippingCity
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.shippingCity &&
                            formik.errors.shippingCity ? (
                              <div className="text-red-500">
                                {formik.errors.shippingCity}
                              </div>
                            ) : null}
                          </div>
                          <div className="col-span-6 sm:col-span-3">
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
                              onBlur={formik.handleBlur}
                              className={
                                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                              }
                              onChange={(e) => {
                                formik.handleChange(e)
                                handleShippingCountryChange(e)
                              }}
                            >
                              <option disabled>Country</option>
                              {shippingValues.shippingCountries.length >= 1 ? (
                                Object.keys(
                                  shippingValues.shippingCountries
                                ).map((index) => {
                                  return (
                                    <option value={index} key={index}>
                                      {shippingValues.shippingCountries[index]}
                                    </option>
                                  )
                                })
                              ) : (
                                <option value={'US'}>United States</option>
                              )}
                              ;
                            </select>
                          </div>

                          <div className="col-span-6 sm:col-span-3 ">
                            <label
                              className="checkout__label"
                              htmlFor="shippingStateProvince"
                            >
                              State/ Province
                            </label>
                            <select
                              value={formik.values.shippingStateProvince}
                              name="shippingStateProvince"
                              type="text"
                              id="shippingStateProvince"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                              }
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
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="shippingPostalZipCode"
                              id="shippingPostalZipCode"
                              autoComplete="postal-code"
                              value={formik.values.shippingPostalZipCode}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.errors.shippingPostalZipCode
                                  ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                  : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                              }
                            />
                            {formik.touched.shippingPostalZipCode &&
                            formik.errors.shippingPostalZipCode ? (
                              <div className="text-red-500">
                                {formik.errors.shippingPostalZipCode}
                              </div>
                            ) : null}
                          </div>
                          <div className="col-span-6">
                            <p className="font-bold text-lg">BILLING ADDRESS</p>
                          </div>
                          <div className="col-span-6">
                            <div id="my-radio-group">
                              {' '}
                              Select the address that matches your card or
                              payment method.
                            </div>
                            <div
                              className="flex flex-col"
                              role="group"
                              aria-labelledby="my-radio-group"
                            >
                              <label htmlFor="billingAddress">
                                <input
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  type="radio"
                                  name="billingAddress"
                                  value="same"
                                  checked={
                                    formik.values.billingAddress === 'same'
                                  }
                                />
                                Same as shipping address
                              </label>
                              <label htmlFor="billingAddress">
                                <input
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  type="radio"
                                  name="billingAddress"
                                  value="different"
                                  checked={
                                    formik.values.billingAddress === 'different'
                                  }
                                />
                                Different from shipping address
                              </label>
                            </div>
                          </div>
                          {formik.values.billingAddress === 'different' ? (
                            <>
                              <div className="col-span-6">
                                <label htmlFor="billingStreet">
                                  Street address
                                </label>
                                <input
                                  type="text"
                                  name="billingStreet"
                                  id="billingStreet"
                                  autoComplete="street-address"
                                  value={
                                    formik.values.billingAddress === 'different'
                                      ? formik.values.billingStreet
                                      : formik.values.shippingStreet
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={
                                    formik.errors.billingStreet
                                      ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                      : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                                  }
                                />
                                {formik.touched.billingStreet &&
                                formik.errors.billingStreet ? (
                                  <div className="text-red-500">
                                    {formik.errors.billingStreet}
                                  </div>
                                ) : null}
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
                                  onBlur={formik.handleBlur}
                                  className={
                                    'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                                  }
                                />
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="billingCity">City</label>
                                <input
                                  type="text"
                                  name="billingCity"
                                  id="billingCity"
                                  value={
                                    formik.values.billingAddress === 'different'
                                      ? formik.values.billingCity
                                      : formik.values.shippingCity
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={
                                    formik.errors.billingCity
                                      ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                      : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                                  }
                                />
                                {formik.touched.billingCity &&
                                formik.errors.billingCity ? (
                                  <div className="text-red-500">
                                    {formik.errors.billingCity}
                                  </div>
                                ) : null}
                              </div>
                              <div className="col-span-6 sm:col-span-3">
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
                                  onBlur={formik.handleBlur}
                                  className={
                                    'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                                  }
                                  onChange={(e) => {
                                    formik.handleChange(e)
                                    handleBillingCountryChange(e)
                                  }}
                                >
                                  <option disabled>Country</option>
                                  {shippingValues.shippingCountries.length >=
                                  1 ? (
                                    Object.keys(
                                      shippingValues.shippingCountries
                                    ).map((index) => {
                                      return (
                                        <option value={index} key={index}>
                                          {
                                            shippingValues.shippingCountries[
                                              index
                                            ]
                                          }
                                        </option>
                                      )
                                    })
                                  ) : (
                                    <option value={'US'}>United States</option>
                                  )}
                                  ;
                                </select>
                              </div>

                              <div className="col-span-6 sm:col-span-3 lg:col-span-3">
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
                                  onBlur={formik.handleBlur}
                                  className={
                                    'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                                  }
                                >
                                  <option className="checkout__option" disabled>
                                    State / Province
                                  </option>
                                  {Object.keys(
                                    billingValues.billingSubdivisions
                                  ).map((index) => {
                                    return (
                                      <option value={index} key={index}>
                                        {
                                          billingValues.billingSubdivisions[
                                            index
                                          ]
                                        }
                                      </option>
                                    )
                                  })}
                                  ;
                                </select>
                              </div>

                              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="billingPostalZipCode">
                                  Postal Code
                                </label>
                                <input
                                  type="text"
                                  name="billingPostalZipCode"
                                  id="billingPostalZipCode"
                                  autoComplete="postal-code"
                                  value={
                                    formik.values.billingAddress === 'different'
                                      ? formik.values.billingPostalZipCode
                                      : formik.values.shippingPostalZipCode
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={
                                    formik.errors.billingPostalZipCode
                                      ? 'block w-full shadow-sm sm:text-sm border-4 border-red-500 mb-2 '
                                      : 'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black'
                                  }
                                />
                                {formik.touched.billingPostalZipCode &&
                                formik.errors.billingPostalZipCode ? (
                                  <div className="text-red-500">
                                    {formik.errors.billingPostalZipCode}
                                  </div>
                                ) : null}
                              </div>
                            </>
                          ) : (
                            ''
                          )}

                          <div className="col-span-6">
                            <p className="font-bold text-lg">SHIPPING METHOD</p>
                          </div>
                          <div className="col-span-6 ">
                            <label
                              className="checkout__label"
                              htmlFor="shippingOption"
                            ></label>
                            <select
                              value={shippingValues.shippingOptions}
                              name="shippingOption"
                              className={
                                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                              }
                              type="text"
                              id="shippingOption"
                              autoComplete="shippingOption"
                              // onChange={setShippingValues({ shippingOption })}
                              onBlur={formik.handleBlur}
                            >
                              <option
                                className="checkout__select-option"
                                disabled
                              >
                                Select a shipping method
                              </option>
                              {shippingValues.shippingOptions.length > 0 ? (
                                shippingValues.shippingOptions.map(
                                  (method, index) => {
                                    return (
                                      <option
                                        className="checkout__select-option"
                                        value={method.id}
                                        key={index}
                                      >{`${method.description} - $${method.price.formatted_with_code}`}</option>
                                    )
                                  }
                                )
                              ) : (
                                <option
                                  className="checkout__select-option"
                                  value={'Free'}
                                  key={1}
                                >
                                  No shipping for digital items
                                </option>
                              )}
                              ;
                            </select>
                          </div>
                          <div className="col-span-6">
                            <p className="font-bold text-lg">PAYMENT</p>
                          </div>
                          <div className="col-span-6">
                            <CardElement
                              className={
                                'p-4 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-4 border-black '
                              }
                              options={{
                                style: {
                                  base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                      color: '#000000'
                                    }
                                  },
                                  invalid: {
                                    color: '#9e2146'
                                  }
                                }
                              }}
                            />
                          </div>

                          {errors ? (
                            <div className="col-span-6">
                              <div className="mt-8 py-4 px-2 block w-full border-4  border-red-500">
                                <p className="text-lg">
                                  There was an error when submitting your
                                  purchase. Please check the errors and try
                                  again.
                                </p>
                                <ul className="mt-2">
                                  {errors.map((error) => (
                                    <li className="text-red-500">{error}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                          <div className="col-span-6"></div>
                        </div>
                        <div className="mt-8 py-4 px-2 block w-full border-4  border-black">
                          {line_items.map((line_item) => (
                            <>
                              <div className="flex flex-row justify-between m-2">
                                <h3 className="text-lg uppercase">
                                  {line_item.name}
                                </h3>
                                <p className="text-lg">
                                  {line_item.line_total.formatted_with_symbol}
                                </p>
                              </div>
                            </>
                          ))}
                          <div className="flex flex-row border-t-2 border-black justify-between m-2">
                            <h3 className="text-lg uppercase">Shipping</h3>

                            {shippingValues?.shippingOption?.price ? (
                              <p className="text-lg">
                                {
                                  shippingValues?.shippingOption?.price
                                    ?.formatted_with_symbol
                                }
                              </p>
                            ) : (
                              <p className="text-lg">Free</p>
                            )}
                          </div>
                          <div className="flex flex-row  justify-between m-2">
                            <h3 className="text-lg uppercase font-bold ">
                              total
                            </h3>

                            {shippingValues?.shippingOption?.price ? (
                              <p className="text-lg font-bold">
                                {`$${
                                  subtotal?.raw +
                                  shippingValues?.shippingOption?.price?.raw
                                }`}
                              </p>
                            ) : (
                              <p className="text-lg font-bold">
                                {`$${subtotal?.raw}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="py-6 lg:col-span-2">
                          <button
                            type="submit"
                            className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
                          >
                            {purchaseButtonMessage}
                          </button>
                          <div className="mt-10 w-48">
                            <StripeLogo className="text-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default CheckoutForm
