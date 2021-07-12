import ProductCard from '@/components/product-card'

function ProductGrid({ products }) {
  return (
    <div className=" w-full lg:w-3/4 border-black">
      <div className="border-b-4 border-black w-full ">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold  ml-8 m-2">
          PRINTS
        </h1>
      </div>
      <div className=" gap-7 md:gap-14 grid sm:grid-cols-2 lg:grid-cols-3 px-10 md:px-20 py-10">
        {products.map(ProductCard)}
      </div>
    </div>
  )
}

export default ProductGrid
