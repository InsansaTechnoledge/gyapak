const responses = {
    // General greetings with more variety
    "hi": ["Hello there! How can I assist you today?", "Hi! What can I help you with?", "Hello! Ready to help!"],
    "hello": ["Hi there! How may I help you?", "Hello! What brings you here today?", "Greetings! How can I assist?"],
    "hey": ["Hey! How can I help?", "Hello there! What's on your mind?", "Hi! Ready to assist you!"],
    "hiya": ["Hello! How are you today?", "Hi there! Need any help?", "Hey! What can I do for you?"],

    // Time-based greetings
    "good morning": ["Good morning! How can I brighten your day?", "Morning! Ready to help you start the day!", "Good morning! What's on the agenda?"],
    "good afternoon": ["Good afternoon! How may I assist you?", "Afternoon! What can I help you with?", "Good afternoon! Ready to help!"],
    "good evening": ["Good evening! How can I help?", "Evening! What brings you here?", "Good evening! How may I assist?"],

    // How are you variations with more personality
    "how are you": ["I'm functioning perfectly! Thanks for asking. How can I help?", "I'm great and ready to assist! What's on your mind?", "All systems running smoothly! What can I do for you?"],
    "how are you doing": ["I'm doing great! Ready to help with whatever you need!", "Feeling fantastic and ready to assist! What's up?", "Operating at 100%! What can I help with?"],
    "whats up": ["Just here to help! What's on your mind?", "Ready to assist! What do you need?", "All set to help you out! What's up with you?"],

    // Bot identity questions with varied responses
    "what is your name": ["I'm ChatAssistant, your friendly AI helper!", "You can call me ChatAssistant! How can I help?", "I'm ChatAssistant, ready to assist!"],
    "who are you": ["I'm ChatAssistant, an AI designed to help you!", "I'm your friendly AI assistant! What can I do for you?", "I'm ChatAssistant, here to make your day easier!"],
    "what can you do": ["I can help with questions, tasks, and conversations! What do you need?", "I'm here to assist with various tasks. What's on your mind?", "I can help with information, answers, and more! What interests you?"],

    // Humor and entertainment
    "tell me a joke": [
        "Why don't programmers like nature? It has too many bugs!",
        "What did the JSON say to the database? 'I'll callback later!'",
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "What do you call a programmer from Finland? Nerdic!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!"
    ],
    "make me laugh": [
        "Why do Java developers wear glasses? Because they don't C#!",
        "What's a programmer's favorite place? The Cookie store!",
        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
        "Why was six afraid of seven? Because 7 8 9!"
    ],

    // Help and support
    "help": ["What do you need help with?", "I'm here to help! What's the issue?", "How can I assist you today?"],
    "i need help": ["I'm here to help! What's going on?", "What kind of help do you need?", "Let me know what's troubling you!"],
    "can you help me": ["Of course! What do you need help with?", "I'll do my best to help! What's the matter?", "Sure thing! What's the issue?"],

    // Appreciation responses
    "thank you": ["You're welcome! Anything else you need?", "Happy to help! Need anything else?", "Anytime! Let me know if you need more assistance!"],
    "thanks": ["You're welcome! What else can I do for you?", "No problem! Need anything else?", "Glad to help! Anything else?"],

    // Farewells with more variety
    "bye": ["Goodbye! Have a great day!", "See you later! Take care!", "Bye! Come back anytime!"],
    "goodbye": ["Take care! Have a wonderful day!", "Goodbye! Hope to chat again soon!", "See you! Have a great time!"],
    "see you later": ["Looking forward to our next chat! Take care!", "See you! Have a fantastic day!", "Bye for now! Come back anytime!"],
    "take care": ["You too! Have a great day ahead!", "Take care! Hope to help you again soon!", "You as well! Come back anytime!"],

    // Error handling and confusion
    "i don't understand": ["Let me try to explain differently. What's confusing?", "I'll do my best to clarify. What part is unclear?", "Maybe I can explain it another way. What's troubling you?"],
    "what": ["Could you please elaborate?", "Need me to clarify something?", "What would you like to know more about?"],
    "huh": ["Seems like there might be some confusion. How can I clarify?", "Let me know what's unclear!", "Would you like me to explain differently?"],

    // Small talk
    "im bored": ["Let's chat! What interests you?", "How about a fun fact or a joke?", "I know lots of interesting things! What would you like to talk about?"],
    "tell me something interesting": [
        "Did you know that honey never spoils? Archaeologists found 3000-year-old honey in Egyptian tombs!",
        "The first computer programmer was a woman named Ada Lovelace!",
        "There are more possible iterations of a game of chess than there are atoms in the universe!"
    ],

    // Emergency responses
    "emergency": ["If this is a real emergency, please contact emergency services immediately!", "Please call your local emergency number if you need immediate help!", "This is serious - please contact professional emergency services right away!"],

    // Default response for unrecognized inputs
    "default": ["I'm not sure I understand. Could you rephrase that?", "I'm still learning! Could you try asking differently?", "I didn't quite catch that. Could you explain more?"]
};

// Make sure all inputs are case-insensitive
const processCaseInsensitiveResponses = () => {
    const processedResponses = {};
    for (let key in responses) {
        // Convert all variations of the key to lowercase
        const lowerKey = key.toLowerCase();
        const upperKey = key.toUpperCase();
        const titleKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

        processedResponses[lowerKey] = responses[key];
        processedResponses[upperKey] = responses[key];
        processedResponses[titleKey] = responses[key];
    }
    return processedResponses;
};

const getResponse = (input) => {
    const responses = processCaseInsensitiveResponses();
    const response = responses[input.toLowerCase()] || responses["default"];
    return Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
};

export { responses, getResponse };