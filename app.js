const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";

// Sample data array
const stats = [
  { city: 'San Juan', zip: '00926', state: 'PR', income: '34781', age: '44' },
  { city: 'Corona', zip: '11368', state: 'NY', income: '50797', age: '32' },
  { city: 'Chicago', zip: '60629', state: 'IL', income: '42019', age: '31' },
  { city: 'El Paso', zip: '79936', state: 'TX', income: '54692', age: '31' },
  { city: 'Los Angeles', zip: '90011', state: 'CA', income: '36954', age: '28' },
  { city: 'Norwalk', zip: '90650', state: 'CA', income: '66453', age: '35' }
];

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('statsdb');
    console.log("Database created: statsdb");

    // Use the 'uscensus' collection
    const collection = database.collection('uscensus');

    // Insert your `stats` data into the collection
    const insertResult = await collection.insertMany(stats);
    console.log(`Records inserted: ${insertResult.insertedCount}`);

    // Query for Corona, NY
    const queryCorona = { city: "Corona", state: "NY" };
    const coronaResult = await collection.findOne(queryCorona);
    
    // Check if the document exists before accessing its properties
    if (coronaResult) {
      console.log("Zip code for Corona, NY:", coronaResult.zip);
    } else {
      console.log("No document found for Corona, NY");
    }

    // Query all cities in California
    const queryCA = { state: "CA" };
    const caCities = await collection.find(queryCA).toArray();
    console.log("Income for cities in California:", caCities.map(item => ({ city: item.city, income: item.income })));

    // Update income and age for Alaska
    const filterAK = { state: "AK" };
    const updateDoc = { $set: { income: 38910, age: 46 } };
    const updateResult = await collection.updateOne(filterAK, updateDoc);
    console.log("Updated document:", updateResult.modifiedCount);

    // Sort records by state in ascending order
    const sortedRecords = await collection.find().sort({ state: 1 }).toArray();
    console.log("Sorted records by state:", sortedRecords);

  } catch (err) {
    console.error(err);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

run().catch(console.dir);
