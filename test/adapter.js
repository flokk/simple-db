var should = require("should"),
    simpleDB = require("..");

module.exports = function(name, adapter) {
  describe(name, function() {
    
    var db;

    before(function() {
      simpleDB.use(name, adapter);
      db = simpleDB(name);
    });

    it("should 'post' a value", function(done) {
      db.post("post-test")
        .send({hello: "world"})
        .end(function(err, res) {
          if(err) return done(err);
          should.exist(res.id);
          done();
        });
    });

    it("should 'get' a value", function(done) {
      var value = {hello: "world"};

      db.post("get-test")
        .send(value)
        .end(function(err, res) {
          if(err) return done(err);

          db.get("get-test", res.id)
            .end(function(err, res) {
              if(err) return done(err);
              value.should.eql(res.body);
            });
        });

    });

    it("should fail on a non-existant 'get'", function(done) {
      db.get("get-test", "non-existant")
        .end(function(err, res) {
          if(err) return done(err);
          should.not.exist(res.body);
          done();
        });
    });

    it("should 'put' a value", function(done) {
      var value = {hello: "world"}
        , id = "my-id";

      db.put("put-test", id)
        .send(value)
        .end(function(err, res) {
          if (err) return done(err);

          db.get("put-test", id)
            .end(function(err, res) {
              if (err) return done(err);
              value.should.eql(res.body);
              done();
            });
        });
    });

    it("should re-'put' a value", function(done) {
      var value = {hello: "world"}
        , bucket = "re-put-test"
        , id = "my-id";

      db.put(bucket, id)
        .send(value)
        .end(function(err, res) {
          if (err) return done(err);

          var newValue = {hello: "universe"};

          db.put(bucket, id)
            .send(value)
            .end(function(err, res) {
              if (err) return done(err);

              db.get(bucket, id)
                .end(function(err, res) {
                  if (err) return done(err);
                  newValue.should.eql(res.body);
                  done();
                });
            });
        });
    });

    it("should update a complex object", function(done) {
      var value = {
        email: "test@example.com",
        age: null,
        addresses: [
          {street: "123 Fake Street", zip: 41224},
          {street: "Center Street"}
        ]
      };

      db.post("re-put-complex-test")
        .send(value)
        .end(function(err, res) {
          if (err) return done(err);

          var newValue = {
            email: "test1@example.com",
            age: 26,
            addresses: [
              {street: "Sesame Stree", zip: 09876},
              {street: "First Center Street", zip: 12345}
            ]
          };

          var id = res.id;

          db.put("re-put-complex-test", id)
            .send(newValue)
            .end(function(err, res) {
              db.get("re-put-complex-test", id)
                .end(function(err, res) {
                  if (err) return done(err);
                  newValue.should.eql(res.body);
                  done();
                });
            });
      });
    });

    it("should 'remove' a value", function(done) {
      var value = {hello: "world"};

      db.post("remove-test")
        .send(value)
        .end(function(err, id) {
          if (err) return done(err);

          db.remove("remove-test", id)
            .end(function(err) {
              if (err) return done(err);

              db.get("remove-test", id)
                .end(function(err, res) {
                  if (err) return done(err);
                  should.not.exist(res.body);
                  done();
                });
            });
        });
    });

    it("should 'all' a bucket", function(done) {
      var value = {hello: "world"},
          value2 = {hello: "universe"};

      db.post("all-test")
        .send(value)
        .end(function(err, id) {
          if (err) return done(err);

          db.post("all-test")
            .send(value2)
            .end(function(err, id2) {
              if (err) return done(err);

              db.all("all-test")
                .end(function(err, res) {
                  if (err) return done(err);
                  should.exist(res.body[id]);
                  should.exist(res.body[id2]);
                  res.body[id].should.eql(value);
                  res.body[id2].should.eql(value2);
                  done();
                });
            });
        });
    });

  });
};