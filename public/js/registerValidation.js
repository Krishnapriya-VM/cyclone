const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');
const mobile = document.getElementById('mobile_number');
const password = document.getElementById('password');
const cpassword = document.getElementById('confirm_password');


const registerForm = document.getElementById('registerForm');
const error1 = document.getElementById('fnameError');
const error2 = document.getElementById('lnameError');
const error3 = document.getElementById('emailError');
const error4 = document.getElementById('mobileNumberError');
const error5 = document.getElementById('passwordError');
const error6 = document.getElementById('confirmPasswordError');

function firstNameValidate(name){
    const namePattern = /^[a-zA-Z]+$/
    if(name.trim() === ""){
        error1.innerHTML = "Please enter first name!!";
        error1.style.display = "block";
    }else if(!namePattern.test(name)){
        error1.innerHTML = "Name should only contain alphabets!!";
        error1.style.display = "block"
    }else{
        error1.innerHTML = "",
        error1.style.display = "none"
    }
}

function lastNameValidate(name){
    const namePattern = /^[a-zA-Z]+$/
    if(name.trim() === ""){
        error2.innerHTML = "Please enter last name!!";
        error2.style.display = "block";
    }else if(!namePattern.test(name)){
        error2.innerHTML = "Name should only contain alphabets!!";
        error2.style.display = "block"
    }else{
        error2.innerHTML = "",
        error2.style.display = "none"
    }

}

function emailValidate(emailID){
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/
    if(emailID.trim() === ""){
        error3.innerHTML = "Please enter your email!!";
        error3.style.display = "block";
    }else if(!emailpattern.test(emailID)){
        error3.innerHTML = "Please enter valid email!!";
        error3.style.display = "block";
    }else{
        error3.innerHTML = "";
        error3.style.display = "none";
    }
}

function mobileValidate(mobile){
    const mobilepattern = /^\d{10}$/;
    const repeatedDigitsPattern = /^(\d)\1{9}$/;

    if(mobile.trim() === ""){
        error4.innerHTML = "Please enter your mobile number!!";
        error4.style.display = "block";
    }else if(!mobilepattern.test(mobile)){
        error4.innerHTML = "Contact number should only be digits and must be exactly 10 digits long!!";
        error4.style.display = "block";
    }else if (repeatedDigitsPattern.test(mobile)) {
        error4.innerHTML = "Number with all repeated digits is not allowed!!";
        error4.style.display = "block";
    }else{
        error4.innerHTML = "";
        error4.style.display = "none";
    }
}

function passwordValidate(pswd){
     const passwordpattern = /^[A-Za-z\d@$!%*?&]+$/

    if(pswd.trim() === ""){
        error5.innerHTML = "Please enter your password!!";
        error5.style.display = "block";
    }else if(!passwordpattern.test(pswd)){
        error5.innerHTML = "Password should only contain numbers, alphabets, and special characters @$!%*?&!!";
        error5.style.display = "block";
    }else if(pswd.length < 8){
        error5.innerHTML = "Password must be atleat 8 characters long!!";
        error5.style.display = "block";
    }else{
        error5.innerHTML = "";
        error5.style.display = "none";
    }
}

function confirmPasswordValidate(pswd){
    const passwordpattern = /^[A-Za-z\d@$!%*?&]+$/

    if(pswd.trim() === ""){
        error6.innerHTML = "Please re-enter your password!!";
        error6.style.display = "block";
    }else if(!passwordpattern.test(pswd)){
        error6.innerHTML = "Password should only contain numbers, alphabets, and special characters @$!%*?&!!";
        error6.style.display = "block";
    }else if(pswd.length < 8){
        error6.innerHTML = "Password must be atleat 8 characters long!!";
        error6.style.display = "block";
    }else{
        error6.innerHTML = "";
        error6.style.display = "none";
    }
}

fname.addEventListener('keyup', () =>{
    const fnameData = fname.value;
    firstNameValidate(fnameData)
})

fname.addEventListener('blur', () =>{
    const fnameData = fname.value;
    firstNameValidate(fnameData)
})



lname.addEventListener('keyup', () =>{
    const lnameData = lname.value;
    lastNameValidate(lnameData)
})

lname.addEventListener('blur', () =>{
    const lnameData = lname.value;
    lastNameValidate(lnameData);
})



email.addEventListener('keyup', () =>{
    const emailData = email.value;
    emailValidate(emailData);
})

email.addEventListener('blur', () =>{
    const emailData = email.value;
    emailValidate(emailData);
})



mobile.addEventListener('keyup', () =>{
    const mobileData = mobile.value;
    mobileValidate(mobileData)
})

mobile.addEventListener('blur', () =>{
    const mobileData = mobile.value;
    mobileValidate(mobileData)
})


password.addEventListener('keyup', () =>{
    const passwordData = password.value;
    passwordValidate(passwordData)
})

password.addEventListener('blur', () =>{
    const passwordData = password.value;
    passwordValidate(passwordData)
})


cpassword.addEventListener('keyup', () =>{
    const cpasswordData = cpassword.value;
    confirmPasswordValidate(cpasswordData)
})

cpassword.addEventListener('keyup', () =>{
    const cpasswordData = cpassword.value;
    confirmPasswordValidate(cpasswordData)
})

registerForm.addEventListener('submit', (event) =>{
    const fnameData = fname.value;
    const lnameData = lname.value;
    const emailData = email.value;
    const mobileData = mobile.value;
    const passwordData = password.value;
    const cpasswordData = cpassword.value;

    firstNameValidate(fnameData);
    lastNameValidate(lnameData);
    emailValidate(emailData);
    mobileValidate(mobileData);
    passwordValidate(passwordData);
    confirmPasswordValidate(cpasswordData);

    if(error1.innerHTML !== "" || error2.innerHTML !== "" || error3.innerHTML !== "" || error4.innerHTML !== "" || error5.innerHTML !== "" || error6.innerHTML !== ""){
        event.preventDefault();
    }
})