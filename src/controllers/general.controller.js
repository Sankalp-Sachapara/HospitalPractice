const Doctors = require("../models/doctor.model");
const Hospital = require("../models/hospital.model");
const { searchDoctorSchema } = require("../validators/general.validate");


exports.welcome = async (req,res) => {
    try{
        return res.send("welcome to site")
    }catch(err){
        console.error(`Error`, err.message);
        next(err);
    }
}

exports.hospitalList = async (req,res) =>{
    try{
    const hospital = await Hospital.find()
       return res.json({
        status : "Success",
        error : false,
        message : "Successfully displayed hospital list",
        data :  hospital
      })
    }catch(err){
        return res.json({
                            status : "Failed",
                            error : true,
                            message : "Failed to display hospital list",
                            data : { result: err}
                        })
    }

}



exports.searchDoctor = async(req,res) =>{
    try{
        const result = await searchDoctorSchema.validateAsync(req.query)
        let search = result.doctorName
        let page = 1
        if(result.page){
            page = result.page
        }
        let limit = 3
        
        let doctors = await Doctors.find({doctorName:{$regex:`${search}`,$options:'i'}})
        .select({_id: 0,doctorEmail : 0, doctorPassword:0, hospitalId : 0, __v : 0})
        .limit(limit * 1)
        .skip((page -1) * limit)
        .exec();
    
        let count = await Doctors.find({doctorName:{$regex:'.*' + search + '.*',$options:'i'}})
        .countDocuments();
        let totalPages = Math.ceil(count/limit)
        let currentPage = page
        return res.json({
                            SearchResult: doctors,
                            TotalPages: totalPages,
                            currentPage: parseInt(currentPage)
                        })
    }catch(err){
        if(err.isJoi === true){
            return res.json({
                status : "Failed  validation",
                error : true,
                message : "Failed to perform search",
                data : { result: err}
            })
        }
        else{
        return res.json({
                            status : "Failed",
                            error : true,
                            message : "Failed to perform search",
                            data : { result: err}
                        })
            }
    }
}