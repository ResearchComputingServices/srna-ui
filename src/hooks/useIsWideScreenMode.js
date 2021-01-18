import useWindowSize from './useWindowSize';

export default function useIsWideScreenMode() {
    const dimensions = useWindowSize();
    return dimensions.width > 1005;
}
