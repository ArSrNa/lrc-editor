import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Navbar1 } from './components/navbar1'
import ErrorPage from './error'
import SingleLineEditor from '.'

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
    </>
  )
}

export default App
