const mongoose=require('mongoose');

var Schema=mongoose.Schema;

const Expert=new Schema({
    subject:{
        type:String
    },
    rating:{
        type:Number
    }
});

const Details=new Schema({
   code:{
    type:String
   },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String
    },
    total_votes:{
        type:Number,
        default:0
    },
    solved:{
        type:Number,
        default:0
    },
    expert:[Expert]
},{
    timestamps:true
});

module.exports=mongoose.model('Detail',Details);