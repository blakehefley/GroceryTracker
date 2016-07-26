var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IngredientSchema   = new Schema({
	user: String,
    name: String
}, {collection: 'Ingredients'});

module.exports = mongoose.model('Ingredient', IngredientSchema);