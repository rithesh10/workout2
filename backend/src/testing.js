import axios from 'axios'

const TEST_SERVER_URL = 'https://b9a0-34-126-147-183.ngrok-free.app/generate';

const testWorkout = async () => {
    try {
        const response = await axios.post(TEST_SERVER_URL, {
            query: 'I am a 48-year-old female with a height of 169 cm and a weight of 71 kg. My primary goal is muscle gain, and I aim to reach a target weight of 76 kg. I am a beginner at the gym. Can you create a 7-day workout plan for me?',
            input_text: 'Beginner level, weight loss'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response from /test-workout route:', response.data);
    } catch (error) {
        console.error('Error while testing /test-workout route:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
    }
};

// Call the test function
testWorkout();
// const formattedText = response.data.generated_text;

// // Remove everything before "### Response:"
// const responseStartIndex = formattedText.indexOf("### Response:");
// const cleanText = responseStartIndex !== -1 
//     ? formattedText.slice(responseStartIndex + "### Response:".length).trim() 
//     : formattedText;

// console.log("Cleaned Workout Plan:", cleanText);
