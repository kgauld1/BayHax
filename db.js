const {MongoClient} = require('mongodb');

var mongoPassword = process.env.password;
const uri = `mongodb+srv://Node:${mongoPassword}@bayhax-cmoxr.mongodb.net/BayHax?retryWrites=true&w=majority`;


async function listDatabases(client){
	databasesList = await client.db().admin().listDatabases();
	console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

async function main() {  
	try {
			// Connect to the MongoDB cluster
			await client.connect();
			// Make the appropriate DB calls
			console.log('MongoDB connected');
    } catch (e) {
        console.error(e);
    }
}
main();
module.exports = client;