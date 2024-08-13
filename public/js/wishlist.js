const removebtn = document.querySelectorAll('.crossbtn')

async function deleteWishlist(proid)
{
    try{

        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          })

          if(confirmResult.isConfirmed){
            const res = await fetch(`/delete-from-wislist?id=${proid}`)
            const data = await res.json();

                if(data.data) 
                {
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Item removed from Wishlist!!",
                        icon: "success",
                        confirmButtonText: "OK"
                    })
                    return true;
                }else{
                    await Swal.fire({
                        title: "Error",
                        text: "Failed to remove item!!",
                        icon: "error",
                        confirmButtonText: "OK"
                    });

                    return false;
                }           
            }
            return false
    }catch(err)
        {
            console.log(err.message);
            window.location.href = '/wishlist'
        }
}

removebtn.forEach(element =>{
    element.addEventListener('click', () =>{
        const proid = element.dataset.proid;
        deleteWishlist(proid)
            .then(removed =>{
                if(removed){
                    window.location.reload()
                }else{
                    console.log("error in reoving the item");
                }
            })
            .catch(err =>{
                console.log(err.message);
            })
        
    })
})