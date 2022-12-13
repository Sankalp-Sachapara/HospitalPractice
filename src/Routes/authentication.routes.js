const express = require("express")
const authRoute = express.Router()
const authController = require("../controllers/authentication.controller")


/**
 * @swagger
 *  components:
 *      schemas:
 *          Login:
 *             type: object
 *             properties:
 *                 email:
 *                     type: string
 *                 password:
 *                      type: string
 */



/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login for Users
 *      tag:
 *          - auth  
 *      description: Login for User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: Login Successfully
 *              
 */ 

authRoute.post('/login', authController.login)


module.exports = {authRoute}