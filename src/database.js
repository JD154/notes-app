const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:admin@notes-db-app-tuvdw.mongodb.net/test?retryWrites=true', {
  useCreateIndex: true,
  useNewUrlParser: true, 
  useFindAndModify: false
})
  .then(db => console.log('DB conected'))
  .catch(err => console.log('error:', err))