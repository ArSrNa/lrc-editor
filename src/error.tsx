import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate()
    return <div className="flex flex-col items-center justify-center gap-3 h-[60vh]">
        <img src="https://www.arsrna.cn/images/error.png" className="w-30" />
        <h1 className="text-3xl font-extrabold">前面的区域，以后再来探索吧？</h1>
        <pre>
            访问页面
            <code className="text-red-500 mx-1 px-2 bg-gray-200 rounded-md">{location.pathname}</code>
            不存在，请检查路径是否正确
        </pre>
        <Separator />
        <Button onClick={() => navigate('/')}>返回首页</Button>
    </div>
}