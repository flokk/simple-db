
exports = module.exports = function(req, res) {
  // Noop
  var links = req.key === "links" ? {friend: {bucket: "bucket", key: "key"}} : {};
  res.emit("response", {
    metadata: {
      links: links
    },
    data: "",
    key: "key",
    error: (req.key === "error" ? new Error("test") : null)
  });
  ["this", "is", "a", "test"].forEach(function (data) {
    res.emit("data", data);
  })
  res.emit("end");
};
