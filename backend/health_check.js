
import axios from 'axios';

const testBackend = async () => {
    try {
        console.log('Trying to reach backend at http://localhost:5000...');
        const response = await axios.get('http://localhost:5000/');
        console.log('✅ Backend is reachable!');
        console.log('Status:', response.status);
        console.log('Message:', response.data.message);

        console.log('\nTrying to reach /api/applications...');
        try {
            const apps = await axios.get('http://localhost:5000/api/applications');
            console.log('✅ /api/applications reachable!');
            console.log('Count:', apps.data.count);
        } catch (apiError) {
             console.error('❌ /api/applications failed:', apiError.message);
             if (apiError.response) console.error('Data:', apiError.response.data);
        }

    } catch (error) {
        console.error('❌ Backend is UNREACHABLE:', error.message);
        console.error('Possible reasons:');
        console.error('1. Server crashed (Syntax error?)');
        console.error('2. MongoDB connection failed');
        console.error('3. Port 5000 is blocked');
    }
};

testBackend();
