var should = require("should")
  , simpleDb = require("..");

function noop () {}

describe("simple-db", function(){

  var db;

  before(function() {
    simpleDb.register("noop", require("./fixtures/noop"));
    db = simpleDb("noop");
  });

  beforeEach(function() {
    db.removeAllListeners();
  });

  describe("get", function(){
    it("should call the callback for 'get'", function(done) {
      db.get("bucket", "key", done);
    });

    it("should call emit a 'get' event", function(done) {
      db.on("get", done);
      db.get("bucket", "key", noop);
    });

    it("should call emit a 'get' event without a callback", function(done) {
      db.on("get", done);
      db.get("bucket", "key");
    });
  });

  describe("exists", function(){
    it("should call the callback for 'exists'", function(done) {
      db.exists("bucket", "key", done);
    });

    it("should call emit a 'exists' event", function(done) {
      db.on("exists", done);
      db.exists("bucket", "key", noop);
    });

    it("should call emit a 'exists' event without a callback", function(done) {
      db.on("exists", done);
      db.exists("bucket", "key");
    });
  });

  describe("put", function(){
    it("should call the callback for 'put'", function(done) {
      db.put("bucket", "key", "value", done);
    });
    
    it("should call the callback for 'put' with metadata", function(done) {
      db.put("bucket", "key", "value", {}, done);
    });

    it("should call emit a 'put' event", function(done) {
      db.on("put", done);
      db.put("bucket", "key", "value", noop);
    });

    it("should call emit a 'put' event without a callback", function(done) {
      db.on("put", done);
      db.put("bucket", "key", "value");
    });

    it("should call emit a 'put' event with metadata", function(done) {
      db.on("put", done);
      db.put("bucket", "key", "value", {}, noop);
    });

    it("should call emit a 'put' event with metadata without a callback", function(done) {
      db.on("put", done);
      db.put("bucket", "key", "value", {});
    });
  });

  describe("post", function(){
    it("should call the callback for 'post'", function(done) {
      db.post("bucket", "value", done);
    });
    
    it("should call the callback for 'post' with metadata", function(done) {
      db.post("bucket", "value", {}, done);
    });

    it("should call emit a 'post' event", function(done) {
      db.on("post", done);
      db.post("bucket", "value", noop);
    });

    it("should call emit a 'post' event without a callback", function(done) {
      db.on("post", done);
      db.post("bucket", "value");
    });

    it("should call emit a 'post' event with metadata", function(done) {
      db.on("post", done);
      db.post("bucket", "value", {}, noop);
    });

    it("should call emit a 'post' event with metadata without a callback", function(done) {
      db.on("post", done);
      db.post("bucket", "value", {});
    });
  });

  describe("remove", function(){
    it("should call the callback for 'remove'", function(done) {
      db.remove("bucket", "key", done);
    });

    it("should call emit a 'remove' event", function(done) {
      db.on("remove", done);
      db.remove("bucket", "key", noop);
    });

    it("should call emit a 'remove' event without a callback", function(done) {
      db.on("remove", done);
      db.remove("bucket", "key");
    });
  });

  describe("all", function(){
    it("should call the callback for 'all'", function(done) {
      db.all("bucket", done);
    });

    it("should call emit a 'all' event", function(done) {
      db.on("all", done);
      db.all("bucket", noop);
    });

    it("should call emit a 'all' event without a callback", function(done) {
      db.on("all", done);
      db.all("bucket");
    });
  });

  describe("keys", function(){
    it("should call the callback for 'keys'", function(done) {
      db.keys("bucket", done);
    });

    it("should call emit a 'keys' event", function(done) {
      db.on("keys", done);
      db.keys("bucket", noop);
    });

    it("should call emit a 'keys' event without a callback", function(done) {
      db.on("keys", done);
      db.keys("bucket");
    });
  });
});
