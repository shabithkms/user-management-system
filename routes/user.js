const { response } = require('express');
var express = require('express');
const { Db } = require('mongodb');
const userHelper = require('../helpers/user-helper');
var router = express.Router();
var swal = require('sweetalert')
var db = require('../config/connection')
var collection = require('../config/collection')
let emails = []



const verifyUserLogin = (req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.userloggedIn) {
    let userId = req.session.user._id
    userHelper.getUserDetails(userId).then((user) => {
      console.log("In verify login");
      if (user) {
        console.log(user.status);
        if (user.status === "Active") {
          next()
        } else {

          req.session.blockErr = true
          req.session.deleteErr = false
          req.session.user = null
          req.session.userloggedIn = false
          res.redirect('/login')
        }

      } else {
        console.log('no user');
        req.session.deleteErr = true
        req.session.user = null
        req.session.userloggedIn = false
        res.redirect('/login')

      }

    })
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', verifyUserLogin, function (req, res,) {
  // let user = req.session.user

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.userloggedIn) {
    let userId = req.session.user._id
    userHelper.getUserDetails(userId).then((user) => {
      res.render('user/view-profile', { loginPage: false, user ,});
    })

  } else {
    res.redirect('/login')

  }
});
router.get('/login', function (req, res, next) {

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {

    res.render('user/user-login', {
      loginPage: true, signup: false, "loginErr": req.session.loggedInErr,
      "blockErr": req.session.blockErr, "deleteErr": req.session.deleteErr,"edited":req.session.edited
    });
    req.session.edited=false
    req.session.blockErr = false
    req.session.loggedInErr = false

  }
});


router.post('/login', (req, res,) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      let status = response.user.status
      console.log("Status");
      console.log(status);
      if (status === "Active") {
        req.session.user = response.user
        req.session.userloggedIn = true
        res.redirect('/')
      } else {

        req.session.blockErr = true
        req.session.user = null
        req.session.userloggedIn = false

        res.redirect('/login')
      }
    } else {
      req.session.loggedInErr = true
      res.redirect('/login')
    }
  })
})

router.get('/signup', function (req, res, next) {
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {
    res.render('user/user-signup', { loginPage: true, signup: true,"emailErr":req.session.emailErr });
    req.session.emailErr=false
  }
});

router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    // console.log(response);
    req.session.user = response
    req.session.userloggedIn = true
    res.redirect('/login')
  }).catch((err)=>{
    req.session.emailErr=true
    res.redirect('/signup')
  })
})

router.get('/edit-user/:id', verifyUserLogin, async (req, res) => {
  let userId = req.params.id

  let user = await userHelper.getUserDetails(userId)

  res.render('user/edit-user', { adminPage: false, user })
})
router.post('/edit-user/:id', verifyUserLogin, async (req, res) => {
  let userId = req.params.id
  userHelper.editUser(userId, req.body).then(async (response) => {
    let user = await userHelper.getUserDetails(userId)
    req.session.edited=true
    req.session.userloggedIn = false
    res.redirect('/login')
    // res.redirect('/')
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.userloggedIn = false
  res.redirect('/login')
})


module.exports = router;