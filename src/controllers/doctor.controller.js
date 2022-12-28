const Doctors = require("../models/doctor.model")
const Prescription = require("../models/prescription.model")
const Patients = require("../models/patient.model")
const Medicine = require("../models/medicine.model")
const Hospital = require("../models/hospital.model")
const Bill = require("../models/bill.model")
const Visit = require("../models/visits.model")

const bcrypt = require("bcrypt")
const { newDoctorSchema, 
        newHospitalSchema, 
        newMedicineSchema, 
        addPrescriptionSchema, 
        addMedicinePrescription, 
        generatebillSchema,
        searchPatientSchema,
        visitSchema
      } = require("../validators/doctor.validate")


exports.newDoctor = async (req, res) =>{
    try{
        const result = await newDoctorSchema.validateAsync(req.body)
        // const hospital = await Hospital.findById(result.hospitalId)
            const doctor = new Doctors({
                doctorName: result.doctorName,
                doctorEmail: result.doctorEmail,
                doctorPassword: await bcrypt.hash(result.doctorPassword,10),
                doctorDepartment: result.doctorDepartment,
                // hospitalId: result.hospitalId,
                // hospitalName: hospital.hospitalName
                
            })
            const newDoctor = await doctor.save()
            return res.json({
                                status : "Success",
                                error : false,
                                message : "Created a new doctor user",
                                data : newDoctor 
                            });  
        
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to create new user",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to create new user",
            data : { result: err}
          })
        }
    }
}



exports.newHospital = async (req,res) =>{
    try{
        const result = await newHospitalSchema.validateAsync(req.body)
        
        const hospital = new Hospital({
            hospitalName: result.hospitalName,
            hospitalAddress: result.hospitalAddress,
            noOfRooms: result.noOfRooms,
            roomCharge: result.roomCharge,
            
        })
        const newHospital = await hospital.save()
        return res.json({
                        status : "Success",
                        error : false,
                        message : "Successfully registered a new hospital",
                        data : newHospital 
                        }); 
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to register a new hospital",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to register a new hospital",
            data : { result: err}
          })
        }
    }
}

exports.newMedicine = async (req,res) => {
    try{
        const result = await newMedicineSchema.validateAsync(req.body)
        const medicine = new Medicine({
            medicineName: result.medicineName,
            medicineType: result.medicineType,
            medicineCost: result.medicineCost,
            medicineDescription: result.medicineDescription
        })
        const newMedicine = await medicine.save()
        return res.json({
                        status : "Success",
                        error : false,
                        message : "Successfully registered a new medicine",
                        data : newMedicine 
                        })
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to register a new medicine",
                data : { result: err}
            })
        }
        else{
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to register a new medicine",
            data : { result: err}
        })
    }
    }
    }

exports.addPrescription = async(req,res) => {
    try{
        const result = await addPrescriptionSchema.validateAsync(req.body)
        const hospital = await Hospital.findById(result.hospitalId)

        if(hospital != null || hospital != undefined){
        const patient = await Patients.findById(result.patientId)
        const prescription = new Prescription({
            doctorId: res.currentUser.data._id,
            hospitalId: result.hospitalId,
            patientId: result.patientId,
            doctorName: res.currentUser.data.doctorName,
            patientName: patient.patientName,
            diagnose: result.diagnose,
            
        })
        
        
        const newPrescription = await prescription.save()
        return res.json({
                        status : "Success",
                        error : false,
                        message : "Successfully added a Prescription",
                        data : newPrescription 
                        }); 
        }
        else{
            return res.json({
                status : "Failed  ",
                error : true,
                message : "Hospital not found ",
                data : { result: err}
                }); 

        }
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to add a new prescription",
                data : { result: err}
            })
        }
        else{
            console.log(err)
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to add the Prescription",
            data : { result: err}
          })
        }
    }
}

exports.addPrescriptionMedicine = async(req,res) => {
    try{
        const result = await addMedicinePrescription.validateAsync(req.body)

        const prescription = await Prescription.findById(result.prescriptionId)
        if (prescription != null || prescription != undefined){
            
            const medicine = await Medicine.findById(result.medicineId)
            if (medicine != null || medicine != undefined){
                prescription.medicines.push(medicine) 
                let updatedPrescription = await prescription.save()
                return res.json({
                                  status : "Success",
                                  error : false,
                                  message : "Successfully added medicine to prescription",
                                  data : updatedPrescription 
                                })
                
            }
            else{
                return res.json({
                                  status : "Failed",
                                  error : true,
                                  message : "Could not find the medicine in database",
                                  data : { result: "medicine not found"}
                                })
            }
        }
    }
    catch{
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to add medicine to the  prescription",
                data : { result: err}
            })
        }
        else{
        return res.json({
                          status : "Failed",
                          error : true,
                          message : "Could not find the prescription in dataase",
                          data : {result: err} 
                        })
        }
    }
}

exports.bill =  async (req,res) =>{
    try{
        const result = await generatebillSchema.validateAsync(req.body)
        let prescription = await Prescription.findById(result.prescriptionId)
        let hospital = await Hospital.findById(res.currentUser.data.hospitalId)
        let patient = await Patients.findById(prescription.patientId)
        var days = 0
        if(result.noOfDays < 0){
            days = 0
        }
        else{
            days = result.noOfDays
        }
        let totalRoomCharge = hospital.roomCharge * days
        let medicineTotal = prescription.medicines.reduce((a,b)=> a + b.medicineCost,0)
        let totalCharges = result.doctorCharge + totalRoomCharge + result.operationCharge + medicineTotal
        
        
        const bill= new Bill({
            prescriptionId: result.prescriptionId,
            hospitalName: hospital.hospitalName,
            doctorName: res.currentUser.data.doctorName,
            patientName: patient.patientName,
            doctorCharge: result.doctorCharge,
            roomCharge: totalRoomCharge,
            medicineCharge: medicineTotal,
            operationCharge: result.operationCharge,
            noOfDays: result.noOfDays,
            totalCharge: totalCharges,
            
        })
        let newbill = await bill.save()
        
        return res.json({
                          status : "Success",
                          error : false,
                          message : "Successfully generated bill",
                          data :  newbill
                        })
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to generate bill",
                data : { result: err}
            })
        }
        else{
            console.log(err)
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to generate bill",
            data : { result: err}
          })
        }   
    }
}

exports.searchPatient = async(req,res) =>{
    try{
        const result = await searchPatientSchema.validateAsync(req.query)
        let search = result.patientName
        let fromDate = new Date(result.fromDate)
        let toDate = new Date(result.toDate)
        let updateToDate = toDate.setDate(toDate.getDate() + 1)
        let page = 1
        if(result.page){
            page = result.page
        }
        let limit = 3
        let currentUserData = res.currentUser.data._id
        let prescription = await Prescription.aggregate([
            {$match: {$and:[{doctorId: currentUserData},{patientName: search}]}},
            {$project: {
                patientName : 1,
                diagnose: 1,
                createdAt :{$and:[{$gte: ["$createdAt",fromDate]},["$createdAt",updateToDate]]} }},
            {$sort: { createdAt: -1 }},
            {$skip: (page -1) * limit},
            {$limit: limit * 1},
        ])
             
    
        let count = await Prescription.aggregate([
            {$match: {$and:[{doctorId: currentUserData},{patientName: search}]}},
            {$project: {
                createdAt :{$and:[{$gte: ["$createdAt",fromDate]},["$createdAt",updateToDate]]} }},
            {$sort: { createdAt: -1 }},
            {$skip: (page -1) * limit},
            {$limit: limit * 1},
        ])
        
        let totalPages = Math.ceil(count/limit)
        let currentPage = page
        
        
        return res.json({
                            status : "Success",
                            error : false,
                            message : "Everything is good",
                            SearchResult: prescription,
                            TotalPages: totalPages,
                            currentPage: parseInt(currentPage)
                        })
    }
    catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to Search patient",
                data : { result: err}
            })
        }
        else{
            console.log(err)
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to Search Patient",
            data : { result: err}
          })
        }
    }
}

exports.visits = async(req,res) =>{
    try{
        const result = await visitSchema.validateAsync(req.body)
        const hospital = await Hospital.findById(result.hospitalId)
            if(hospital != null){
            const visit = new Visit({
                doctorId: res.currentUser.data._id,
                hospitalId: result.hospitalId,
                hospitalName: hospital.hospitalName,
                timings: result.timings,
            })
            const newVisit = await visit.save()
            return res.json({
                            status : "Success",
                            error : false,
                            message : "Successfully registered a new visit in a hospital",
                            data : newVisit
                            });
            }
            else{
                return res.status(404).send ("Hospital does not exist, Register new one!")
            } 
    }
    catch(err){
        
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to set a visiting",
                data : { result: err}
            })
        }
        else{
            console.log(err)
        return res.json({
            status : "Failed",
            error : true,
            message : "Failed to set a visiting",
            data : { result: err}
          })
        }
    }
}
