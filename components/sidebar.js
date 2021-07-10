import Image from 'next/image'
import Logo from '../public/DMC-main-logo.jpg'
import { RiInstagramFill } from 'react-icons/ri'

function Sidebar() {
  return (
    <div className="md:w-1/4 border-l-4 border-black">
      <div class="sidebar">
        <Image src={Logo} height={500} width={500} alt="logo" title="logo" />
        <div className="flex flex-column">
          <RiInstagramFill />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
