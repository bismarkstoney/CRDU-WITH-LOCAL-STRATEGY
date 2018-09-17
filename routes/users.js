const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const passport=require('passport')
const User=require('../models/Users')

router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.get('/resgister', (req,res)=>{
    res.render('users/resgister')
})


//register form  POST
router.post('/resgister',(req,res)=>{
    
    req.checkBody('name', 'Please enter Your name').notEmpty()
    req.checkBody('email', "email can't be empty").notEmpty()
    req.checkBody('password',  "password can't be empty").notEmpty()
    req.checkBody('password2',  "confirm password  can't be empty").notEmpty()
    req.checkBody('email', 'Please enter a valid email').isEmail()
    req.assert('password', 'Passwords do not match').equals(req.body.password2);
    var errors =req.validationErrors()
    if(errors){
        res.render('users/resgister',{
            errors: errors,
           name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2:req.body.password2
        })
       
    }else{
        User.findOne({email: req.body.email})
        .then(user =>{
            if(user){
                req.flash('error_msg', 'Emial Already taken')
                res.redirect('/users/login')
            }else{
                const newUser= new User({
                    name: req.body.name,
                    email:req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password,salt, (err,hash)=>{
                     if(err) throw err;
                     newUser.password=hash
                     newUser.save()
                     .then(user=>{
                         req.flash('success_msg', 'You are now register')
                         res.redirect('/users/login')
                     })
                     .catch((err) => console.log(err))
        
                    })
        
                })
            }
        })
       

    }
})

router.post('/login', (req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})


//logoutUser

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'Your logout')
    res.redirect('/users/login')
})
module.exports=router