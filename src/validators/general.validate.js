const Joi = require("joi")

const searchDoctorSchema = Joi.object({
    doctorName : Joi.string().required(),
    page: Joi.number(),
})

module.exports = {searchDoctorSchema}