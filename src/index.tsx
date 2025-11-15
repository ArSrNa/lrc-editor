import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./components/ui/shadcn-io/dropzone";
import dayjs from 'dayjs';
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { getRangeWithRadius, jsonToLrc } from "./lrc";
import { createLrcObj } from 'react-lrcplayer'

export interface resultType {
    text: string,
    time: number
}

export default function SingleLineEditor() {
    const [files, setFiles] = useState<File[] | undefined>();
    const [previewSrc, setPreviewSrc] = useState<string | undefined>();
    const [subtitle, setSubtitle] = useState('');
    const [result, setResult] = useState<resultType[]>([]);
    const [lrcResult, setLrcResult] = useState('');

    const [current, setCurrent] = useState(0);

    const [currentTime, setCurrentTime] = useState(0);
    const audioPlayer = useRef<HTMLAudioElement>(null);

    const resultCurrentIndex = useMemo(() => {
        return result.findLastIndex(f => f.time <= currentTime)
    }, [currentTime, result]);

    function onTimeUpdate() {
        if (audioPlayer.current) {
            setCurrentTime(audioPlayer.current.currentTime)
        }
        requestAnimationFrame(onTimeUpdate);
    }


    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            // console.log(current)
            if (current >= subtitle.split('\n').length) return;
            if (!audioPlayer.current.paused) {
                setResult(prev => {
                    const res = [...prev];
                    res[current] = {
                        text: subtitle.split('\n')[current],
                        time: currentTime
                    }
                    return res;
                });
            }
            setCurrent(current => current + 1);
        }
        if (e.key === "ArrowUp") {
            // console.log(current)
            if (current <= 0) return;
            if (!audioPlayer.current.paused) {
                setResult(prev => {
                    const res = [...prev];
                    res.splice(current, 1);
                    return res;
                });
            }
            setCurrent(current => current - 1);
        }
        if (e.key === " ") {
            if (!audioPlayer.current) return;
            if (audioPlayer.current.paused) {
                audioPlayer.current.play();
            } else {
                audioPlayer.current.pause();
            }
        }
    }, [current, subtitle, currentTime]);

    useEffect(() => {
        setLrcResult(jsonToLrc(result));
        localStorage.setItem('result', JSON.stringify(result));
        if (result.length !== 0) localStorage.setItem('result', jsonToLrc(result));
    }, [result]);


    useEffect(() => {
        onTimeUpdate();
        setSubtitle(localStorage.getItem('subtitle') || '');
        setLrcResult(jsonToLrc(JSON.parse(localStorage.result || [])));
    }, []);

    useEffect(() => {
        document.getElementById('key-spy')?.focus();
        document.getElementById('key-spy').addEventListener('keydown', onKeyDown);
        return () => {
            document.getElementById('key-spy').removeEventListener('keydown', onKeyDown);
        }
    }, [current])


    return <div className="flex mx-10 flex-col gap-10">
        <div className="grid grid-cols-2 gap-3 h-90">
            <div className="flex flex-col gap-2">
                <label>上传音频文件</label>
                <Dropzone
                    className="h-80"
                    accept={{ 'audio/*': [] }}
                    maxFiles={1}
                    onDrop={(files) => {
                        console.log(files);
                        setFiles(files);
                        setPreviewSrc(URL.createObjectURL(files[0]));
                    }}
                    onError={console.error}
                    src={files}
                >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                </Dropzone>
            </div>
            <div className="flex flex-col gap-2">
                <div>输入字幕或直接<a className="text-cyan-500 cursor-pointer">上传</a></div>
                <Textarea value={subtitle} onChange={e => {
                    setSubtitle(e.target.value)
                    localStorage.setItem('subtitle', e.target.value);
                }}
                    className="h-80 resize-none scroll-auto"
                    placeholder="输入纯文本字幕" />
            </div>
        </div>

        <div className="flex gap-2 flex-col">
            <div>
                字幕 {current}
                <div className="flex font-[monospace] text-xl mx-2 gap-5">
                    <span>{dayjs.unix(currentTime)?.format('mm:ss.SSS')}</span>
                    <span>{result[resultCurrentIndex]?.text}</span>
                </div>
            </div>

            <SubtitleDisplay subtitle={subtitle} current={current} result={result} />
        </div>

        {files?.[0] && <audio className="w-full" ref={audioPlayer} controls src={previewSrc} />}

        <input className="border h-20 text-center px-3" id="key-spy" placeholder="聚焦在这里，使用下键下一句，上键回退，空格控制播放/暂停" value={''} />

        <Button onClick={() => {
            if (confirm('确定清空字幕？')) {
                setResult([]);
                setCurrent(0);
            }
        }}>清空</Button>

        <Textarea value={lrcResult} onInput={(e) => {
            setLrcResult(e.currentTarget.value);
        }} className="resize-none h-80" />
        <Button onClick={() => {
            setResult(createLrcObj(lrcResult).map(m => ({
                text: m.c,
                time: m.t
            })));
        }}>转换</Button>
    </div >
}

function SubtitleDisplay(props: { subtitle: string, current: number, result: resultType[] }) {
    const { current, result } = props;
    const n = 3;
    const subtitle = props.subtitle?.split('\n');
    function Container({ index, current, item }: { index: number, current: number, item: string | null }) {
        return <div className="grid grid-cols-[10px_70px_auto] gap-5 items-center w-full" id={current === index ? "current-srt" : ''} >
            <div className={current === index ? 'text-green-400' : "text-gray-400"}>{index}</div>
            <div>{dayjs(result?.[index]?.time * 1000 || 0).format('mm:ss.SSS')}</div>
            <span className={current === index ? 'text-xl font-bold' : "text-sm text-gray-400"}>
                {item === null ? <span className="text-indigo-600">无</span> : item}
            </span>
        </div>
    }

    return <div className="flex flex-col gap-2 font-[monospace] bg-gray-200 rounded-md p-2 mx-2 h-80 overflow-x-hidden" id="lrc-container">
        {subtitle.map((item, index) => {
            if (index >= current - n)
                return <Container
                    item={item}
                    key={`subtitle_${index}`}
                    index={index}
                    current={current} />
        })}
    </div>
}