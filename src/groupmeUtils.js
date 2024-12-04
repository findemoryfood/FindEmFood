import axios from 'axios';
import { writeFoodInfo, getFoodInfo } from './firebaseUtils';

const GROUPME_TOKEN = process.env.REACT_APP_GROUPME_TOKEN;
const GROUPME_GROUP_ID = '104461918';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const TIME_WINDOW = 180; // 3 minutes in seconds

// Fetch messages from GroupMe
export const fetchGroupMeMessages = async () => {
  console.log('Fetching messages...');
  try {
    const response = await axios.get(
      `https://api.groupme.com/v3/groups/${GROUPME_GROUP_ID}/messages?token=${GROUPME_TOKEN}`
    );

    const messages = response.data.response.messages;

    // Filter messages from today's date onward
    const today = new Date().toISOString().split('T')[0];
    const startOfDayTimestamp = Math.floor(new Date(`${today}T00:00:00Z`).getTime() / 1000);

    const filteredMessages = messages.filter(
      (message) => message.created_at >= startOfDayTimestamp
    );

    console.log('Filtered messages:', filteredMessages);
    return filteredMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Group messages by user and proximity in time
const groupMessagesByUser = (messages) => {
  const groupedMessages = [];
  const userGroups = {};

  messages.forEach((message) => {
    const { user_id, created_at, text } = message;

    if (!userGroups[user_id]) {
      userGroups[user_id] = [];
    }

    const lastMessage = userGroups[user_id].slice(-1)[0];
    if (lastMessage && created_at - lastMessage.created_at <= TIME_WINDOW) {
      // Combine texts if within the time window
      lastMessage.text += ` ${text}`;
    } else {
      // Add new message group
      userGroups[user_id].push({ text, created_at });
    }
  });

  Object.values(userGroups).forEach((groups) => groupedMessages.push(...groups));
  console.log('Grouped messages:', groupedMessages);
  return groupedMessages;
};

// Format grouped messages using OpenAI
const formatWithOpenAI = async (messages) => {
  if (!messages.length) {
    console.log('No messages to format.');
    return [];
  }

  try {
    const groupedMessages = groupMessagesByUser(messages);
    const formattedMessages = groupedMessages.map((msg) => msg.text).join('\n');

    const prompt = `Parse the following messages into structured JSON entries. Each entry must have:
- A required "name" field for the food item.
- A required "location" field (building name).
- An optional "room" field (if available).
- An optional "time" field (if available).
- An optional "club" field (if available).

Messages:
${formattedMessages}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON formatter for GroupMe messages.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const structuredData = JSON.parse(
      response.data.choices[0].message.content.replace(/```json|```/g, '')
    );
    console.log('Structured data:', structuredData);
    return structuredData || [];
  } catch (error) {
    console.error('Error formatting with OpenAI:', error);
    return [];
  }
};

// Initialize Firebase FoodInfo node if empty
const initializeFoodInfo = async () => {
  try {
    const existingData = await getFoodInfo();
    if (!existingData) {
      await writeFoodInfo('init', {}); // Initialize with an empty object
      console.log('Initialized FoodInfo in Firebase.');
    }
  } catch (error) {
    console.error('Error initializing Firebase FoodInfo:', error);
  }
};

// Populate Firebase from GroupMe
export const populateFirebaseFromGroupMe = async () => {
  console.log('Populating Firebase from GroupMe...');
  await initializeFoodInfo(); // Ensure Firebase is initialized

  const messages = await fetchGroupMeMessages();
  if (!messages.length) {
    console.log('No new messages to process.');
    return;
  }

  // Format messages using OpenAI
  const foodEntries = await formatWithOpenAI(messages);

  if (!foodEntries.length) {
    console.log('No structured data to process.');
    return;
  }

  // Fetch existing Firebase data
  const existingEntries = (await getFoodInfo()) || {};
  console.log('Existing Firebase entries:', existingEntries);

  const processedEntries = [];

  for (const foodData of foodEntries) {
    // Standardize data for comparison
    const standardizedFoodData = {
      name: (foodData.name || '').toLowerCase().trim(),
      location: (foodData.location || '').toLowerCase().trim(),
      room: (foodData.room || '').toLowerCase().trim(),
      time: (foodData.time || '').toLowerCase().trim(),
      club: (foodData.club || '').toLowerCase().trim(),
    };

    const isDuplicate = Object.values(existingEntries).some((entry) => {
      // Standardize existing entry for comparison
      const standardizedEntry = {
        name: (entry.name || '').toLowerCase().trim(),
        location: (entry.location || '').toLowerCase().trim(),
        room: (entry.room || '').toLowerCase().trim(),
        time: (entry.time || '').toLowerCase().trim(),
        club: (entry.club || '').toLowerCase().trim(),
      };

      // Compare all standardized fields
      return (
        standardizedFoodData.name === standardizedEntry.name &&
        standardizedFoodData.location === standardizedEntry.location &&
        standardizedFoodData.room === standardizedEntry.room &&
        standardizedFoodData.time === standardizedEntry.time &&
        standardizedFoodData.club === standardizedEntry.club
      );
    });

    if (isDuplicate) {
      console.log('Duplicate entry skipped:', foodData);
    } else {
      const foodId = Math.random().toString(36).substr(2, 9);
      try {
        await writeFoodInfo(foodId, foodData);
        processedEntries.push(foodData);
        console.log('Written to Firebase:', foodData);
      } catch (error) {
        console.error('Error writing to Firebase:', error);
      }
    }
  }

  console.log('Food entries processed:', processedEntries);
};