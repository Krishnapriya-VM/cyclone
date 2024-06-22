const email = document.getElementById('email');
const password = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const error1 = document.getElementById('error1');
const error2 = document.getElementById('error2');


function emailValidate(emailID){
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/
    if(emailID.trim() === "" ){
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

function passwordValidate(pswd){
    const passwordpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    if(pswd.trim() === ""){
        error2.innerHTML = "Please enter your password!!";
        error2.style.display = "block";
    }else if(!passwordpattern.test(pswd)){
        error2.innerHTML = "Password should only contain numbers and alphabets!!";
        error2.style.display = "block";
    }else if(pswd.length < 8){
        error2.innerHTML = "Password must be atleat 8 characters long!!";
        error2.style.display = "block";
    }else{
        error2.innerHTML = "";
        error2.style.display = "none";
    }
}

email.addEventListener('keyup', () => {
    const emailData = email.value;
    emailValidate(emailData)
})

email.addEventListener('blur', ()=>{
    const emailData = email.value;
    emailValidate(emailData)
})

password.addEventListener('keyup', () => {
    const passData = password.value;
    passwordValidate(passData)
})

password.addEventListener('blur', ()=>{
    const passData = password.value;
    passwordValidate(passData)
})

loginForm.addEventListener('submit', (event) =>{
    const emailData = email.value;
    const passData = password.value;
    emailValidate(emailData);
    passwordValidate(passData);

    if(error1.innerHTML !== "" || error2.innerHTML !== ""){
        event.preventDefault();
    }
})