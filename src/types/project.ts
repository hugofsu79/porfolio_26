// src/types/project.ts

export interface Project {
    slug: string;

    hero: {
        image: string;
        tags: string[];
        title: string;
        year: number;
    };

    sections: {
        context: {
            description: string;
            details: {
                label: string;
                value: string | string[];
            }[];
        };
        objectifs: string;
        role: string;
    };

    carousel: {
        images: {
            src: string;
            alt: string;
        }[];
    };
}