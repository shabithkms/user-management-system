const { response } = require('express');
var express = require('express');
const { Db } = require('mongodb');
const userHelper = require('../helpers/user-helper');
var router = express.Router();
var db = require('../config/connection')
var collection = require('../config/collection')
let emails = []
// console.log("In user js");
// console.log(emails);


const verifyUserLogin = (req, res, next) => {
  if (req.session.userloggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res,) {
  let user = req.session.user
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.userloggedIn) {
    res.render('user/view-profile', { loginPage: false, user });
  }
  else {
    res.redirect('/login')

  }

});
router.get('/login', function (req, res, next) {

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {

    res.render('user/user-login', { loginPage: true, signup: false, "loginErr": req.session.loggedInErr, "blockErr": req.session.blockErr });
    req.session.blockErr = false
    req.session.loggedInErr = false
  }
});

router.post('/login', (req, res,) => {
  console.log("Login Process Started");


  async function authUser(email) {
    let block = false
    console.log(email);
    userHelper.getBlockedUsers().then((blockedUsers) => {

      length = blockedUsers.length

      for (var i = 0; i < length; i++) {
        emails.push(blockedUsers[i].email)
      }
      let newMail = [email]
      console.log("Blocked Emails");
      console.log(emails);
      console.log("String");
      console.log(newMail);
      for (var i = 0; i < newMail.length; i++) {
        for (var j = 0; j < emails.length; j++) { 
          if (newMail[i] == emails[j]) {
            block = true
          }
        }
        console.log(block);
        if (!block) {
          userHelper.doLogin(req.body).then((response) => {
            if (response.status) {
              req.session.user = response.user
              req.session.userloggedIn = true
              res.redirect('/')
            } else {
              req.session.loggedInErr = true
              res.redirect('/login')
            }
          })
        } else {
          req.session.blockErr = true


          res.redirect('/login')
        }
      }
    })
  }

  authUser(req.body.email)

})

router.get('/signup', function (req, res, next) {
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {
    res.render('user/user-signup', { loginPage: true, signup: true });
  }


});

router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    // console.log(response);
    req.session.user = response
    req.session.userloggedIn = true
    res.redirect('/login')
  })
})

router.get('/edit-user/:id', verifyUserLogin, async (req, res) => {
  let userId = req.params.id
  let user = await userHelper.getUserDetails(userId)

  res.render('user/edit-user', { adminPage: false, user })

})
router.post('/edit-user/:id', verifyUserLogin, async (req, res) => {
  let userId = req.params.id
  userHelper.updateUser(userId, req.body).then(async (response) => {
    let user = await userHelper.getUserDetails(userId)
    req.session.userloggedIn = false

    res.redirect('/login')
  })

})

router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.userloggedIn = false
  res.redirect('/login')
})




module.exports = router;
