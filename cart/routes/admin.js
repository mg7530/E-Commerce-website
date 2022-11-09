var express = require('express');
const { resolve } = require('promise');
const { render } = require ('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{
    
    res.render('admin/view-products',{products ,admin : true  } );
  })
 
});
//add product
router.get('/add-product' , (req,res)=>{
  res.render('admin/add-product');
})

//get value from add-product form

router.post('/add-product',(req,res)=>{
  
 //productHelper defines
  productHelper.addProducts(req.body, (id)=>{
    let image = req.files.productImg;
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }
      else{
        console.log(err);
      }
    });
    
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id',async (req,res)=>{
 let product = await productHelper.getProductDetails(req.params.id)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  productHelper.updateProducts(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.productImg){
      let image = req.files.productImg;
      let id = req.params.id;
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

module.exports = router;

