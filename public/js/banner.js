const bname = document.getElementById('banner_name')
const bimage = document.getElementById('banner_image')
const status = document.getElementById('status')
const bannerform = document.getElementById('bannerform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

function formValidation(data){
    if(data.trim() === ""){
        error1.innerHTML = "Please enter banner name!!"
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Banner name cannot be just whitespace!!";
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

async function addBanner(namedata, imagedata, status){
    try {
        const formdata = new FormData();
        formdata.append('banner_name', namedata)
        formdata.append('banner_image', imagedata)
        formdata.append('status', status)
        console.log(namedata, imagedata);

        const res = await fetch('/admin/banner', {
            method: 'POST',
            body: formdata
        })
        const data = await res.json()
        console.log(data);
        if(data.message){
            document.getElementById('success_mess').style.display = 'block'
            document.getElementById('success_mess').innerHTML = data.message;
            setTimeout(() =>{
                window.location.href = '/admin/banner'
            }, 1000) 
        }
    } catch (error) {
      console.log(error.message);  
    }
}

bannerform.addEventListener('submit', (e) => {
    e.preventDefault();

    const namedata = bname.value;
    const imagedata = bimage.files;

    formValidation(namedata);
    imageValidate(imagedata);

    if (error1.innerHTML === "" || error2.innerHTML === "") {
        console.log('ADDED BANNER');
        const statusdata = status.value;
        console.log(statusdata);
        addBanner(namedata, imagedata[0], statusdata)
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const bannerimageInput = document.getElementById('banner_image');
    const imagePreview = document.getElementById('imagePreview');
    const closeButton = document.getElementById('closeButton');

    if (bannerimageInput) {
        bannerimageInput.addEventListener('change', function(event) {
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
            bannerimageInput.value = '';
        });
    } else {
        console.error('File input element not found');
    }
});



//List and Unlist Brand
const unlistBtn = document.querySelectorAll(".unlistbtn");
const listBtn = document.querySelectorAll(".listbtn");

function unlist(bannerid) {
    fetch(`/admin/unlist-and-list-banners/${bannerid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Banner not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(bannerid) {
    fetch(`/admin/unlist-and-list-banners/${bannerid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Banner not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


if (unlistBtn) {
    unlistBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const bannerid = btn.dataset.uid;
            // const confirmResult = confirm("Are you sure you want to block this user?");
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to unlist this banner',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    unlist(bannerid);
                }
            })

        });
    });
}

if (listBtn) {
    listBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const bannerid = btn.dataset.uid;
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to list this banner',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    list(bannerid);
                }
            })
        });
    });
}