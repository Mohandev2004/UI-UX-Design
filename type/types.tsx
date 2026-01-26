export type ProjectType = {
  id: number;
  projectId: string;
  device: string;
  userInput: string;
  projectName?: string;
  theme?: string; // corrected spelling and type
}

export type ScreenConfig ={
  id: number,
  screenId: string,
  screenName: string,
  purpose: string,
  screenDescription: string,
  code?: string 
}


