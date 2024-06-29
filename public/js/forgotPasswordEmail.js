const email = document.getElementById('email');
const forgotForm = document.getElementById('forgotForm');


function emailForgot(emailID){
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/
    if(emailID.trim() === ""){
        error1.innerHTML = "Please enter your email!!";
        error1.style.display = "block";
    }else if(!emailpattern.test(emailID)){
        error1.innerHTML = "Please enter valid email!!";
        error1.style.display = "block";
    }else{
        error1.innerHTML = "";
        error1.style.display = "none";
    }
}

email.addEventListener('keyup', () =>{
    const emailData = email.value;
    emailForgot(emailData);
})

email.addEventListener('blur', () =>{
    const emailData = email.value;
    emailForgot(emailData);
})

async function acceptEmail(mail){
    try {
        console.log(mail);
        const res = await fetch('/reset-link',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({mail})
        })
        const data = await res.json()
        console.log(data);
        if(data.message){
            document.getElementById('success_mess').innerHTML = data.message;
            setTimeout(()=>{
                window.location.href = '/reset-otp'
            },3000)
        }
    } catch (error) {
        console.log(error.message);
    }
}


forgotForm.addEventListener('submit', (event) =>{

    const emailData = email.value;

    emailForgot(emailData);

    if(error1.innerHTML !== ""){
        event.preventDefault();
    }else{
        acceptEmail(emailData)
    }
})


        
   