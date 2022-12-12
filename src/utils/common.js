const jwt = require("jsonwebtoken")


var refreshTokens = []

const verify = (data, compare) =>{
    const accessToken = jwt.sign({data}, compare, {expiresIn: "60m"})
    const refreshToken = jwt.sign({data}, compare, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return {accessToken,refreshToken}

} 

module.exports = {verify}