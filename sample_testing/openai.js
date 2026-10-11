import { OpenRouter } from '@openrouter/sdk';
import "dotenv/config"
import readlineSync from 'readline-sync';

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const completion = await client.chat.send({
    chatRequest: {
        model: '~openai/gpt-latest',
        messages: [
            // ...History,
            {
                role: "user",
                content: "do u know me ? "
            }
        ],
    }
});


// History.push({ role: "user", content: question });
// History.push({ role: "assistant", content: completion.choices[0].message.content })

console.log(completion)  
// console.log(completion.choices[0].message.content)  