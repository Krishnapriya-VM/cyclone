const addToCart = document.getElementById("addToCart")
const qty = document.getElementById("qty")


function addCart(proid, qty){
    fetch(`/addToCart?id=${proid}&qty=${qty}`)
    .then(res =>{
        return res.json()
    })
    .then(data =>{
        if(data.data){
            Swal.fire({
                title: data.data,
                icon: "success",
                confirmButtonText: "OK"
            })
            .then(res =>{
                if(res.isConfirmed){
                    window.location.reload()
                }
            })
        }else if(data.err){
            Swal.fire({ 
                title: data.err,
                icon: "error",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {
                        window.location.reload()
                    }
                }) 
        }else if(data.stockerr){
            Swal.fire({
                title: data.stockerr,
                icon: "info"
                })
        }
    })
}

addToCart.addEventListener('click', function(){
    let proid = this.dataset.productid;
    let quantity = qty.value;
    addCart(proid, quantity)
})


const addToWishlist = document.getElementById("addToWishlist")



function addWishlist(proid){
    fetch(`/add-to-wishlist?id=${proid}`)
    .then(res =>{
        return res.json()
    })
    .then(data =>{
        if(data.data){
            Swal.fire({
                title: data.data,
                icon: "success",
                confirmButtonText: "OK"
            })
            .then(res =>{
                if(res.isConfirmed){
                    window.location.reload()
                }
            })
        }else if(data.err){
            Swal.fire({ 
                title: data.err,
                icon: "error",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {
                        window.location.reload()
                    }
                }) 
        }else if(data.stockerr){
            Swal.fire({
                title: data.stockerr,
                icon: "info"
                })
        }
    })
}

addToWishlist.addEventListener('click', function(){
    let proid = this.dataset.productid;
    addWishlist(proid)
})
