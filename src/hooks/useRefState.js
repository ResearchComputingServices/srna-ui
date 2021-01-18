import { useState, useRef } from 'react';

export default function useRefState(initialState) {
    const [state, setState] = useState(initialState);
    const stateRef = useRef(state);
    stateRef.current = state;
    return [() => stateRef.current, setState];
}
