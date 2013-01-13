var should = require("should"),
    index = require("..");

describe("Adapters", function() {

  Object.keys(index._adapters).forEach(function(name) {
    var adapter = index._adapters[name];

    describe(name, function() {

      var instance;

      before(function() {
        switch(name) {
          case 'mongo':
            instance = adapter("mongo://127.0.0.1:27017/test");
            break;
          default:
            instance = adapter();
            break;
        }
      });

      it("should 'post' a value", function(done) {
        instance.post("post-test", {hello: "world"}, function(err, id) {
          should.exist(id);
          done(err);
        });
      });

      it("should 'get' a value", function(done) {
        var value = {hello: "world"};

        instance.post("get-test", value, function(err, id) {
          if (err) return done(err);

          instance.get("get-test", id, function(err, obj) {
            value.should.eql(obj);
            done(err);
          });
        });
      });

      it("should fail on a non-existant 'get'", function(done) {
        instance.get("get-test", "non-existant", function(err, obj) {
          should.not.exist(obj);
          done(err);
        });
      });

      it("should 'put' a value", function(done) {
        var value = {hello: "world"},
            id = "my-id";
        instance.put("put-test", id, value, function(err) {
          if (err) return done(err);

          instance.get("put-test", id, function(err, obj) {
            value.should.eql(obj);
            done(err);
          });
        });
      });

      it("should 'remove' a value", function(done) {
        var value = {hello: "world"};
        instance.post("remove-test", value, function(err, id) {
          if (err) return done(err);

          instance.remove("remove-test", id, function(err) {
            if (err) return done(err);

            instance.get("remove-test", id, function(err, obj) {
              should.not.exist(obj);
              done();
            });
          });
        });
      });

      it("should 'all' a bucket", function(done) {
        var value = {hello: "world"},
            value2 = {hello: "universe"};

        instance.post("all-test", value, function(err, id) {
          if (err) return done(err);

          instance.post("all-test", value2, function(err, id2) {
            if (err) return done(err);

            instance.all("all-test", function(err, values) {
              if (err) return done(err);
              should.exist(values[id]);
              should.exist(values[id2]);
              values[id].should.eql(value);
              values[id2].should.eql(value2);
              done();
            });
          });
        });
      });
    });
  });
});
