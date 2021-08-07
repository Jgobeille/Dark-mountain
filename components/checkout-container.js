import React, { useEffect, useState } from 'react'

import commerce from '@/lib/commerce'

import { useSettingsContext } from '@/context/settings'
import useForm from '@/utils/useForm'

const CheckoutForm = () => {
  const { checkoutToken } = useSettingsContext()
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
    shippingCountry: 'US',
    // Payment details
    cardNum: '4242 4242 4242 4242',
    expMonth: '11',
    expYear: '2023',
    ccv: '123',
    billingPostalZipcode: '94107',
    // Shipping and fulfillment data
    shippingCountries: {},
    shippingSubdivisions: {},
    shippingOptions: [],
    shippingOption: ''
  })
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
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country / Region
                          </label>
                          <select
                            id="country"
                            name="country"
                            autoComplete="country"
                            onChange={updateValue}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
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
