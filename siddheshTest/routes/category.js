const express = require('express');
const router = express.Router();

const catgMasterModel = require('../modules/categoryMaster');


// GET ROUTE
router.get('/', function (req, res, next) {
  getAllDataFromCategoryMaster(req, res);
});


// DELETE ROUTE
router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;

  var del = catgMasterModel.findByIdAndDelete(id);
  del.exec(function (err) {
    if (err) {
      console.log('error is : - >>', err);
    } else {
      getAllDataFromCategoryMaster(req, res);
    }
  });
});


// EDIT ROUTE
router.get('/edit/:id', function (req, res, next) {
  id = req.params.id;

  var edit = catgMasterModel.findById(id);
  edit.exec(function (err, data) {
    if (err) {
      console.log('error is : -->> ', err);
    } else {
      res.render('categoryEdit', {
        title: 'Edit Product Master',
        records: data
      });
    }
  });
});


// UPDATE ROUTE
router.post('/update/', function (req, res, next) {
  checkCatgIdAndCatgName(req.body.CategoryId, req.body.CategoryName, function (data) {
    if (data.length > 0) {
      res.send("PLEASE CHECK CATEGORY ID OR CATEGORY NAME");
    } else {
      var id = req.body.id;
      var updateObj = {
        CategoryId: req.body.CategoryId,
        CategoryName: req.body.CategoryName
      }

      catgMasterModel.findByIdAndUpdate(id, updateObj).exec(function (err, resData) {
        if (err) {
          console.log('Error While Updating is : --> ', err);
        } else {
          getAllDataFromCategoryMaster(req, res);
        }
      });
    }
  });
});


// POST ROUTE 
router.post('/', function (req, res, next) {
  checkCatgIdAndCatgName(req.body.CategoryId, req.body.CategoryName, function (data) {
    if (data.length > 0) {
      res.send("PLEASE CHECK CATEGORY ID OR CATEGORY NAME");
    } else {
      var obj = {
        CategoryId: req.body.CategoryId,
        CategoryName: req.body.CategoryName,
      }

      var prodDetails = new catgMasterModel(obj);
      prodDetails.save(function (err, data) {
        if (err) {
          console.log('Error Is : --> ', err);
        } else {
          getAllDataFromCategoryMaster(req, res);
        }
      });
    }
  });
});


// GET ALL DATA FROM catgMaster COLLECTION.
function getAllDataFromCategoryMaster(req, res) {
  catgMasterModel.find({}, {}, {
    sort: {
      CategoryId: 1
    }
  }, function (err, categData) {
    if (err) {
      console.log("Error Is : ------> ", err);
    } else {
      res.render('categoryView', {
        title: 'Category Master',
        records: JSON.parse(JSON.stringify(categData)),
      });
    }
  });
}


// CHECK DUPLICATION FOR CATEGORY ID AND CATEGORY NAME.
function checkCatgIdAndCatgName(CategoryId, CategoryName, cb) {
  var matchQuery = {
    $or: [{
      "CategoryId": CategoryId
    }, {
      "CategoryName": CategoryName
    }]
  }

  catgMasterModel.find(matchQuery, function (err, matchData) {
    if (err) {
      console.log(err);
    } else {
      cb(matchData);
    }
  });
}


module.exports = router;