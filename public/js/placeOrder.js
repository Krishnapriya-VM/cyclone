async function verifyPayment(paymentdetails,orderIdDB){
    try {
        const res = await fetch('/verify-payment',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                razorPayId:paymentdetails.razorpay_payment_id,
                razorOrderId:paymentdetails.razorpay_order_id,
                razorSignature:paymentdetails.razorpay_signature,
                realOrderID:orderIdDB
            })
            }
        )
        const data = await res.json()
        if(data.success)
        {
            window.location.href = `/order?id=${data.success}`
        }else{
            Swal.fire({
                title:"Payment Failed!!",
                icon:"error",

            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function razorOrderAPI(orderid,amount,userdata,orderIdDB)
{
    try {
        var options = {
            "key": "rzp_test_iqxC6hlqYjWODY", 
            "amount": amount, 
            "currency": "INR",
            "name": "Cyclone",
            "description": "Test Transaction",
            "image": "/public/image/cyclone-logo.png",
            "order_id": orderid, 
            "handler": function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)

                verifyPayment(response,orderIdDB)
            },
            "prefill": {
                "name": userdata.firstname +" "+ userdata.lastname,
                "email": userdata.email,
                "contact": userdata.mobile
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#FF5B14"
            }
        };
        let rzp1 = new Razorpay(options);
        rzp1.open()
        rzp1.on('payment.failed', function (response){
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);
            // alert(response.error.metadata.payment_id);
            console.log(response.error)
            Swal.fire({
                title: "PAYMENT FAILED!",
                text: "Try using Other Options",
                imageUrl: "/public/images/paymentfailed.png",
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "Custom image",
                confirmButtonText:"OK",
                showDenyButton:true,
                denyButtonText:"Cancel"
              })
              .then(res=>{
                if(res.isConfirmed)
                {
                    cancelOrder(orderIdDB)
                    window.location.reload()
                }
                if(res.isDenied)
                {
                    cancelOrder(orderIdDB)
                }
              })
        })
    } catch (error) {
        console.log(error.message)
    }
}

async function placeOrder(selectedAddress,selectedPaymentMethod) {
    
        const productDetails = [];
        document.querySelectorAll('.table-mini-cart tbody tr').forEach(item =>{
            productDetails.push({
                product_id: item.dataset.productId,
                quantity: parseInt(item.querySelector('.product-qty').innerText, 10),
                price: parseInt(item.querySelector('.product-total').innerText.replace('Rs: ', ''))
            })
        });
        console.log(productDetails);

        console.log("ADDRESS",selectedAddress.value);
        console.log("PAYMENT",selectedPaymentMethod.value);

        const orderData = {
            address_id: selectedAddress.value,
            payment_method: selectedPaymentMethod.value,
            subtotal: parseInt(document.querySelector(".total-price span").innerText.replace('Rs: ', '')),
            items: productDetails,
            payment_status: 'Pending'
        };
        console.log(orderData);

        try {
            const response = await fetch('/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log("response",data);
            if (response.ok) {
                if(data.cod){
                    Swal.fire({
                        title: 'Success!',
                        text: data.message || 'Your order has been placed successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = `/order?id=${data.cod}`;
                    });
                }else if(data.razorpay){
                    razorOrderAPI(data.razorpay.id, data.razorpay.amount, data.razorpay.userdata, data.razorpay.orderId)
                }else if(data.wallet){
                    Swal.fire({
                        title: 'Success!',
                        text: data.message || 'Your order has been placed successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = `/order?id=${data.wallet}`;
                    });
                }else if(data.walleterr){
                    Swal.fire({
                        title: 'Error!',
                        text: data.walleterr || 'An error occurred while placing the order.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }

            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'An error occurred while placing the order.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while placing the order.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    
    const placeOrderButton = document.querySelector(".btn-place-order");

    placeOrderButton.addEventListener("click", (event) => {
        const selectedAddress = document.querySelector("input[name='address_id']:checked");
        const selectedPaymentMethod = document.querySelector("input[name='payment_method']:checked");
        if (!selectedAddress) {
            Swal.fire({
                title: 'Error!',
                text: 'Please select a shipping address!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!selectedPaymentMethod) {
            Swal.fire({
                title: 'Error!',
                text: 'Please select a payment method!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        // event.preventDefault();
        placeOrder(selectedAddress,selectedPaymentMethod);
    });

    async function deleteAddress(addressId){
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this address?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if(result.isConfirmed){
            try{
                const response = await fetch(`/address/remove-address/${addressId}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                console.log(result)

                if (response.ok) {
                    Swal.fire(
                        'Deleted!',
                        'Your address has been deleted.',
                        'success'
                    ).then(() => {
                        location.reload(); 
                    });
                } else {
                    Swal.fire(
                        'Error!',
                        result.error || 'Failed to remove the address',
                        'error'
                    );
                }

            }catch(error){
                console.error('Error:', error);
                Swal.fire(
                    'Error!',
                    'An error occurred while removing the address',
                    'error'
                );
            }
        }

    }
    

   const removeAddressButtons = document.querySelectorAll('.remove-address');
   removeAddressButtons.forEach(button =>{
    button.addEventListener('click', (event) =>{
        event.preventDefault();
        const addressId = button.getAttribute('data-id');
        deleteAddress(addressId)
    })
   })

   