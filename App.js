require("dotenv").config()
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const swaggerjsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const {DoctorRoute} = require("./Routes/doctor.js")
const {PatientRoute} = require("./Routes/patient.js")

const Doctors = require("./models/doctorModel");
const Patients = require("./models/patientModel")
const Hospital = require("./models/hospitalModel")

// const port = process.env.PORT


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/HospitalManagement')

const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log("connected to database"))

app.use(express.json())


const options ={
    definition:{
        openapi:'3.0.0',
        info:{
            title:"Hospital management",
            version:"1.0.0"
        },
       
        servers:[
            {
               url: 'http://localhost:3000/'
            }
        
            ],
        
        
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security:[
            {
                bearerAuth: [],
            },
        ],
        },  
        apis:['App.js','./routes/*.js'] //'./routes/*.js'
    }


const swaggerSpec = swaggerjsdocs(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use('/patient',PatientRoute);
app.use('/doctor',DoctorRoute);

var refreshTokens = []

/**
 * @swagger
 *  components:
 *      schemas:
 *          Login:
 *             type: object
 *             properties:
 *                 Email:
 *                     type: string
 *                 Password:
 *                      type: string
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
 * /:
 *  get:
 *      summary: welcome to site
 *      description: welcome to site
 *      responses:
 *          200:
 *              description: To test get method
 */
app.get('/', async (req,res) => {
    res.send("welcome to site")
})




/**
 * @swagger
 * /hospitalList:
 *  get:
 *      summary: The get hospital data from database  
 *      description: displaying all hospital data from database
 *      responses:
 *          200:
 *              description: successfully  displaying all product data from database
 *              
 */ 

app.get('/hospitalList', async (req,res) =>{
    const hospital = await Hospital.find()
    res.json(hospital)

})

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login for Users  
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

app.post('/login', async (req,res) => {
    
    let Doctor = await Doctors.findOne({doctorEmail :req.body.Email})
    let Patient = await Patients.findOne({patientEmail :req.body.Email})
    
    if(Doctor != null ){
    if (await bcrypt.compare(req.body.Password, Doctor.doctorPassword)) 
        {   
            
            
            //access token for buyer
            const accessToken = jwt.sign({Doctor}, process.env.DOCTOR_ACCESS_TOKEN_SECRET, {expiresIn: "60m"})
            //refresh token for seller
            const refreshToken = jwt.sign({Doctor}, process.env.DOCTOR_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
            refreshTokens.push(refreshToken)
            res.json ({accessToken: accessToken, refreshToken: refreshToken})
        } 
    }
    else if(Patient != null ){
        if (await bcrypt.compare(req.body.Password, Patient.patientPassword)) {
            //access token for seller
            const accessToken = jwt.sign({Patient}, process.env.PATIENT_ACCESS_TOKEN_SECRET, {expiresIn: "60m"})
            //refresh token for buyer
            const refreshToken = jwt.sign({Patient}, process.env.PATIENT_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
            refreshTokens.push(refreshToken)
            res.json ({accessToken: accessToken, refreshToken: refreshToken})
        
            }
        }
    else if (Doctor == null || Patient == null) 
    {
        
        res.status(404).send ("User does not exist!")
    }
    else {
    res.status(401).send("Password Incorrect!")
    }
   
})


/**
 * @swagger
 * /searchDoctor/{doctorName}:
 *  get:
 *      summary: For Searching a doctor  
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/doctorSearch'
 *              
 */

 app.get("/searchDoctor/:doctorName",async(req,res) =>{
    let search = req.query.doctorName
    let page = 1
    if(req.query.page){
        page = req.query.page
    }
    let limit = 3
    
    let doctors = await Doctors.find({doctorName:{$regex:'.*' + search + '.*',$options:'i'}})
    .limit(limit * 1)
    .skip((page -1) * limit)
    .exec();

    let count = await Doctors.find({doctorName:{$regex:'.*' + search + '.*',$options:'i'}})
    .countDocuments();
    let totalPages = Math.ceil(count/limit)
    let currentPage = page
    res.json({
        SearchResult: doctors,
        TotalPages: totalPages,
        currentPage: parseInt(currentPage)})
})




app.listen(3000, () => console.log("Server Started"))