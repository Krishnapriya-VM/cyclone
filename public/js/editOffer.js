const title = document.getElementById('offertitle')
const description = document.getElementById('offerdescription')
const percentage = document.getElementById('percentage')
const status = document.getElementById('status')
const editofferform = document.getElementById('editofferform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const error3 = document.getElementById('error3')


function validateTitle(data){
    if(data.trim() === ""){
        error1.innerHTML = "Please enter the title!!"
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Title cannot be just whitespace!!";
        error1.style.display = "block";
    } 
    else{
        error1.innerHTML = "";
        error1.style.display = "none";
    }
}

function validateDescription(data){
    if(data.length === 0)
        {
            error2.innerHTML = "Please enter the description!!"
            error2.style.display = "block"
        }
        else if (data.trim().length === 0) {
            error2.innerHTML = "Description cannot be just whitespace!!";
            error2.style.display = "block";
        } 
        else{
            error2.innerHTML = ""
            error2.style.display = "none"
        }
}

function validateDiscount(data){
    const nonNegPattern = /^\d+$/;

    if(data.trim()==="")
    {
        error3.innerHTML = "Please Enter Discount."
        error3.style.display = "block"
    }
    else if(!nonNegPattern.test(data) && parseInt(data) <= 100)
    {
        error3.innerHTML = "Please Enter Valid Discount."
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"
    }
}

title.addEventListener('keyup',()=>{
    const namedata = title.value
    validateTitle(namedata)
})
title.addEventListener('blur',()=>{
    const namedata = title.value
    validateTitle(namedata)
})

description.addEventListener('keyup',()=>{
    const descdata = description.value
    validateDescription(descdata)
})
description.addEventListener('blur',()=>{
    const descdata = description.value
    validateDescription(descdata)
})

percentage.addEventListener('keyup',()=>{
    const discountdata = percentage.value
    validateDiscount(discountdata)
})
percentage.addEventListener('blur',()=>{
    const discountdata = percentage.value
    validateDiscount(discountdata)
})


// async function editOffer(namedata, offerid, descdata, discountdata, statusdata){
//     try {

//         const res = await fetch(`/admin/edit-offer?id=${offerid}`, {
//             method: 'POST',
//             headers:{
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 title: namedata,
//                 description: descdata,
//                 percentage: discountdata,
//                 status: statusdata
//             })
//         })
//         const data = await res.json()
//         console.log(data);
//         if(data.message){
//             document.getElementById('success_mess').style.display = 'block'
//             document.getElementById('success_mess').innerHTML = data.message;
//             setTimeout(() =>{
//                 window.location.href = '/admin/offers'
//             }, 1000) 
//         }
//     } catch (error) {
//       console.log(error.message);  
//     }
// }

// editofferform.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const namedata = title.value;
//     const descdata = description.value;
//     const discountdata = percentage.value;
//     const statusdata = status.value;

//     const offerid = document.getElementById('offerid').value

//     validateTitle(namedata);
//     validateDescription(descdata);
//     validateDiscount(discountdata)

//     if (error1.innerHTML === "" || error2.innerHTML === "" || error3.innerHTML === "") {
//         console.log('OFFER EDITED');
//         editOffer(namedata, offerid, descdata, discountdata, statusdata)
//     }
// });

//List and Unlist Offer
const unlistBtn = document.querySelectorAll(".unlistbtn");
const listBtn = document.querySelectorAll(".listbtn");

function unlist(offerid) {
    fetch(`/admin/unlist-and-list-offers/${offerid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Offer not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(offerid) {
    fetch(`/admin/unlist-and-list-offers/${offerid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Offer not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


if (unlistBtn) {
    unlistBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const offerid = btn.dataset.uid;
            
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to unlist this offer',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    unlist(offerid);
                }
            })

        });
    });
}

if (listBtn) {
    listBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const offerid = btn.dataset.uid;
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to list this offer',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    list(offerid);
                }
            })
        });
    });
}