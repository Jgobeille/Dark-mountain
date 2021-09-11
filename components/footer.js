import { useSettingsContext } from '@/context/settings'

// Code comment
function Footer() {
  const { setLegalModal, setSelectedPolicy } = useSettingsContext()
  return (
    <footer className="border-black border-t-4" aria-labelledby="footerHeading">
      <div className="py-4 mx-auto overflow-hidden border-b-2">
        <div className="flex justify-center w-3733 pl-6  overflow-hidden">
          <div className=" flex flex-row whitespace-nowrap animate-scroll slide-track ">
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('return')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Return Policy
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('service')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Terms of Service
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('privacy')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Privacy Policy
            </div>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.instagram.com/darkmountaincult/"
              rel="noreferrer"
              target="_blank"
            >
              Instragram
            </a>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.facebook.com/Dark-Mountain-Cult-107346627630353"
              rel="noreferrer"
              target="_blank"
            >
              Facebook
            </a>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Made with ❤ by Jamie Gobeille
            </div>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Thanks for checking out the site!
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('return')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Return Policy
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('service')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Terms of Service
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('privacy')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Privacy Policy
            </div>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.instagram.com/darkmountaincult/"
              rel="noreferrer"
              target="_blank"
            >
              Instragram
            </a>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.facebook.com/Dark-Mountain-Cult-107346627630353"
              rel="noreferrer"
              target="_blank"
            >
              Facebook
            </a>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Made with ❤ by Jamie Gobeille
            </div>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Thanks for checking out the site!
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('return')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Return Policy
            </div>
            <div
              onClick={() => {
                setLegalModal(true)
                setSelectedPolicy('service')
              }}
              className="mx-2 text-lg font-bold cursor-pointer"
            >
              Terms of Service
            </div>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Privacy Policy
            </div>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.instagram.com/darkmountaincult/"
              rel="noreferrer"
              target="_blank"
            >
              Instragram
            </a>
            <a
              className="mx-2 text-lg font-bold cursor-pointer"
              href="https://www.facebook.com/Dark-Mountain-Cult-107346627630353"
              rel="noreferrer"
              target="_blank"
            >
              Facebook
            </a>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Made with ❤ by Jamie Gobeille
            </div>
            <div className="mx-2 text-lg font-bold cursor-pointer">
              Thanks for checking out the site!
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
