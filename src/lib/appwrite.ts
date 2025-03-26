
import { Account, Client, Databases, Storage, ID, Query } from 'appwrite';

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
export const USERS_COLLECTION_ID = 'users';

// Storage bucket ID
export const BUCKET_ID = 'xapi_content';

// User roles
export const ROLE_ADMIN = 'admin';
export const ROLE_USER = 'user';

// Helper functions for authentication
export const createUser = async (email: string, password: string, name: string, role = ROLE_USER) => {
  try {
    // Create the user account
    const user = await account.create(ID.unique(), email, password, name);
    
    // Create a session
    await account.createEmailSession(email, password);
    
    // Store additional user data with role in the database
    await databases.createDocument(
      DB_ID,
      USERS_COLLECTION_ID,
      user.$id,
      {
        userId: user.$id,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      }
    );
    
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
    const user = await account.get();
    
    // Fetch the user's role from the database
    const userData = await databases.listDocuments(
      DB_ID,
      USERS_COLLECTION_ID,
      [Query.equal('userId', user.$id)]
    );
    
    if (userData.documents.length > 0) {
      // Combine Appwrite user data with our custom user data
      return {
        ...user,
        role: userData.documents[0].role,
        userDetails: userData.documents[0]
      };
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserRole = async (userId: string) => {
  try {
    const userData = await databases.listDocuments(
      DB_ID,
      USERS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    
    if (userData.documents.length > 0) {
      return userData.documents[0].role;
    }
    
    return ROLE_USER; // Default role
  } catch (error) {
    console.error('Error getting user role:', error);
    return ROLE_USER; // Default role on error
  }
};

// Helper functions for content management
export const uploadContent = async (file: File) => {
  try {
    // Upload the zip file to storage
    const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
    
    // Create a document in the database to track the content
    const contentDoc = await databases.createDocument(
      DB_ID,
      CONTENT_COLLECTION_ID,
      ID.unique(),
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
      ID.unique(),
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
