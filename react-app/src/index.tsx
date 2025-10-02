import { createRoot } from 'react-dom/client'; 

import App from './App';

const c = document.getElementById('root')!; 
const r = createRoot(c); r.render(<App />);