declare global {
  namespace Express {
    interface User {
      username: string;
      isCoach: boolean;
      coachId: string | null;
      _id: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
