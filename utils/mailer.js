const nodemailer = require("nodemailer");

const mailer =  async (otp, email)=>{
    try {
        return new Promise(async(resolve, reject) =>{
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: process.env.NODEMAILER_MAIL,
                  pass: process.env.NODEMAILER_PASS,
                },
              });
      
              const message = await transporter.sendMail({
                from: process.env.NODEMAILER_MAIL,
                to: email,
                subject: "Cyclone OTP Verification",
                text: `Your One Time Password`,
                html: `<h4> Your otp is: <b> ${otp} </b> </h4> `,
              });
              console.log(message);
              resolve(message)
        })
    } catch (error) {
        reject(error.message)
    }
}


module.exports = {
    mailer
}