import dayjs from "dayjs";
import type { resultType } from ".";

export function jsonToLrc(json: resultType[]): string {
    return json.map(item => `[${dayjs(item.time * 1000).format('mm:ss.SSS').substring(0, 8)}]${item.text}`).join('\n')
}


/**获取半径为n的元素内容 */
export function getRangeWithRadius<T>(arr: T[], i: number, n: number): (T | null)[] {
    // 计算起始索引（i - n）和结束索引（i + n）
    const start = i - n;
    const end = i + n;

    // 生成从 start 到 end 的索引数组，并映射对应值（越界则为 null）
    return Array.from({ length: end - start + 1 }, (_, index) => {
        const currentIndex = start + index;
        // 检查索引是否在数组有效范围内
        return currentIndex >= 0 && currentIndex < arr.length
            ? arr[currentIndex]
            : null;
    });
}