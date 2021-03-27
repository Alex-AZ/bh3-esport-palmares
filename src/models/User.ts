import { Moment } from 'moment';

export interface User {
    id: number;
    position: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Moment | number | string;
    gamertag?: string;
    psn?: string;
    steam?: string;
    twitter?: string;
    facebook?: string;
    roles?: any[];
    token?: string;
    picture?: string;
    pictureFile?: File;
    pictureData?: string | ArrayBuffer;
    pictureExtension?: string;
    subscription: boolean;
    password?: string;
}
