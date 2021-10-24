var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const objectId = require('mongodb').ObjectID

module.exports = {

    addUser: (userData, callback) => {
        return new Promise(async (resolve, reject) => {
            userData.pw = await bcrypt.hash(userData.pw, 10)
            user = {
                name: userData.name,
                email: userData.email,
                status: "true",
                pw: userData.pw

            }
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then(() => {

                resolve()
            })
        })
    },
    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            // console.log(users);
            resolve(users)
        })
    },
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.pw = await bcrypt.hash(userData.pw, 10)
            user = {
                name: userData.name,
                email: userData.email,
                status: "true",
                pw: userData.pw

            }
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                resolve(user)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {

                bcrypt.compare(userData.pw, user.pw).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                        console.log("Response");
                        console.log(response);
                    } else {
                        console.log("Login Failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("Failed");
                resolve({ status: false })
            }
        })
    },
    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let responseAdmin = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTTION).findOne({ email: adminData.email })
            if (admin) {


                if (adminData.pw == admin.pw) {
                    console.log("login success");
                    responseAdmin.admin = admin
                    responseAdmin.status = true
                    resolve(responseAdmin)
                } else {
                    console.log("Login Failed");
                    resolve({ status: false })
                }

            } else {
                console.log("Failed");
                resolve({ status: false })
            }
        })
    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            console.log(userId);
            console.log(objectId(userId));
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then(() => {
                resolve(userId)
            })
        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    updateUser: (userId, userData) => {
        return new Promise(async (resolve, reject) => {
            userData.pw = await bcrypt.hash(userData.pw, 10)
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        name: userData.name,
                        email: userData.email,
                        status:userData.status,
                        pw: userData.pw
                    }
                }).then((response) => {
                    resolve(response)
                    console.log("Response helper");
                    console.log(response);
                })
        })
    },
    searchUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ name: user }).then((user) => {
                resolve(user)

            })
        })
    },
    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            console.log(user._id + user.name + user.email);
            let userData = {
                _id: user._id,
                name: user.name,
                email: user.email
            }
            db.get().collection(collection.B_USER_COLLECTION).insertOne(userData).then((data) => {
                // console.log(data);
                resolve(userData)
            })
        })
    },
    unBlockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.B_USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((data) => {
                console.log(data);
                resolve()
            })
        })
    },
    getBlockedUsers: () => {
        return new Promise(async (resolve, reject) => {
            let blockedUsers = await db.get().collection('blocked').find().toArray()
            // console.log(blockedUsers);
            resolve(blockedUsers)
        })
    },
    checkBlockedUser: () => {
        return new Promise(async (resolve, reject) => {
            let blockedUsers = await db.get().collection('blocked').find().toArray()

            resolve(blockedUsers)
        })
    }

}