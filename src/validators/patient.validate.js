const Joi = require("joi")

const newPatientSchema = Joi.object({
    patientName : Joi.string().required(),
    patientEmail : Joi.string().email().lowercase().required(),
    patientPassword : Joi.string().required(),
    patientDob: Joi.date().required(),
    patientGender: Joi.string().lowercase().valid('male', 'female', 'others').required(),
    patientWeight: Joi.number().required(),
    patientAddress : Joi.object({
                                addressLine: Joi.string().required(),
                                city: Joi.string().required(),
                                postalCode: Joi.number().required(),
                                country: Joi.string().required()
                                }),
    patientPhone : Joi.number().max(9999999999).min(1111111111).required(),

    

})

const prescriptionIdSchema = Joi.object({
    prescriptionId: Joi.string().required()
})

module.exports = {newPatientSchema, prescriptionIdSchema}