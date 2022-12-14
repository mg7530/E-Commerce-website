var  db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
const { reject } = require('promise');
const { ObjectID } = require('mongodb');
var objectId = require('mongodb').ObjectID
//const { USER_COLLECTION } = require('../config/collection');
//var promise = require('promise')
module.exports={
    doSignup: (userData) =>{
       return new Promise(async (resolve,reject)=>{
        userData.password = await bcrypt.hash(userData.password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            resolve(userData)
        })
        
       })
    },
    doLogin : (userData)=>{
        return new Promise(async(resolve,reject)=>{
        let loginStatus = false;
        let response = {};
        
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare( userData.password,user.password).then((status)=>{
                        if(status){
                            console.log('login success');
                            response.user = user;
                            response.status = true;
                            resolve(response);
                        }else{
                            console.log('failed');
                            resolve({status:false});
                        }
                })
            }else{
                console.log('incorrect email');
                resolve({status:false})

            }
        })
    },
    addToCart: (proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                    $push:{products:objectId(proId)}
                }).then((response)=>{
                    resolve();
                })
            }else{
                let cartObj={
                    user: objectId(userId),
                    products: [objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve();
                })
            }
           
            
        })
    },
    getCartProducts : (userId)=>{
        return new Promise (async(resolve,reject)=>{
            let cartItems =await  db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match : {user:objectId(userId)}
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        let : {proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    expr:{
                                        $in : ['$_id',"$$proList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }














}