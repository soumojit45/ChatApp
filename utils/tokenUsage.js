// export const addChatTokenUsage = async (chat, usage) => {
//     chat.usage.promptTokens += usage.promptTokens;
//     chat.usage.completionTokens += usage.completionTokens;
//     chat.usage.totalTokens += usage.totalTokens;

//     await chat.save();
// };

export const addChatTokenUsage = async (chat, usage) => {
    // 1. Initialize if undefined to prevent crashes
    if (!chat.usage) {
        chat.usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    }

    // 2. Add the tokens
    chat.usage.promptTokens += (usage.promptTokens || 0);
    chat.usage.completionTokens += (usage.completionTokens || 0);
    chat.usage.totalTokens += (usage.totalTokens || 0);

    // 3. Force Mongoose to track the nested change
    chat.markModified('usage'); 
};