const Admin = require('../../models/admin')
const CheckIO = require('../../models/checkio');

//Module for handling database querys, connections and interactions
const Connectors = {}

//Create default admin user {username: 'admin', password: 123}
Connectors.defaultAdmin = function() {
  var query = Admin.find()
  query.where('username').equals('admin')
  //check if user already exists
  query.exec().then(function(docs) {
    if(!docs.length) { //if user doesn't exist
      new Admin().save(adminCreate) //returns promise
    } else {
      console.log('DB: default admin user found on database...')
    }
  }).catch( error => {
    console.log(error)
  });

  var adminCreate = function(err, doc) {
    if(err) {
      console.log(err)
    } else {
      console.log('DB: default user administrator added to the database')
    }
  };
}

Connectors.verifyAdminCredentials = function(credentials) {
  var query = Admin.find()
  query.where('username').equals(credentials[0])
  .where('password').equals(credentials[1])

  return query.exec().then(function(docs) {
    if(docs.length === 1) {
      var ll = Date.now()
      doc = new Admin(docs[0])
      doc.lastLogin = new Date(ll)
      doc.save()
      return ll;
    }
    return false;
  }).catch( error => {
    console.log(error)
  });

  var updateLogin = function(err, doc) {
    if(err) {
      console.log(err)
    } else {
      console.log('DB: system administrator logged in')
    }
  };
}

//Compare lastLogin information
Connectors.verifyAdminCookie = function(lastLogin) {
  var ll = new Date(lastLogin)
  var query = Admin.find()
  query.where('lastLogin').equals(ll)

  return query.exec().then(function(docs) {
    return (docs.length !== 1) ? false : true;
  }).catch( error => {
    console.log(error)
  });
}

Connectors.getCheckIOList = function(count, /*temporal window option?? from, to*/) {
  var query = CheckIO.find({ }).setOptions({ limit: count })
  return query.exec().then(function(docs) {
    return docs;
  }).catch( error => {
    console.log(error);
  });
}

module.exports = Connectors;
