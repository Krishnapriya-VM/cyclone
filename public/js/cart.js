const quantity = document.querySelectorAll('.qtyvalue');
const minusbtn = document.querySelectorAll('.minusbtn');
const plusbtn = document.querySelectorAll('.plusbtn');

const increment = async (proid) =>{
    try {
        fetch(`/cart/increment-quantity?id=${proid}`)
        .then(res =>{
            return res.json();
        })
        .then(res =>{
            console.log(res);
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

minusbtn.forEach(element => {
    element.addEventListener('click',() =>{
        const productRow = element.closest('.product-row');
        const quantityInput = productRow.querySelector('.qtyvalue');
        const proprice = productRow.querySelector('.proprice').innerText;
        const subtotalPrice = productRow.querySelector('.subtotal-price');
        const proid = element.dataset.proid;
        console.log(proid);
        let quantity = parseInt(quantityInput.value);

        if (quantity > 1) {
            quantity -= 1;
            quantityInput.value = quantity;
            subtotalPrice.innerText = (quantity * parseInt(proprice))
        }


    })
});

plusbtn.forEach(element => {
    element.addEventListener('click',() =>{
        const productRow = element.closest('.product-row');
        const quantityInput = productRow.querySelector('.qtyvalue');
        const proprice = productRow.querySelector('.proprice').innerText;
        const subtotalPrice = productRow.querySelector('.subtotal-price');
        const proid = element.dataset.proid;
        console.log(proid);
        let quantity = parseInt(quantityInput.value);

        quantity += 1;
        quantityInput.value = quantity;
        subtotalPrice.innerText = (quantity * parseInt(proprice))

    })
});