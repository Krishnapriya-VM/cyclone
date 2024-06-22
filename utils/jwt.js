const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_PASSWORD = process.env.JWT_PASS;

const createToken = (user)=>{
    return jwt.sign(user, JWT_PASSWORD, {expiresIn: '5h'})
}

const verifyToken = async(token)=>{

    try{
        const decoded = await jwt.verify(token, JWT_PASSWORD);
        return decoded
    }catch(error){
        console.log(error.message);
        return false;
    }

}

module.exports = {
    createToken,
    verifyToken
}