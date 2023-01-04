import clinicService from '../services/clinicService'

//Tạo thông tin phòng khám
let createClinic = async (req, res) => {
    try {
        let newClinic = await clinicService.createClinic(req.body);
        return res.status(200).json(newClinic)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy all phòng khám
let getAllClinic = async (req, res) => {
    try {
        let allClinic = await clinicService.getAllClinic();
        return res.status(200).json(allClinic)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy doctors theo chuyên khoa (detail specialty) và vị trí
let getDetailClinicById = async (req, res) => {
    try {
        let detailClinic = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(detailClinic)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}