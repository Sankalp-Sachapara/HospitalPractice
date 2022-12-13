require("dotenv").config()
const bodyParser = require("body-parser");
const express = require("express");

const runDb = require("./src/db.js");

const swaggerjsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")

const {doctorRoute} = require("./src/Routes/doctor.routes.js")
const {patientRoute} = require("./src/Routes/patient.routes.js")
const { authRoute } = require("./src/Routes/authentication.routes.js");
const { generalRoute } = require("./src/Routes/general.routes.js");

const port = process.env.PORT


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
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
               url: 'http://localhost:3000/'  //Can have to change the server PORT here too
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
        apis:['App.js','./src/Routes/*.js'] //'./routes/*.js'
    }


const swaggerSpec = swaggerjsdocs(options)
runDb()

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/auth', authRoute)
app.use('/general', generalRoute)
app.use('/patient',patientRoute);
app.use('/doctor',doctorRoute);


app.listen(port, () => console.log("Server Started"))