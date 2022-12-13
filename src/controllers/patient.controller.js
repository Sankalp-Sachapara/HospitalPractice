const Patients = require("../models/patient.model")
const Prescription = require("../models/prescription.model")
const Bill = require("../models/bill.model")

const bcrypt = require("bcrypt")

const {newPatientSchema, prescriptionIdSchema} = require("../validators/patient.validate")

exports.newPatient = async (req,res) => {
    try{
        const result = await newPatientSchema.validateAsync(req.body)
        
        const patient = new Patients({
            patientName: result.patientName,
            patientEmail: result.patientEmail,
            patientPassword: await bcrypt.hash(result.patientPassword,10),
            patientDob: result.patientDob,
            patientGender: result.patientGender,
            patientWeight: result.patientWeight,
            patientAddress: result.patientAddress,
            patientPhone: result.patientPhone,
            
        })
        const newPatient = await patient.save()
       return res.json({
                            status : "Success",
                            error : false,
                            message : "Successfully register new patient User",
                            data : newPatient
                        });  
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to register new patient user",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to register new patient User",
            data : { result: err}
                        })
            }
        }
    }

exports.prescription =  async (req,res) => {
    try{
        let prescription = await Prescription.find({patientId:res.currentUser.data._id})
        return res.json({
                          status : "Success",
                          error : false,
                          message : "Successfully Displayed the prescription ",
                          data : prescription
                        })

    }catch(err){
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to display perscription",
            data : { result: err}
        })
    }
}

exports.bill = async (req,res) => {
    try{
        const result = await prescriptionIdSchema.validateAsync(req.body)
        let bill = await Bill.find({prescriptionId:result.prescriptionId})
        return res.json({
                            status : "Success",
                            error : false,
                            message : "Successfully displayed bill",
                            data : bill
                        })

    }catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to displayed bill",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to display bill",
            data : { result: err}
        })
    }
    }
}