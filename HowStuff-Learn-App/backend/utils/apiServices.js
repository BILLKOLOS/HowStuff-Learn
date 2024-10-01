// Consolidated apiServices.js file

// Services from additional_resources
const ck12Service = require('./additional_resources/ck12Service.js');
const clinical_trials_govService = require('./additional_resources/clinical_trials_govService.js');
const courseraService = require('./additional_resources/courseraService.js');
const dataAnalysis = require('./additional_resources/dataAnalysis.js');
const deepgramService = require('./additional_resources/deepgramService.js');
const desmosService = require('./additional_resources/desmosService.js');
const dialogflowService = require('./additional_resources/dialogflowService.js');
const disqusService = require('./additional_resources/disqusService.js');
const duolingoService = require('./additional_resources/duolingoService.js');
const ebscoService = require('./additional_resources/ebscoService.js');
const edxService = require('./additional_resources/edxService.js');
const emailService = require('./additional_resources/emailService.js');
const faoService = require('./additional_resources/faoService.js');
const feedbackService = require('./additional_resources/feedbackService.js');
const firebaseService = require('./additional_resources/firebaseService.js');
const google_analyticsService = require('./additional_resources/google_analyticsService.js');
const google_formsService = require('./additional_resources/google_formsService.js');
const google_patentsService = require('./additional_resources/google_patentsService.js');
const kaggleService = require('./additional_resources/kaggleService.js');
const kahootService = require('./additional_resources/kahootService.js');
const khanAcademyService = require('./additional_resources/khanAcademyService.js');
const mathwayService = require('./additional_resources/mathwayService.js');
const mpesaService = require('./additional_resources/mpesaService.js');
const notificationService = require('./additional_resources/notificationService.js');
const oecdService = require('./additional_resources/oecdService.js');
const openaiService = require('./additional_resources/openaiService.js');
const openai_codexService = require('./additional_resources/openai_codexService.js');
const paypalService = require('./additional_resources/paypalService.js');
const proquestService = require('./additional_resources/proquestService.js');
const quizletService = require('./additional_resources/quizletService.js');
const resourceService = require('./additional_resources/resourceService.js');
const simscaleService = require('./additional_resources/simscaleService.js');
const slackService = require('./additional_resources/slackService.js');
const squareService = require('./additional_resources/squareService.js');
const stripeService = require('./additional_resources/stripeService.js');
const taylor_francisService = require('./additional_resources/taylor_francisService.js');
const ttsService = require('./additional_resources/ttsService.js');
const twilioService = require('./additional_resources/twilioService.js');
const udemyService = require('./additional_resources/udemyService.js');
const usgsService = require('./additional_resources/usgsService.js');
const videoService = require('./additional_resources/videoService.js');
const voiceflowService = require('./additional_resources/voiceflowService.js');
const wikipediaService = require('./additional_resources/wikipediaService.js');
const world_bankService = require('./additional_resources/world_bankService.js');
const zoomService = require('./additional_resources/zoomService.js');

// Services from general_education
const elasticsearchService = require('./general_education/elasticsearchService.js');
const google_booksService = require('./general_education/google_booksService.js');
const khan_academyService = require('./general_education/khan_academyService.js');
const openaiService_general = require('./general_education/openaiService.js');
const pexelsService = require('./general_education/pexelsService.js');
const youtube_dataService = require('./general_education/youtube_dataService.js');

// Services from graduate
const citeseerxService = require('./graduate/citeseerxService.js');
const crossrefService = require('./graduate/crossrefService.js');
const elsevierService = require('./graduate/elsevierService.js');
const ieee_xploreService_graduate = require('./graduate/ieee_xploreService.js');
const orcidService = require('./graduate/orcidService.js');
const pubchemService = require('./graduate/pubchemService.js');
const pubmedService_graduate = require('./graduate/pubmedService.js');
const scopusService = require('./graduate/scopusService.js');
const zenodoService = require('./graduate/zenodoService.js');

// Services from specialized_research
const biomed_centralService = require('./specialized_research/biomed_centralService.js');
const chemspiderService = require('./specialized_research/chemspiderService.js');
const nasa_openService = require('./specialized_research/nasa_openService.js');
const wolfram_alphaService_specialized = require('./specialized_research/wolfram_alphaService.js');

// Services from undergraduate
const arxivService = require('./undergraduate/arxivService.js');
const google_scholarService = require('./undergraduate/google_scholarService.js');
const ieee_xploreService_undergrad = require('./undergraduate/ieee_xploreService.js');
const jstorService = require('./undergraduate/jstorService.js');
const linkedin_learningService = require('./undergraduate/linkedin_learningService.js');
const pubmedService_undergrad = require('./undergraduate/pubmedService.js');
const springerService = require('./undergraduate/springerService.js');

// Module exports
module.exports = {
    ck12Service,
    clinical_trials_govService,
    courseraService,
    dataAnalysis,
    deepgramService,
    desmosService,
    dialogflowService,
    disqusService,
    duolingoService,
    ebscoService,
    edxService,
    emailService,
    faoService,
    feedbackService,
    firebaseService,
    google_analyticsService,
    google_formsService,
    google_patentsService,
    kaggleService,
    kahootService,
    khanAcademyService,
    mathwayService,
    mpesaService,
    notificationService,
    oecdService,
    openaiService,
    openai_codexService,
    paypalService,
    proquestService,
    quizletService,
    resourceService,
    simscaleService,
    slackService,
    squareService,
    stripeService,
    taylor_francisService,
    ttsService,
    twilioService,
    udemyService,
    usgsService,
    videoService,
    voiceflowService,
    wikipediaService,
    world_bankService,
    zoomService,
    elasticsearchService,
    google_booksService,
    khan_academyService,
    openaiService_general,
    pexelsService,
    youtube_dataService,
    citeseerxService,
    crossrefService,
    elsevierService,
    ieee_xploreService_graduate,
    orcidService,
    pubchemService,
    pubmedService_graduate,
    scopusService,
    zenodoService,
    biomed_centralService,
    chemspiderService,
    nasa_openService,
    wolfram_alphaService_specialized,
    arxivService,
    google_scholarService,
    ieee_xploreService_undergrad,
    jstorService,
    linkedin_learningService,
    pubmedService_undergrad,
    springerService
};
