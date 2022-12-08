const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const PatientRoute = express.Router()
const Patients = require("../models/patientModel")
const Prescription = require("../models/prescriptionModel")
const Bill = require("../models/billModel")


/**
 * @swagger
 *  components:
 *      schemas:
 *          Patient:
 *             type: object
 *             properties:
 *                 patientName:
 *                     type: string
 *                 patientEmail:
 *                     type: string
 *                 patientPassword:
 *                     type: string
 *                 patientDob:
 *                     type: string
 *                     format: date
 *                     example: '2022-07-01'
 *                 patientWeight:
 *                     type: number
 *                 patientGender:
 *                     type: string
 *                 patientAddress:
 *                     type: object
 *                     properties:
 *                         address_line:
 *                             type: string 
 *                         City:
 *                             type: string
 *                         Postal_Code:
 *                             type: number
 *                         Country:
 *                             type: string
 *                 patientPhone:
 *                      type: number
 *          Prescriptions:
 *             type: object
 *             properties:
 *                 patientId:
 *                     type: string
 *                 patientName:
 *                     type: string
 *                 diagnose:
 *                     type: string
 *          Bill:
 *             type: object
 *             properties:
 *                 prescriptionId:
 *                     type: string
 * 
 */



/**
 * @swagger
 * /patient/newPatient:
 *  post:
 *      summary: Registering a new patient  
 *      description: Add the new patient data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Patient'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

// creating one record
PatientRoute.post('/newPatient', async (req,res) => {
    
    const patient = new Patients({
        patientName: req.body.patientName,
        patientEmail: req.body.patientEmail,
        patientPassword: await bcrypt.hash(req.body.patientPassword,10),
        patientAddress: req.body.patientAddress,
        patientPhone: req.body.patientPhone,
        
    })
    const newPatient = await patient.save()
    res.json(newPatient);  
})
/**
 * @swagger
 * /patient/prescription:
 *  get:
 *      summary: get the prescription of patient  
 *      description: get the prescription of patient
 *      responses:
 *          200:
 *              description: Added Successfully
 * 
 * 
 */

PatientRoute.get('/prescription',verifyToken,async (req,res) => {
    let prescription = await Prescription.find({patientId:res.current_user.Patient._id})
    res.json(prescription)
})

/**
 * @swagger
 * /patient/bill:
 *  post:
 *      summary: get the bill based on prescription of patient  
 *      description: get the bill based on prescription of patient
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Bill'
 *      responses:
 *          200:
 *              description: Added Successfully
 * 
 * 
 */

PatientRoute.post('/bill',verifyToken,async (req,res) => {
    let bill = await Bill.find({prescriptionId:req.body.prescriptionId})
    res.json(bill)
})


async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    
    const bearer = bearerHeader.split(" ")[1];
    const tokendecoder = bearerHeader.split(" ");
    if(typeof bearerHeader !== 'undefined'){
                
        jwt.verify(bearer,process.env.PATIENT_ACCESS_TOKEN_SECRET,(err,authdata) =>{
            if(err){
                res.json({result:err})
            }
            else{
                res.current_user = JSON.parse(Buffer.from(tokendecoder[1].split(".")[1], 'base64').toString());
                next()
            }
        })

    }
    else{
        res.send({"result":"token not provided"})
    }
}


module.exports = {PatientRoute}