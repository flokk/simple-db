var should = require("should")
  , simpleDB = require("..");

describe("simple-db", function(){

  var db;

  before(function() {
    simpleDB
      .use("noop", require("./fixtures/noop"));
    simpleDB.default("noop");
    db = simpleDB();
  });

  describe("with an object", function(){
    it("should use 'bucket' and 'key'", function(done) {
      db.get({bucket:'bucket', key:'key'})
        .end(function(res) {
          done();
        });
    });
  });

  describe("with a callback", function(){
    it("should invoke .end()", function(done) {
      db.get('bucket', 'key', function(res) {
          done();
        });
    });
  });

  describe(".end()", function(){
    it("should issue a call", function(done) {
      db.get('bucket', 'key')
        .end(function(res) {
          done();
        });
    });
  });

  describe('res.error', function(){
    it('should should be an Error object', function(done){
      db.get('bucket', 'error')
        .end(function(res){
          should.exist(res.error);
          done();
        });
    });
  });

  describe('res.links', function(){
    it('should default to an empty object', function(done){
      db.get('bucket', 'get')
        .end(function(res){
          res.links.should.eql({});
          done();
        });
    });

    it('should populate the links from the metadata', function(done){
      db.get('bucket', 'links')
        .end(function(res){
          res.links.friend.should.eql({bucket:"bucket",key:"key"});
          done();
        });
    });

  });

  describe("db.set(key, value)", function(){
    it("should send the metadata info");
  });

  describe("db.set(obj)", function(){
    it("should send the metadata info");
  });

  describe('req.send(str)', function(){
    it('should write the string', function(done) {
      db.post('bucket')
        .send("this is my value")
        .end(function(res) {
          res.ok.should.be.ok;
          done();
        });
    });
  });

  describe('req.send(obj)', function(){
    it('should send an obj', function(done) {
      db.post('bucket')
        .send({key:"value"})
        .end(function(res) {
          res.ok.should.be.ok;
          done();
        });
    });

    describe('when called several times', function(){
      it('should merge the objects', function(done){
        db.post('bucket')
          .send({key:"value"})
          .send({key2:"value2"})
          .end(function(res) {
            res.ok.should.be.ok;
            done();
          });
      })
    })
  });

  describe('.end(fn)', function(){
    it('should check arity', function(done){
      db.get('bucket', 'get')
        .end(function(err, res) {
          should.not.exist(err);
          res.ok.should.be.ok;
          done();
        });
    });
  });

  describe('.buffer()', function(){
    it('should enable buffering', function(done){
      db.getAll('bucket')
        .buffer()
        .end(function(err, res) {
          should.not.exist(err);
          res.raw.length.should.be.above(1);
          done();
        });
    });
  });

  describe('.buffer(false)', function(){
    it('should disable buffering', function(done){
      db.getAll('bucket')
        .buffer(false)
        .end(function(err, res) {
          should.not.exist(err);
          var keys = 0;
          res.on("data", function(key, value, meta) {
            keys++;
          });
          res.on("end", function() {
            keys.should.be.above(1);
            done();
          });
        });
    });
  });

});
