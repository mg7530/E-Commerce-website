var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userhelpers = require('../helpers/user-helpers');
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login');
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let   user = req.session.user


  productHelper.getAllProducts().then((products)=>{
    
    res.render('user/view-products',{products ,user } );
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{

 
    res.render('user/login',{"loginerr":req.session.loginerr});
    req.session.loginerr=false;
}
})



router.get('/signup',(req,res)=>{
  res.render('user/signup');
})


router.post('/signup',(req,res)=>{
  userhelpers.doSignup(req.body).then((response)=>{
    req.session.loggedIn=true;
    req.session.user = response;
    res.redirect('/');
    
  })
})
router.post('/login',(req,res)=>{
  userhelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true;
      req.session.user=response.user;

    res.redirect('/')}
    else{
      req.session.loginerr = true;
      res.redirect('/login');
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
router.get('/cart',verifyLogin,async(req,res)=>{
 let products = await  userhelpers.getCartProducts(req.session.user._id)
  res.render('user/cart');
  console.log(products)
})
router.get('/addToCart/:id',verifyLogin,(req,res)=>{
  userhelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/');
  })
})

module.exports = router;
