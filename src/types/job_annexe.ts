export interface JobDetail {
    job: string;
    year: number;
    entreprise: string;
    city: string;
}

export interface Jobs {
    slug: string;
    details: JobDetail[];
}

