export class Job {
  id: number;
  name: string;
  status: string;
}

export class User {
  id: number;
  name: string;
  avatarUrl: string;
}

export class Commit {
  id: number;
  name: string;
  user: User;
  date: Date;
}

export class Pipeline {
  id: number;
  branch: string;
  status: string;
  jobs: Job[];
  commit: Commit;
  date: Date;
}
