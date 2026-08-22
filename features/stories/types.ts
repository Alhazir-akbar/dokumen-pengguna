export interface UserStory {
  id: number | string;
  epicId?: number | string;
  code: string;
  as_a: string;
  i_want: string;
  so_that: string;
  acceptanceCriteria?: string[];
  techNotes?: string[];
  testCases?: string[];
}

export interface Epic {
  id: number | string;
  code: string;
  name: string;
  description: string;
  user_stories: UserStory[];
}