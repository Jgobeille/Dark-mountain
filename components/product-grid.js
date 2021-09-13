import ProductCard from '@/components/product-card'
import { clearConfigCache } from 'prettier'

function ProductGrid({ products }) {
  //loop through products and arrange physical and digital into array of arrays

  // sort alphabetically
  const groupedProducts = products.sort(function (a, b) {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })

  let productsGroupedArray = []
  let i = 0
  while (i < groupedProducts.length) {
    // slice off the first and second
    productsGroupedArray.push(groupedProducts.slice(i, i + 2))
    i += 2
  }

  return (
    <>
      <div className="flex flex-row items-center border-b-4 border-black w-full ">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold  ml-5 md:ml-8 m-2">
          PRINTS
        </h1>
        <p className="text-md m-2">*8/11in size</p>
      </div>
      <div className="gap-7 md:gap-14 grid sm:grid-cols-2 lg:grid-cols-3 px-10 md:px-20 py-10">
        {productsGroupedArray.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
    </>
  )
}

export default ProductGrid
