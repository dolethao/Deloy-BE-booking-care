import db from "../models/index"
require('dotenv').config();

//Tạo thông tin chuyên khoa
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameVi || !data.nameEn || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {// Check xem có data k
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                await db.Specialty.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
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
// Lấy thông tin tất cả chuyển khoa
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
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
//Lấy doctors theo chuyên khoa (detail specialty) và vị trí
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter',
                })
            } else {


                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['nameVi', 'nameEn', 'descriptionHTML', 'descriptionMarkdown',],// miêu tả specialty
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {//Tìm tất cả doctor ko phân biệt vùng miền
                        doctorSpecialty = await db.Doctor_Infor.findAll({// Tìm all doctor thuộc speciatly đấy
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']//doctorId và tỉnh thành
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({//Tìm all doctor thuộc location
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']//doctorId và tỉnh thành
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
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
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}