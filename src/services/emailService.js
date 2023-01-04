require('dotenv').config();
import nodemailer from 'nodemailer'
//Xác nhận đặt lịch khám bệnh
let sendSimpleEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",//nodemailer send email
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Đỗ Lê Thao 👻" <doilabekho112000@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: getTitleEmail(dataSend), // Subject line
        text: "Hello world test email?", // plain text body
        html: getBodyHTMLEmail(dataSend)
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Đỗ Lê Thao</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div><a href=${dataSend.redirecLink} target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because you booked an online medical appointment on the site Đỗ Lê Thao</p>
        <p>Information to book a medical appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
        <div>
        <a href=${dataSend.redirecLink} target="_blank">Click here</a>
        </div>
        <div>Thank you !</div>
        `
    }
    return result;
}
let getTitleEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = 'Thông tin đặt lịch khám bệnh'
    }
    if (dataSend.language === 'en') {
        result = 'Information to book a medical appointment'
    }
    return result;
}
//Gửi hóa đơn thuốc cho bệnh nhân
let sendAttachments = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",//nodemailer send email
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Đỗ Lê Thao 👻" <doilabekho112000@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: getTitleEmailRemedy(dataSend), // Subject line
        text: "Hello world test email?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: {   // encoded string as an attachment // Gửi file
            filename: `donthuoc-${dataSend.patientId}-${new Date().getTime()}.png`,// ren động ảnh gửi khác nhau theo time
            content: dataSend.imageBase64.split("base64,")[1], //Chia cắt phần đầu vs base64
            //         "data:image/gif;base64,"
            // + "R0lGODlhAQABAIABAP///wAAACH5"
            // + "BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            encoding: 'base64'
        },
    });
}
let getTitleEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = 'Kết quả lịch khám bệnh'
    }
    if (dataSend.language === 'en') {
        result = 'Results of medical examination schedule'
    }
    return result;
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}  !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Đỗ Lê Thao</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm:</p>
        
        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName} </h3>
        <p>You received this email because you booked an online medical appointment on the site Đỗ Lê Thao</p>
        <p>Prescription/invoice information is sent in the attached file:</p>
       
        <div>Thank you !</div>
        `
    }
    return result;
}
module.exports = {
    sendSimpleEmail,
    sendAttachments
}