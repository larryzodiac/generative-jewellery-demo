/*
  Evan MacHale - N00150552
  26.05.19
  test.js
*/

/*
  Use this file to test database connections when moving to a new machine
  Use node to test: 'node test.js'
*/

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: false, required: false },
  password: { type: String, unique: false, required: false },
}, { collection: 'TEST' });

// Collections in database are Model name as lowercase and with appended 's'
const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb+srv://larryzodiac:1234@fourth-year-tawax.mongodb.net/db?retryWrites=true', { autoIndex: false });

const u1 = new User({ username: 'EVAN TESTING SHOWCASE', password: 'test2' });

u1.save(() => console.log('added'));
