const bname = document.getElementById('brand_name')
const bimage = document.getElementById('brand_image')
const status = document.getElementById('status')
const brandform = document.getElementById('brandform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

function formValidation(data){
    if(data.trim() === ""){
        error1.innerHTML = "Please enter brand name!!"
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Brand name cannot be just whitespace!!";
        error1.style.display = "block";
    } 
    else{
        error1.innerHTML = "";
        error1.style.display = "none";
    }
}

function imageValidate(data){
    if(data.length === 0)
        {
            error2.innerHTML = "Please select an image!!"
            error2.style.display = "block"
        }
        else if(!data[0].type.startsWith('image/'))
        {
            error2.innerHTML = "Please select image file only!!"
            error2.style.display = "block"
        }
        else{
            error2.innerHTML = ""
            error2.style.display = "none"
        }
}

bname.addEventListener('keyup',()=>{
    const namedata = bname.value
    formValidation(namedata)
})
bname.addEventListener('blur',()=>{
    const namedata = bname.value
    formValidation(namedata)
})

bimage.addEventListener('change',()=>{
    const imagedata = bimage.files
    imageValidate(imagedata)
})



brandform.addEventListener('submit', (e) => {

    const namedata = bname.value;
    const imagedata = bimage.files;

    formValidation(namedata);
    if(imagedata === ""){
        imageValidate(imagedata);
    }
    

    if (error1.innerHTML !== "" || error2.innerHTML !== "") {
        console.log('EDITED BRAND');
        e.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const brandimageInput = document.getElementById('brand_image');
    const imagePreview = document.getElementById('imagePreview');
    const closeButton = document.getElementById('closeButton');

    if (brandimageInput) {
        brandimageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    closeButton.style.display = 'block';
                };

                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
                closeButton.style.display = 'none';
            }
        });

        closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            closeButton.style.display = 'none';
            brandimageInput.value = '';
        });
    } else {
        console.error('File input element not found');
    }



});



//List and Unlist Brand
const unlistBtn = document.querySelectorAll(".unlistbtn");
const listBtn = document.querySelectorAll(".listbtn");

function unlist(brandid) {
    fetch(`/admin/unlist-and-list-brands/${brandid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Brand not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(brandid) {
    fetch(`/admin/unlist-and-list-brands/${brandid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Brand not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


if (unlistBtn) {
    unlistBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const brandid = btn.dataset.uid;
            // const confirmResult = confirm("Are you sure you want to block this user?");
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to unlist this brand',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    unlist(brandid);
                }
            })

        });
    });
}

if (listBtn) { 
    listBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const brandid = btn.dataset.uid;
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to list this brand',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    list(brandid);
                }
            })
        });
    });
}