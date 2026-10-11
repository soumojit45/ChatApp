import openRouter from "../config/openRouter.js";

export const generateAIResponse = async ({ model, messages }) => {
    const completion = await openRouter.chat.send({
        chatRequest: {
            model,
            messages
        }
    });

    const aiReply = completion.choices[0]?.message?.content;
    if (!aiReply) {
        throw new Error("AI response is empty");
    }

    const promptTokens = completion.usage?.promptTokens || completion.usage?.prompt_tokens || 0;
    const completionTokens = completion.usage?.completionTokens || completion.usage?.completion_tokens || 0;

    return {
        aiReply, // Consistent naming
        usage: {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens
        }
    };
};