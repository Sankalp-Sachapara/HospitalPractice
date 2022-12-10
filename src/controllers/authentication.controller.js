const Joi = require("joi")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Doctors = require("../models/doctor.model");
const Patients = require("../models/patient.model")

const {authSchema} = require("../validators/auth.validate");


var refreshTokens = []

exports.login = async (req,res) => {
    try{
        const result = await authSchema.validateAsync(req.body)
        

        let doctor = await Doctors.findOne({doctorEmail :result.email})
        let patient = await Patients.findOne({patientEmail :result.email})
        
        if(doctor != null ){
        if (await bcrypt.compare(result.password, doctor.doctorPassword)) 
            {   
                
                
                //access token for buyer
                const accessToken = jwt.sign({doctor}, process.env.DOCTOR_ACCESS_TOKEN_SECRET, {expiresIn: "60m"})
                //refresh token for seller
                const refreshToken = jwt.sign({doctor}, process.env.DOCTOR_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
                refreshTokens.push(refreshToken)
                return res.json (
                    {
                        status : "Success",
                        error : false,
                        message : "Doctor successfully logged in ",
                        data : {accessToken: accessToken, refreshToken: refreshToken }
                    }
                )
            } 
        }
        else if(patient != null ){
            if (await bcrypt.compare(result.password, patient.patientPassword)) {
                //access token for seller
                const accessToken = jwt.sign({patient}, process.env.PATIENT_ACCESS_TOKEN_SECRET, {expiresIn: "60m"})
                //refresh token for buyer
                const refreshToken = jwt.sign({patient}, process.env.PATIENT_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
                refreshTokens.push(refreshToken)
                return res.json (
                    {
                        status : "Success",
                        error : false,
                        message : "Patient successfully logged in",
                        data : {accessToken: accessToken, refreshToken: refreshToken }
                    }
                )
            
            }
        }
        else if (doctor == null || patient == null) 
        {
            return res.status(404).send ("User does not exist!")
        }
        else 
        {
            return res.status(401).send("Password Incorrect!")
        }
       
    }catch(err){
        
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to LOGIN",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to LOGIN",
            data : { result: err}
        })
        }
    }
}
