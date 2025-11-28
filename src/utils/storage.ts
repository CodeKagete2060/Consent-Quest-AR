export const getProgress = () => {
    const stored = localStorage.getItem('consent_quest_progress');
    return stored ? JSON.parse(stored) : { xp: 0, badges: [], completedQuests: [] };
};

export const saveProgress = (xp: number, badge: string, questId: string) => {
    const current = getProgress();

    if (current.completedQuests.includes(questId)) {
        return current; // Already completed
    }

    const newProgress = {
        xp: current.xp + xp,
        badges: [...current.badges, badge],
        completedQuests: [...current.completedQuests, questId]
    };

    localStorage.setItem('consent_quest_progress', JSON.stringify(newProgress));
    return newProgress;
};
