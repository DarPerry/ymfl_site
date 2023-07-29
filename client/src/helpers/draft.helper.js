export const getSnakeDraftPick = (draftSlot, round) => {
    const oddAdjustment = draftSlot - 12;
    const evenAdjustment = -oddAdjustment - 12 + 1;
    const isEvenRound = round % 2 === 0;

    if (isEvenRound) {
        return round * 12 - evenAdjustment;
    }

    return round * 12 + oddAdjustment;
};
