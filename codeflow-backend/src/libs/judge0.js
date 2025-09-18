import axios from 'axios';

const NODE_ENV = process.env.NODE_ENV || 'development';
const JUDGE0_URL =
    NODE_ENV === 'development'
        ? process.env.JUDGE0_LOCAL_URL
        : process.env.JUDGE0_API_URL;

const rapidApiHeaders =
    NODE_ENV === 'development'
        ? {}
        : {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
          };

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        PYTHON: 71,
        JAVA: 62,
        JAVASCRIPT: 63,
        // 'C++': 54,
    };

    return languageMap[language.toUpperCase()];
};

export const getLanguageName = (languageId) => {
    const language_names = {
        71: 'Python',
        62: 'Java',
        63: 'Javascript',
        // 54: 'C++',
    };

    return language_names[languageId] || 'Unknown';
};

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(
        `${JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        { submissions },
        Object.keys(rapidApiHeaders).length
            ? { headers: rapidApiHeaders }
            : undefined
    );
    console.log('Submission Results: ', data);
    return data;
};

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${JUDGE0_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(','),
                base64_encoded: false,
            },
            ...(Object.keys(rapidApiHeaders).length
                ? { headers: rapidApiHeaders }
                : {}),
        });
        if (!data?.submissions || !Array.isArray(data.submissions)) {
            throw new Error("Judge0 batch response is missing 'submissions'");
        }
        const results = data.submissions;
        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        );
        if (isAllDone) return results;
        await sleep(1000);
    }
};
