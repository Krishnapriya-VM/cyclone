const couponcode = document.getElementById('couponcode')
const coupondescription = document.getElementById('coupondescription')
const couponname = document.getElementById('couponname')
const limit = document.getElementById('limit')
const reduction = document.getElementById('reduction')

const editcouponform = document.getElementById('editcouponform')

const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const error3 = document.getElementById('error3')
const error4 = document.getElementById('error4')
const error5 = document.getElementById('error5')


function nameval(data)
{
    if(data.trim()==="")
    {
        error1.innerHTML = "Please enter coupon name!!"
        error1.style.display = "block"
    }
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}


function descval(data)
{
    if(data.trim()==="")
    {
        error2.innerHTML = "Please enter description!!"
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}

function codeval(data)
{
    const codeR = /^[a-zA-Z0-9]+$/


    if(data.trim()==="")
    {
        error3.innerHTML = "Please enter coupon code!!"
        error3.style.display = "block"
    }
    else if(!codeR.test(data)){
        error3.innerHTML = "Coupon code can only be alphabets and digits!!"
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"
    }
}

function limitval(data)
{
    const nonNegPattern = /^\d+$/;

    if(data.trim()==="")
    {
        error4.innerHTML = "Please enter coupon code limi!!"
        error4.style.display = "block"
    }
    else if(!nonNegPattern.test(data))
    {
        error4.innerHTML = "Please enter valid coupon limi!!"
        error4.style.display = "block"
    }
    else{
        error4.innerHTML = ""
        error4.style.display = "none"
    }
}

function reductionval(data)
{
    const nonNegPattern = /^\d+$/;

    if(data.trim()==="")
    {
        error5.innerHTML = "Please enter reduction rate!!"
        error5.style.display = "block"
    }
    else if(!nonNegPattern.test(data))
    {
        error5.innerHTML = "Please enter valid reduction rate!!"
        error5.style.display = "block"
    }
    else{
        error5.innerHTML = ""
        error5.style.display = "none"
    }
}

couponname.addEventListener('keyup',()=>{
    const pdata = couponname.value
    nameval(pdata)
})
couponname.addEventListener('blur',()=>{
    const pdata = couponname.value
    nameval(pdata)
})

coupondescription.addEventListener('keyup',()=>{
    const ddata = coupondescription.value
    descval(ddata)
})
coupondescription.addEventListener('blur',()=>{
    const ddata = coupondescription.value
    descval(ddata)
})
couponcode.addEventListener('keyup',()=>{
    const codedata = couponcode.value
    codeval(codedata)
})
couponcode.addEventListener('blur',()=>{
    const codedata = couponcode.value
    codeval(codedata)
})
limit.addEventListener('keyup',()=>{
    const pdata = limit.value
    limitval(pdata)
})
limit.addEventListener('blur',()=>{
    const pdata = limit.value
    limitval(pdata)
})
reduction.addEventListener('keyup',()=>{
    const reddata = reduction.value
    reductionval(reddata)
})
reduction.addEventListener('blur',()=>{
    const reddata = reduction.value
    reductionval(reddata)
})


editcouponform.addEventListener('submit', (e) =>{
    e.preventDefault();

    const namedata = couponname.value
    const desdata = coupondescription.value
    const limitdata = limit.value
    const reductdata = reduction.value
    const codedata = couponcode.value

    const couponID = document.getElementById("couponid").value;

    codeval(codedata)
    reductionval(reductdata)
    limitval(limitdata)
    descval(desdata)
    nameval(namedata)

    if (error1.innerHTML === "" || error2.innerHTML === "" ||
        error3.innerHTML === "" || error4.innerHTML === "" ||
        error5.innerHTML === "") 
        {
            console.log("COUPON............");
            editCoupon(couponID, namedata, desdata, limitdata, reductdata, codedata);
        }
})

async function editCoupon(couponid, name, description, limit, reduction, code){
    try {
        console.log("Update Request");
        console.log(couponid, name, description, limit, reduction, code);
        const response = await fetch(`/admin/edit-coupon?id=${couponid}`, {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                couponname: name,
                description: description,
                couponcode: code,
                couponlimit: limit,
                reductionrate: reduction
            })
        });
        console.log("RESPONSE", response);
        const data = await response.json();
        console.log("Coupon data", data);
        if (data.message) {
            document.getElementById('success_mess').style.display = 'block';
            document.getElementById('success_mess').innerHTML = data.message;
            setTimeout(() => {
                window.location.href = '/admin/coupon';
            }, 1000);
        }
    } catch (error) {
        console.error(error.message);
    }
}