import db from "../models/index"
require('dotenv').config();
import _, { reject } from 'lodash';
import emailService from './emailService'


//Max số bệnh nhân khám 1 ngày
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

//Lấy top doctor homepage
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,// 10 users
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']], //lấy users theo ngày tạo mới
                attributes: {
                    exclude: ['password']// Ko lấy password
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error);
        }
    })
}
// get all doctors (manage doctors)
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                //Vào database lấy user có roleId là R2
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']// Ko lấy password, ảnh
                },
            })
            resolve({
                errCode: 0,
                // trả về user doctor và gán vào data
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}
//Validate data
let checkDataFields = (inputData) => {
    let arrFileds = ['doctorId', 'contentHTML', 'contentMarkdown',
        'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameCilinic', 'addressClinic', 'note', 'specialtyId', 'clinicId']
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFileds.length; i++) {
        if (!inputData[arrFileds[i]]) {
            isValid = false;
            element = arrFileds[i]// trả ra data k truyền
            break;
        }
    }
    return {
        isValid,
        element
    }
}
// save deatil infor doctor (manage doctors)
let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkDataFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Mising parameter ${checkObj.element}`
                })
            } else {
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({// Lưu infor doctor vào database
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        // Tìm doctorId dưới db và lưu lại content vừa edit
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {// Tìm thấy doctor
                        //Gán giá trị content vào colums
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        // lưu content được edit
                        await doctorMarkdown.save();
                    }
                }
                //Table doctor_infor
                let doctorInfor = await db.Doctor_Infor.findOne({
                    // Tìm doctorId dưới db và lưu lại content vừa edit
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    //Update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameCilinic = inputData.nameCilinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save();
                } else {
                    //Create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameCilinic: inputData.nameCilinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                })
            }
        } catch (error) {
            reject(error)
        }

    })
}
// Lấy detail infor doctor
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']// Ko lấy password
                    },
                    include: [// nối tiếp đến table Markdown để lấy tt user theo id
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']// Ko lấy 
                            },
                            include: [// Lấy thêm data ở table allcode và Specialty
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Specialty, as: 'specialtyTypeData', attributes: ['nameVi', 'nameEn'] },
                                { model: db.Clinic, as: 'clinicTypeData', attributes: ['name'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,//gộp các ptu trong cùng 1 obj lại
                })
                if (data && data.image) {//covert image
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                if (!data) data = {};// ko có data trả ra obj rỗng
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// Lưu lịch khám bệnh của doctor
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {// Check xem có data k
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    // Thêm maxnumber từ data của client
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // lấy lịch khám dưới db lên để compare
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: '' + data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });
                // a = '5';
                // b = +a => b = 5 
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === +b.date;// đổi sang kiểu interger
                });
                // Nếu có data mới thì lưu thông tin vào bảng Schedule
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })

}
// Lấy lịch khám bệnh doctor theo ngày
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [// nối tiếp đến table Allcode để lấy keyMap để hiện thị giờ khám bệnh doctor
                        //table User để lấy fullname doctor
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true,//gộp các ptu trong cùng 1 obj lại
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
//Lấy giá khám, tên địa chỉ phòng khám của doctor
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },

                    include: [// nối tiếp đến table Allcode để lấy 
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    attributes: {
                        exclude: ['id', 'doctorId']// Ko lấy 
                    },
                    raw: false,
                    nest: true,//gộp các ptu trong cùng 1 obj lại
                })

                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
//lấy profile doctor model đặt lịch khám bệnh và gửi email xác nhận
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']// Ko lấy password
                    },
                    include: [// nối tiếp đến table Allcode để lấy chức vụ user theo id
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']// Ko lấy 
                            },
                            include: [// Lấy thêm data ở table allcode
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,//gộp các ptu trong cùng 1 obj lại
                })
                if (data && data.image) {//covert image
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
//lấy danh sách bệnh nhân khám bệnh của doctor theo date
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [// vào bảng user lấy tt patient
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'lastName', 'address', 'gender', 'phonenumber'],
                            include: [// vào tiếp bảng allcode thông qua user lấy gender
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },],
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },//allcode lấy thời gian
                    ],

                    raw: false,
                    nest: true,//gộp các ptu trong cùng 1 obj lại
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// Khám bệnh xong và gửi hóa đơn thuốc
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: `Mising parameter`
                })
            } else {
                //Upadate patient status
                let appointment = await db.Booking.findOne({// Tìm lịch hẹn của bệnh nhân
                    where: {
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                    },
                    raw: false // thì ms dùng đc hàm save(trả ra class sequelize)
                })
                if (appointment) {// Cập nhận khám bệnh thành công
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                //send email remedy
                await emailService.sendAttachments(data)
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
module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}