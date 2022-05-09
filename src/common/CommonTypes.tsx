export type PlayerId = number;
export type LabelTypeId = number;
export type LabelItemId = number;

export interface PlayerLabel {
    dynamic: boolean;
    typeId: LabelTypeId;
    itemId: LabelItemId;
}

export interface Player {
    id: number;
    name: string;
    number?: number;
    labels: Map<LabelTypeId, PlayerLabel>;
}

export interface NewPlayer {
    name: string;
}

export type PlayerIndex = Map<PlayerId, Player>;

export type LabelTypeMode = 'TEXT' | 'NUMBER' | 'SINGLETON' | 'ONE_FOR_EACH_PLAYER';

export interface NewLabelType {
    name: string;
    mode: LabelTypeMode;
}
export interface LabelType extends NewLabelType {
    id: LabelTypeId;
}

export interface NewLabelItem {
    labelType: LabelTypeId;
    name: string;
}

export interface LabelItem {
    id: LabelItemId;
    name: string;
}
export type LabelTypeIndex = Map<LabelTypeId, LabelType>;
export type LabelItemMap = Map<LabelItemId, LabelItem>
export type LabelItemIndex = Map<LabelTypeId, LabelItemMap>;
