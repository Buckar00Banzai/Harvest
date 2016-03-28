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
  tickets: {type: Number, default: 76},
  beds: {type: Number, default: 12},

  //JOBS
  performer: {type: Number, default: 50},
  lead: {type: Number, default: 30},
  drumCircle: {type: Number, default: 20},
  tech: {type: Number, default: 12},
  setup: {type: Number, default: 80},
  breakdown: {type: Number, default: 80},
  lighting: {type: Number, default: 12},
  decoration: {type: Number, default: 50},
  flowerArranging: {type: Number, default: 10},
  fire: {type: Number, default: 20},
  altars: {type: Number, default: 8},
  host: {type: Number, default: 50},
  yourIdea1: {type: Number, default: 200},


  dessert: {type: Number, default: 60},
  tequila: {type: Number, default: 35},
  partyFavors: {type: Number, default: 200},
  yourIdea2: {type: Number, default: 200},

  patronDrink: {type: Number, default: 500},
  sundayBrunch: {type: Number, default: 500},
  chocolateBar: {type: Number, default: 500},
  pond: {type: Number, default: 500},
  yourIdea3: {type: Number, default: 500},
  

  arrival1: {type: Number, default: 4},
  arrival2: {type: Number, default: 4},
  arrival3: {type: Number, default: 4},

  accommodation1: {type: Number, default: 500},
  accommodation2: {type: Number, default: 5},
  accommodation3: {type: Number, default: 500},
  accommodation4: {type: Number, default: 500},


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
