export type ContextLink = {
    label: string;
    href: string;
};
export type ContextDetail = {
    label: string;
    value: (string | ContextLink)[];
    marquee?: boolean;
};

export type Project = {
    slug: string;

    hero: {
        entreprise: string;
        title: string;
        cover: string;
        image: string;
        tags: string[];
        year: number;
    };

    leftCorridor: {
        skills: {
            value: string[];
        };
    };

    sections: {
        context: {
            description: string;
            details: ContextDetail[];
        };
        objectifs: {
            description: string;
            image: string;
        };
        role: {
            description: string;
            image: string;
        };
        demarche: {
            description: string;
            image: string;
        };
        resultat: {
            description: string;
            image: string;
        };
    };

    carousel: {
        images: {
            src: string;
            alt: string;
        }[];
    };
};