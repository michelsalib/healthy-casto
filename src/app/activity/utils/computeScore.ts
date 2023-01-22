import { DayString, ObjectiveConfig, YearActivity } from '../../models/User';
import { getDaysInMonth, parse } from 'date-fns';

export function computeMonthScore(month: string, config: ObjectiveConfig, activity: YearActivity): {
    emoji: string,
    score: number,
    ratio: number,
} {
    if (!activity) {
        return {
            emoji: '😶',
            score: NaN,
            ratio: NaN,
        };
    }

    const activeDays = (Object.keys(activity) as DayString[]).filter(day => day.startsWith(month) && activity[day]?.[config.id]);
    const days = getDaysInMonth(parse(month, 'yyyy-MM', 0));

    const score = activeDays
        .reduce((r, c) => {
            const act = activity[c]?.[config.id];

            if (act == '🟩') {
                return ++r;
            }

            if (act == '🟧') {
                return r + config.averageValue;
            }

            return r;
        }, 0);

    const ratio = score * days / activeDays.length / Math.min(config.target, days);

    let emoji = '😶';
    if (ratio < 0.8) {
        emoji = '😩';
    }
    else if (ratio < 1) {
        emoji = '😟';
    }
    else if (ratio < 1.1) {
        emoji = '🙂';
    }
    else if (ratio < 1.2) {
        emoji = '😀';
    }
    else if (ratio >= 1.2) {
        emoji = '🤩';
    }

    return {
        emoji,
        score,
        ratio,
    };
}
