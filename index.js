if (process.env.REDISTOGO_URL) {
  
}
else if (process.env.MONGOHQ_URL) {
  module.exports = require("./adapters/mongo")(process.env.MONGOHQ_URL);
}
else {
  module.exports = require("./adapters/memory")();
}

module.exports._adapters = {
  mongo: require("./adapters/mongo"),
  memory: require("./adapters/memory")
};
