import {
    clearItemIndex,
    generateLabelPoolWithDynamicItems,
    nextRandomNumber,
    randomizeLabelsForPlayers
} from "./Random";
import {
    LabelItem,
    LabelItemId,
    LabelItemIndex, LabelRef,
    LabelType,
    LabelTypeId,
    LabelTypeIndex,
    Player, PlayerId,
    PlayerIndex, PlayerLabelIndex
} from "./CommonTypes";
import NumberPool from "./NumberPool";
import {RandomProvider, ShuffleFunc} from "./Utils";

describe('nextRandomNumber', () => {

    const MIN_VALUE = () => 0;
    const ALMNOST_MIN_VALUE = () => 0.001;
    const ALMOST_MAX_VALUE = () => 0.999;
    const MAX_VALUE = () => 1;

    for (let min = -10; min < 10; ++min) {
        for (let max = -10; max <= 10; ++max) {
            if (min <= max) {
                test(`min for range ${min} – ${max}`, () => {
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, MIN_VALUE)).toEqual(min);
                });
                test(`almost min for range ${min} – ${max}`, () => {
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                    expect(nextRandomNumber(min, max, ALMNOST_MIN_VALUE)).toEqual(min);
                });

                test(`almost max for range ${min} – ${max}`, () => {
                    expect(nextRandomNumber(min, max, ALMOST_MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, ALMOST_MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, ALMOST_MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, ALMOST_MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, ALMOST_MAX_VALUE)).toEqual(max);
                });

                test(`max for range ${min} – ${max}`, () => {
                    expect(nextRandomNumber(min, max, MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, MAX_VALUE)).toEqual(max);
                    expect(nextRandomNumber(min, max, MAX_VALUE)).toEqual(max);
                });
            }
        }
    }

});

describe('clearItemIndex', () => {

    test('Empty', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>();
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>());
    });

    test('TEXT type and item is added', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Text label", mode: "TEXT"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "Some text", typeId: 1000}]
        ]);

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "Some text", typeId: 1000}]
        ]));
    });

    test('NUMBER type and item is added', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Number label", mode: "NUMBER"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "2", typeId: 1000}],
            [2001, {id: 2001, name: "3", typeId: 1000}],
            [2002, {id: 2002, name: "4", typeId: 1000}],
        ]);

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "2", typeId: 1000}],
            [2001, {id: 2001, name: "3", typeId: 1000}],
            [2002, {id: 2002, name: "4", typeId: 1000}],
        ]));
    });

    test('SINGLETON type and item is not added', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Singleton label", mode: "SINGLETON"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "1", typeId: 1000}],
        ]);

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>());
    });

    test('ONE_FOR_EACH_PLAYER type and item is not added', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "One for each label", mode: "ONE_FOR_EACH_PLAYER"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "2", typeId: 1000}],
            [2001, {id: 2001, name: "3", typeId: 1000}],
            [2002, {id: 2002, name: "4", typeId: 1000}],
        ]);

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>());
    });

    test('Multiple labels and items', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Text label", mode: "TEXT"}],
            [1001, {id: 1001, name: "Number label", mode: "NUMBER"}],
            [1002, {id: 1002, name: "Singleton label", mode: "SINGLETON"}],
            [1003, {id: 1003, name: "One for each label", mode: "ONE_FOR_EACH_PLAYER"}],
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "Some text", typeId: 1000}],

            [2001, {id: 2001, name: "2", typeId: 1001}],
            [2002, {id: 2002, name: "3", typeId: 1001}],
            [2003, {id: 2003, name: "4", typeId: 1001}],

            [2004, {id: 2004, name: "1st Seat", typeId: 1002}],

            [2005, {id: 2005, name: "P1", typeId: 1003}],
            [2006, {id: 2006, name: "P2", typeId: 1003}],
            [2007, {id: 2007, name: "P3", typeId: 1003}],
        ]);

        const result = clearItemIndex(labelTypes, labelItems);

        expect(result).toEqual(new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "Some text", typeId: 1000}],

            [2001, {id: 2001, name: "2", typeId: 1001}],
            [2002, {id: 2002, name: "3", typeId: 1001}],
            [2003, {id: 2003, name: "4", typeId: 1001}],
        ]));
    });
});


describe("generateLabelPoolWithDynamicItems", () => {

    let idPool: NumberPool;

    beforeEach(() => {
        idPool = new NumberPool(4000);
    });

    test('No labels or items', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>();
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();
        const players: PlayerIndex = new Map<PlayerId, Player>();

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>());
    });

    test('One TEXT and one player', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Text label", mode: "TEXT"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "Some text", typeId: 1000}]
        ]);
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [{id: 2000, name: "Some text", typeId: 1000}]]
        ]));
    });

    test('One NUMBER and one player', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Number label", mode: "NUMBER"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>([
            [2000, {id: 2000, name: "1", typeId: 1000}]
        ]);
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [{id: 2000, name: "1", typeId: 1000}]]
        ]));
    });

    test('One SINGLETON and one player', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Singleton label", mode: "SINGLETON"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [{id: 4000, name: "Singleton label", typeId: 1000}]]
        ]));
    });

    test('One SINGLETON and many players', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "Singleton label", mode: "SINGLETON"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
            [3002, {id: 3002, name: "Player 2"}],
            [3003, {id: 3003, name: "Player 3"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [{id: 4000, name: "Singleton label", typeId: 1000}]]
        ]));
    });

    test('One ONE_FOR_EACH_PLAYER and one player', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "One for each player label", mode: "ONE_FOR_EACH_PLAYER"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [{id: 4000, name: "1", typeId: 1000}]]
        ]));
    });

    test('One ONE_FOR_EACH_PLAYER and many players', () => {
        const labelTypes: LabelTypeIndex = new Map<LabelTypeId, LabelType>([
            [1000, {id: 1000, name: "One for each player label", mode: "ONE_FOR_EACH_PLAYER"}]
        ]);
        const labelItems: LabelItemIndex = new Map<LabelItemId, LabelItem>();
        const players: PlayerIndex = new Map<PlayerId, Player>([
            [3001, {id: 3001, name: "Player 1"}],
            [3002, {id: 3002, name: "Player 2"}],
            [3003, {id: 3003, name: "Player 3"}],
        ]);

        const result = generateLabelPoolWithDynamicItems(idPool, labelTypes, labelItems, players);

        expect(result).toEqual(new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [
                {id: 4000, name: "1", typeId: 1000},
                {id: 4001, name: "2", typeId: 1000},
                {id: 4002, name: "3", typeId: 1000},
            ]],
        ]));
    });
});

describe('randomizeLabelsForPlayers', () => {
    const NO_SHUFFLE: ShuffleFunc = array => array;
    const RANDOM_MIN: RandomProvider = ((min, max) => min);
    const RANDOM_MAX: RandomProvider = ((min, max) => max);

    test('None', () => {
        const result: PlayerLabelIndex = randomizeLabelsForPlayers(
            new Map<LabelTypeId, Array<LabelItem>>(),
            [],
            new Map<PlayerId, Player>(),
            NO_SHUFFLE,
            RANDOM_MIN
        );

        expect(result).toEqual(new Map());
    });

    test('Players and one label type', () => {
        const labelItemPool = new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [
                {id: 2000, typeId: 1000, name: "Label 1"},
                {id: 2001, typeId: 1000, name: "Label 2"},
            ]],
        ]);
        const playerIndex: PlayerIndex = new Map<PlayerId, Player>([
            [3000, {id: 3000, name: "Player 1"}],
            [3001, {id: 3001, name: "Player 2"}],
        ]);
        const playerPool = [3000, 3001];

        const result: PlayerLabelIndex = randomizeLabelsForPlayers(
            labelItemPool,
            playerPool,
            playerIndex,
            NO_SHUFFLE,
            RANDOM_MIN
        );

        expect(result).toEqual(new Map<PlayerId, Array<LabelRef>>([
            [3000, [{typeId: 1000, itemId: 2000}]],
            [3001, [{typeId: 1000, itemId: 2001}]],
        ]));
    });

    test('Players and one label type max label index', () => {
        const labelItemPool = new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [
                {id: 2000, typeId: 1000, name: "Label 1"},
                {id: 2001, typeId: 1000, name: "Label 2"},
            ]],
        ]);
        const playerIndex: PlayerIndex = new Map<PlayerId, Player>([
            [3000, {id: 3000, name: "Player 1"}],
            [3001, {id: 3001, name: "Player 2"}],
        ]);
        const playerPool = [3000, 3001];

        const result: PlayerLabelIndex = randomizeLabelsForPlayers(
            labelItemPool,
            playerPool,
            playerIndex,
            NO_SHUFFLE,
            RANDOM_MAX
        );

        expect(result).toEqual(new Map<PlayerId, Array<LabelRef>>([
            [3000, [{typeId: 1000, itemId: 2001}]],
            [3001, [{typeId: 1000, itemId: 2000}]],
        ]));
    });

    test('Players and many label types', () => {
        const labelItemPool = new Map<LabelTypeId, Array<LabelItem>>([
            [1000, [
                {id: 2000, typeId: 1000, name: "Label 1"},
                {id: 2001, typeId: 1000, name: "Label 2"}
            ]],
            [1001, [
                {id: 2002, typeId: 1001, name: "Label 3"},
                {id: 2003, typeId: 1001, name: "Label 4"},
                {id: 2004, typeId: 1001, name: "Label 5"},
            ]],
            [1002, [
                {id: 2005, typeId: 1002, name: "Label 6"},
            ]],
        ]);
        const playerIndex: PlayerIndex = new Map<PlayerId, Player>([
            [3000, {id: 3000, name: "Player 1"}],
            [3001, {id: 3001, name: "Player 2"}]
        ]);

        const playerPool = [3000, 3001];

        const result: PlayerLabelIndex = randomizeLabelsForPlayers(
            labelItemPool,
            playerPool,
            playerIndex,
            NO_SHUFFLE,
            RANDOM_MIN
        );

        expect(result).toEqual(new Map<PlayerId, Array<LabelRef>>([
            [3000, [
                {typeId: 1000, itemId: 2000},
                {typeId: 1001, itemId: 2002},
                {typeId: 1002, itemId: 2005},
            ]],
            [3001, [
                {typeId: 1000, itemId: 2001},
                {typeId: 1001, itemId: 2003},
            ]]
        ]));
    });
});
