import userService from '../services/userService'

//Login User
let handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        // Check email  & password: empty, underfine, null
        return res.status(500).json({
            errCode: 1,
            message: "Mising inputs parameter!"
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        //If có userData thì trả user else {}
        user: userData.user ? userData.user : {}

    })
}

// Get danh sach User
let handleGetAllUser = async (req, res) => {
    let id = req.query.id; //All or Single
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `Mising required parameters`,
            user: []
        })
    }
    let user = await userService.getAllUsers(id);
    console.log(user)
    return res.status(200).json({
        errCode: 0,
        errMessage: "Ok",
        user
    })

}
// Create new user
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message);
    return res.status(200).json(message);
}

//Delete user
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)

}
//Edit user
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message)
}
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
}