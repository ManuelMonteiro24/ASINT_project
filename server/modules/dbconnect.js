const crypto = require('crypto');
const _ = require('underscore');

const Admin = require('../../models/admin');
const CheckIO = require('../../models/checkio');
const Cache = require('../../models/cache');
const Room = require('../../models/room');

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

//TODO implement 'count' and temporal window option
Connectors.getCheckIOList = function(count, /*temporal window option?? from, to*/) {
  var query = CheckIO.find().setOptions({ limit: count })
  query.sort('-timestamp')
  return query.exec().then(function(docs) {
    console.log(docs)
    return docs;
  }).catch( error => {
    console.log(error);
  });
}

Connectors.checkIn = function(body) {
  return Room.findById(body.roomId).exec().then(function(doc) {
    var nwdoc
    if(!doc) {
      nwdoc = new Room({
         _id: body.roomId,
         name: body.roomName,
         checkedInUsers: [{ username: body.username, displayName: body.displayName }],
         messages: [],
       })
    } else {
      nwdoc = new Room(doc)
      nwdoc.checkedInUsers.push({ username: body.username, displayName: body.displayName })
    }

    body = _.extend(body, { io: true });
    var doc = new CheckIO(body)
    doc.save();
    return nwdoc.save()
  })
}

Connectors.checkOut = function(body) {
  var query = Room.findById(body.roomId)
  return query.exec().then(function(doc) {

    if(doc) {
      var update = new Room(doc)
      //Pop out user from 'checkedInUsers'
      update.checkedInUsers.pop(update.checkedInUsers.find(function(elem) {
        if(elem.username === body.username){
          return elem
        }
      }))

      if(!update.checkedInUsers.length) { //If there are no more 'checkedInUsers', drop room from database
        update.remove()
      } else {
        update.save()
      }


      var doc = new CheckIO(_.extend(body, { io: false }))
      doc.save()
      return true

    } else {
      console.log('Connector: user ', body.username, ' check out from room ', body.roomId, ' failed')
      return false
    }
  });
}

Connectors.isCheckedIn = function(user) {
  var query = Room.find({ checkedInUsers: { username: user.username, displayName: user.displayName }}).findOne()
  return query.exec().then(function(doc) {
    if(doc) {
      return doc;
    }
    return undefined;
  })
}

Connectors.cacheResults = function(query, results) {
  var hash256 = crypto.createHash('sha256')
  //Hash query string sent by client
  hash256.update(query)
  var doc = new Cache({
    _id: hash256.digest('base64'),
    value: results,
    lastAccess: new Date(),
  })
  //Save to database
  return doc.save()
}

//TODO cache search needs to be optimized: if cache miss, search for room in 'value'
Connectors.searchCache = function(query) {
  var hash256 = crypto.createHash('sha256')
  hash256.update(query)

  var query = Cache.findById(hash256.digest('base64'))

  return query.exec().then(function(doc) {
    if(doc){
      doc.lastAccess = new Date()
      doc.save()
      return doc
    }
    return undefined

  }).catch( error => {
    console.log(error)
  })

}

Connectors.getCheckedInUsers = function() {
  return Room.find({}).then(function(docs) {
    var info = []
    for(var i = 0; i < docs.length; i++) {
      var item = {
        roomName: docs[i].name,
        roomId : docs[i]._id,
        users: [],
      }
      for(var a = 0; a < docs[i].checkedInUsers.length; a++) {
        item.users.push(docs[i].checkedInUsers[a])
      }
      info.push(item)
    }
    return info;
  })
}

Connectors.writeMessage = function(roomId, msg) {
  return Room.findById(roomId).then(function(room) {
    if(room) {
      room.messages.push({ text: msg, timestamp: new Date() });
      room.save()
      return true;
    }
    return false;
  })
}

module.exports = Connectors;
