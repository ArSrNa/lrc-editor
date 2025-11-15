export function parseLrc(lrcText: string): {
    meta: {
        [key: string]: string;
    },
    lines: {
        time: number;
        text: string;
    }[]
} {
    const lrc = {
        meta: {}, // 存储头部信息（如标题、歌手）
        lines: [] // 存储歌词行 { time: 毫秒, text: 歌词 }
    };

    // 按行分割歌词文本（兼容 Windows 和 Unix 换行符）
    const lines = lrcText.split(/\r?\n/);

    // 正则表达式：匹配时间标签 [mm:ss.ms]
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    // 正则表达式：匹配头部信息 [key:value]
    const metaRegex = /^\[(\w+):(.+)\]$/;

    lines.forEach(line => {
        // 跳过空行
        if (!line.trim()) return;

        // 解析头部信息（如 [ti:xxx]）
        const metaMatch = line.match(metaRegex);
        if (metaMatch) {
            const [, key, value] = metaMatch;
            lrc.meta[key] = value.trim();
            return;
        }

        // 提取当前行的所有时间标签
        const timeMatches = [...line.matchAll(timeRegex)];
        if (!timeMatches.length) return;

        // 提取歌词内容（去掉所有时间标签后的部分）
        const text = line.replace(timeRegex, '').trim();

        // 解析每个时间标签为毫秒，并添加到歌词行
        timeMatches.forEach(match => {
            const [, mm, ss, ms] = match;
            // 转换为毫秒（mm*60*1000 + ss*1000 + ms，注意ms可能是2位或3位）
            const time = Number(mm) * 60 * 1000 + Number(ss) * 1000 + Number(ms);
            lrc.lines.push({ time, text });
        });
    });

    // 按时间升序排序歌词行
    lrc.lines.sort((a, b) => a.time - b.time);

    return lrc;
}