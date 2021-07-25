const { useSettingsContext } = require('@/context/settings')

import Image from 'next/image'
import { RiFacebookBoxFill, RiInstagramFill } from 'react-icons/ri'
import ProductImage from '../public/pyramid-head.png'

const Modal = () => {
  const { modal, setModal } = useSettingsContext()
  console.log(modal)
  const showHideClassName = modal ? 'modal block' : 'modal hidden'

  return (
    <div
      className={`${showHideClassName} fixed top-0 left-0 w-full h-full bg-black z-50`}
    >
      <section className="modal-main flex flex-col lg:flex-row absolute lg:fixed bg-white lg:w-3/5 h-full lg:h-auto lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
        <Image
          className="visible"
          src={ProductImage}
          height={500}
          width={400}
          alt="product Image"
          title="Product Image"
        />

        <div className="flex flex-col flex-grow">
          <div className="flex flex-row justify-between border-b-2 p-2 border-black">
            <h3>ITEM NAME</h3>
            <button
              className="mr-2"
              type="button"
              onClick={() => setModal(false)}
            >
              X
            </button>
          </div>
          <div className="flex flex-row border-b-2 border-black items-center p-2">
            <h3 className="">SHARE</h3>
            <div className="flex flex-row mx-2">
              <RiInstagramFill className="text-3xl mx-2" />
              <RiFacebookBoxFill className="text-3xl mx-2" />
            </div>
          </div>
          <div>
            <h3 className="flex-grow border-b-2 border-black p-2">
              PRODUCT DETAILS
            </h3>
            <div className="py-4 px-4">
              <ul>
                <li>Organic cotton drill</li>
                <li>Off-shoulder asymmetric neckline</li>
                <li>Under-the-knee length</li>
                <li>Trench lapel</li>
                <li>6 button double breasted front</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="border-b-2 border-t-2 p-2 border-black">
              SHIPPING AND RETURNS
            </h3>
            <div className="py-4 px-4">
              <ul>
                <li>No</li>
                <li className="break-all">
                  You can ship items back at your own cost for a full no refund
                </li>
                <li>Just messing with you...</li>
                <li>No refunds. EVER.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Modal
