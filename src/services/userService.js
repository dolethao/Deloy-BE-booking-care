import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            //Check database có email 
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'lastName', 'firstName'],
                    where: { email: email },
                    raw: true // trả dl ra obj
                });
                //Check có user lần 2, next compare password
                if (user) {
                    //Compare password: true : false
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `Ok`
                        delete user.password// Xóa password
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not fond`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try other email!`
            }
            resolve(userData)
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    //Check email trong database
    return new Promise(async (resolve, reject) => {
        try {

            let user = await db.User.findOne({
                where: { email: userEmail },

            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (e) {
            reject(e)
        }
    })
}
//Handle get users
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            // Lấy All user
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    //Ko in ra password
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            //Lấy 1 user
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}
//Handle create new user
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Check email is exist ???
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Email da ton tai vui long thu email khac"
                })
            } else {
                let hashPasswordFormBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFormBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'Ok',
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
//Handle delete user
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`,
            })
        }
        await db.User.destroy({
            where: { id: userId }
        });// Delete user
        resolve({
            errCode: 0,
            message: 'The user delete'
        })
    })
}
//Handle eidt user
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Mising required parameters'
                })
            }
            let user = await db.User.findOne({// Find user có id trùng
                where: { id: data.id },
                raw: false
            })
            if (user) {// Cập nhật data cho user
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save()
                resolve({
                    errCode: 0,
                    message: 'Update user succseed'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found`
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required paramters ! '
                })
            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }


        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUser,
    getAllCodeService,
}