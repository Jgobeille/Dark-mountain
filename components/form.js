import React, { useRef, useState } from 'react'
import { Formik } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { clearConfigCache } from 'prettier'

const Form = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const reRef = useRef()

  return (
    <div className="mx-4 justify-center">
      <Formik
        initialValues={{ name: '', email: '', message: '', file: null }}
        validateOnChange={false}
        validateOnBlur={false}
        validate={(values) => {
          console.log(values)
          const errors = {}
          if (!values.name) {
            errors.name = 'Please enter your name!'
          }
          if (!values.email) {
            errors.email = 'Please enter your email!'
          }
          if (!values.message) {
            errors.message = 'Please tell me what you want!'
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address'
          }
          return errors
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setLoading(true)
          setError(null)
          setMessage(null)
          setSubmitting(false)
          try {
            // function encodeImageFileAsURL(element) {
            //   var reader = new FileReader()
            //   reader.onloadend = function () {
            //     values.file = reader.result
            //   }
            //   return reader.readAsDataURL(element)
            // }
            // encodeImageFileAsURL(values.file)

            const token = await reRef.current.executeAsync()
            reRef.current.reset()

            values.token = token

            const res = await fetch('/api/sendEmail', {
              method: 'POST',
              body: JSON.stringify(values)
            })
            const text = JSON.parse(await res.text())

            // check if everything worked
            if (res.status >= 400 && res.status < 600) {
              setLoading(false)
              setError(text.message)
            } else {
              setLoading(false)
              setMessage(text.message)
            }
          } catch (error) {
            setLoading(false)
            setMessage(error.message)
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
          /* and other goodies */
        }) => (
          <form className="px-10 py-6" onSubmit={handleSubmit}>
            <div className="flex flex-column justify-between">
              <label className="" htmlFor="name">
                Name
              </label>
              <div>*Required</div>
            </div>
            <input
              className={
                errors.name
                  ? 'border-4 border-red-500 mb-4 p-2 w-full'
                  : 'border-4 border-black mb-4 p-2 w-full'
              }
              type="name"
              name="name"
              placeholder={errors.name ? `*${errors.name}` : 'Hugh Jazz'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <div className="flex flex-column justify-between">
              <label className="" htmlFor="email">
                Email
              </label>
              <div>*Required</div>
            </div>
            <input
              className={
                errors.email
                  ? 'border-4 border-red-500 mb-4 w-full'
                  : 'border-4 border-black mb-4 w-full'
              }
              type="email"
              name="email"
              placeholder={
                errors.email
                  ? `*${errors.email}`
                  : 'hughJazzSaxophones@gmail.com'
              }
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <div className="flex flex-column justify-between">
              <label htmlFor="message">Message</label>
              <div>*Required</div>
            </div>
            <textarea
              rows="5"
              cols="33"
              className={
                errors.message
                  ? 'border-4 border-red-500 mb-4 w-full'
                  : 'border-4 border-black mb-4 w-full'
              }
              type="message"
              name="message"
              placeholder={
                errors.message ? `*${errors.message}` : 'Can I get uhhhhhh....'
              }
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.message}
            />
            {/* <div className="flex flex-column justify-between">
              <label htmlFor="message">File</label>
              <div>*Optional</div>
            </div>

            <input
              className="mb-4 w-full"
              type="file"
              id="file"
              name="file"
              accept="image/png, image/jpeg"
              onChange={(event) => {
                setFieldValue('file', event.currentTarget.files[0])
              }}
            /> */}
            <div className="mb-4 w-full">
              <div className="font-secondary text-red-600">
                {error ? <p>Error: {error}</p> : ''}
              </div>
              <div className="font-main text-lg text-ghost-white">
                {message ? <p>{message} </p> : ''}
              </div>
            </div>
            <div className="mb-4 w-full">
              <ReCAPTCHA
                sitekey="6LdatF0cAAAAAInXk-A5hqbZEJQ-DHrjXhy447u_"
                size="invisible"
                ref={reRef}
              />
            </div>
            <button
              type="submit"
              className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
              disabled={isSubmitting}
            >
              {loading ? 'SENDING THAT SH*T...' : 'SEND THAT SH*T'}
            </button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Form
