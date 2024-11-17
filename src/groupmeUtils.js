import axios from 'axios';
import { writeFoodInfo } from './firebaseUtils';

const GROUPME_TOKEN = '9ICAEtyzcf2UyUvXgFVDZ6TsuvfciXaccXyQzlR4';
const GROUPME_GROUP_ID = '104461918';
const OPENAI_API_KEY = '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';

// Fetch messages from GroupMe
export const fetchGroupMeMessages = async () => {
  try {
    const response = await axios.get(`https://api.groupme.com/v3/groups/${GROUPME_GROUP_ID}/messages?token=${GROUPME_TOKEN}`);
    const messages = response.data.response.messages;
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Helper function to group messages by user and proximity in time
const groupMessagesByUser = (messages) => {
  const groupedMessages = [];
  const userMessages = {};

  messages.forEach((message) => {
    const { user_id, created_at, text } = message;

    if (!userMessages[user_id]) {
      userMessages[user_id] = [];
    }

    const lastMessage = userMessages[user_id].slice(-1)[0];

    // Group messages if they are within 5 minutes of each other
    if (lastMessage && created_at - lastMessage.created_at <= 300) {
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
- Optional fields: "room", "time", and "club" (leave empty if missing, with no placeholders).
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

