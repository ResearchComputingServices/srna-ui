import React from 'react';
import { useStore } from '../../hooks';
import { ComputationForm, ComputationPending, ComputationResult } from '..';

function Computation() {
    const computation = useStore('computation');

    if (computation.stage === 1) {
        return <ComputationForm />;
    }

    if (computation.stage === 2) {
        return <ComputationPending />;
    }

    if (computation.stage === 3) {
        return <ComputationResult />;
    }

    return <ComputationForm />;
}

export default Computation;
