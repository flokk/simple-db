module.exports = function(res, fn){
  res.raw = '';
  res.on('data', function(chunk){ res.raw += chunk; });
  res.on('end', function(){
    try {
      fn(null, JSON.parse(res.raw));
    } catch (err) {
      fn(err);
    }
  });
};