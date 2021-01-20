import React from 'react';
import { useStore } from '../../hooks';
import { ComputationForm, ComputationPending } from '..';

function Computation() {
    const computation = useStore('computation');

    if (computation.stage === 1) {
        return <ComputationForm />;
    }

    if (computation.stage === 2) {
        return <ComputationPending />;
    }

    return <ComputationForm />;
}

export default Computation;
