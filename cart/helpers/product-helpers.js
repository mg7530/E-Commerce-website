var  db = require('../config/connection');
var collection = require('../config/collection');
const { ObjectId } = require('mongodb');
const { resolve } = require('promise');
var objectId = require('mongodb').ObjectID
module.exports={
    addProducts : (product , callback)=>{
        
       
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
          
             callback(data.insertedId);
           
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
            resolve(product)
        })

    })
    },

    updateProducts:(proId,proDetails)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proId)},
            {
                $set:{
                    productName:proDetails.productName,
                    productDescription : proDetails.productDescription,
                    productCategory : proDetails.productCategory,
                    productPrice : proDetails.productPrice
                }
            
        }).then((response)=>{
            resolve();
         })
        })
         
    

    }


































}