import React from 'react'
import { Formik } from 'formik'

const Form = () => (
  <div className="flex flex-row justify-center">
    <Formik
      initialValues={{ name: '', email: '', message: '' }}
      validateOnChange={false}
      validateOnBlur={false}
      validate={(values) => {
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
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
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
                ? 'border-4 border-red-500 mb-2 w-full'
                : 'border-4 border-black mb-4 w-full'
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
                ? 'border-4 border-red-500 mb-2 w-full'
                : 'border-4 border-black mb-4 w-full'
            }
            type="email"
            name="email"
            placeholder={
              errors.email ? `*${errors.email}` : 'hughJazzSaxophones@gmail.com'
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
                ? 'border-4 border-red-500 mb-2 w-full'
                : 'border-4 border-black mb-2 w-full'
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
          <button
            type="submit"
            className="border-4 shadow-brutalist-sm p-2 border-black hover:bg-black hover:text-white transition duration-300 ease-in-out"
            disabled={isSubmitting}
          >
            SEND THAT SH*T
          </button>
        </form>
      )}
    </Formik>
  </div>
)

export default Form
