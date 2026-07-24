import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Event Management System</h1>
          <p>Welcome to the Event Management System</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="home-page">
      <h2>Home</h2>
      <p>This is the home page of the Event Management System.</p>
    </div>
  )
}

export default App
