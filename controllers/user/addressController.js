const User = require("../../models/userModel");
const Address = require("../../models/addressModel");

const loadAddress = async(req, res) =>{
    try {
        const userid = req.userid;
        const udata = await User.findById({_id: userid}).populate("cart.product_id");
        const addressData = await Address.find({userid, isListed: 0});

        if(addressData.length > 0){
            res.render("user/manageAddress", {
                udata: udata,
                addressData: addressData
            });
        }else{
            res.render("user/manageAddress", {
                error: "No Addresses Found!!"
            })
            console.log("Cannot fetch Address");
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const loadAddAddress = async (req, res) =>{
    try {
        const userid = req.userid;
        const udata = await User.findById({_id: userid}).populate("cart.product_id");
        res.render("user/addAddress", {udata: udata}) 
    } catch (error) {
        console.log(error.message);
    }
}

const postAddAddress = async(req, res) =>{
    try {
        const userid = req.userid;
        const {fdata, ldata, mdata, hdata, sdata, 
            landdata, tdata, ddata, cdata, statedata, pdata} = req.body;
            console.log(req.body);
        const addressData = {userid, 
            fname: fdata, 
            lname: ldata, 
            mobile: mdata, 
            houseno: hdata, 
            street_address: sdata, 
            landmark: landdata, 
            town: tdata, 
            district: ddata, 
            country:cdata, 
            state:statedata, 
            pincode: pdata};
    
    console.log(addressData); 
    
    const addressExist = await Address.findOne({
        houseno: new RegExp(hdata, 'i'),
        isListed: 0
    });
    if(addressExist ===  null){
        const addAddress = await Address.create(addressData);
            if(addAddress != null){
                return res.status(200).json({message: 'Address Added'});
            }
    }else{
        const address_details = await Address.find({isListed: 0});
        res.status(400).json({
            data: address_details,
            error: "Address Already Exist!!"
        })
    }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }      
}

const loadEditAddress = async (req, res) => {
    try {
        console.log("EDIT ADDRESSghghhj")
        const userid = req.userid;
        const addressId = req.params.id;
        const udata = await User.findById({_id: userid}).populate("cart.product_id");
        const addressData = await Address.findById({_id: addressId, userid: userid, isListed: 0});

        if (addressData) {
            res.render("user/editAddress", {
                udata: udata,
                addressData: addressData
            });
        } else {
            res.status(404).render("user/editAddress", {
                error: "Address Not Found!!"
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const postEditAddress = async (req, res) => {
    try {
        const userid = req.userid;
        const addressId = req.params.id;
        console.log(userid, addressId);
        const { fdata, ldata, mdata, hdata, sdata, landdata, tdata, ddata, cdata, statedata, pdata } = req.body;
        console.log(req.body);

        const addressData = {
            fname: fdata,
            lname: ldata,
            mobile: mdata,
            houseno: hdata,
            street_address: sdata,
            landmark: landdata,
            town: tdata,
            district: ddata,
            country: cdata,
            state: statedata,
            pincode: pdata
        };

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userid: userid, isListed: 0 },
            addressData,
            { new: true }
        );

        if (updatedAddress) {
            res.status(200).json({ message: 'Address Updated' });
        } else {
            res.status(404).json({ error: "Address Not Found!!" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const userid = req.userid;

        const deletedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userid: userid, isListed: 0 },
            { isListed: 1 }, // Soft delete by marking as listed
            { new: true }
        );

        if (deletedAddress) {
            res.status(200).json({ message: 'Address removed successfully' });
        } else {
            res.status(404).json({ error: "Address not found" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




module.exports = {
    loadAddress,
    loadAddAddress,
    postAddAddress,
    loadEditAddress,
    postEditAddress,
    deleteAddress
}