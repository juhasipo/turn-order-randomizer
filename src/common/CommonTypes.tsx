export type PlayerId = number;
export type LabelTypeId = number;
export type LabelItemId = number;

export interface Player {
    id: number;
    name: string;
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
    typeId: LabelTypeId;
    name: string;
}
export type LabelTypeIndex = Map<LabelTypeId, LabelType>;
export type LabelItemIndex = Map<LabelItemId, LabelItem>

export interface LabelRef {
    typeId: LabelTypeId;
    itemId: LabelItemId;
}
export type PlayerLabelIndex = Map<PlayerId, Array<LabelRef>>

export interface LabelTypeButton {
    mode: LabelTypeMode;
    name: string;
}

export const LABEL_TYPES: LabelTypeButton[] = [
    {
        mode: 'TEXT',
        name: 'Text'
    },
    {
        mode: 'NUMBER',
        name: 'Number'
    },
    {
        mode: 'SINGLETON',
        name: 'Only One'
    },
    {
        mode: 'ONE_FOR_EACH_PLAYER',
        name: 'One for Each Player'
    },
];

export const findLabelTypeName = (mode: LabelTypeMode): string => {
    return LABEL_TYPES.filter(l => l.mode === mode)[0].name;
}

export interface Status {
    players: PlayerIndex;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
    playerOrder: Array<PlayerId>;
    idPool: number;
}
