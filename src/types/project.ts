/* =========================
   Types utilitaires
========================= */

export interface ContextLink {
    label: string;
    href: string;
}

export type ContextValue =
    | string
    | string[]
    | ContextLink
    | ContextLink[];

export interface ContextDetail {
    label: string;
    value: ContextValue;
    marquee?: boolean;
}

export interface Project {
    slug: string;

    hero: {
        entreprise: string;
        cover: string;
        image: string;
        tags: string[];
        title: string;
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
}