// features/users/types.ts

export interface Persona {
  name: string;
  workTitle?: string;
  age?: string;
  location?: string;
  familyStatus?: string;
  about?: string;
  goals?: string;
  frustrations?: string;
}

export interface UserType {
  id: string;
  name: string;
  description: string;
  storiesCount?: number;
  personasCount?: number;
  personas?: Persona[];
}