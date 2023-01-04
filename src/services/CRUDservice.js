import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {// lay thong tin user lưu vào database
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFormBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFormBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('ok create a new user succeed!')
        } catch (e) {
            reject(e);
        }
    })
}
let hashUserPassword = (password) => {// Mã hóa password
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e);
        }
    })
}
let getAllUser = () => {// Lấy all users
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,// lấy array
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}
let getUserInfoById = (userId) => {// Tìm user để edit
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({//Tim user co trung id
                where: { id: userId },
                raw: true,
            })
            if (user) {//Nếu có trả ra user còn không thì trả ra {}
                resolve(user)
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })
}
let updateUser = (data) => {// Edit user
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({// Find user có id trùng
                where: { id: data.id }
            })
            if (user) {// Cập nhật data cho user
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve();
            } else {
                resolve()
            }
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUserById = (id) => {//Delete User
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({// Find use id and delete
                where: { id: id }
            })
            if (user) {// User có id trùng thì xóa
                await user.destroy();
            }
            resolve()
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createNewUser,
    hashUserPassword,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById,
}