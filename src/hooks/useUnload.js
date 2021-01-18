import { useRef, useEffect } from 'react';

const useUnload = fn => {
    const callback = useRef(fn);
    useEffect(() => {
        const onUnload = callback.current;
        window.addEventListener('beforeunload', onUnload);
        return () => window.removeEventListener('beforeunload', onUnload);
    }, [callback]);
};

export default useUnload;
