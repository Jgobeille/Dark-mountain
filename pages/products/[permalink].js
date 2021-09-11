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

  const product = await commerce.products.retrieve(permalink, {
    type: 'permalink'
  })

  return {
    props: {
      product
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

export default function ProductPage({ product }) {
  const { activeCurrency } = useSettingsContext()
  const router = useRouter()

  console.log(product.description)
  return (
    <div>
      <Meta
        title={product.name}
        desc={product.description}
        canonical={`https://dark-mountain.vercel.app${router.asPath}`}
        css="styles/styles.css"
        image={product.media.source}
      />
      <div className="modal block lg:fixed top-0 left-0 w-full h-full bg-black z-50">
        <section className="flex flex-col lg:flex-row md:mx-32 lg:mx-0 lg:absolute lg:fixed bg-white lg:w-4/5 h-full lg:h-auto lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div className="flex flex-row w-full justify-center">
            <Link href={`/`}>
              <a className="lg:hidden absolute m-4 text-xl z-10 right-0 md:right-32">
                X
              </a>
            </Link>
            <Image
              className="visible lg:w-1/2"
              src={product.media.source}
              height={500}
              width={500}
              alt="product Image"
              title="Product Image"
            />
          </div>

          <div className="flex flex-col flex-grow lg:w-full lg:border-l-2  border-black">
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
                <PinterestShareButton
                  url={`https://dark-mountain.vercel.app${router.asPath}`}
                >
                  <PinterestIcon
                    size={32}
                    bgStyle={{ fill: 'black' }}
                    round="true"
                  />
                </PinterestShareButton>
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
                <ul>
                  <li>No</li>
                  <li className="break-all">
                    You can ship items back at your own cost for a full no
                    refund
                  </li>
                  <li>Just messing with you...</li>
                  <li>No refunds. EVER.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
