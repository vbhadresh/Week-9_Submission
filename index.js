const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
//const BookModel = require('./BookModel.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let BookModel = require('./BookModel.model');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true },function(err,res){
	if(err){
		console.log("Error in connecting to MongoDB");
	}
	else{
		console.log("MongoDB is connected Successfully");
	}
});


app.get('/books',function(req,res){
	BookModel.find(function(err,book){
		if(err){
			res.json({'message':'Error in retreiving books ','status':400}).status(400).send(err);
		}else{
			res.status(200).send(book);
		}
	});
	
});

app.post('/books', function(req, res){

	let book = new BookModel(req.body);
	book.save().then(item => {
		//res.send("item saved to database");
		res.status(200).send(item);
	}).catch(err =>{
		res.status(400).send("unable to post book");
	});
	
});
app.get('/books/:id', function(req, res){
	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)){
		BookModel.findById(mongoose.Types.ObjectId(req.params.id),function(err,book) {
			if(err){
				res.json({'message':'Error in retreiving book with Given Id','status':400}).status(400).send(err);
			}else{
			if(book){
				res.status(200).send(book);
			}
			else{
				res.json({'message':'Unable to find book','status':200}).status(200);
			}
			}
	});
	}else{
		res.json({'message':'No book found with the given id','status':400}).status(400);
	}
});

app.put('/books/:id', function(req,res){
	
	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)){
	BookModel.findById(mongoose.Types.ObjectId(req.params.id),function(err,updatedBook){
		if(err){
			res.json({'message':"error in updating value",'status':400}).send(err);
		}else{
			if(req.body.title!== undefined){
				updatedBook.title=req.body.title;
			}
			if(req.body.author!== undefined){
				updatedBook.author=req.body.author;
			}
			if(req.body.numPages!== undefined){
				updatedBook.numPages=req.body.numPages;
			}
			updatedBook.save().then(item =>{
				res.status(200).send(item);
			}).catch(err =>{
				res.status(400).send(err);
			});
		}
	});
	}
	else{
		res.json({'message':'No book found with the given id','status':400}).status(400);
	}
});
app.delete('/books/:id',function(req,res){
	let id=req.params.id;
	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)){
	BookModel.findOneAndDelete({_id:mongoose.Types.ObjectId(id)},function(err,deletedBook){
		if(err){
			res.json({'message':"error in deleting value",'status':400});
		}else{
		res.json({'message':'successfully deleted','status':204});
		//res.status(204).send(deletedBook);
		
		}
	});
	}else{
		res.json({'message':'No book found with the given id','status':400});
	}
		
});
//End get function single
module.exports =app.listen(port,() => console.log(`Listening to Port ${port}!`));
