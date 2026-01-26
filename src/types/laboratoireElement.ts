export type Composition = {
    artiste: string;
    title: string;
    song: string;
};

export type TopAlbum = {
    artiste: string;
    title: string;
    year: number;
    cover: string
};

export type TopMovie = {
    realisateur: string[];
    title: string;
    year: number;
    cover: string
};

export type Ingredient = {
    name: string;
    quantity?: number;
    unit?: string;
    note?: string;
};

export type Recettes = {
    cover: string;
    title: string;
    origin: string;
    date: {
        day: number;
        mouth: string;
        year: number;
    }

    ingredients: Ingredient[];
}