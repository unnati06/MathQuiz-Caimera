const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateToken = async function(){
    try {
      return jwt.sign({
        userId : this._id.toString(),
      }, "secretkey" , {expiresIn:  "120d"})
    } catch (error) {
      console.log(error);
    }
  };

const User = mongoose.model('User', userSchema);

module.exports = User;
