import { useEffect, useRef, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./components/ui/shadcn-io/dropzone";
import dayjs from 'dayjs';
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";

interface resultType {
    text: string,
    time: number
}

export default function SingleLineEditor() {
    const [files, setFiles] = useState<File[] | undefined>();
    const [previewSrc, setPreviewSrc] = useState<string | undefined>();
    const [subtitle, setSubtitle] = useState('');
    const result = useRef<resultType[]>([]);

    const [current, setCurrent] = useState(0);

    const [currentTime, setCurrentTime] = useState(0);
    const audioPlayer = useRef<HTMLAudioElement>(null);

    function onTimeUpdate() {
        if (audioPlayer.current) {
            setCurrentTime(audioPlayer.current.currentTime)
        }
        requestAnimationFrame(onTimeUpdate);
    }

    function start() {
        result.current = [];
    }

    function onDownKey() {
        result.current[current] = {
            text: subtitle.split('\n')[current],
            time: currentTime
        }
        setCurrent(current => current + 1);
    }

    useEffect(() => {
        onTimeUpdate();
        //下键下一句
        document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") onDownKey();
        });
        return () => {
            document.removeEventListener("keydown", function (event) {
                console.log(event.code);
            });
        }
    }, [])


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
                <Textarea value={subtitle} onChange={e => setSubtitle(e.target.value)}
                    className="h-80 resize-none scroll-auto"
                    placeholder="输入纯文本字幕" />
            </div>
        </div>

        <div className="flex gap-2 flex-col">
            <div>
                字幕
                <code className="font-[monospace] text-xl mx-2">
                    {dayjs.unix(currentTime).format('mm:ss.SSS')}
                </code>
            </div>

            <div className="font-[monospace] flex flex-col bg-gray-200 rounded-md p-2 mx-2 items-center gap-2">
                <SubtitleDisplay subtitle={subtitle} current={current - 1} className="text-sm text-gray-600" />
                <SubtitleDisplay subtitle={subtitle} current={current} className="text-2xl font-bold" />
                <SubtitleDisplay subtitle={subtitle} current={current + 1} className="text-sm text-gray-600" />
            </div>
        </div>

        {files?.[0] && <audio className="w-full" ref={audioPlayer} controls src={previewSrc} />}
        <Button onClick={start} disabled={!files?.[0]}>开始</Button>
    </div >
}

function SubtitleDisplay(props: { subtitle: string, current: number, className?: string }) {
    const { current, className = "text-sm" } = props;
    const subtitle = props.subtitle?.split('\n');
    return <span className={className}>
        {subtitle?.[current] || <span className="text-indigo-600">无</span>}
    </span>
}