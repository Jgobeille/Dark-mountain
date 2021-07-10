import React from 'react'
import { Formik } from 'formik'

const Form = () => (
  <div className="flex flex-row">
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={(values) => {
        const errors = {}
        if (!values.email) {
          errors.email = 'Required'
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
          <input
            className="border-4 border-black mb-4 w-full"
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email && errors.email}
          <input
            className="border-4 border-black mb-4 w-full"
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          <textarea
            rows="5"
            cols="33"
            className="border-4 border-black mb-2 w-full"
            type="message"
            name="message"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {errors.password && touched.password && errors.password}
          <button
            type="submit"
            className="border-4 border-black"
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
