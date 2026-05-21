/** Evita flash de tema incorrecto antes de hidratar React. */
export function ThemeScript() {
  const script = `(function(){try{var k='site-theme';var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
