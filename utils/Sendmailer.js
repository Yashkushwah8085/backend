import Nodemailer from "nodemailer"

export const SendMailer = async (to,subject,html) =>{
    const transporter = Nodemailer.createTransport({
        service : "gmail",
        auth:{
            user: "mr.yash.kushwah8085@gmail.com",
            pass: "spwu gfsr cxlp jorr",
        },
    });
    
    await transporter.sendMail({
        from: `"hello guys" <mr.yash.kushwah8085@gmail.com>`,
        to,
        subject,
        html
    })
}