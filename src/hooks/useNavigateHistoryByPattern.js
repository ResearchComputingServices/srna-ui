import useService from './useService';

export default function useNavigateHistoryByPattern() {
    const historyService = useService('history');
    return () => (historyService.size() <= 2 ? historyService.go('/') : historyService.goBack());
}
