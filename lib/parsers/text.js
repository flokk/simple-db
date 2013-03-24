module.exports = function(req, res, fn){
  res.raw = '';
  req.on('data', function(chunk){ res.raw += chunk; });
  req.on('end', fn);
};