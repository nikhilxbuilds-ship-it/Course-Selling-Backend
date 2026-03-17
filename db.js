const mongoose = require("mongoose");
const { string, stringFormat, object } = require("zod");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;


const userSchema = new Schema({
    email : {type : string, unique : true},
    password : string,
    firstName : string,
    lastName : string
})

const adminSchema = new Schema({
    email : {type : string, unique : true},
    password : string,
    firstName : string,
    lastName : string
})

const courseSchema = new Schema({
    title : string,
    discription : string,
    price : string,
    imageURL : string,
    creatorId : ObjectId
})


const purchaseSchema = new Schema ({
    courseId : ObjectId,
    userId : ObjectId

})

const userModel = mongoose.model("users", userSchema)
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}