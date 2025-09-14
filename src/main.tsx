import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import Splash from '@/components/Splash'
import { AuthProvider } from '@/hooks/useAuth'
import './index.css'

function Root() {
	const [ready, setReady] = useState(true); // Changed to true to skip splash

	return (
		<>
			{!ready && <Splash onFinish={() => setReady(true)} />}
			{ready && (
				<AuthProvider>
					<App />
				</AuthProvider>
			)}
		</>
	);
}

createRoot(document.getElementById("root")!).render(<Root />);
