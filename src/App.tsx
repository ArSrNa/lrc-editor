import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Navbar1 } from './components/navbar1'
import ErrorPage from './error'
import SingleLineEditor from '.'
import { Separator } from './components/ui/separator'

function App() {

  return (
    <>
      <Navbar1 />
      <div className="mt-[80px]">
        <Routes>
          <Route path="/" element={<SingleLineEditor />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

      <footer className="flex items-center justify-center gap-2 py-10 text-gray-500">
        <a href='https://www.arsrna.cn' target='_blank'>Powered by Ar-Sr-Na</a>
        <Separator orientation="vertical" />
        <a href='https://beian.miit.gov.cn' target='_blank'>沪ICP备2023039698号-1</a>
      </footer>
    </>
  )
}

export default App
