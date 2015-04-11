// DEPENDENCIES
// ============

var mongoose =     require('mongoose'),
    Schema =     mongoose.Schema,
    objectID =     Schema.ObjectID;

// USER ACCOUNT SCHEMA
// ===================

var baseSchema = new Schema({
  // GLOBALS
  key: {type: Number, default: 0},
  tickets: {type: Number, default: 50},
  beds: {type: Number, default: 12},

  //JOBS
  dinnerPrep: {type: Number, default: 4},
  dinnerClean: {type: Number, default: 3},
  brunchPrep: {type: Number, default: 3},
  brunchClean: {type: Number, default: 4},
  altar: {type: Number, default: 2},
  templeSetup: {type: Number, default: 5},
  templeBreakdown: {type: Number, default: 5},
  pointman: {type: Number, default: 1},
  musicSetup: {type: Number, default: 4},
  musicBreakdown: {type: Number, default: 4},
  snackPrep: {type: Number, default: 4},
  otherJob: {type: Number, default: 7},
  foodList: {type: Array}
});

// CREATE DATABASE MODEL
// =====================

var baseModel = mongoose.model('baseModel', baseSchema);
module.exports = baseModel;

// SCHEMA METHODS
// ==============

module.exports.getBase = function(req, res) {
  baseModel.findOne({key: 0}, function(err, docs){
    if (err) throw err;
    res.send(docs);
  });
};

module.exports.createBase = function(req, res) {
  baseModel.create({key: 0}, function(err, docs){
    if(err) throw err;
    res.send(docs);
  })
}

module.exports.updateBase = function(req, res) {

  console.log(req.body);

  var job = req.body.job,
      foods = req.body.food;

  baseModel.findOne({'key': 0}, function(err, doc){
    if(err) throw err;
    if(foods) {
      for (var i = 0; i < foods.length; i++) {
        doc.foodList.push(foods[i]);
      }
    }

    doc.tickets = doc.tickets - 1;
    doc[job] = doc[job] - 1;

    doc.save(function (err, doc) {
      if (err) console.log(err);
      res.send(doc);
    });
  });
}
