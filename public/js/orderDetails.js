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
            console.log("asasas",response.error)
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


async function handleRetryPayment(event) {
    event.preventDefault(); 

    const button = event.target;
    const orderId = button.getAttribute('data-order-id');

    try {
        
        const res = await fetch(`/retry-payment/${orderId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (data.razorpay) {
            razorOrderAPI(data.razorpay.id, data.razorpay.amount, data.razorpay.userdata, data.razorpay.orderId);
        } else if (data.success) {
            Swal.fire({
                title: "Payment Successful!",
                icon: "success",
            }).then(() => {
                window.location.href = `/order?id=${data.orderId}`;
            });
        } else {
            Swal.fire({
                title: "Payment Failed!",
                text: data.message || "An error occurred.",
                icon: "error",
            });
        }
    } catch (error) {
        console.log(error.message);
        Swal.fire({
            title: "Error!",
            text: "An error occurred while retrying the payment.",
            icon: "error",
        });
    }
}


const retryButton = document.querySelector('.retry-payment-btn');

retryButton.addEventListener('click', handleRetryPayment);
