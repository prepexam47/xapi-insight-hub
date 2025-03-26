
import { Models } from 'appwrite';

// Extended user type that includes our custom fields
export interface ExtendedUser extends Models.User<Models.Preferences> {
  role?: string;
  userDetails?: Models.Document;
}
