const User = require("../../models/userModel");

const loadUserList = async(req, res) =>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // You can adjust the default limit
        const skip = (page - 1) * limit;

        const totalItems = await User.countDocuments({ isAdmin: 0 });
        const udata = await User.find({isAdmin:0}).skip(skip).limit(limit);

        const totalPages = Math.ceil(totalItems / limit);
        res.render('admin/user-list',{
            udata,
            currentPage: page,
            totalPages,
            limit
            })
    } catch (error) {
        console.log(error.message);
    }
}
 
const userBlockAndUnBlock = async(req, res) => {
    try {
        const {id} = req.query;
        const userState = await User.findById({_id: id});
        if(userState !== null){
            if(userState.isBlocked === 1){
                const unblock = await User.findOneAndUpdate(
                    {_id: id},
                    {$set: {isBlocked: 0}},
                    {new: true}
                )
                if(unblock !== null){
                    res.json({unblocked: "User Blocked"});
                }else{
                    res.json({error: "Error in unblocking"})
                }
            }else{
                const block = await User.findOneAndUpdate(
                    {_id: id},
                    {$set: {isBlocked: 1}},
                    {new: true}
                )
                if(block !== null){
                    res.json({blocked: "User Blocked"});
                }else{
                    res.json({error: "Error in unblocking"})
                }
            }
        }else{
            console.log('No action performed');
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadUserList,
    userBlockAndUnBlock
}