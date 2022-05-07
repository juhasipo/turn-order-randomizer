export type Label = string;

export interface Player {
    id: number;
    name: string;
    number?: number;
    labels?: Array<Label>;
}

export interface NewPlayer {
    name: string;
}

export type PlayerId = number;
export type PlayerIndex = Map<PlayerId, Player>;
