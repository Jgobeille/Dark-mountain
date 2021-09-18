// pages/products/[permalink].js
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Meta from '@/components/seo-meta.js'
import { useRouter } from 'next/router'
import commerce from '@/lib/commerce'
import parse from 'html-react-parser'
import { formatCurrencyValue } from '@/utils/format-currency-value'
const { useSettingsContext } = require('@/context/settings')
import CheckoutForm from '@/components/checkout-container'
import getPolicies from '@/lib/get-policies'

import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import { useCartDispatch } from '@/context/cart'
import addToCart from '@/utils/addToCart'
import generateCheckoutToken from '@/utils/generateCheckoutToken'

export async function getStaticProps({ params }) {
  const { permalink } = params

  const { policies } = await getPolicies()

  const product = await commerce.products.retrieve(permalink, {
    type: 'permalink'
  })

  return {
    props: {
      product,
      policies
    }
  }
}

export async function getStaticPaths() {
  const { data: products } = await commerce.products.list()

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink
      }
    })),
    fallback: false
  }
}

export default function ProductPage({ product, policies }) {
  const router = useRouter()

  const {
    activeCurrency,
    addToCartStatus,
    setAddToCartStatus,
    setCheckoutToken,
    shippingValues,
    setShippingValues,
    billingValues,
    setBillingValues,
    setCheckoutInitialized
  } = useSettingsContext()
  const { setCart } = useCartDispatch()

  useEffect(() => {
    setCheckoutInitialized(false)
  }, [])

  return (
    <div>
      <Meta
        title={product.name}
        desc={product.description}
        canonical={`https://dark-mountain.vercel.app${router.asPath}`}
        css="styles/styles.css"
        image={product.media.source}
      />
      <div className="w-full ">
        <section className="flex flex-col lg:flex-row lg:mx-0 min-h-screen s bg-white  h-full  ">
          <div className="lg:w-1/2 md:px-24 border-b-2 lg:border-b-0 border-black">
            <Image
              src={product.media.source}
              height={150}
              width={200}
              alt="product Image"
              title="Product Image"
              layout="responsive"
            />
          </div>

          <div className="flex flex-col flex-grow w-full lg:w-1/2 lg:border-l-2  border-black">
            <div className="flex flex-row border-black ">
              <p className="text-black text-center font-bold py-6 w-1/2">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: product.price.formatted * 100
                })}
              </p>
              <button
                onClick={() => {
                  addToCart(
                    product.id,
                    setAddToCartStatus,
                    setCart,
                    generateCheckoutToken,
                    setCheckoutToken,
                    shippingValues,
                    setShippingValues,
                    billingValues,
                    setBillingValues
                  )
                }}
                className="w-1/2 hover:bg-black hover:text-white bg-turquoise-default transition duration-300 ease-in-out text-center py-4  border-l-2 border-black font-bold "
              >
                {product.id === addToCartStatus.id
                  ? addToCartStatus.message
                  : 'ADD TO CART'}
              </button>
            </div>
            <div className="flex flex-row justify-between border-t-2 border-b-2 p-2 border-black">
              <h3 className="uppercase">{product.name}</h3>
            </div>
            <div className="flex flex-row border-black items-center p-2">
              <h3 className="">SHARE</h3>
              <div className="flex flex-row mx-2">
                <TwitterShareButton
                  url={`https://dark-mountain.vercel.app${router.asPath}`}
                >
                  <TwitterIcon
                    size={32}
                    bgStyle={{ fill: 'black' }}
                    round="true"
                    className="mr-2"
                  />
                </TwitterShareButton>
                <FacebookShareButton
                  url={`https://dark-mountain.vercel.app${router.asPath}`}
                >
                  <FacebookIcon
                    size={32}
                    bgStyle={{ fill: 'black' }}
                    round="true"
                    className="mr-2"
                  />
                </FacebookShareButton>
                <RedditShareButton
                  url={`https://dark-mountain.vercel.app${router.asPath}`}
                >
                  <RedditIcon
                    size={32}
                    bgStyle={{ fill: 'black' }}
                    round="true"
                    className="mr-2"
                  />
                </RedditShareButton>
                {/* <PinterestShareButton
                  url={`https://dark-mountain.vercel.app${router.asPath}`}
                >
                  <PinterestIcon
                    size={32}
                    bgStyle={{ fill: 'black' }}
                    round="true"
                  />
                </PinterestShareButton> */}
              </div>
            </div>

            <div>
              <h3 className="flex-grow border-b-2 border-t-2 border-black p-2">
                PRODUCT DETAILS
              </h3>
              <div className="py-4 px-4">{parse(product.description)}</div>
            </div>
            <div>
              <h3 className="border-b-2 border-t-2 p-2 border-black">
                SHIPPING AND RETURNS
              </h3>
              <div className="py-4 px-4">
                {parse(policies.returnsPolicy.policyDescription)}
              </div>
            </div>
          </div>
        </section>

        <CheckoutForm />
      </div>
    </div>
  )
}
