export default function useEntityService(entity) {
    const entityServiceMap = {};
    return entityServiceMap[entity];
}
