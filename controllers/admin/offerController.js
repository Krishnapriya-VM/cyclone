const Offer = require("../../models/offerModel");

const loadOffer = async(req, res)=>{
    try{
        const offer_details = await Offer.find();

        if(offer_details != null){
            res.render("admin/addOffer" , {data: offer_details})
        }else{
            res.render("admin/addOffer")
        }
    }catch(error){
        console.log(error.message);
        res.render("admin/offer_details", {message: "ERROR! Please try again."})
    }
};

const addOffer = async (req, res)=>{
    try {
        const { offertitle, offerdescription, percentage } = req.body;
        
        const data = {
            offertitle: offertitle,
            description: offerdescription,
            discount: percentage
        };
        console.log("OFFER DATA", data);
        const offerExist = await Offer.findOne({
            offertitle: new RegExp(offertitle, 'i'),
            status: 1
        })
        if(offerExist === null){
            const offer_data = await Offer.create(data);
            if(offer_data != null){
                
                return res.status(200).json({message: 'Offer Added!'})
            }
        }else{
            const offer_data = await Offer.find({ status: 1});
            res.staus(400).json({
                data: offer_data,
                message: "Offer Already Exist!!"
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadEditOffer = async(req, res) =>{
    try {
        const id = req.query.id;
        console.log(req.query);   
        const offer_data = await Offer.findById({_id: id});
        if(offer_data != ""){
            res.render("admin/editOffer", {offer_data: offer_data});
        }else{
            res.render("admin/editOffer", { message: "Cannot load offer data"})
        } 
    } catch(error) {
        console.log(error.message);
        res.render("admin/editOffer", { message: "An error occurred while loading offer data" });
    }
}

const postEditOffer = async(req, res) =>{
    try {
        const {offertitle, id, offerdescription, percentage} =req.body;
        console.log(offertitle, id, offerdescription, percentage);
        const existingOffer = await Offer.findOne({
            offertitle: new RegExp(offertitle, 'i'),
            _id: {$ne: id},
            status: 1
        });
        const offer_data = await Offer.findById({_id: id});
        if(existingOffer){
            res.render('admin/editOffer', {
                offer_data: {offertitle: offertitle,
                    description: offerdescription,
                    discount: percentage},
                message: "Offer Already Exist!!"
            })
        }else{
            let updatedOffer = await Offer.findByIdAndUpdate(
                {_id: id},
                {$set: {offertitle: offertitle,
                    description: offerdescription,
                    discount: percentage}},
                {new: true}
                );
            console.log("Updated Data of Offer: ", updatedBrand);
            res.redirect("/admin/offers")
        }
    } catch (error) {
        res.status(5000).send("An error occurred while updating the offer")
    }
}

// const listOffer = async (req, res) =>{
//     try {
//         const offerid = req.params.offerid;
//         console.log("offerid", offerid);
//         const offerDetails = await Offer.findById(offerid);
//         if(offerDetails.status === 1){
//             const updateOffer = await Offer.findByIdAndUpdate(offerid, {status: 1})
//             if(updateOffer){
//                 res.json({success: true, message: "Offer Unlisted"})
//             }else{
//                 res.json({
//                     success: false,
//                     message: "Failed to update Offer!"
//                 });
//             }
//         }else{
//             const updateBrand = await Brand.findByIdAndUpdate(brandid,{
//                 isListed: 0
//             });
//             if(updateBrand){
//                 res.json({success: true, message: "Brand Listed"})
//             }else{
//                 res.json({
//                     success: false,
//                     message: "Failed to update Brand"
//                 })
//             }
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }