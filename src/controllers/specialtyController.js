import specialtyService from '../services/specialtyService'

//Tạo thông tin phòng chuyên khoa
let createSpecialty = async (req, res) => {
    try {
        let newSpecialty = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(newSpecialty)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy all chuyên khoa
let getAllSpecialty = async (req, res) => {
    try {
        let allSpecialty = await specialtyService.getAllSpecialty();
        return res.status(200).json(allSpecialty)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
//Lấy doctors theo chuyên khoa (detail specialty) và vị trí
let getDetailSpecialtyById = async (req, res) => {
    try {
        let detailSpecialty = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(detailSpecialty)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}