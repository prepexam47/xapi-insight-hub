
import { User, Preferences } from 'appwrite';
import { Document } from 'appwrite/database';

// Extended user type that includes our custom fields
export interface ExtendedUser extends User<Preferences> {
  role?: string;
  userDetails?: Document;
}
