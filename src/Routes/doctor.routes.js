const express = require("express")
const doctorRoute = express.Router()

const verifyToken = require("../middleware/verifyDoctor.middleware")
const doctorController = require("../controllers/doctor.controller")


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
 *                         addressLine:
 *                             type: string 
 *                         city:
 *                             type: string
 *                         postalCode:
 *                             type: number
 *                         country:
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
 * /doctor/:
 *  post:
 *      summary: Registering a new Doctor
 *      tags:
 *          - doctors  
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

doctorRoute.post('/',doctorController.newDoctor)

/**
 * @swagger
 * /doctor/hospital:
 *  post:
 *      summary: Registering a new hospital
 *      tags:
 *          - doctors 
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

doctorRoute.post('/hospital',verifyToken, doctorController.newHospital)

/**
 * @swagger
 * /doctor/medicine:
 *  post:
 *      summary: Registering a new Medicine
 *      tags:
 *          - doctors 
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

doctorRoute.post('/medicine',verifyToken,doctorController.newMedicine)

/**
 * @swagger
 * /doctor/prescription:
 *  post:
 *      summary: Add a prescription for a patient
 *      tags:
 *          - doctors   
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

doctorRoute.post('/prescription',verifyToken, doctorController.addPrescription)

/**
 * @swagger
 * /doctor/prescription/medicine:
 *  post:
 *      summary: Add medicine for a prescription of a  patient
 *      tags:
 *          - doctors  
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


doctorRoute.post('/prescription/medicine',verifyToken,doctorController.addPrescriptionMedicine)

/** 
* @swagger
* /doctor/bill:
*  post:
*      summary: generate bill for a patient on basis of prescription id
*      tags:
*          - doctors 
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

doctorRoute.post('/bill', verifyToken,doctorController.bill)

/**
 * @swagger
 * /doctor/search:
 *  get:
 *      summary: For Searching a patient for user user
 *      tags:
 *          - doctors  
 *      description: For Searching a patient
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

 doctorRoute.get("/search",verifyToken,doctorController.searchPatient)



module.exports = {doctorRoute}

