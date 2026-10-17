interface Member {
    role: string;
}

export interface Project {
    title: string;
    description: string;
    members: Member[];
}