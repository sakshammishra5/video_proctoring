// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add your MongoDB URI to .env.local');

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In dev mode, use a global var so MongoClient is not re-created on every HMR reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, always create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
