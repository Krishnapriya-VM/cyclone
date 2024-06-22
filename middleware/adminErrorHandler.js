const adminerrorHandler = (err,req,res,next)=>{
    try {
        console.log("ERROR_HANDLER");
        console.log(err.message);
        if(err){
            res.status(500).render('admin/admin404',{err:err.message})
        }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {adminerrorHandler};