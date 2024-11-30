import axios from 'axios';
import { writeFoodInfo } from './firebaseUtils';

const GROUPME_TOKEN = process.env.REACT_APP_GROUPME_TOKEN;
const GROUPME_GROUP_ID = '104461918';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

let lastFetchedTimestamp = 0; // Keeps track of the last fetched timestamp

// Helper function to capitalize every word in a string
const capitalizeWords = (text) => {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Fetch messages from GroupMe
export const fetchGroupMeMessages = async () => {
  try {
    const response = await axios.get(
      `https://api.groupme.com/v3/groups/${GROUPME_GROUP_ID}/messages?token=${GROUPME_TOKEN}`
    );

    const messages = response.data.response.messages;

    // Filter messages sent after the last fetched timestamp
    const newMessages = messages
      .filter((message) => message.created_at > lastFetchedTimestamp)
      .map((message) => ({
        ...message,
        text: capitalizeWords(message.text || ''), // Capitalize message text
      }));

    // Update the last fetched timestamp
    if (newMessages.length > 0) {
      lastFetchedTimestamp = Math.max(...newMessages.map((msg) => msg.created_at));
    }

    return newMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Helper function to group messages by user and proximity in time
const groupMessagesByUser = (messages, timeWindow = 300) => {
  const groupedMessages = [];
  const userMessages = {};

  messages.forEach((message) => {
    const { user_id, created_at, text } = message;

    if (!userMessages[user_id]) {
      userMessages[user_id] = [];
    }

    const lastMessage = userMessages[user_id].slice(-1)[0];

    // Ensure timestamps are correctly checked in seconds
    if (lastMessage && created_at - lastMessage.created_at <= timeWindow) {
      userMessages[user_id].push({ text, created_at });
    } else {
      if (userMessages[user_id].length > 0) {
        groupedMessages.push(userMessages[user_id]);
      }
      userMessages[user_id] = [{ text, created_at }];
    }
  });

  Object.values(userMessages).forEach((group) => groupedMessages.push(group));
  return groupedMessages;
};

// Function to extract time stamps (e.g., 5:00 PM) from text
const extractTimeFromText = (text) => {
  const timeRegex = /\b\d{1,2}:\d{2}\s?(AM|PM)?\b/i; // Match common time formats
  const match = text.match(timeRegex);
  return match ? match[0] : null; // Return the time or null
};

// OpenAI function to format and extract data
const formatWithOpenAI = async (messages) => {
  try {
    const groupedMessages = groupMessagesByUser(messages);

    const formattedMessages = groupedMessages.map((group) =>
      group.map((msg) => msg.text).join(' ')
    );

    const prompt = `Parse the following messages into structured JSON entries. Each entry must have:
- A required "building" field (location of the food).
- A required "food" field. If not specified, use "Free Food!", otherwise just use the food in the message.
- Optional fields: "room", "time", and "club" (leave blank if missing, with no placeholders).
If multiple messages are grouped together, treat them as one entry:
Messages:
${formattedMessages.join('\n')}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are a parser converting messages into structured JSON for a food list." },
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

    const structuredData = JSON.parse(response.data.choices[0].message.content.trim());

    // Add extracted time from text to the structured data
    structuredData.forEach((entry) => {
      entry.time = entry.time || extractTimeFromText(entry.text || '');
    });

    return structuredData;
  } catch (error) {
    console.error("Error formatting with OpenAI:", error.response?.data || error.message);
    return [];
  }
};

// Function to populate Firebase with parsed food entries from OpenAI
export const populateFirebaseFromGroupMe = async () => {
  const messages = await fetchGroupMeMessages();

  // Get structured data from OpenAI
  const foodEntries = await formatWithOpenAI(messages);

  foodEntries.forEach(async (foodData) => {
    const foodId = Math.random().toString(36).substr(2, 9);
    await writeFoodInfo(foodId, foodData);
  });
};
