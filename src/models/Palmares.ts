import { Moment } from 'moment';

export interface Palmares {
    id: number;
    game: string;
    event: string;
    country: string;
    ranking: number;
    date: Moment | number | string;
    visibleOnHomepage: boolean;
}