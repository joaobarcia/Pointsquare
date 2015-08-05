Concepts = new Mongo.Collection('concepts');
//orientDBImport.remove({});

Concepts.initEasySearch(['name'], {
    'limit': 20,
    'use': 'mongo-db'
});