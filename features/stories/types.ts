export interface UserStory {
  id: string;
  code: string;
  as_a: string;
  i_want: string;
  so_that: string;
}

export interface Epic {
  id: string;
  code: string;
  name: string;
  description: string;
  user_stories: UserStory[];
}