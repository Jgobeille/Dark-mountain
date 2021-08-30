import { useSettingsContext } from '@/context/settings'
import commerce from '@/lib/commerce'
import fetchShippingOptionsAndSubdivisions from '@/utils/fetchShippingOptionsAndSubdivisions'

/**
 * Fetches a list of countries available to ship to checkout token
 * https://commercejs.com/docs/sdk/checkout#list-available-shipping-countries
 *
 * @param {string} dId
 */

const fetchShippingCountries = async (
  checkoutTokenId,
  shippingValues,
  setShippingValues,
  billingValues,
  setBillingValues
) => {
  try {
    const countries = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    )
    setShippingValues({
      ...shippingValues,
      shippingCountries: countries.countries
    })

    fetchShippingOptionsAndSubdivisions(
      checkoutTokenId,
      'US',
      null,
      shippingValues,
      setShippingValues,
      'shipping',
      countries.countries
    )
    fetchShippingOptionsAndSubdivisions(
      checkoutTokenId,
      'US',
      null,
      billingValues,
      setBillingValues,
      'billing'
    )
  } catch (error) {
    console.log(
      'There was an error fetching a list of shipping countries',
      error
    )
  }
}

const generateCheckoutToken = async (
  setCheckoutToken,
  shippingValues,
  setShippingValues,
  billingValues,
  setBillingValues,
  line_items,
  id
) => {
  console.log(line_items)
  if (line_items.length) {
    try {
      const token = await commerce.checkout.generateToken(id, {
        type: 'cart'
      })
      setCheckoutToken(token)
      fetchShippingCountries(
        token.id,
        shippingValues,
        setShippingValues,
        billingValues,
        setBillingValues
      )
    } catch (error) {
      console.log('There was an error in generating a token', error)
    }
  }
}

export default generateCheckoutToken
