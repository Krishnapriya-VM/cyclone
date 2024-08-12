const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const mobile = document.getElementById("mobile");
const houseno = document.getElementById("houseno");
const street = document.getElementById("street");
const landmark = document.getElementById("landmark");
const town = document.getElementById("town");
const district = document.getElementById("district");
const country = document.getElementById("country");
const state = document.getElementById("state");
const pincode = document.getElementById("pincode");

const editAddressform = document.getElementById('editAddressform')
const error1 = document.getElementById("fnameerror");
const error2 = document.getElementById("lnameerror");
const error3 = document.getElementById("mobileerror");
const error4 = document.getElementById("housenoerror");
const error5 = document.getElementById("streeterror");
const error6 = document.getElementById("landmarkerror");
const error7 = document.getElementById("townerror");
const error8 = document.getElementById("districterror");
const error9 = document.getElementById("countryerror");
const error10 = document.getElementById("stateerror");
const error11 = document.getElementById("pinerror");


console.log(country.value);

const countrylist = {
    India: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Maharashtra",
      "Madhya Pradesh",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Tripura",
      "Telangana",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Delhi",
    ],
    Pakistan: [],
  };
  
  window.onload = function () {
    state.disabled = true;
  
    for (let count in countrylist) {
      country.options[country.options.length] = new Option(count, count);
    }
  };
  
  country.onchange = (e) => {
    state.disabled = false;
    for (let states of countrylist[e.target.value]) {
      state.options[state.options.length] = new Option(states, states);
    }
  };

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

function mobileValidate(mobile){
    const mobilepattern = /^\d{10}$/;
    const repeatedDigitsPattern = /^(\d)\1{9}$/;

    if(mobile.trim() === ""){
        error3.innerHTML = "Please enter your mobile number!!";
        error3.style.display = "block";
    }else if(!mobilepattern.test(mobile)){
        error3.innerHTML = "Contact number should only be digits and must be exactly 10 digits long!!";
        error3.style.display = "block";
    }else if (repeatedDigitsPattern.test(mobile)) {
        error3.innerHTML = "Number with all repeated digits is not allowed!!";
        error3.style.display = "block";
    }else{
        error3.innerHTML = "";
        error3.style.display = "none";
    }
}

function housenoValidate(houseno){
    const housenoPattern = /^[a-zA-Z0-9\s\-\/]+$/;

   if(houseno.trim() === ""){
       error4.innerHTML = "Please enter your house/flat number!!";
       error4.style.display = "block";
   }else if(!housenoPattern.test(houseno)){
       error4.innerHTML = "Please enter a valid house/flat number!!";
       error4.style.display = "block";
   }else{
       error4.innerHTML = "";
       error4.style.display = "none";
   }
}

function streetValidate(name) {
    const namepattern = /^[a-z A-Z,().]+$/;
    if (name.trim() === "") {
      error5.innerHTML = "Please enter street address!";
      error5.style.display = "block";
    } else if (!namepattern.test(name)) {
      error5.innerHTML = "Street address should only include alphabets!";
      error5.style.display = "block";
    } else {
      error5.innerHTML = "";
      error5.style.display = "none";
    }
  }

  function landmarkValidate(name) {
    const namepattern = /^[a-z A-Z(),.\/]+$/;
    if (name.trim() === "") {
      error6.innerHTML = "Please enter your landmark!";
      error6.style.display = "block";
    } else if (!namepattern.test(name)) {
      error6.innerHTML = "Landmark should only include alphabets!";
      error6.style.display = "block";
    } else {
      error6.innerHTML = "";
      error6.style.display = "none";
    }
  }

  function townValidate(name) {
    const namepattern = /^[a-z A-Z(),.\/]+$/;
    if (name.trim() === "") {
      error7.innerHTML = "Please enter your current town!";
      error7.style.display = "block";
    } else if (!namepattern.test(name)) {
      error7.innerHTML = "Town should only include alphabets!";
      error7.style.display = "block";
    } else {
      error7.innerHTML = "";
      error7.style.display = "none";
    }
  }

  function districtvalidate(name) {
    const namepattern = /^[a-zA-Z]+$/;
    if (name.trim() === "") {
      error8.innerHTML = "Please enter your district!";
      error8.style.display = "block";
    } else if (!namepattern.test(name)) {
      error8.innerHTML = "District should only include alphabets!";
      error8.style.display = "block";
    } else {
      error8.innerHTML = "";
      error8.style.display = "none";
    }
  }

  function countryValidate(data) {
    if (data === "") {
      error9.innerHTML = "Please select any country!";
      error9.style.display = "block";
    } else {
      error9.innerHTML = "";
      error9.style.display = "none";
    }
  }

  function stateValidate(data) {
    if (data === "") {
      error10.innerHTML = "Please select any state!";
      error10.style.display = "block";
    } else {
      error10.innerHTML = "";
      error10.style.display = "none";
    }
  }

function pinValidate(pincode) {
    const pincodePattern = /^\d{6}$/;
    const repeatedDigitsPattern = /^(\d)\1{5}$/;

    if (pincode.trim() === "") {
        error11.innerHTML = "Please enter your pincode!";
        error11.style.display = "block";
    } else if (!pincodePattern.test(pincode)) {
        error11.innerHTML = "Pincode should only be digits and must be exactly 6 digits long!";
        error11.style.display = "block";
    } else if (repeatedDigitsPattern.test(pincode)) {
        error11.innerHTML = "Pin code with all repeated digits is not allowed!";
        error11.style.display = "block";
    } else {
        error11.innerHTML = "";
        error11.style.display = "none";
    }
}

fname.addEventListener("keyup", () => {
    const fdata = fname.value;
    firstNameValidate(fdata);
  });
  fname.addEventListener("blur", () => {
    const fdata = fname.value;
    firstNameValidate(fdata);
  });
  
lname.addEventListener("keyup", () =>{
    const ldata = lname.value;
    lastNameValidate(ldata);
});
lname.addEventListener("blur", () => {
    const ldata = lname.value;
    lastNameValidate(ldata);
  });

  mobile.addEventListener("keyup", () =>{
    const mdata = mobile.value;
    mobileValidate(mdata);
});
mobile.addEventListener("blur", () => {
    const mdata = mobile.value;
    mobileValidate(mdata);
  });


  houseno.addEventListener("keyup", () =>{
    const hdata = houseno.value;
    housenoValidate(hdata);
});
houseno.addEventListener("blur", () => {
    const hdata = houseno.value;
    housenoValidate(hdata);
  });


  street.addEventListener("keyup", () =>{
    const sdata = street.value;
    streetValidate(sdata);
});
street.addEventListener("blur", () => {
    const sdata = street.value;
    streetValidate(sdata);
  });


  landmark.addEventListener("keyup", () =>{
    const landdata = landmark.value;
    landmarkValidate(landdata);
});
landmark.addEventListener("blur", () => {
    const landdata = landmark.value;
    landmarkValidate(landdata);
  });


  town.addEventListener("keyup", () =>{
    const tdata = town.value;
    townValidate(tdata);
});
town.addEventListener("blur", () => {
    const tdata = town.value;
    townValidate(tdata);
  });


  district.addEventListener("keyup", () =>{
    const ddata = district.value;
    districtvalidate(ddata);
});
district.addEventListener("blur", () => {
    const ddata = district.value;
    districtvalidate(ddata);
  });


  country.addEventListener("keyup", () =>{
    const cdata = country.value;
    countryValidate(cdata);
});
country.addEventListener("blur", () => {
    const cdata = country.value;
    countryValidate(cdata);
  });


  state.addEventListener("keyup", () =>{
    const statedata = state.value;
    stateValidate(statedata);
});
state.addEventListener("blur", () => {
    const statedata = state.value;
    stateValidate(statedata);
  });


  pincode.addEventListener("keyup", () =>{
    const pdata = pincode.value;
    pinValidate(pdata);
});
pincode.addEventListener("blur", () => {
    const pdata = pincode.value;
    pinValidate(pdata);
});


async function editAddress(addressId, fdata, ldata, mdata, hdata, sdata, landdata, tdata, ddata, cdata, statedata, pdata){
        try {
            console.log(addressId, fdata, ldata, mdata, hdata, sdata, landdata, tdata, ddata, cdata, statedata, pdata);
            const formdata = {
                fdata,
                ldata,
                mdata,
                hdata,
                sdata,
                landdata, 
                tdata, 
                ddata, 
                cdata, 
                statedata, 
                pdata
            }
            // const query = window.location.search
            // const url = new URLSearchParams(query)
            // const isCheckout = url.get("check")
            // console.log("check",isCheckout);
            
            const res = await fetch(`/address/edit-address/${addressId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(formdata)  
            })


            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }

            console.log("Response status", res.status);


            const data = await res.json();
            console.log("Data:", data);
         

            if(data.message){
                Swal.fire({
                    title:'Success!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                .then(() => {
                    //window.location.reload()
                    window.location.href = '/address'
                })
                // .then(()=>{
                //     if(isCheckout == 'true'){
                //         window.location.href = '/checkout'
                //     }else{
                //         window.location.href = '/address'
                //     }
                // })
            }else if(data.error){
                Swal.fire({
                    title: 'Error!',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.log(error.message);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while adding the address.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
}

  editAddressform.addEventListener('submit', (event) =>{
    event.preventDefault();

    const fdata = fname.value;
    const ldata = lname.value;
    const mdata = mobile.value;
    const hdata = houseno.value;
    const sdata = street.value;
    const landdata = landmark.value;
    const tdata = town.value;
    const ddata = district.value;
    const cdata = country.value;
    const statedata = state.value;
    const pdata = pincode.value;

    // const addressId = document.querySelector("#addressId").value;
    const addressId = document.getElementById('addressId').value;

    firstNameValidate(fdata);
    lastNameValidate(ldata);
    mobileValidate(mdata);
    housenoValidate(hdata);
    streetValidate(sdata);
    landmarkValidate(landdata);
    townValidate(tdata);
    districtvalidate(ddata);
    countryValidate(cdata);
    stateValidate(statedata);
    pinValidate(pdata);

    if(error1.innerHTML === "" && error2.innerHTML === "" &&
        error3.innerHTML === "" && error4.innerHTML === "" &&
        error5.innerHTML === "" && error6.innerHTML === "" &&
        error7.innerHTML === "" && error8.innerHTML === "" &&
        error9.innerHTML === "" && error10.innerHTML === "" &&
        error11.innerHTML === "")
        {
          editAddress(addressId, fdata, ldata, mdata, hdata, sdata, landdata, tdata, ddata, cdata, statedata, pdata)   
    }
  })


