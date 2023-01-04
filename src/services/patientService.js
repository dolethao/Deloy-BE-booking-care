import { v4 as uuidv4 } from 'uuid'
import db from "../models/index"
require('dotenv').config();
import emailService from './emailService'
//Url động kèm token và doctorId để xác thực đặt lịch khám
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
// Đặt lịch khám bệnh và gửi email xác nhận
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType ||
                !data.date || !data.fullName || !data.selectedGender
                || !data.address || !data.phoneNumber || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters'
                })
            } else {

                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirecLink: buildUrlEmail(data.doctorId, token)
                })
                //update patient
                //True: nếu create, false nếu find
                let user = await db.User.findOrCreate({// Find or create
                    where: { email: data.email },
                    //Tạo mới user
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                        gender: data.selectedGender,
                        address: data.address,
                        lastName: data.fullName,
                        phonenumber: data.phoneNumber
                    }
                });
                //Create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!',
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
//Xác nhận đặt lịch khám bệnh qua url: token và doctorId
let postVerifyAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({//Tìm kiếm lịch hẹn
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1"
                    },
                    raw: false// thì ms sd dc update
                })
                if (appointment) {//Xác nhận lịch hẹn
                    appointment.statusId = "S2"
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated!',
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postBookAppointment,
    postVerifyAppointment
}