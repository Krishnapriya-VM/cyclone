const jwttoken = require("../utils/jwt");

const isLoggedIn = async(req, res, next) =>{
    try {
        if(req.cookies.adminToken){
            const decodeToken = await jwttoken.verifyToken(req.cookies.adminToken)
            if(decodeToken){
                req.adminid = decodeToken.id;
                next();
            }else{
                res.redirect('/admin/admin-login')
            }
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLoggedOut = async(req, res, next)=>{
    try {
        if(req.cookies.adminToken != undefined){
            const decodeToken = await jwttoken.verifyToken(req.cookies.adminToken);
            if(decodeToken){
                req.adminid = decodeToken.id;
                res.redirect("/admin/admin-dashboard")
            }else{
                next();
            }
        }else{
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    isLoggedIn,
    isLoggedOut
}