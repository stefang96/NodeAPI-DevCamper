const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
//Promise - zavrsetak asinhrone operacije
module.exports = asyncHandler;

//ova funckija je za async/await da se ne mora na svakom controleru pisati try i catch
