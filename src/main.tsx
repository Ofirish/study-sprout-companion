import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const urlParams = new URLSearchParams(window.location.search);
const initialFilter = urlParams.get('filter') || '';

createRoot(document.getElementById("root")!).render(<App initialFilter={initialFilter} />);
