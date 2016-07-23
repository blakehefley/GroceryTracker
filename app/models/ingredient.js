var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IngredientSchema   = new Schema({
	id: Number,
    name: String
}, {collection: 'Ingredients'});

module.exports = mongoose.model('Ingredient', IngredientSchema);