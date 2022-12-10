const express = require("express")
const patientRoute = express.Router()

const verifyToken = require("../middleware/verifyPatient.middleware")


const patientController = require("../controllers/patient.controller")


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
 *                         addressLine:
 *                             type: string 
 *                         city:
 *                             type: string
 *                         postalCode:
 *                             type: number
 *                         country:
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
 *      tags:
 *          - patients   
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
patientRoute.post('/newPatient', patientController.newPatient)

/**
 * @swagger
 * /patient/prescription:
 *  get:
 *      summary: get the prescription of patient
 *      tags:
 *          - patients  
 *      description: get the prescription of patient
 *      responses:
 *          200:
 *              description: Added Successfully
 * 
 * 
 */

patientRoute.get('/prescription',verifyToken,patientController.prescription)

/**
 * @swagger
 * /patient/bill:
 *  post:
 *      summary: get the bill based on prescription of patient
 *      tags:
 *          - patients  
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

patientRoute.post('/bill',verifyToken,patientController.bill)


module.exports = {patientRoute}