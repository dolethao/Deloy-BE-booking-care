import doctorService from '../services/doctorService'
//get top doctors home
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10; // Nếu k truyền limit thì lấy mặc định là 10 doctor
    try {
        let response = await doctorService.getTopDoctorHome(+limit);// String => Number
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever...'
        })
    }
}
//get all doctor (manager doctor)
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
//lưu infor doctors vào database
let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);// Hứng res từ client
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errorCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
// Lấy detail infor doctor
let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errorCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
// Lưu lịch khám bệnh của doctor
let bulkCreateSchedule = async (req, res) => {
    try {
        let schedule = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(schedule)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
// Lấy lịch khám bệnh doctor theo date 
let getScheduleByDate = async (req, res) => {
    try {
        let scheduleDate = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(scheduleDate)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy giá khám, tên địa chỉ phòng khám của doctor
let getExtraInforDoctorById = async (req, res) => {
    try {
        let extraInforDoctor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(extraInforDoctor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//lấy profile doctor model đặt lịch khám bệnh
let getProfileDoctorById = async (req, res) => {
    try {
        let profileDoctor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(profileDoctor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy danh sách bệnh nhân khám bệnh doctor theo date
let getListPatientForDoctor = async (req, res) => {
    try {
        let listPatient = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(listPatient)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
// Khám bệnh xong và gửi hóa đơn
let sendRemedy = async (req, res) => {
    try {
        let sendRemedy = await doctorService.sendRemedy(req.body);
        return res.status(200).json(sendRemedy)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctors,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}
