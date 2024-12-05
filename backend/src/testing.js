import axios from 'axios'

const TEST_SERVER_URL = process.env.TEST_SERVER_URL;

const testWorkout = async (query) => {
    try {
        const response = await axios.post(process.env.TEST_SERVER_URL, {
            query:query || 'I am a 48-year-old female with a height of 169 cm and a weight of 71 kg. My primary goal is muscle gain, and I aim to reach a target weight of 76 kg. I am a beginner at the gym. Can you create a 7-day workout plan for me?',
            input_text: 'Beginner level, weight loss'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
         return response
        // console.log('Response from /test-workout route:', response.data);
    } catch (error) {
        console.error('Error while testing /test-workout route:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
    }
};

export {testWorkout}