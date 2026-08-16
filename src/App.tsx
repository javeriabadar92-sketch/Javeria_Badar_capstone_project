import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Chat from './pages/Chat';
import Features from './pages/Features'
import HealthCheck from './pages/HealthCheck'
import KanbanBoard from './pages/KanbanBoard'
import Notes from './pages/Notes'
import Overview from './pages/Overview'
import Requirements from './pages/Requirements'
import Roadmap from './pages/Roadmap'
import UserStories from './pages/UserStories'
import PlaygroundPage from './playground/PlaygroundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/user-stories" element={<UserStories />} />
        <Route path="/features" element={<Features />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="chat" element={<Chat />} />
        <Route path="/health-check" element={<HealthCheck />} />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Route>
    </Routes>
  )
}

export default App
