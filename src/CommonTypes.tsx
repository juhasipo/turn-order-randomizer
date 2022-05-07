export type PlayerId = number;
export type LabelTypeId = number;
export type LabelItemId = number;

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

export type PlayerIndex = Map<PlayerId, Player>;

export interface LabelType {
    id: LabelTypeId;
    name: string;
}
export interface LabelItem {
    id: LabelItemId;
    name: string;
}

export interface NewLabelType {
    name: string;
}

export interface NewLabelItem {
    labelType: LabelTypeId;
    name: string;
}

export type LabelTypeIndex = Map<LabelTypeId, LabelType>;
export type LabelIndex = Map<LabelTypeId, Map<LabelItemId, LabelItem>>;
