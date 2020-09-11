const express = require('express');
const router = express.Router();

const prodMasterModel = require('../modules/productMaster');
const catgMasterModel = require('../modules/categoryMaster');
const async = require('async');


// GET ROUTE
router.get('/', function (req, res, next) {
  getAllDataFromProdMaster(req, res);
});


// DELETE ROUTE
router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;

  var del = prodMasterModel.findByIdAndDelete(id);
  del.exec(function (err) {
    if (err) {
      console.log('error is : - >>', err);
    } else {
      getAllDataFromProdMaster(req, res);
    }
  });
});


// EDIT ROUTE
router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;

  var edit = prodMasterModel.findById(id);
  edit.exec(function (err, data) {
    if (err) {
      console.log('error is : -->> ', err);
    } else {
      catgMasterModel.find({

      }, function (err, data2) {
        res.render('productEdit', {
          title: 'Edit Product Master',
          records: data,
          category: data2
        });
      })
    }
  });
});


// UPDATE ROUTE
router.post('/update/', function (req, res, next) {
  var id = req.body.id;
  var updateObj = {
    ProductId: req.body.ProductId,
    ProductName: req.body.ProductName,
    CategoryId: req.body.CategoryId,
    CategoryName: req.body.CategoryName
  }

  prodMasterModel.findByIdAndUpdate(id, updateObj).exec(function (err, resData) {
    if (err) {
      console.log('Error While Updating is : --> ', err);
    } else {
      getAllDataFromProdMaster(req, res);
    }
  });
});


// POST ROUTE 
router.post('/', function (req, res, next) {
  var obj = {
    ProductId: req.body.ProductId,
    ProductName: req.body.ProductName,
    CategoryId: req.body.CategoryId,
    CategoryName: req.body.CategoryName,
  }

  var prodDetails = new prodMasterModel(obj);
  prodDetails.save(function (err, data) {
    if (err) {
      console.log('Error Is : --> ', err);
    } else {
      getAllDataFromProdMaster(req, res);
    }
  });
});


// GET ALL DATA FROM prodMaster COLLECTION.
function getAllDataFromProdMaster(req, res) {
  var query = req.query;
  var page = 1;
  if (query.page && query.page != "") {
    page = query.page;
  }
  var limit = 10;
  var skip = (page - 1) * limit;
  var searchQuery = {};

  async.parallel({
    data: function (cb) {
      prodMasterModel.aggregate([{
            "$match": searchQuery
          },
          {
            "$lookup": {
              from: "catgmasters",
              localField: "CategoryId",
              foreignField: "CategoryId",
              as: "category"
            }
          },
          {
            "$sort": {
              _id: -1
            }
          },
          {
            "$skip": skip,
          },
          {
            "$limit": limit
          }
        ],
        function (err, productData) {
          if (err) {
            cb(err);
          } else {
            cb(null, JSON.parse(JSON.stringify(productData)))
          }
        });
    },
    count: function (cb) {
      prodMasterModel.find(searchQuery, {
        _id: 1
      }, {}, function (err, productData) {
        if (err) {
          cb(err);
        } else {
          cb(null, JSON.parse(JSON.stringify(productData)).length)
        }
      });
    },
    category: function (cb) {
      catgMasterModel.find({}, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb(null, JSON.parse(JSON.stringify(data)));
        }
      });
    }
  }, function (err, result) {
    res.render('productView', {
      title: 'Product Master',
      records: result.data,
      count: result.count,
      category: result.category,
      x: page,
      limit: limit
    });
  });
}


module.exports = router;