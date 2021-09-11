import ProductCard from '@/components/product-card'

function ProductGrid({ products }) {
  return (
    <>
      <div className="flex flex-row items-center border-b-4 border-black w-full ">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold  ml-5 md:ml-8 m-2">
          PRINTS
        </h1>
        <p className="text-md m-2">*8/11in size</p>
      </div>
      <div className="gap-7 md:gap-14 grid sm:grid-cols-2 lg:grid-cols-3 px-10 md:px-20 py-10">
        {products.map(ProductCard)}
      </div>
    </>
  )
}

export default ProductGrid
