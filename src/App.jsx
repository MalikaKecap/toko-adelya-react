import { useEffect, useRef } from 'react';
import { bodyClass, markup, legacyScript } from './legacy-app.js';
import './app.css';

export default function App() {
  const hostRef = useRef(null);

  useEffect(() => {
    document.body.className = bodyClass;
    hostRef.current.innerHTML = markup;

    const script = document.createElement('script');
    script.dataset.posRuntime = 'true';
    script.textContent = legacyScript;
    document.body.appendChild(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    return () => script.remove();
  }, []);

  return <div ref={hostRef} className="contents" />;
}
