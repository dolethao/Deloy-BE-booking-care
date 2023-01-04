import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'

let router = express.Router();

let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage);//Home
    router.get('/crud', homeController.getCRUD);//Nhap info User
    router.post('/post-crud', homeController.postCRUD);//Create User
    router.get('/display-crud', homeController.displayCRUD);// info User
    router.get('/edit-crud', homeController.editCRUD)//Edit User
    router.post('/put-crud', homeController.putCRUD)//Update User
    router.get('/delete-crud', homeController.deleteCRUD)//Delete User

    //API để client gọi
    router.post('/api/login', userController.handleLogin);// api login
    router.get('/api/get-all-user', userController.handleGetAllUser);// api read user
    router.post('/api/create-new-user', userController.handleCreateNewUser);//api create user
    router.put('/api/edit-user', userController.handleEditUser);//api edit user
    router.delete('/api/delete-user', userController.handleDeleteUser);//api delete user

    //gender, role, position
    router.get('/api/allcode', userController.getAllCode);

    //doctor
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);//top doctors home
    router.get('/api/all-doctors', doctorController.getAllDoctors);//all doctors
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors);// lưu info doctors
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);//lấy thông tin của bác sĩ
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)// lưu lịch khám bệnh của doctor
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);// Lịch khám của doctor theo date
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);// Giá khám, tên, địa chỉ phòng khám
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);// Giá khám, tên, địa chỉ phòng khám
    router.get('/api/list-paitent-for-doctor', doctorController.getListPatientForDoctor);// Lấy danh sách bệnh nhân khám bệnh của doctor
    router.post('/api/send-remedy', doctorController.sendRemedy);//Doctor khám bệnh thành công và gửi hóa đơn

    //patient
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)// Lưu Modal lịch khám bệnh
    router.post('/api/verify-book-appointment', patientController.postVerifyAppointment)// Xác nhận đặt lịc khám bệnh

    //specialty
    router.post('/api/create-new-specialty', specialtyController.createSpecialty)//Tạo thông tin chuyên khoa
    router.get('/api/all-specialty', specialtyController.getAllSpecialty);//all specialty
    router.get('/api/detail-specialty-by-id', specialtyController.getDetailSpecialtyById);//lấy doctor theo chuyên khoa (detail specialty)

    //Clinic
    router.post('/api/create-new-clinic', clinicController.createClinic)//Tạo thông tin phòng khám
    router.get('/api/all-clinic', clinicController.getAllClinic);//all clinic
    router.get('/api/detail-clinic-by-id', clinicController.getDetailClinicById);//lấy phòng khám theo id

    return app.use("/", router)

}
module.exports = initWebRoutes