export const getProgress = () => {
    const stored = localStorage.getItem('consent_quest_progress');
    return stored ? JSON.parse(stored) : { xp: 0, badges: [], completedQuests: [], generatedCards: [] };
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

export const saveLastRoute = (route: string) => {
    localStorage.setItem('consent_quest_last_route', route);
};

export const getLastRoute = () => {
    return localStorage.getItem('consent_quest_last_route') || '/';
};

export const getLevel = (xp: number) => {
    // Simple level calculation: every 100 XP = 1 level
    return Math.floor(xp / 100) + 1;
};

export const markCardGenerated = (badge: string) => {
    const current = getProgress();
    if (!current.generatedCards.includes(badge)) {
        const newProgress = {
            ...current,
            generatedCards: [...current.generatedCards, badge]
        };
        localStorage.setItem('consent_quest_progress', JSON.stringify(newProgress));
    }
};
