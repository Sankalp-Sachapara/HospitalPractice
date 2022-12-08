const express = require("express")
const bcrypt = require("bcrypt")
const DoctorRoute = express.Router()
const jwt = require("jsonwebtoken")
const moment = require('moment');
const Doctors = require("../models/doctorModel")
const Prescription = require("../models/prescriptionModel")
const Patients = require("../models/patientModel")
const Medicine = require("../models/medicineModel")
const Hospital = require("../models/hospitalModel")
const Bill = require("../models/billModel")


/**
 * @swagger
 *  components:
 *      schemas:
 *          Doctor:
 *             type: object
 *             properties:
 *                 doctorName:
 *                     type: string
 *                 doctorEmail:
 *                     type: string
 *                 doctorPassword:
 *                     type: string
 *                 doctorDepartment:
 *                     type: string
 *                 hospitalId:
 *                     type: string
 *          Prescription:
 *             type: object
 *             properties:
 *                 patientId:
 *                     type: string
 *                 diagnose:
 *                     type: string
 *          PrescriptionMedicine:
 *             type: object
 *             properties:
 *                 prescriptionId:
 *                     type: string
 *                 medicineId:
 *                     type: string
 *          Medicine:
 *             type: object
 *             properties:
 *                 medicineName:
 *                     type: string
 *                 medicineType:
 *                     type: string
 *                 medicineCost:
 *                     type: number
 *                 medicineDescription:
 *                     type: string
 *          Hospital:
 *             type: object
 *             properties:
 *                 hospitalName:
 *                     type: string
 *                 hospitalAddress:
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
 *                 noOfRooms:
 *                     type: number
 *                 roomCharge:
 *                     type: number
 *          bill:
 *             type: object
 *             properties:
 *                 prescriptionId:
 *                      type: string
 *                 doctorCharge:
 *                      type: number
 *                 noOfDays:
 *                      type: number
 *                 operationCharge:
 *                      type: number                     
 *          
 *             
 */

/**
 * @swagger
 * /doctor/newDoctor:
 *  post:
 *      summary: Registering a new Doctor  
 *      description: Add the new doctor data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Doctor'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

DoctorRoute.post('/newDoctor',async (req,res) => {
    const hospital = await Hospital.findById(req.body.hospitalId)
    if(hospital != null || hospital != undefined){

        const doctor = new Doctors({
            doctorName: req.body.doctorName,
            doctorEmail: req.body.doctorEmail,
            doctorPassword: await bcrypt.hash(req.body.doctorPassword,10),
            doctorDepartment: req.body.doctorDepartment,
            hospitalId: req.body.hospitalId,
            hospitalName: hospital.hospitalName
            
        })
        const newDoctor = await doctor.save()
        res.json(newDoctor);  
    }
    else{
        res.json({result: "incorrect hospital id try again"})
    }
    
})

/**
 * @swagger
 * /doctor/hospital:
 *  post:
 *      summary: Registering a new hospital 
 *      description: Add the new hospital data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospital'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

DoctorRoute.post('/hospital',verifyToken, async (req,res) =>{
    const hospital = new Hospital({
        hospitalName: req.body.hospitalName,
        hospitalAddress: req.body.hospitalAddress,
        noOfRooms: req.body.noOfRooms,
        roomCharge: req.body.roomCharge,
        
    })
    const newhospital = await hospital.save()
    res.json(newhospital); 
})

/**
 * @swagger
 * /doctor/newMedicine:
 *  post:
 *      summary: Registering a new Medicine 
 *      description: Add the new medicine data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Medicine'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

DoctorRoute.post('/newMedicine',async (req,res) => {
    const medicine = new Medicine({
        medicineName: req.body.medicineName,
        medicineType: req.body.medicineType,
        medicineCost: req.body.medicineCost,
        medicineDescription: req.body.medicineDescription
    })
    const newmedicine = await medicine.save()
    res.json(newmedicine)
})

/**
 * @swagger
 * /doctor/addPrescription:
 *  post:
 *      summary: Add a prescription for a patient   
 *      description: Add a prescription for a patient
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Prescription'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

DoctorRoute.post('/addPrescription',verifyToken, async(req,res) => {
    const patient = await Patients.findById(req.body.patientId)
   
    const prescription = new Prescription({
        doctorId: res.current_user.Doctor._id,
        patientId: req.body.patientId,
        doctorName: res.current_user.Doctor.doctorName,
        patientName: patient.patientName,
        diagnose: req.body.diagnose,
        // medicineId: req.body.medicineId,
    })
    // const addDoctor = await patient.findOneAndUpdate({_id:req.body.patientId},{doctorId: res.current_user.Doctor._id}, {new: true})
    const newprescription = await prescription.save()
    res.json(prescription); 
    // res.json(res.current_user.Doctor._id)

})

/**
 * @swagger
 * /doctor/addPrescription/addMedicine:
 *  post:
 *      summary: Add medicine for a prescription of a  patient  
 *      description: Add medicine for a prescription of a  patient
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PrescriptionMedicine'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 


DoctorRoute.post('/addPrescription/addMedicine',verifyToken,async(req,res) => {
    const prescription = await Prescription.findById(req.body.prescriptionId)
    
    if (prescription != null || prescription != undefined){
        
        const medicine = await Medicine.findById(req.body.medicineId)
        if (medicine != null || medicine != undefined){
            prescription.medicines.push(medicine) 
            let updatedPrescription = await prescription.save()
            res.json(updatedPrescription)
            
        }
        else{
            res.json({result: "medicine not found"})
        }
    }
    else{
        res.json({result: "prescription not found"})
    }
})

/** 
* @swagger
* /doctor/bill:
*  post:
*      summary: generate bill for a patient on basis of prescription id 
*      description: generate bill for a patient on basis of prescription id 
*      requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      $ref: '#/components/schemas/bill'
*      responses:
*          200:
*              description: Added Successfully
*              
*/ 

DoctorRoute.post('/bill', verifyToken, async (req,res) =>{
    let prescription = await Prescription.findById(req.body.prescriptionId)
    let hospital = await Hospital.findById(res.current_user.Doctor.hospitalId)
    let patient = await Patients.findById(prescription.patientId)
    var Days = 0
    if(req.body.noOfDays < 0){
        Days = 0
    }
    else{
        Days = req.body.noOfDays
    }
    let totalRoomCharge = hospital.roomCharge * Days
    let medicineTotal = prescription.medicines.reduce((a,b)=> a + b.medicineCost,0)
    let totalCharges = req.body.doctorCharge + totalRoomCharge + req.body.operationCharge + medicineTotal
    
    // console.log(totalCharges)
    const bill= new Bill({
        prescriptionId: req.body.prescriptionId,
        hospitalName: hospital.hospitalName,
        doctorName: res.current_user.Doctor.doctorName,
        patientName: patient.patientName,
        doctorCharge: req.body.doctorCharge,
        roomCharge: totalRoomCharge,
        medicineCharge: medicineTotal,
        operationCharge: req.body.operationCharge,
        noOfDays: req.body.noOfDays,
        totalCharge: totalCharges,
        
    })
    let newbill = await bill.save()
    
    res.json(newbill)

})

/**
 * @swagger
 * /doctor/searchPatient:
 *  get:
 *      summary: For Searching a doctor  
 *      description: For Searching a doctor
 *      parameters:
 *          - name: patientName
 *            in: query
 *            description: fetch with Patient name
 *            schema:
 *              type: string
 *          - name: page
 *            in: query
 *            description: page number you want to go
 *            schema:
 *              type: number
 *          - name: fromDate
 *            in: query
 *            description: prescription from date
 *            schema:
 *              type: string
 *              format: date
 *              example: '2022-07-01'
 *          - name: toDate
 *            in: query
 *            description: prescription to date
 *            schema:
 *              type: string
 *              format: date
 *              example: '2022-07-02'              
 *      responses:
 *          200:
 *              description: updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Prescription'
 *              
 */

 DoctorRoute.get("/searchPatient",verifyToken,async(req,res) =>{
    let search = req.query.patientName
    let fromDate = new Date(req.query.fromDate)
    let toDate = new Date(req.query.toDate)
    let updatetoDate = toDate.setDate(toDate.getDate() + 1)
    let page = 1
    if(req.query.page){
        page = req.query.page
    }
    let limit = 1
    console.log(fromDate)
    let prescription = await Prescription.find({"$expr": { 
        "$and": [
            { "$eq": ["$doctorId", res.current_user.Doctor._id] },
            { "$eq": [ "$patientName", search ]},
            {"$gte":["$created_at", fromDate]},
            { "$lte": ["$created_at",  updatetoDate ]},
        ]
     }
    })
    .sort({created_at: -1 })
    .limit(limit * 1)
    .skip((page -1) * limit)
    .exec();

    
    //  let patientIdcollection =  prescription.map(ob => {return ob.patientId})  // other cases
    //  let patientinfo = await Promise.all( patientIdcollection.map( e => Patients.findById(e))) // other cases
         

    let count = await Prescription.find({"$expr": { 
        "$and": [
            { "$eq": ["$doctorId", res.current_user.Doctor._id] },
            { "$eq": [ "$patientName",search ]},
            {"$gte":["$created_at", fromDate]},
            { "$lte": ["$created_at",  toDate ]},
        ]
     }
    })
    .countDocuments();
    let totalPages = Math.ceil(count/limit)
    let currentPage = page
    // res.json(prescription)
    res.json({
        SearchResult: prescription,
        TotalPages: totalPages,
        currentPage: parseInt(currentPage)})
})

async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    
    const bearer = bearerHeader.split(" ")[1];
    const tokendecoder = bearerHeader.split(" ");
    if(typeof bearerHeader !== 'undefined'){
                
        jwt.verify(bearer,process.env.DOCTOR_ACCESS_TOKEN_SECRET,(err,authdata) =>{
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



module.exports = {DoctorRoute}

