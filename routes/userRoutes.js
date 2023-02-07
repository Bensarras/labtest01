const express = require("express");
const { collection } = require("../modules/usermodule");
const User = require("../modules/usermodule");

const router = express.Router();

// router.post("/register", async (req, res) => {
//   const user = new usermodule(req.username, req.email, req.password);
//     try
//     {
//       const newuser = await user.save();
//       res.status(201).json(newuser);
//     }
//     catch (err)
//     {
//       res.status(400).json({ message: err.message || "Some error occurred while creating the Account." });
//     }

//     //save the user to the database
//     //newuser.save();
//     //res.send("User registered");

//     user.save((err, user) => {
//         if (err) {
//             res.status(500).send({ message: err });
//             return;
//         }
    
//         res.send({ message: "User was registered successfully!" });
//         }
//     );

// });


// module.exports = router;
router.post("/", async (req, res) => {
    const user = new User(req.body);
    // try{
        const newuser = await user.save();
        if(newuser!=null){
            res.redirect('/login');
        }        
        // alert(message, "User registered");
        
        
    // }catch(err){
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating the Account."
    //     });
    // }

    // Save account in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the account."
        });
    });

    
});


router.post("/login", async (req, res) => {
    try{
        const check= await collection.findOne({username:req.body.username});
        if(check.password === req.body.password){
            res.redirect('/chat');
        }
        else{
            res.send("Invalid credentials")
            res.render('login');
     
        }
    }catch{
        res.send("Invalid credentials")
        res.render('login');
    }

});
  module.exports = router;