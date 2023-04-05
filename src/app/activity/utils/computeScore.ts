import { DayString, ObjectiveConfig, YearActivity } from '../../models/User';
import { format, getDate, getDaysInMonth, parse } from 'date-fns';

export interface Score {
    emoji: string;
    score: number;
    ratio: number;
    monthRatio: number;
}

export function blankScore(): Score {
  return {
    emoji: ratioToEmoji(NaN),
    score: NaN,
    ratio: NaN,
    monthRatio: NaN,
  };
}

export function computeMonthScore(month: string, config: ObjectiveConfig, activity: YearActivity): Score {
    if (!activity) {
        return blankScore();
    }

    const activeDays = (Object.keys(activity) as DayString[]).filter(day => day.startsWith(month) && activity[day]?.[config.id]);

    if (!activeDays.length) {
        return {
            emoji: ratioToEmoji(NaN),
            score: NaN,
            ratio: NaN,
            monthRatio: NaN,
        };
    }

    const days = getDaysInMonth(parse(month, 'yyyy-MM', 0));
    const daysToCount = format(new Date(), 'yyyy-MM') == month ? getDate(new Date()) : days;

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

    const monthRatio = score / Math.min(config.target, days);
    const ratio = monthRatio * days / daysToCount;

    return {
        emoji: score >= config.target ? '🎉' : ratioToEmoji(ratio),
        score,
        ratio,
        monthRatio,
    };
}

export function computeGroupScore(month: string, data: {
    config: ObjectiveConfig, activity: YearActivity,
}[]): Score {
    const scores = data.map(d => computeMonthScore(month, d.config, d.activity)).filter(s => !isNaN(s.score));

    const score = scores.reduce((a, b) => a + b.score, 0) / scores.length;
    const ratio = scores.reduce((a, b) => a + b.ratio, 0) / scores.length;
    const monthRatio = scores.reduce((a, b) => a + b.monthRatio, 0) / scores.length;

    return {
        emoji: ratioToEmoji(ratio),
        score,
        ratio,
        monthRatio,
    };
}

function ratioToEmoji(ratio: number): string {
    let emoji = '😶';

    if (isNaN(ratio)) {
        return emoji;
    }

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

    return emoji;
}
