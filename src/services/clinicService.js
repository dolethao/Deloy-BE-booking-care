import db from "../models/index"
require('dotenv').config();

//Tạo thông tin phòng khám
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {// Check xem có data k
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// // Lấy thông tin tất cả chuyển khoa
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map(item => {//convert image thanh binary
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
// //Lấy doctors theo chuyên khoa (detail specialty) và vị trí
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter',
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown',],// miêu tả clinic
                })
                if (data) {
                    let doctorClinic = await db.Doctor_Infor.findAll({// Tìm all doctor thuộc phòng khám đấy
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId']//doctorId và phòng khám
                    })
                    data.doctorClinic = doctorClinic;
                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}