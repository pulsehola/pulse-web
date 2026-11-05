import { WORDMARK_PATH } from "../wordmark";

// Animación de entrada de la home: el trazo de la P se dibuja, el punto naranja late dos veces
// (como un pulso), aparece "PULSE" y la cortina sube dejando ver la página.
// Es CSS puro: se reproduce aunque el JavaScript tarde en cargar y se retira sola a los 2,1 s.
// Solo la primera visita de cada sesión; tocar la pantalla o pulsar una tecla la salta;
// con "reducir movimiento" no aparece.
const TRAZO = "M10 15.5H13.5A6.25 6.25 0 0 0 13.5 3H5V15";
const S = 24 / 22.25;

const SCRIPT = `(function(){try{var d=document.documentElement;if(location.pathname!=='/'||sessionStorage.getItem('pulse-intro')){d.setAttribute('data-intro','visto');return}sessionStorage.setItem('pulse-intro','1')}catch(e){}
function saltar(){var el=document.getElementById('intro');if(el)el.classList.add('intro-salir')}
document.addEventListener('pointerdown',saltar,{once:true});document.addEventListener('keydown',saltar,{once:true})})();`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div id="intro" className="intro" aria-hidden="true">
        <svg viewBox="0 0 115.62 24" className="intro-logo">
          <g transform={`translate(${(-2.5 * S).toFixed(3)} ${(-1.25 * S).toFixed(3)}) scale(${S.toFixed(4)})`}>
            <path className="intro-trazo" d={TRAZO} pathLength={1} fill="none" stroke="#111111" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle className="intro-onda" cx="5" cy="21" r="2.5" fill="none" stroke="#FF4F00" strokeWidth="0.8" />
            <rect className="intro-punto" x="2.5" y="18.5" width="5" height="5" rx="1" fill="#FF4F00" />
          </g>
          <g className="intro-palabra">
            <path transform="translate(30.96 19.92)" fill="#111111" d={WORDMARK_PATH} />
          </g>
        </svg>
      </div>
    </>
  );
}
