const mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
let should= chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
var mongoose = require('mongoose');
let BookModel = require('../BookModel.model');
let index= require('../index.js');

describe('/POST Books',() =>{
	
	it('Should Post Book', (done) =>{
		let book={title:'Lord of Rings',author:'Robert',numPages:30};
		chai.request(index).post('/books').send(book).end((err,res) =>{
			res.should.have.status(200);
			res.body.should.be.a('object');
			done();
		});
	});
});

describe('/ GET/:id Books',() =>{
	it('Should get all book with a given id',(done) =>{
		let book = new BookModel({title:'Lord of Rings',author:'Robert',numPages:30});
		book.save((err, book) => {
		chai.request(index)
		.get('/books/'+book.id)
		.send(book).end((err,res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('title');
			res.body.should.have.property('author');
			res.body.should.have.property('numPages');
			done();
		});
		});
	});
});



describe('/PUT:id Books',() =>{
	
	it('Should Post Book with a id', (done) =>{
		let book=new BookModel({title:'Chronicles of Narnia',author:'John',numPages:690});
		book.save((err,book) =>{
		chai.request(index).post('/books/'+book.id).send({title:'Chronicles of Narnia',author:'Tom',numPages:690}).end((err,res) =>{
			res.body.should.be.a('object');
			done();
		});
	});
	});
});

describe('/Delete/:id Books',() =>{
	
	it('Should Delete Book with a id', (done) =>{
		let book=new BookModel({title:'Chronicles of Narnia',author:'John',numPages:690});
		book.save((err,book) =>{
		chai.request(index)
		.delete('/books/'+book.id).end((err,res) =>{
			res.body.should.be.a('object');
			res.should.have.status(200);
			done();
		});
	});
	});
});