const catname = document.getElementById('category_name')
const catimage = document.getElementById('catimage')
const catform = document.getElementById('catform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

function formValidation(data){
    if(data.trim() === ""){
        error1.innerHTML = "Please enter category name!!"
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Category name cannot be just whitespace!!";
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

catname.addEventListener('keyup',()=>{
    const namedata = catname.value
    formValidation(namedata)
})
catname.addEventListener('blur',()=>{
    const namedata = catname.value
    formValidation(namedata)
})

catimage.addEventListener('change',()=>{
    const imagedata = catimage.files
    imageValidate(imagedata)
})

catform.addEventListener('submit',(e)=>{

    const namedata = catname.value
    const imagedata = catimage.files

    imageValidate(imagedata)
    formValidation(namedata)

    if(error1.innerHTML !== "" || error2.innerHTML !== "" )
    {
        e.preventDefault()
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const catimageInput = document.getElementById('catimage');
    const imagePreview = document.getElementById('imagePreview');
    const closeButton = document.getElementById('closeButton');

    if (catimageInput) {
        catimageInput.addEventListener('change', function(event) {
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
            catimageInput.value = '';
        });
    } else {
        console.error('File input element not found');
    }



});



//List and Unlist Category
const unlistBtn = document.querySelectorAll(".unlistbtn");
const listBtn = document.querySelectorAll(".listbtn");

function unlist(catid) {
    fetch(`/admin/unlist-and-list-categories/${catid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Category not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(catid) {
    fetch(`/admin/unlist-and-list-categories/${catid}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.success) {
                window.location.reload();
                console.log(data.success)
            } else {
                console.log("Error: Category not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


if (unlistBtn) {
    unlistBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const catid = btn.dataset.uid;
            // const confirmResult = confirm("Are you sure you want to block this user?");
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to unlist this category',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    unlist(catid);
                }
            })

        });
    });
}

if (listBtn) {
    listBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const catid = btn.dataset.uid;
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to list this category',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    list(catid);
                }
            })
        });
    });
}