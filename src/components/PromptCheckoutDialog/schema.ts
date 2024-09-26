import * as Yup from 'yup'

export const schemaPaymentAddressForm = Yup.object().shape({
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  addressLine1: Yup.string().required('This field is required'),
  addressLine2: Yup.string(),
  city: Yup.string(),
  state: Yup.string().required("It's required"),
  postcode: Yup.string().required("It's required"),
})
