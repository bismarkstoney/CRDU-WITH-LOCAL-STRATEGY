const express=require('express')
const exphbs=require('express-handlebars')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const session=require('express-session')
const methodOverride=require('method-override')
const expressValidator=require('express-validator')
const passport=require('passport')
const flash=require('connect-flash')
const db=require('./config/config')
const path=require('path')

const ideasRouter=require('./routes/ideas')
const usersRouter=require('./routes/users')
//passport config
require('./config/passport')(passport)




const app=express()
mongoose.connect(db.database, {
    useNewUrlParser: true
}).then(()=> console.log('connected'))
.catch((err)=> console.log(err))


app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars' ,exphbs({defaultLayout: 'main'}))
app.set('view engine' ,'handlebars' )
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(expressValidator())

app.use(session({
    secret: db.secret,
    resave: true,
    saveUninitialized: true

}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(function(req,res,next){
 res.locals.success_msg=req.flash('success_msg')
 res.locals.error_msg=req.flash('error_msg')
 res.locals.error=req.flash('error')
 //users
 res.locals.user=req.user || null
 next()
})
app.use('/ideas', ideasRouter)
app.use('/users', usersRouter)


const port= process.env.PORT || 3000
//INDEX ROUTE
app.get('/', (req,res)=>{
     res.render('index')
})
//About
app.get('/about', (req,res)=>{
    res.render('About')
})






app.listen(port, ()=>{
    console.log(`the magic is on ${port}`)
})