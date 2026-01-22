import Joi from 'joi'

export const checkoutSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name must contain only letters',
      'string.empty': 'Full name is required'
    }),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Pincode must be exactly 6 digits',
      'string.empty': 'Pincode is required'
    }),

  phoneNumber: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must start with 6,7,8 or 9',
      'string.empty': 'Phone number is required'
    }),

  addressLine1: Joi.string().required().messages({
    'string.empty': 'Address Line 1 is required'
  }),

  // OPTIONAL (important fix)
  addressLine2: Joi.string().allow('').optional(),

  city: Joi.string().required().messages({
    'string.empty': 'City is required'
  }),

  country: Joi.string().required().messages({
    'string.empty': 'Country is required'
  }),

  state: Joi.string().required().messages({
    'string.empty': 'State is required'
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),

  // IMPORTANT FIX
  paymentMethod: Joi.string().min(1).required().messages({
    'string.empty': 'Payment method is required'
  })
})
