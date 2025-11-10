
// types.ts

/**
 * Represents a single contact entry.
 * All fields are optional strings, as not all information may be present in the image.
 */
export interface Contact {
  name: string;
  company: string;
  location: string;
  email: string;
  phone: string;
}
