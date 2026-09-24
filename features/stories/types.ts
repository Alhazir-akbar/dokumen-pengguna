export interface TestCase {
  id: number | string;
  action: string;
  expectedResult: string;
}

export interface StoryImage {
  id: number | string;
  url: string;
  caption?: string | null;
  createdAt?: string;
}

export interface UserStory {
  id: number | string;
  epicId?: number | string;
  code: string;
  as_a: string;
  i_want: string;
  so_that: string;
  acceptanceCriteria?: string[];
  techNotes?: string[];
  testCases?: TestCase[];
  images?: StoryImage[];
}

export interface Epic {
  id: number | string;
  code: string;
  name: string;
  description: string;
  user_stories: UserStory[];
}

export interface NFR {
  id: number | string;
  category: string;
  description: string;
  project_id?: number;
}