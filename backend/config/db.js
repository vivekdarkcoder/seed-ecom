const mongoose = require('mongoose');

const summarizeUri = (uri) => {
  try {
    const parsed = new URL(uri);
    const maskedAuth = parsed.username ? '***:***@' : '';
    return `${parsed.protocol}//${maskedAuth}${parsed.host}${parsed.pathname}`;
  } catch {
    return 'unparsable Mongo URI';
  }
};

const buildMongoUri = () => {
  const {
    MONGO_URI,
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_HOST,
    MONGO_DB_NAME,
    MONGO_PROTOCOL = 'mongodb+srv',
    MONGO_PORT,
    MONGO_OPTIONS,
  } = process.env;

  if (MONGO_URI) return MONGO_URI;

  if (MONGO_USER && MONGO_PASSWORD && MONGO_HOST) {
    const user = encodeURIComponent(MONGO_USER);
    const pass = encodeURIComponent(MONGO_PASSWORD);
    const db = MONGO_DB_NAME || 'admin';
    const portSegment = MONGO_PORT ? `:${MONGO_PORT}` : '';
    const options = MONGO_OPTIONS || 'retryWrites=true&w=majority&appName=Cluster0';
    return `${MONGO_PROTOCOL}://${user}:${pass}@${MONGO_HOST}${portSegment}/${db}?${options}`;
  }

  throw new Error('Mongo credentials missing: set MONGO_URI or MONGO_USER/MONGO_PASSWORD/MONGO_HOST');
};

const connectDB = async () => {
  const uri = buildMongoUri();
  const dbName = process.env.MONGO_DB_NAME || undefined;
  const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000;

  console.log(`ℹ️ Connecting to Mongo: ${summarizeUri(uri)} (dbName=${dbName || 'default'})`);

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ DB Error: ${error.message}`);
    throw error;
  }
};

// Export as callable plus helper for reuse (e.g., seeding)
connectDB.buildMongoUri = buildMongoUri;
module.exports = connectDB;
