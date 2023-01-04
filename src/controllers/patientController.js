import patientService from '../services/patientService'
// Lưu Modal lịch khám bệnh và gửi email kèm url xác nhận
let postBookAppointment = async (req, res) => {
    try {
        let profileDoctor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(profileDoctor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
// Xác nhận đặt lịch khám bệnh url: token & doctorId
let postVerifyAppointment = async (req, res) => {
    try {
        let verifyBooking = await patientService.postVerifyAppointment(req.body);
        return res.status(200).json(verifyBooking)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
module.exports = {
    postBookAppointment,
    postVerifyAppointment
}