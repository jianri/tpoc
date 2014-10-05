var MongoDb = require('mongodb').Db;
var Server = require('mongodb').Server;
var conf = require('../conf.js');

var db = new MongoDb(conf.dbName, new Server(conf.dbHost, conf.dbPort, {auto_reconnect:true}), {w:1});

var initBaseData = {
    categorylabel:'Giving',
    categoryname:'Individual Giving',
    arealabel:'Overall Performance'
};
var initColorData = {
    panelcolor : 'green',
    savedflag : false
};
var initItemData = {
};

db.open(function(e, d){
    db.authenticate(conf.dbUser, conf.dbPass, function(err, res){
        if(e){
            console.log(e);
        }else{
            console.log('Connected to DB::'+conf.dbName);
        }
    });
});

var createInitData = function(callback){
    db.collection('tblbase', function(err, collection){
        collection.insert(initBaseData, {safe : true}, function(err, result){
            if(result){
                db.collection('tblcolor', function(err, collection){
                    collection.insert(initColorData, {safe : true},
                    function(err, result){
                      if(result){
                          db.collection('tblitem', function(err, collection){
                            collection.insert(initItemData, {safe : true}, function(err, result){
                              if(result){
                                  return true;
                              }else{
                                  return false;
                              }
                            });
                          });
                      }else{
                          return false;
                      }
                    });
                });
             }else{
                  return false;
             }
        });
    });
};

exports.loadbase = function (req, res) {
    db.collection('tblbase').findOne({}, function(e, o){
        if(o){
            console.log('Base Data:'+o);
            res.json(o);
        }else{
             if(createInitData()){
                 res.json(initBaseData);
             }
        }
    });
};

exports.loadcolor = function (req, res) {
    db.collection('tblcolor').findOne({}, function(e, o){
         if(o){
             console.log('Color Data:'+o);
             res.json(o);
         }
    });
};

exports.loaditem = function (req, res) {
    db.collection('tblitem').findOne({}, function(e, o){
        if(o){
            console.log('Item Data:'+o);
            res.json(o);
        }
    });
};

exports.saveitem = function(req, res){
    if(req.body.data){
        db.collection('tblitem').remove({}, function(e,o){
            db.collection('tblitem', function(err, collection){
                collection.insert(req.body.data, {safe : true}, function(err, result){
                    if(result){
                        res.json({result:true});
                    }else{
                        res.json({result:false});
                    }
                });
            });
        });
    }
};

exports.savecolor = function(req, res){
    if(req.body.data){
        db.collection('tblcolor').remove({}, function(e,o){
            db.collection('tblcolor', function(err, collection){
              collection.insert(req.body.data, {safe : true}, function(err, result){
                if(result){
                    res.json({result:true});
                }else{
                    res.json({result:false});
                }
              });
            });
        });
    }
};

exports.initdata = function(req, res){
    db.collection('tblitem').remove({}, function(e,o){
     db.collection('tblitem', function(err, collection){
       collection.insert(initItemData, {safe : true}, function(err, result){
         if(result){
            db.collection('tblcolor').remove({}, function(e,o){
                 db.collection('tblcolor', function(err, collection){
                     collection.insert(initColorData, {safe : true}, function(err, result){
                         if(result){
                             res.json({result:true});
                         }else{
                             res.json({result:false});
                         }
                     });
                 });
            });
          }
        });
      });
    });
};