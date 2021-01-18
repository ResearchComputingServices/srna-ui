import { useState } from 'react';
import { useMount, useUnmount } from 'react-use';
import _ from 'lodash';

export default function useWindowSize() {
    const isClient = _.isObject(window);

    const getSize = () => ({
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined,
    });

    const [windowSize, setWindowSize] = useState(getSize);

    const handleResize = () => setWindowSize(getSize());

    useMount(() => {
        if (isClient) {
            window.addEventListener('resize', handleResize);
        }
    });

    useUnmount(() => window.removeEventListener('resize', handleResize));

    return windowSize;
}
