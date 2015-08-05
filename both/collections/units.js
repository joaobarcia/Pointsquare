Units = new Mongo.Collection('units');
//orientDBImport.remove({});

Units.initEasySearch(['name'], {
    'limit': 20,
    'use': 'mongo-db'
});