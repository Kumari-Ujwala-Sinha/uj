const express = require('express')
const router = express.Router()
const mongoose =  require("mongoose")
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")
const User = mongoose.model("User")
const {JWT_SECRET} = require("../keys")
const requireLogin = require("../middleware/requireLogin")



router.post("/signup",(req, res) =>{
    const {name, email, password} = req.body
    if(!email|| !password || !name){
        return res.status(422).json({error:"please fill all the field"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({message:"User already exist"})
        }
        bcrypt.hash(password,14)
        .then(hashedpassword=>{
            const user = new User({
                email,name,
                password:hashedpassword
            })
            user.save()
            .then((user)=>{
               return res.json({message:"successfully singed up"})
            })
            .catch(err=>console.log(err))
        })
        }
        )
        
    .catch(err=>console.log(err))
    
})

router.post("/signin",(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({message:"email or password is empty"})
    }
    
    User.findOne({email:email})
    .then(savedUser =>{
        if(savedUser){
            bcrypt.compare(password,savedUser.password)
            .then(doMatch => {if(!doMatch){
                return res.status(422).json({error:"invalid email or password"})

                }
                else{
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id, name, email} = savedUser
                    return res.json({token,user:{_id, name, email}})
                }}
            )
            .catch(err=>console.log(err))
        }
        else{
            return res.status(422).json({error:"invalid email or password"})
        }
    })
    .catch(err=>console.log(err))
})

module.exports = router