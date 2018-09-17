const express=require('express')
const router=express.Router()
const Ideas=require('../models/Ideas')
const {ensureAuthenticated}= require('../helper/auth')
//ADD IDEAS FORMS
router.get('/add',ensureAuthenticated, (req,res)=>{
    res.render('ideas/add')
})

//PROCESS FORM
router.post('/',ensureAuthenticated, (req,res)=>{
    let title=req.body.title
    let details=req.body.details
    let user=req.user.id
    req.checkBody('title', 'Please Enter a title').notEmpty()
    req.checkBody('details', 'Please Enter details').notEmpty()
    var errors= req.validationErrors()

    if(errors){
        res.render('ideas/add',{
            errors: errors,
            title:title,
            details: details
           

        })
    }else{
         const newPost=new Ideas({
             title: title,
             details: details,
             user: user
         })
         newPost.save()
         .then((ideas)=>{
            req.flash('success_msg', ' Idea save')
             res.redirect('/ideas')
         })
    }
})

// INDEX IDEAS ROUTE
router.get('/',ensureAuthenticated,(req,res)=>{
    Ideas.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas=> {
        res.render('ideas/index',{
            ideas:ideas
        })
    })


 
})

//EDIT FORM RECORD
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Ideas.findOne({_id: req.params.id})
    .then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit',{
                idea:idea
            })
        }
        
    })
    .catch((err)=>console.log(err))
      
})


//Edit THE IDEA
router.put('/:id',ensureAuthenticated, (req,res)=>{
    Ideas.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        idea.title=req.body.title
        idea.details=req.body.details
        idea.save()
        .then(idea =>{
            req.flash('success_msg', ' Idea Updated')
            res.redirect('/ideas')
        })
    })
})

router.delete('/:id',ensureAuthenticated, (req,res)=>{
    Ideas.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Idea Remove')
        res.redirect('/ideas')
    })
})




module.exports=router