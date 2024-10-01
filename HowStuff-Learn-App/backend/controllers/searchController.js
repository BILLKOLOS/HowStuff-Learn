// Import necessary services from various directories
// Additional Resources
const ck12Service = require('../utils/additional_resources/ck12Service');
const clinicalTrialsGovService = require('../utils/additional_resources/clinical_trials_govService');
const courseraService = require('../utils/additional_resources/courseraService');
const dataAnalysisService = require('../utils/additional_resources/dataAnalysis');
const deepgramService = require('../utils/additional_resources/deepgramService');
const desmosService = require('../utils/additional_resources/desmosService');
const dialogflowService = require('../utils/additional_resources/dialogflowService');
const disqusService = require('../utils/additional_resources/disqusService');
const duolingoService = require('../utils/additional_resources/duolingoService');
const ebscoService = require('../utils/additional_resources/ebscoService');
const edxService = require('../utils/additional_resources/edxService');
const emailService = require('../utils/additional_resources/emailService');
const faoService = require('../utils/additional_resources/faoService');
const feedbackService = require('../utils/additional_resources/feedbackService');
const firebaseService = require('../utils/additional_resources/firebaseService');
const googleAnalyticsService = require('../utils/additional_resources/google_analyticsService');
const googleFormsService = require('../utils/additional_resources/google_formsService');
const googlePatentsService = require('../utils/additional_resources/google_patentsService');
const kaggleService = require('../utils/additional_resources/kaggleService');
const kahootService = require('../utils/additional_resources/kahootService');
const mathwayService = require('../utils/additional_resources/mathwayService');
const mpesaService = require('../utils/additional_resources/mpesaService');
const notificationService = require('../utils/additional_resources/notificationService');
const oecdService = require('../utils/additional_resources/oecdService');
const openaiService = require('../utils/additional_resources/openaiService');
const openaiCodexService = require('../utils/additional_resources/openai_codexService');
const paypalService = require('../utils/additional_resources/paypalService');
const proquestService = require('../utils/additional_resources/proquestService');
const quizletService = require('../utils/additional_resources/quizletService');
const resourceService = require('../utils/additional_resources/resourceService');
const simscaleService = require('../utils/additional_resources/simscaleService');
const slackService = require('../utils/additional_resources/slackService');
const squareService = require('../utils/additional_resources/squareService');
const stripeService = require('../utils/additional_resources/stripeService');
const taylorFrancisService = require('../utils/additional_resources/taylor_francisService');
const ttsService = require('../utils/additional_resources/ttsService');
const twilioService = require('../utils/additional_resources/twilioService');
const udemyService = require('../utils/additional_resources/udemyService');
const usgsService = require('../utils/additional_resources/usgsService');
const videoService = require('../utils/additional_resources/videoService');
const voiceflowService = require('../utils/additional_resources/voiceflowService');
const wikipediaService = require('../utils/additional_resources/wikipediaService');
const worldBankService = require('../utils/additional_resources/world_bankService');
const zoomService = require('../utils/additional_resources/zoomService');

// Graduate Resources
const citeseerxService = require('../utils/graduate/citeseerxService');
const crossrefService = require('../utils/graduate/crossrefService');
const elsevierService = require('../utils/graduate/elsevierService');
const ieeeXploreService = require('../utils/graduate/ieee_xploreService');
const pubchemService = require('../utils/graduate/pubchemService');
const pubmedService = require('../utils/graduate/pubmedService');
const scopusService = require('../utils/graduate/scopusService');
const zenodoService = require('../utils/graduate/zenodoService');
const orcidService = require('../utils/graduate/orcidService');

// Education Resources
const airtableService = require('../utils/education_resources/airtableService');
const alisonService = require('../utils/education_resources/alisonService');
const alphaVantageService = require('../utils/education_resources/alpha_vantageService');
const apacheSparkService = require('../utils/education_resources/apache_sparkService');
const authorizeNetService = require('../utils/education_resources/authorize_netService');
const biorexivService = require('../utils/education_resources/biorexivService');
const bureauOfLaborStatisticsService = require('../utils/education_resources/bureau_of_labor_statisticsService');
const cambridgeDictionaryService = require('../utils/education_resources/cambridge_dictionaryService');
const cdcService = require('../utils/education_resources/cdcService');
const classcraftService = require('../utils/education_resources/classcraftService');
const climateDataService = require('../utils/education_resources/climate_dataService');
const clinicalkeyService = require('../utils/education_resources/clinicalkeyService');
const cochraneLibraryService = require('../utils/education_resources/cochrane_libraryService');
const codecademyService = require('../utils/education_resources/codecademyService');
const coingeckoService = require('../utils/education_resources/coingeckoService');
const crazyEggService = require('../utils/education_resources/crazy_eggService');
const dataGovService = require('../utils/education_resources/data_govService');
const daz3dService = require('../utils/education_resources/daz_3dService');
const dimensionsService = require('../utils/education_resources/dimensionsService');
const discordService = require('../utils/education_resources/discordService');
const edabitService = require('../utils/education_resources/edabitService');
const edmodoService = require('../utils/education_resources/edmodoService');
const epaService = require('../utils/education_resources/epaService');
const europePMCService = require('../utils/education_resources/europe_pmcService');
const eventbriteService = require('../utils/education_resources/eventbriteService');
const facebookGraphService = require('../utils/education_resources/facebook_graphService');
const faostatService = require('../utils/education_resources/faostatService');
const flickrService = require('../utils/education_resources/flickrService');
const freecodecampService = require('../utils/education_resources/freecodecampService');
const genbankService = require('../utils/education_resources/genbankService');
const giphyService = require('../utils/education_resources/giphyService');
const githubService = require('../utils/education_resources/githubService');
const googleClassroomService = require('../utils/education_resources/google_classroomService');
const googleCloudVisionService = require('../utils/education_resources/google_cloud_visionService');
const googleHangoutsService = require('../utils/education_resources/google_hangoutsService');
const googleMapsService = require('../utils/education_resources/google_mapsService');
const hackerrankService = require('../utils/education_resources/hackerrankService');
const healthGorillaService = require('../utils/education_resources/health_gorillaService');
const healthlineService = require('../utils/education_resources/healthlineService');
const heapService = require('../utils/education_resources/heapService');
const hotjarService = require('../utils/education_resources/hotjarService');
const ibmWatsonService = require('../utils/education_resources/ibm_watsonService');
const iftttService = require('../utils/education_resources/iftttService');
const instagramGraphService = require('../utils/education_resources/instagram_graphService');
const kahootService = require('../utils/education_resources/kahootService');
const leetcodeService = require('../utils/education_resources/leetcodeService');
const lingqService = require('../utils/education_resources/lingqService');
const linkedinService = require('../utils/education_resources/linkedinService');
const lyndaService = require('../utils/education_resources/lyndaService');
const mailgunService = require('../utils/education_resources/mailgunService');
const microsoftComputerVisionService = require('../utils/education_resources/microsoft_computer_visionService');
const microsoftTeamsService = require('../utils/education_resources/microsoft_teamsService');
const minecraftEducationEditionService = require('../utils/education_resources/minecraft_education_editionService');
const mixpanelService = require('../utils/education_resources/mixpanelService');
const nasaEarthService = require('../utils/education_resources/nasa_earthService');
const nasaVariousApisService = require('../utils/education_resources/nasa_various_apis');
const nlmService = require('../utils/education_resources/nlmService');
const nprService = require('../utils/education_resources/nprService');
const oecdDataService = require('../utils/education_resources/oecd_dataService');
const openDataPortalService = require('../utils/education_resources/open_data_portalService');
const openstaxService = require('../utils/education_resources/openstaxService');
const openweatherService = require('../utils/education_resources/openweatherService');
const oxfordDictionariesService = require('../utils/education_resources/oxford_dictionariesService');
const paystackService = require('../utils/education_resources/paystackService');
const pexelsVideoService = require('../utils/education_resources/pexels_videoService');
const pinterestService = require('../utils/education_resources/pinterestService');
const plumxMetricsService = require('../utils/education_resources/plumx_metricsService');
const pluralsightService = require('../utils/education_resources/pluralsightService');
const prodigyService = require('../utils/education_resources/prodigyService');
const quandlService = require('../utils/education_resources/quandlService');
const quizizzService = require('../utils/education_resources/quizizzService');
const rawGraphsService = require('../utils/education_resources/raw_graphsService');
const replitService = require('../utils/education_resources/replitService');
const salesforceService = require('../utils/education_resources/salesforceService');
const scratchService = require('../utils/education_resources/scratchService');
const scrimbaService = require('../utils/education_resources/scrimbaService');
const sevenBridgesService = require('../utils/education_resources/seven_bridgesService');
const shmoopService = require('../utils/education_resources/shmoopService');
const slackAPIService = require('../utils/education_resources/slack_apiService');
const snapserviceService = require('../utils/education_resources/snapserviceService');
const teachableMachineService = require('../utils/education_resources/teachable_machineService');
const teachmintService = require('../utils/education_resources/teachmintService');
const tutorService = require('../utils/education_resources/tutorService');
const udacityService = require('../utils/education_resources/udacityService');
const udemyService = require('../utils/education_resources/udemyService');
const unacademyService = require('../utils/education_resources/unacademyService');
const uniplacesService = require('../utils/education_resources/uniplacesService');
const universityOfCaliforniaService = require('../utils/education_resources/university_of_californiaService');
const universityOfEdinburghService = require('../utils/education_resources/university_of_edinburghService');
const universityOfWashingtonService = require('../utils/education_resources/university_of_washingtonService');
const weatherAPIService = require('../utils/education_resources/weather_apiService');
const wileyService = require('../utils/education_resources/wileyService');
const wolframAlphaService = require('../utils/education_resources/wolfram_alphaService');
const worldHealthOrganizationService = require('../utils/education_resources/world_health_organizationService');
const youtubeService = require('../utils/education_resources/youtubeService');

// Function to generate tailored educational responses using OpenAI's API
const generateContentWithOpenAI = async (query, userLevel) => {
    const prompt = `
        You are an educational assistant. Generate a response to the following query: "${query}" for a user at the level of "${userLevel}". 
        Ensure the response is clear, accurate, and age-appropriate, avoiding any explicit or inappropriate content.
    `;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.5,
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API Key
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating content with OpenAI:', error);
        return null; // Return null if error occurs
    }
};

// Function to generate tailored educational responses using Hugging Face API
const generateContentWithHuggingFace = async (query, userLevel) => {
    const model = "distilbert-base-uncased"; // Example model
    const prompt = `Generate a response to the following query: "${query}" for a user at the level of "${userLevel}".`;

    try {
        const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
            inputs: prompt,
        }, {
            headers: {
                'Authorization': `Bearer YOUR_HUGGINGFACE_API_KEY`, // Replace with your Hugging Face API Key
                'Content-Type': 'application/json',
            },
        });

        return response.data[0].generated_text.trim();
    } catch (error) {
        console.error('Error generating content with Hugging Face:', error);
        return null;
    }
};

// General function to generate tailored content
const generateContentWithAI = async (query, userLevel) => {
    let content = await generateContentWithOpenAI(query, userLevel);
    
    if (!content) {
        // Fallback to Hugging Face if OpenAI fails
        content = await generateContentWithHuggingFace(query, userLevel);
    }

    // If all AI models fail, return a default message
    if (!content) {
        content = "I'm sorry, I couldn't generate an answer to your query at this time.";
    }

    return content;
};

// Function to filter and format the search results based on user level
const formatResultsForUserLevel = (results, userLevel) => {
    // Define content mapping based on user levels
    const contentMapping = {
        kindergarten: (result) => ({
            title: result.title,
            description: `A simple explanation: ${result.description}`,
            content: `Here’s a fun fact: ${result.funFact || 'Planes are like big birds that fly in the sky!'}`,
        }),
        primary: (result) => ({
            title: result.title,
            description: result.description,
            content: `For example, ${result.example || 'the wings help the plane to lift up!'}`,
        }),
        secondary: (result) => ({
            title: result.title,
            description: result.description,
            content: result.detailedContent || 'Planes fly because of lift created by their wings and engines.',
        }),
        tertiary: (result) => ({
            title: result.title,
            description: result.description,
            content: result.detailedContent || 'The principles of flight involve lift, thrust, drag, and gravity.',
        }),
        postgraduate: (result) => ({
            title: result.title,
            description: result.description,
            content: result.detailedContent || 'Advanced aerodynamics explains the mechanics of flight and fluid dynamics.',
        }),
    };

    // Format the results according to user level
    return results
        .filter(result => !result.isExplicit) // Exclude explicit content
        .map(result => {
            // Use the appropriate mapping based on the user level
            const formatter = contentMapping[userLevel] || contentMapping.postgraduate; // Default to postgraduate if level not found
            return formatter(result);
        });
};

// Search function to query educational resources
exports.searchResources = async (req, res) => {
    const { query, userLevel } = req.body;

    try {
        // Perform search using all relevant services
        const [ck12Results, edxResults, courseraResults, udemyResults, wikipediaResults] = await Promise.all([
            ck12Service.search(query),
            edxService.search(query),
            courseraService.search(query),
            udemyService.search(query),
            wikipediaService.search(query),
        ]);

        // Combine results into one array
        const allResults = [
            ...ck12Results,
            ...edxResults,
            ...courseraResults,
            ...udemyResults,
            ...wikipediaResults,
        ];

        // Format results based on the user's education level
        const formattedResults = formatResultsForUserLevel(allResults, userLevel);

        // Generate tailored content using AI
        const aiResponse = await generateContentWithAI(query, userLevel);

        return res.status(200).json({
            success: true,
            data: {
                query,
                userLevel,
                resources: formattedResults,
                aiResponse,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error searching resources',
            error: error.message,
        });
    }
};
