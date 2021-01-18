import _ from 'lodash';

export default function useIsVisible(el) {
    if (_.isNil(el)) return true;
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}
