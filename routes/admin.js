const { response } = require('express');
var express = require('express');
const { default: swal } = require('sweetalert');
var router = express.Router();
var userHelper = require('../helpers/user-helper')


const verifyAdminLogin = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let admin = req.session.admin
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.adminloggedIn) {

    userHelper.getAllUser().then((users) => {
      
      let userStatus = "Active"
    

      res.render('admin/view-users', { adminPage: true, admin, users,userStatus })


    })
  }
  else {
    res.redirect('/admin/login')
  }
});

router.get('/login', (req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.adminloggedIn) {
    res.redirect('/admin')
  } else {

    res.render('admin/admin-login', { loginPage: true, "loginErr": req.session.loggedInErr });
    req.session.loggedInErr = false
  }
})

router.post('/login', (req, res,) => {
  userHelper.doAdminLogin(req.body).then((responseAdmin) => {
    if (responseAdmin.status) {
      req.session.admin = responseAdmin.admin
      req.session.adminloggedIn = true
      res.redirect('/admin')
    } else {
      req.session.loggedInErr = true
      res.redirect('/admin/login')
    }
  })
})

router.get('/add-user', verifyAdminLogin, (req, res) => {
  res.render('admin/add-user', { adminPage: true,"emailErr":req.session.emailErr })
  req.session.emailErr=false
})

router.post('/add-user', (req, res) => {
  userHelper.addUser(req.body).then(() => {

    res.redirect('/admin')
  }).catch((err)=>{
    console.log("Email already taken");
    req.session.emailErr=true
   res.redirect('/admin/add-user')
  })
})

router.get('/delete-user/:id', verifyAdminLogin, (req, res) => {
  let userId = req.params.id
  userHelper.deleteUser(userId).then((response) => {
    res.redirect('/admin')
  })
})




router.get('/edit-user/:id', verifyAdminLogin, async (req, res) => {
  let userId = req.params.id
  let user = await userHelper.getUserDetails(userId)
  console.log(user);
  let status = true
  if (user.status !== "Active")
    status = false
  console.log("in edit user");
  console.log(status);
  res.render('admin/edit-user', { adminPage: true, user, status })

})

router.post('/edit-user/:id', verifyAdminLogin, async (req, res) => {
  let userId = req.params.id
  userHelper.updateUser(userId, req.body).then((response) => {
    res.redirect('/admin')
    console.log("In admin eddi");
    console.log(req.session.user);
    req.session.user = null
    req.session.userloggedIn = false
    console.log(req.session.user);
  })

})

router.get('/search-user', verifyAdminLogin, async (req, res) => {
  let user = await userHelper.searchUser()
  res.render('admin/search-user', { adminPage: true })
})

router.post('/search-user', verifyAdminLogin, (req, res) => {

  let userName = req.body.userName
  userHelper.searchUser(userName).then((user) => {
    console.log(user);
    if (user)
      res.render('admin/search-user', { adminPage: true, user })
    else {
      err = true
      res.render('admin/search-user', { adminPage: true, err })
    }
  })

})



router.get('/logout', (req, res) => {
  req.session.admin = null
  req.session.adminloggedIn = false
  res.redirect('/admin/login')
})



module.exports = router;
