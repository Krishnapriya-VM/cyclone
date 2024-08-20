const quantity = document.querySelectorAll('.qtyvalue');
const minusbtn = document.querySelectorAll('.minusbtn');
const plusbtn = document.querySelectorAll('.plusbtn');
const removebtn = document.querySelectorAll('.remove-btn')


minusbtn.forEach(element => {
    element.addEventListener('click',() =>{
        try {
            const productRow = element.closest('.product-row');
            const quantityInput = productRow.querySelector('.qtyvalue');
            const proprice = productRow.querySelector('.proprice').innerText;
            const subtotalPrice = productRow.querySelector('.subtotal-price');
            const  grandTotal = document.getElementById('product-total');
            const proid = element.dataset.proid;
            console.log(proid);
            let quantity = parseInt(quantityInput.value);

            fetch(`/cart/decrement-quantity?id=${proid}`)
            .then(res =>{
                return res.json();  
            })
            .then(res =>{
                console.log(res);
                if (res.success) {
                    console.log(res);
                    quantity -= 1;
                    quantityInput.value = quantity;
                    subtotalPrice.innerText = (quantity * parseInt(proprice))
                    grandTotal.innerHTML = parseInt(grandTotal.innerHTML) - parseInt(proprice) 

                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.err,
                    });
                    // console.log(res.err);
                }
            })
            .catch(error => console.error(error));
            
        } catch (error) {
            console.log(error.message);
        }
    })
});

plusbtn.forEach(element => {
    element.addEventListener('click',async () =>{
        try{
        const productRow = element.closest('.product-row');
        const quantityInput = productRow.querySelector('.qtyvalue');
        const proprice = productRow.querySelector('.proprice').innerText;
        const subtotalPrice = productRow.querySelector('.subtotal-price');
        const  grandTotal = document.getElementById('product-total');
        const proid = element.dataset.proid;
        console.log(proid);
        let quantity = parseInt(quantityInput.value);

        fetch(`/cart/increment-quantity?id=${proid}`)
        .then(res =>{
            return res.json();
        })
        .then(res =>{
            console.log(res);
            if(res.success){
                console.log(res);
                quantity += 1;
                quantityInput.value = quantity;
                subtotalPrice.innerText = (quantity * parseInt(proprice))
                grandTotal.innerHTML = parseInt(grandTotal.innerHTML) + parseInt(proprice) 
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.err,
                });
                //console.log(res.err);
            }
        })
        .catch(error => console.error(error));
        }catch(err){
            console.log(err.message);
        }

    })
});


async function delCart(proid)
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
            const res = await fetch(`/cart/deleteCart?id=${proid}`)
            const data = await res.json();

                if(data.data) 
                {
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Item removed from Cart!!",
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
            window.location.href = '/cart'
        }
}

removebtn.forEach(element =>{
    element.addEventListener('click', () =>{
        const proid = element.dataset.proid;
        delCart(proid)
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


