var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    passHash: String,
    currToken: String
}, {collection: 'Users'});

module.exports = mongoose.model('User', UserSchema);