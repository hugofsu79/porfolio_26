import type { Composition, TopAlbum, TopMovie, Recettes, Ingredient } from "../types/laboratoireElement";


export const elementsCompo: Composition[] = [
    {
        artiste: "Moth",
        title: "Parienzo",
        song: "/public/audio/Parientzo.wav",
    },
    {
        artiste: "Moth",
        title: "Flamens",
        song: "/public/audio/flamens.wav",
    },
    {
        artiste: "Moth",
        title: "Smaltown",
        song: "/public/audio/SmallTown.wav",
    },
    {
        artiste: "Moth",
        title: "Fentiger",
        song: "/public/audio/Fentiger.mp3",
    },
    {
        artiste: "Moth",
        title: "Ending",
        song: "/public/audio/Ending.wav",
    },
    {
        artiste: "Moth",
        title: "Morpho",
        song: "/public/audio/8 Morpho.wav",
    },
    {
        artiste: "Moth",
        title: "I'll running",
        song: "/public/audio/I'll running.wav",
    },
    {
        artiste: "Moth",
        title: "Exosphery",
        song: "/public/audio/Exosphery.wav",
    },
    {
        artiste: "Moth",
        title: "Careless",
        song: "/public/audio/Careless.wav",
    },
]

export const albumsInformation: TopAlbum[] = [
    {
        artiste: "Oneohtrix point never",
        title: "Magic Oneohtrix Point Never",
        year: 2021,
        cover: "/public/images/labo/cover/opn.webp"


    },
    {
        artiste: "Clark",
        title: "Steep stims",
        year: 2025,
        cover: "/public/images/labo/cover/clark.webp"

    },
    {
        artiste: "Radiohead",
        title: "In Rainbows",
        year: 2007,
        cover: "/public/images/labo/cover/radiohead.webp"

    },
    {
        artiste: "Oklou",
        title: "Choke Enough",
        year: 2025,
        cover: "/public/images/labo/cover/oklou.webp"

    },
    {
        artiste: "Sega Bodega",
        title: "Romeo",
        year: 2021,
        cover: "/public/images/labo/cover/sega.webp"

    },
    {
        artiste: "Burial",
        title: "Untrue",
        year: 2007,
        cover: "/public/images/labo/cover/burial.webp"

    },
    {
        artiste: "Rival Consoles",
        title: "Landscape from memory",
        year: 2025,
        cover: "/public/images/labo/cover/rival_consoles.webp"

    },
    {
        artiste: "Tim Hecker",
        title: "Shards",
        year: 2025,
        cover: "/public/images/labo/cover/timHecker.webp"

    },
    {
        artiste: "Jamie XX",
        title: "In Colour",
        year: 2000,
        cover: "/public/images/labo/cover/Jamie_xx.webp"

    },
    {
        artiste: "Lorenzo Senni",
        title: "Scacco matto",
        year: 2000,
        cover: "/public/images/labo/cover/lorenzo.webp"

    },
]
export const MoviesInformation: TopMovie[] = [{
    realisateur: ["Wayne Wang"],
    title: "Smoke",
    year: 1995,
    cover: "/public/images/labo/movie/smoke.webp",
},
{
    realisateur: ["Thomas Anderson"],
    title: "une bataille après l'autre",
    year: 2025,
    cover: "/public/images/labo/movie/oneBattleAfterAnother.webp"
},
{
    realisateur: ["Ben Safdie", "Josh Safdie"],
    title: "Good Time",
    year: 2025,
    cover: "/public/images/labo/movie/goodTime.webp",

},
{
    realisateur: ["Ben Safdie", "Josh Safdie"],
    title: "Uncut Gems",
    year: 2019,
    cover: "/public/images/labo/movie/uncutGems.webp"
},
{
    title: "O'Brother",
    realisateur: ["Ethan Coen", "Joel Coen"],
    year: 2000,
    cover: "/public/images/labo/movie/obroter.webp"
},
{
    realisateur: ["Alexander Payne"],
    title: "Winter Break",
    year: 2023,
    cover: "/public/images/labo/movie/theholdovers.webp"
},
{
    realisateur: ["Ari Aster"],
    title: "Midsommar",
    year: 2019,
    cover: "/public/images/labo/movie/midsommar.webp"
},
{
    realisateur: ["Brady Corbet"],
    title: "The Brutalist",
    year: 2025,
    cover: "/public/images/labo/movie/brutalist.webp"
},
{
    realisateur: ["Brad Bird"],
    title: "Le Géant de fer",
    year: 1999,
    cover: "/public/images/labo/movie/le-geant-de-fer.webp"
},
{
    realisateur: ["Wes Anderson"],
    title: "Fantastic Mr. Fox",
    year: 2025,
    cover: "/public/images/labo/movie/mrfox.webp"
},]

export const mesRecettes: Recettes[] = [
    {
        slug: "Phở",
        cover: "public/images/labo/recette/pho.webp",
        title: "Phở",
        origin: "Corée du sud",
        date: {
            day: 22,
            mouth: "Janvier",
            year: 2026
        },
        ingredients: [
            { name: "Gingembre", quantity: 100, unit: "g" },
            { name: "Oignon", quantity: 1 },
            { name: "Échalotes", quantity: 2 },
            { name: "Eau", quantity: 5, unit: "l" },
            { name: "Jarrets de boeuf", quantity: 2, note: "ou paleron" },
            { name: "Os a moelle", quantity: 5 },
            { name: "Sauce poisson", quantity: 8, note: "à ajuster" },
            { name: "Graine de coriandre", quantity: 1, unit: "càs" },
            { name: "Anis étoilés", quantity: 2 },
            { name: "Bâton de cannelle", quantity: 1 },
        ],
    },
    {
        slug: "Focaccia d’automne",
        cover: "public/images/labo/recette/foccacia.webp",
        title: "Focaccia d’automne",
        origin: "Italie",
        date: {
            day: 12,
            mouth: "mai",
            year: 2025
        },
        ingredients: [
            { name: "Farine", quantity: 750, unit: "g" },
            { name: "Sel", quantity: 15, unit: "g" },
            { name: "Échalotes", quantity: 2 },
            { name: "Eau", quantity: 700, unit: "g" },
            { name: "levure", quantity: 12, unit: "g" },
            { name: "Burrata", quantity: 1 },
            { name: "Sauce poisson", quantity: 80, unit: "g" },
            { name: "Pistache", quantity: 80, unit: "g", note: "Non salée" },
            { name: "Bresaola", quantity: 12, note: "Tranches" },
        ],
    },
    {
        slug: "Tirami Brest",
        cover: "public/images/labo/recette/tiraparisBrest.webp",
        title: "Tirami Brest",
        origin: "Italie",
        date: {
            day: 31,
            mouth: "Décembre",
            year: 2025
        },
        ingredients: [
            { name: "Sucre", quantity: 200, unit: "g" },
            { name: "Noisette", quantity: 100, unit: "g" },
            { name: "Amande", quantity: 100, unit: "g" },
            { name: "Lait entier", quantity: 250, unit: "ml" },
            { name: "Jaune d’œuf", quantity: 60, unit: "g" },
            { name: "Maïzena", quantity: 27, unit: "g" },
            { name: "Beurre", quantity: 75, unit: "g" },
            { name: "Lait d'amande", quantity: 1, unit: "verre" },
            { name: "Boudoirs", quantity: 1, unit: "paquet" }
        ],
    },
    {
        slug: "Saumon Gravlax",
        cover: "public/images/labo/recette/saumonGrav.webp",
        title: "Saumon Gravlax",
        origin: "Suède",
        date: {
            day: 24,
            mouth: "Décembre",
            year: 2024
        },
        ingredients: [
            { name: "Saumon", quantity: 1, unit: "filet" },
            { name: "Betterave rouge", quantity: 1 },
            { name: "Gros sel", quantity: 12, unit: "%", note: "du poids du saumon" },
            { name: "Sucre", quantity: 12, unit: "%", note: "du poids du saumon" },
            { name: "Aneth", quantity: 1, unit: "bouquet" },
            { name: "Poivre noir", quantity: 1, unit: "càs" },
            { name: "Graine de coriandre", quantity: 2, unit: "càs" },
            { name: "Zeste de faustrime", quantity: 4, unit: "càs" },
        ],
    },
    {
        slug: "Lemon posset",
        cover: "public/images/labo/recette/lemonposset.webp",
        title: "Lemon posset",
        origin: "Grande-Bretagne",
        date: {
            day: 4,
            mouth: "Juin",
            year: 2023
        },
        ingredients: [
            { name: "Jus de citron", quantity: 7, unit: "cl" },
            { name: "Zeste du citron" },
            { name: "Crème entière", quantity: 40, unit: "cl" },
            { name: "Sucre", quantity: 80, unit: "g" },
            { name: "Meringue", quantity: 8 },
            { name: "Shortbreads", quantity: 4, note: "ou sablé breton" },
        ],
    },
];