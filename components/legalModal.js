import { useSettingsContext } from '@/context/settings'
import parse from 'html-react-parser'

const Modal = () => {
  const {
    setLegalModal,
    legalModal,
    selectedPolicy,
    policies
  } = useSettingsContext()

  const showHideClassName = legalModal ? ' block' : ' hidden'

  return (
    <div
      className={`${showHideClassName} blur absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 z-50`}
    >
      <section className="flex flex-col h-full absolute overflow-hidden overflow-y-scroll bg-white border-black border-4 md:fixed md:h-1/2 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 lg:w-1/2">
        <div className="flex flex-row border-b-2 p-4 border-black">
          {selectedPolicy === 'privacy' ? (
            <h1 className="flex-grow text-3xl ">{policies[0].title}</h1>
          ) : selectedPolicy === 'return' ? (
            <h1 className="flex-grow text-3xl ">{policies[1].title}</h1>
          ) : selectedPolicy === 'service' ? (
            <h1 className="flex-grow text-3xl ">{policies[2].title}</h1>
          ) : (
            ''
          )}
          <button onClick={() => setLegalModal(false)} className="text-xl pr-2">
            X
          </button>
        </div>
        <div>
          {selectedPolicy === 'privacy' ? (
            <div className="p-8">{parse(policies[0].policyDescription)}</div>
          ) : selectedPolicy === 'return' ? (
            <div className="p-8">{parse(policies[1].policyDescription)}</div>
          ) : selectedPolicy === 'service' ? (
            <div className="p-8">{parse(policies[2].policyDescription)}</div>
          ) : (
            ''
          )}
        </div>
      </section>
    </div>
  )
}

export default Modal
