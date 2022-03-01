class TutorialService {
    getReadme = async () => fetch('https://raw.githubusercontent.com/ResearchComputingServices/srna-ui/main/Tutorial.md').then(response => response.text())
}

const tutorialService = new TutorialService();

Object.freeze(tutorialService);

export default tutorialService;

export { TutorialService };
