        const forgotForm = document.getElementById('forgotForm');
        const newpass = document.getElementById('acc-new-password');
        const confirmpass = document.getElementById('acc-confirm-password');

        function newPassword(password){
            const passwordpattern = /^[A-Za-z\d@$!%*?&]+$/
            if(password.trim() === ""){
                error1.innerHTML = "Please enter the new password!";
                error1.style.display = "block";
            }else if(!passwordpattern.test(password)){
                error1.innerHTML = "Password should only contain numbers, alphabets, and special characters @$!%*?&!!";
                error1.style.display = "block";
            }else if(password.length < 8){
                error1.innerHTML = "Password must be atleat 8 characters long!!";
                error1.style.display = "block";
            }else{
                error1.innerHTML = "";
                error1.style.display = "none";
            }
        }

        function confirmNewPassword(password){
            const passwordpattern = /^[A-Za-z\d@$!%*?&]+$/
            if(password.trim() === ""){
                error2.innerHTML = "Please re-enter the new password!";
                error2.style.display = "block";
            }else if(!passwordpattern.test(password)){
                error2.innerHTML = "Password should only contain numbers, alphabets, and special characters @$!%*?&!!";
                error2.style.display = "block";
            }else if(password.length < 8){
                error2.innerHTML = "Password must be atleat 8 characters long!!";
                error2.style.display = "block";
            }else{
                error2.innerHTML = "";
                error2.style.display = "none";
            }
        }

        newpass.addEventListener('keyup', () =>{
            const passwordData = newpass.value;
            newPassword(passwordData)
        })
        
        newpass.addEventListener('blur', () =>{
            const passwordData = newpass.value;
            newPassword(passwordData)
        })
        
        
        confirmpass.addEventListener('keyup', () =>{
            const cpasswordData = confirmpass.value;
            confirmNewPassword(cpasswordData)
        })
        
        confirmpass.addEventListener('blur', () =>{
            const cpasswordData = confirmpass.value;
            confirmNewPassword(cpasswordData)
        })


        forgotForm.addEventListener('submit', (event)=>{
            const passwordData = newpass.value;
            const cpasswordData = confirmpass.value;
            event.preventDefault();


            newPassword(passwordData);
            confirmNewPassword(cpasswordData);

            if(error1.innerHTML === "" || error2.innerHTML === ""){
                acceptPassword(newpass.value,confirmpass.value)
            }

        })


        async function acceptPassword(newp, confp){
            try {
                const res = await fetch('/forgot-password',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({newpass:newp,confirmpass:confp})
                })
                const data = await res.json()
                // console.log(data);
                // if(data.message){
                //     document.getElementById('success_mess').innerHTML = data.message;
                //     setTimeout(()=>{
                //         window.location.href = '/user-login'
                //     },3000)
                // }
                if (res.ok) {
                document.getElementById('success_mess').innerHTML = data.message;

                setTimeout(() => {
                    window.location.href = '/user-login';
                }, 3000);
            } else {
                document.getElementById('success_mess').innerHTML = data.error || 'An error occurred';
            }
            } catch (error) {
                console.log(error.message);
                document.getElementById('success_mess').innerHTML = 'An error occurred';
            }
        }

        // forgotForm.addEventListener('submit',(e)=>{
        //     e.preventDefault()
        //     console.log(newpass.value);
        //     console.log(confirmpass.value);

        //     acceptPassword(newpass.value,confirmpass.value)
        // })
