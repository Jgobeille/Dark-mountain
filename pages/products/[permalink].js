// pages/products/[permalink].js
import React from 'react'
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
  const { activeCurrency } = useSettingsContext()
  const router = useRouter()

  console.log(policies)
  return (
    <div>
      <Meta
        title={product.name}
        desc={product.description}
        canonical={`https://dark-mountain.vercel.app${router.asPath}`}
        css="styles/styles.css"
        image={product.media.source}
      />
      <div className="w-full blur bg-opacity-20 bg-black z-50">
        <section className="flex flex-col lg:flex-row lg:mx-0 min-h-screen s bg-white  h-full  ">
          <div className="lg:w-1/2 ">
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
            <div className="flex flex-row justify-between border-b-2 p-2 border-black">
              <h3 className="uppercase">{product.name}</h3>
              <Link href={`/`}>
                <a className="mr-2 hidden lg:block ">X</a>
              </Link>
            </div>
            <div className="flex flex-row border-b-2 border-black items-center p-2">
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
            <div className="flex flex-row border-b-2 border-black ">
              <h3 className="p-2">PRICE</h3>
              <p className="text-black font-bold p-2">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: product.price.formatted * 100
                })}
              </p>
            </div>
            <div>
              <h3 className="flex-grow border-b-2 border-black p-2">
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
          <CheckoutForm />
        </section>
      </div>
    </div>
  )
}
