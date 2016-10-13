//Database Schema
var mongoose     = require('mongoose');  //Require mongoose
var Schema       = mongoose.Schema; //Mongoose schema object

//Define Schema for Weather collection
var Weather=mongoose.model('Weather', new Schema({
    city : {
        id:Number,
        name:String,
        country:String,
    },
    list:{
         id:Number,
         main:String,
         description:String,
         dt_txt:String
   }

}));
//Define Schema for Account collection
var Account=mongoose.model('Account', new Schema({

   source:String,
   destination:String,
   amount:Number

}));

//Export the modules
module.exports = {
    Weather: Weather,
    Account: Account

};
