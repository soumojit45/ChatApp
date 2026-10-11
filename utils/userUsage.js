export const resetUsageIfNeeded = async (user)=>{
    const now = new Date()

    if (now>user.usage.resetAt) {
        user.usage.tokenUsed = 0
        user.usage.resetAt = new Date(Date.now() + 5*60*60*1000)
        await user.save()
    }
}

export const hasTokenLimitExceed = async (user) =>{
    return user.usage.tokenUsed >= user.usage.tokenLimit
}

// export const addUserTokenUsage = async (user, totalTokens) => {
//   user.usage.tokenUsed += totalTokens;
//   user.usage.totalTokenUsed += totalTokens;

//   await user.save();
// };

export const addUserTokenUsage = async (user, totalTokens) => {
    if (!user.usage) {
        user.usage = { tokenUsed: 0, totalTokenUsed: 0 };
    }

    user.usage.tokenUsed += (totalTokens || 0);
    user.usage.totalTokenUsed += (totalTokens || 0);

    // Force Mongoose to track the nested change
    user.markModified('usage');
};