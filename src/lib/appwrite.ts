
import { Account, Client, Databases, Storage } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_APPWRITE_PROJECT_ID'); // Replace with your Appwrite project ID

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DB_ID = 'xapi_database';
export const CONTENT_COLLECTION_ID = 'content';
export const STATEMENTS_COLLECTION_ID = 'statements';

// Storage bucket ID
export const BUCKET_ID = 'xapi_content';

// Helper functions for authentication
export const createUser = async (email: string, password: string, name: string) => {
  try {
    const user = await account.create('unique()', email, password, name);
    await account.createEmailSession(email, password);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper functions for content management
export const uploadContent = async (file: File) => {
  try {
    // Upload the zip file to storage
    const fileUpload = await storage.createFile(BUCKET_ID, 'unique()', file);
    
    // Create a document in the database to track the content
    const contentDoc = await databases.createDocument(
      DB_ID,
      CONTENT_COLLECTION_ID,
      'unique()',
      {
        name: file.name,
        fileId: fileUpload.$id,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'processing'
      }
    );
    
    return contentDoc;
  } catch (error) {
    console.error('Error uploading content:', error);
    throw error;
  }
};

// Helper functions for fetching content
export const getContentList = async () => {
  try {
    const response = await databases.listDocuments(DB_ID, CONTENT_COLLECTION_ID);
    return response.documents;
  } catch (error) {
    console.error('Error fetching content list:', error);
    throw error;
  }
};

// Function to store xAPI statements
export const storeXAPIStatement = async (statement: any) => {
  try {
    return await databases.createDocument(
      DB_ID,
      STATEMENTS_COLLECTION_ID,
      'unique()',
      {
        statement: JSON.stringify(statement),
        verb: statement.verb?.id || '',
        actor: statement.actor?.name || statement.actor?.mbox || '',
        object: statement.object?.id || '',
        timestamp: statement.timestamp || new Date().toISOString(),
        result: JSON.stringify(statement.result || {})
      }
    );
  } catch (error) {
    console.error('Error storing xAPI statement:', error);
    throw error;
  }
};

// Function to get xAPI statements
export const getXAPIStatements = async (filters = {}) => {
  try {
    const response = await databases.listDocuments(DB_ID, STATEMENTS_COLLECTION_ID);
    return response.documents;
  } catch (error) {
    console.error('Error fetching xAPI statements:', error);
    throw error;
  }
};
