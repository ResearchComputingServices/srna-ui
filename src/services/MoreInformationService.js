class MoreInformationService {
    getReadme = async () => fetch('https://raw.githubusercontent.com/ResearchComputingServices/srna/main/README.md').then(response => response.text())
}

const moreInformationService = new MoreInformationService();

Object.freeze(moreInformationService);

export default moreInformationService;

export { MoreInformationService };
