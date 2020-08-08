var express=require('express');
var DetailsRouter=express.Router();
var bodyparser=require('body-parser');

const Details=require('../models/details');

DetailsRouter.use(bodyparser.json());

DetailsRouter.route('/details')
.get((req,res,next)=>{
    Details.find()
    .then((data)=>{
       // console.log(req);
        let list=[];
        data.forEach((item)=>{
            let temp={
                _id:item._id,
                first_name:item.first_name,
                last_name:item.last_name,
                total_votes:item.total_votes,
                solved:item.solved,
                expert:item.expert,
            }

            list.push(temp);

        });
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json({list:list,status:0});

    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer')
    {
        let code=req.headers.authorization.split(' ')[1];
       // console.log(code);
       // console.log(process.env.ADMIN_CODE);
        if(code === process.env.ADMIN_CODE)
        {
            let s1=new Date().getTime().toString();
            let password=s1.substring(s1.length-4,s1.length);
            req.body.code=password;
           // console.log(req.body);
            Details.create(req.body)
            .then((data)=>{
                res.statusCode=200;
                res.setHeader('content-type','application/json');
                res.json({status:0,code:data.code});
            },(err)=>console.log(err))
            .catch((err)=>{
                next(err);
            })
        }
        else
        {
            res.statusCode=401;
            res.setHeader('content-type','application/json');
            res.json({status:1,result:'Not authorized'});
        }
    }
    else
    {
        res.statusCode=401;
            res.setHeader('content-type','application/json');
            res.json({status:1,result:'Not authorized'});
    }
})

.put((req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer')
    {
        let code=req.headers.authorization.split(' ')[1];
       // console.log(req.body);
        Details.findById(req.body._id)
        .then((data)=>{
            if(code === data.code || code === process.env.ADMIN_CODE)
            {
                Details.findByIdAndUpdate({_id:req.body._id},req.body)
                .then((data)=>{
                    res.statusCode=200;
                    res.setHeader('cntent-type','application/json');
                    res.json({status:0,result:'done'});
                },(err)=>console.log(err))
                .catch((err)=>next(err));
            }
            else
            {
                res.statusCode=401;
                res.setHeader('content-type','application/json');
                res.json({status:1,result:'Not authorized'});
            }
        },(err)=>console.log(err))
        .catch((err)=>{
            next(err);
        })

    }
    else
    {
                res.statusCode=401;
                res.setHeader('content-type','application/json');
                res.json({status:1,result:'Not authorized'});
    }
})

.delete((req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer')
    {
        let code = req.headers.authorization.split(' ')[1];

        if(code === process.env.ADMIN_CODE)
        {
            Details.findByIdAndRemove(req.body._id)
            .then((data)=>{
                res.statusCode=200;
                res.setHeader('content-type','application/json');
                res.json({status:0,result:'Deleted successfully',data:data});
            },(err)=>console.log(err))
            .catch((err)=>next(err));
        }
        else
        {
            res.statusCode=401;
            res.setHeader('content-type','application/json');
            res.json({status:1,result:'Not authorized'});
        }
    }
    else
    {
            res.statusCode=401;
            res.setHeader('content-type','application/json');
            res.json({status:1,result:'Not authorized'});
    }
});


DetailsRouter.route('/')
.post((req,res,next)=>{
   // console.log(req);
    if(req.cookies.voted)
    {
        Details.findById(req.cookies.voted)
        .then((data)=>{
          //  console.log(data);

            res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json({status:1,result:'Already Voted',first:data.first_name});
        },(err)=>console.log(err))
        .catch((err)=>next(err));
    }
    else
    {
        let total=req.body.total_votes+1;
       // console.log(total);
        Details.findByIdAndUpdate({_id:req.body._id},{total_votes:total})
        .then((data)=>{
            let d = new Date();
            d.setTime(d.getTime() + (30*60*1000));

          res.cookie('voted',req.body._id,{path: "/", expires: d,domain:"localhost",httpOnly:false,secure:false,signed:false});
            res.statusCode=200;
            res.setHeader('content-type','application/json');

       // res.setHeader('Set-Cookie',`voted=${req.body._id}`);

            res.json({status:0,result:'Voted successfully'});
           // console.log(res);
        })
    }
    
});


module.exports=DetailsRouter;
