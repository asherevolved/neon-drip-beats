import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import Splash from '@/components/Splash'
import './index.css'

function Root() {
	const [ready, setReady] = useState(false);

	return (
		<>
			{!ready && <Splash onFinish={() => setReady(true)} timeout={4500} />}
			{ready && <App />}
		</>
	);
}

createRoot(document.getElementById("root")!).render(<Root />);
