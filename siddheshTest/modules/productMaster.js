var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/productMaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var productSchema = new mongoose.Schema({
    ProductId: Number,
    ProductName: String,
    CategoryId: Number,
    CategoryName: String
});

var productModel = mongoose.model('prodMaster', productSchema);

module.exports = productModel;