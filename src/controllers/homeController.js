import { json } from 'body-parser';
import db from '../models/index';
import CRUDservice from '../services/CRUDservice'

let getHomePage = async (req, res) => {
    try {
        // let data = await db.User.findAll();

        return res.render('homepage.ejs', {// lấy data từ database
            data: JSON.stringify({})
        })//Đã khai báo bên viewEngine
    } catch (error) {
        console.log(error)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {// create user
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message)
    return res.redirect("/display-crud")
}
let displayCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    console.log('-----------')
    console.log(data)
    console.log('------------')
    return res.render('displayCRUD.ejs', {// truyền data sang views
        dataTables: data
    })
}
let editCRUD = async (req, res) => {//edit user
    let userId = req.query.id;
    if (userId) {// Check xem co id khong
        let userData = await CRUDservice.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {// truyền data sang views
            userData: userData
        })
    } else {
        return res.send('User not found!')
    }
}
let putCRUD = async (req, res) => {//update user
    let data = req.body
    await CRUDservice.updateUser(data);
    return res.redirect("/display-crud")// quay lại trang

}
let deleteCRUD = async (req, res) => {//delete user
    let id = req.query.id
    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.redirect("/display-crud")
    } else {
        return res.send('User not found')
    }

}
module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD,

}