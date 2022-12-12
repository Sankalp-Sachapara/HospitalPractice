const express = require("express")
const generalRoute = express.Router()
const generalController = require("../controllers/general.controller")

/**
 * @swagger
 *  components:
 *      schemas:
 *          doctorSearch:
 *             type: object
 *             properties:
 *                 doctorName:
 *                     type: string
 *                 doctorDepartment:
 *                     type: string
 *                 hospitalId:
 *                     type: string
 *                 hospitalName:
 *                     type: string
 */


/**
 * @swagger
 * /general:
 *  get:
 *      summary: welcome to site
 *      tags:
 *          - general
 *      description: welcome to site
 *      responses:
 *          200:
 *              description: To test get method
 */
generalRoute.get('/',generalController.welcome )

/**
 * @swagger
 * /general/hospital:
 *  get:
 *      summary: To get List of hospital data from database
 *      tags:
 *          - general  
 *      description: displaying all hospital data from database
 *      responses:
 *          200:
 *              description: successfully  displaying all product data from database
 *              
 */ 

generalRoute.get('/hospital', generalController.hospitalList)


/**
 * @swagger
 * /general/search/{doctorName}:
 *  get:
 *      summary: For Searching a doctor 
 *      tags:
 *          - general 
 *      description: For Searching a doctor
 *      parameters:
 *          - name: doctorName
 *            in: query
 *            description: fetch with Doctor information
 *            schema:
 *              type: string
 *          - name: page
 *            in: query
 *            description: page number you want to go
 *            schema:
 *              type: number 
 *                      
 *      responses:
 *          200:
 *              description: updated Successfully
 *              
 */

generalRoute.get("/search/:doctorName",generalController.searchDoctor)




module.exports = {generalRoute}