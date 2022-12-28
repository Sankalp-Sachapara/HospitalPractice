const Joi = require("joi")

const newDoctorSchema = Joi.object({
    doctorName : Joi.string().required(),
    doctorEmail : Joi.string().email().lowercase().required(),
    doctorPassword : Joi.string().required(),
    doctorDepartment: Joi.string().required(),
    
    
})

const newHospitalSchema = Joi.object({
    hospitalName:Joi.string().required(),
    hospitalAddress:Joi.object({
                                addressLine: Joi.string().required(),
                                city: Joi.string().required(),
                                postalCode: Joi.number().required(),
                                country: Joi.string().required()
                                }),
    noOfRooms:Joi.number().required(),
    roomCharge: Joi.number().required(),

})

const newMedicineSchema = Joi.object({
    medicineName:Joi.string().required(),
    medicineType:Joi.string().lowercase().valid('tablet', 'capsule', 'syringe', 'bottle').required(),
    medicineCost:Joi.number().required(),
    medicineDescription: Joi.string().required(),

})

const addPrescriptionSchema = Joi.object({
    hospitalId: Joi.string().required(),
    patientId: Joi.string().required(),
    diagnose:Joi.string().required(),
})

const addMedicinePrescription = Joi.object({
    prescriptionId: Joi.string().required(),
    medicineId:Joi.string().required(),
})

const generatebillSchema = Joi.object({
    prescriptionId: Joi.string().required(),
    doctorCharge:Joi.number().required(),
    noOfDays:Joi.number().required(),
    operationCharge:Joi.number().required(),
})

const searchPatientSchema = Joi.object({
    patientName : Joi.string().required(),
    page:Joi.number(),
    fromDate:Joi.date().required(),
    toDate:Joi.date().required(),
})

const visitSchema = Joi.object({
    hospitalId:Joi.string(),
    timings: Joi.object({
        from:Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // time validation remaining
        to:Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    }),
})

module.exports = {
    newDoctorSchema, 
    newHospitalSchema, 
    newMedicineSchema, 
    addPrescriptionSchema,
    addMedicinePrescription,
    generatebillSchema,
    searchPatientSchema,
    visitSchema,
}