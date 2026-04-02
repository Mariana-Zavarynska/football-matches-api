import { Request } from 'express';

export type Score = {
    home: number;
    away: number;
};

export type Match = {
    homeTeam: string;
    awayTeam: string;
    score: Score;
};
