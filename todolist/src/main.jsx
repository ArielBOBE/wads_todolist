import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Header from './components/header.jsx'

// const banner = document.getElementById('header');
// const header = createRoot(banner);

const mainDiv = document.getElementById('root');

const root = createRoot(mainDiv);


root.render(<App />)
// header.render(<Header />)

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
