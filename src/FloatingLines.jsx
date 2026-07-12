import { useEffect, useRef } from 'react';
import { Clock, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from 'three';

const vertexShader = `void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader = `
precision highp float;
uniform float time; uniform vec2 resolution; uniform vec2 mouse; uniform float influence;
uniform vec3 colorA; uniform vec3 colorB; uniform vec3 colorC;
float wave(vec2 uv,float offset,float width){float y=sin(uv.x*1.3+offset+time*.18)*.16+sin(uv.x*.55-offset*.7+time*.1)*.11;return width/(abs(uv.y-y)+.026);}
void main(){vec2 base=(gl_FragCoord.xy*2.0-resolution.xy)/resolution.y;base.y*=-1.;vec2 m=(mouse*2.0-resolution.xy)/resolution.y;m.y*=-1.;float a=-.16;vec2 uv=mat2(cos(a),-sin(a),sin(a),cos(a))*base;m=mat2(cos(a),-sin(a),sin(a),cos(a))*m;vec2 delta=uv-m;float bend=exp(-dot(delta,delta)*2.35)*influence;float ripple=sin(length(delta)*20.0-time*3.2)*bend*.035;uv.y+=(m.y-uv.y)*bend*.92+ripple;uv.x+=(m.x-uv.x)*bend*.18;float a2=.72;vec2 uv2=mat2(cos(a2),-sin(a2),sin(a2),cos(a2))*base;vec3 col=vec3(.062,.041,.045);for(int i=0;i<15;i++){float f=float(i);float t=f/14.;vec3 tint=mix(colorA,colorB,t);tint=mix(tint,colorC,sin(f*1.7)*.16+.16);float mainLine=wave(uv+vec2(0.,(t-.5)*1.55),f*.48,.0095);float backLine=wave(uv2+vec2(0.,(t-.5)*2.1),f*.36,.0045);col+=tint*(mainLine*.12+backLine*.025);}float glow=exp(-length(uv-vec2(.18,-.05))*1.2);float cursorGlow=exp(-dot(delta,delta)*4.2)*influence;col+=colorB*glow*.08+mix(colorB,colorA,.55)*cursorGlow*.19;gl_FragColor=vec4(col,1.0);}`;

const color = hex => new Vector3(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);

export default function FloatingLines({ interactive = true, linesGradient = ['#ffe2a8', '#c67632', '#5b3026'] }) {
  const root = useRef(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return undefined;
    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    container.appendChild(renderer.domElement);
    const scene = new Scene(); const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1); camera.position.z = 1;
    const uniforms = { time: { value: 0 }, resolution: { value: new Vector2(1, 1) }, mouse: { value: new Vector2(-999, -999) }, influence: { value: 0 }, colorA: { value: color(linesGradient[0]) }, colorB: { value: color(linesGradient[1]) }, colorC: { value: color(linesGradient[2]) } };
    const geometry = new PlaneGeometry(2, 2); const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader }); scene.add(new Mesh(geometry, material));
    const clock = new Clock(); let targetMouse = new Vector2(-999, -999); let targetInfluence = 0; let isVisible = false; let frame = 0;
    const resize = () => { const width = container.clientWidth || 1; const height = container.clientHeight || 1; const dpr = renderer.getPixelRatio(); const scale = Math.min(1, Math.sqrt(1800000 / Math.max(width * height * dpr * dpr, 1))); renderer.setSize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), false); uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height); };
    const onMove = event => { if (!isVisible) return; const rect = container.getBoundingClientRect(); const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom; if (!inside) { targetInfluence = 0; return; } const scaleX = renderer.domElement.width / rect.width; const scaleY = renderer.domElement.height / rect.height; targetMouse.set((event.clientX - rect.left) * scaleX, (rect.height - (event.clientY - rect.top)) * scaleY); targetInfluence = 1; };
    const onLeave = () => { targetInfluence = 0; };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    if (interactive) { window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('blur', onLeave); }
    const loop = () => { if (!isVisible) { frame = 0; return; } uniforms.time.value = clock.getElapsedTime(); uniforms.mouse.value.lerp(targetMouse, .085); uniforms.influence.value += (targetInfluence - uniforms.influence.value) * .08; renderer.render(scene, camera); frame = requestAnimationFrame(loop); };
    const start = () => { if (isVisible && !frame) frame = requestAnimationFrame(loop); };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; targetInfluence = 0; };
    const visibilityObserver = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting && document.visibilityState === 'visible'; if (isVisible) start(); else stop(); }, { rootMargin: '120px 0px', threshold: 0 });
    const onVisibility = () => { isVisible = document.visibilityState === 'visible' && container.getBoundingClientRect().bottom > -120 && container.getBoundingClientRect().top < window.innerHeight + 120; if (isVisible) start(); else stop(); };
    visibilityObserver.observe(container); document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); observer.disconnect(); visibilityObserver.disconnect(); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pointermove', onMove); window.removeEventListener('blur', onLeave); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [interactive, linesGradient]);
  return <div ref={root} className="floating-lines-container" aria-hidden="true" />;
}
