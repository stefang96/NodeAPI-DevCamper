const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  console.log(reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // za gte,lte,gt,lt ima objasnjenje u mongo docs
  // replace npr.: nadji gdje je gte i zamjeni ga sa $gte
  //Create operators ($gt,$gte,etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Finding resource
  query = model.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    //split sluzi da stavi , gje god pronadje ono sto se navede, a join(zamjena) da zamjeni , sa ' '
    const fields = req.query.select.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // - znaci sort u opdajucem redosledu
    query = query.sort("-createdAt");
  }

  //Paginantion
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing query
  const results = await query;

  //Paginantion result
  const paginantion = {};

  if (endIndex < total) {
    paginantion.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    paginantion.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    paginantion,
    data: results
  };

  next();
};

module.exports = advancedResults;
