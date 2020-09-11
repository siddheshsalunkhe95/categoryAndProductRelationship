var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/productMaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var categorySchema = new mongoose.Schema({
    CategoryId: Number,
    CategoryName: String
});

var categoryModel = mongoose.model('catgMaster', categorySchema);

module.exports = categoryModel;