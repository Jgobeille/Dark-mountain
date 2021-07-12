import Link from 'next/link'
import Image from 'next/image'

import { formatCurrencyValue } from '@/utils/format-currency-value'
import { useSettingsContext } from '@/context/settings'

function ProductCard({ id, images, name, price, slug }) {
  const { activeCurrency } = useSettingsContext()

  const [primaryImage] = images

  return (
    <article className="border-4 border-black shadow-brutalist-lg" key={id}>
      <>
        <div className="text-left ml-2 mt-2 absolute z-10">
          <p className="text-black font-bold text-lg lg:text-xl">
            {formatCurrencyValue({
              currency: activeCurrency,
              value: price
            })}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg cursor-pointer w-full overflow-hidden relative">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              height={primaryImage.height}
              width={primaryImage.width}
              alt={name}
              title={name}
            />
          ) : null}
        </div>
        <div>
          <button className="text-center py-2 w-full border-t-2 border-black">
            ADD TO CART
          </button>
        </div>
      </>
    </article>
  )
}

export default ProductCard
