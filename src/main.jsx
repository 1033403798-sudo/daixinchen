import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './refined.css';
import Ferrofluid from './Ferrofluid';
import Shuffle from './Shuffle';
import BorderGlow from './BorderGlow';
import FerrofluidField from './FerrofluidField';
import ChromaGrid from './ChromaGrid';
import TiltedCard from './TiltedCard';
import CircularGallery from './CircularGallery';
import ConcertNotes from './ConcertNotes';
import TextPressure from './TextPressure';
import BlurText from './BlurText';
import MotionDirector from './MotionDirector';

const MastersMasonry = lazy(() => import('./MastersMasonry'));
const FloatingLinesBackdrop = lazy(() => import('./FloatingLinesBackdrop'));

const Arrow = () => <span className="arrow">↗</span>;
const ferroColors = ['#983b3b', '#bd6161', '#8c7070'];
const lowerFerroColors = ['#a47070', '#a47676', '#b57373'];
const profileCard = [{ image: '/images/dai-xinchen.webp', title: 'DAI XINCHEN', subtitle: 'TENOR · AI DESIGNER', handle: '代欣辰', borderColor: '#c99d5c', gradient: 'linear-gradient(145deg, #6d4935, #17110e)' }];
const stageGallery = [
  { image: '/images/stage-01.png', text: 'STAGE CHECK' }, { image: '/images/stage-02.jpg', text: 'CREATIVE CREW' }, { image: '/images/stage-03.jpg', text: 'LIVE / RED' },
  { image: '/images/stage-04.jpg', text: 'LIVE / GREEN' }, { image: '/images/stage-05.jpg', text: 'LIVE / BLUE' }, { image: '/images/stage-06.jpg', text: 'ON STAGE' }
];
const projects = [
  { no: '01', type: 'STAGIONE CONCERTISTICA 2026', title: 'MUSIC ACADEMY MEETS THE CITY', sub: '2026 年“音乐学院遇见城市”年度系列音乐季', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=85', cls: 'project-echo', collage: true, notes: [
    ['2026 年“音乐学院遇见城市”年度系列音乐季', '作为核心声乐成员，受邀参加由艺术总监 M° Michele Mosa 主持的系列演出。在卡尔塔尼塞塔音乐学院礼拜堂（Cappella del Conservatorio）及城市重要场地进行多场高水平公演。演绎曲目涵盖巴洛克至浪漫主义时期经典作品，重点参与《Scrivimi l’anima: Vincenzo Bellini e le sue Giuditte》（5 月 29 日）及《L’eco del belcanto: un ponte tra le culture》（6 月 10 日）主题音乐会，展现深厚的意式美声（Bel Canto）功底。'],
    ['2026 年国际音乐节（Festa della Musica）特别演出', '受邀参与国际音乐节专题演出，在“声音与实践”及“弦乐与键盘对话”板块担任男高音独唱，展示对巴洛克时期音乐及室内乐的高水平驾驭能力。'],
    ['马西莫歌剧院《AIDA》排练与制作', '2026 年 5 月 16 日，于世界三大歌剧院之一的马西莫歌剧院，与剧院首席男高音歌唱家 Blagoj Nacoski 一同参与歌剧《AIDA》的排练和制作。'],
    ['米兰斯卡拉歌剧院大师班（2025.02）', '入选著名男高音歌唱家 Marco Filippo Romano 声乐大师班，接受为期三天的职业化精修指导，并于汇报演出中获专业认可。'],
    ['Teatro di Rosso 联合音乐会（2025.03）', '受邀与导师 Letizia Colajanni 同台，在 Teatro di Rosso 音乐会中演绎经典歌剧唱段《Vedi quel ruscelletto》。'],
    ['学校年度开放日表演（2025.05）', '受邀作为优秀学生代表演唱歌剧《蝴蝶夫人》经典咏叹调《Addio fiorito asil》。']
  ] },
  { no: '02', type: 'LIVE HOUSE / 商业演出档案', title: 'NIGHTS WITHOUT A NAME', sub: 'R&B · FOLK · HIP-HOP', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=85', cls: 'project-night', gallery: true },
];

function App() {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    let frame = 0;
    const hero = document.querySelector('.hero');
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const stickyMarker = y > window.innerHeight * .85 ? window.innerHeight : 0;
      setScroll(previous => previous === stickyMarker ? previous : stickyMarker);
      hero?.style.setProperty('--hero-shift', `${y * .12}px`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <main>
    <section className="hero" id="home">
      <div className="hero-video hero-portrait" aria-hidden="true"></div>
      <Ferrofluid colors={ferroColors} speed={0.7} scale={1.3} turbulence={1.3} fluidity={0.1} rimWidth={0.2} sharpness={2.5} shimmer={1.5} glow={2} opacity={1} mouseInteraction mouseStrength={1} mouseRadius={0.35} />
      <div className="hero-scan"></div><div className="hero-glow"></div>
      <nav className={scroll > window.innerHeight * .85 ? 'is-sticky' : ''}><a className="logo name-logo" href="#home"><Shuffle className="name-cn" text="代欣辰" duration={0.35} shuffleTimes={1} stagger={0.03} threshold={0.1} triggerOnce triggerOnHover respectReducedMotion scrambleCharset="代欣辰声乐歌剧艺术意大利贝利尼"/><small>DAI XINCHEN</small></a><div className="nav-links"><a href="#about">ABOUT</a><a href="#work">SELECTED WORK</a><a href="#strength">CAPABILITY</a></div><a className="contact-pill" href="#contact">LET'S CONNECT <Arrow /></a></nav>
      <div className="hero-content" style={{ transform: `translateY(${scroll * .12}px)` }}><p className="eyebrow"><i></i> TENOR · AI DESIGNER · BRAND DESIGNER</p><h1><Shuffle text="VOICE" shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} triggerOnce triggerOnHover respectReducedMotion loop={false} loopDelay={0}/><br/><em><Shuffle text="BEYOND" shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} triggerOnce triggerOnHover respectReducedMotion loop={false} loopDelay={0}/></em><br/><Shuffle text="THE STAGE." shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} triggerOnce triggerOnHover respectReducedMotion loop={false} loopDelay={0}/></h1><p className="hero-note">以声乐家的感性，构建 AI 时代的视觉语言。<br/>BASED BETWEEN ITALY &amp; CHINA.</p></div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><div className="scroll-line"></div><span>2023 — 2026</span></div>
    </section>
    <TextPressure target="#contact .footer-center a" text="LET'S MAKE IT RESONATE." minFontSize={34} />
    <Suspense fallback={null}>
      <MastersMasonry />
      <FloatingLinesBackdrop />
    </Suspense>
    <BlurText target=".about-copy h2" text={'让每一次\n表达，有回响。'} delay={75} direction="top" />
    <MotionDirector />

    <div className="lower-fluid"><FerrofluidField colors={lowerFerroColors} speed={0.5} opacity={0.58}/><div className="lower-fluid-content"><section className="about section" id="about"><div className="section-tag">01 / PROFILE</div><BorderGlow className="module-glow profile-glow"><div className="about-grid"><ChromaGrid items={profileCard} className="profile-chroma" radius={260} damping={.45} fadeOut={.6}/><div className="about-copy"><p className="kicker">A HUMANIST IN THE AGE OF AI</p><h2>让每一次<br/><span>表达，有回响。</span></h2><p className="intro">我叫代欣辰，一名正在意大利深造的男高音，也是一名 AI 与品牌设计师。游走于歌剧舞台与数字世界之间，我关注声音的情感张力，也相信设计能为品牌带来独特的共鸣。</p><div className="details"><div><span>LOCATION</span><b>CALTANISSETTA / ITALY</b></div><div><span>LANGUAGES</span><b>中文 · ENGLISH · ITALIANO</b></div><div><span>EMAIL</span><a href="mailto:davideccc1210@outlook.com">DAVIDECCC1210@OUTLOOK.COM</a></div></div></div></div></BorderGlow><BorderGlow className="module-glow stat-glow"><div className="stats"><div><strong>Top<br/>5%</strong><span>专业排名<br/>VOCAL PERFORMANCE</span></div><div><strong>06<sup>+</sup></strong><span>年舞台与创作<br/>EXPERIENCE</span></div><div><strong>03</strong><span>种工作语言<br/>LANGUAGES</span></div><div><strong>AI</strong><span>创意策略与<br/>DESIGN TOOLS</span></div></div></BorderGlow></section>

    <section className="work section" id="work"><div className="work-head"><div><div className="section-tag">02 / SELECTED WORK</div><h2>SELECTED<br/><span>PROJECTS</span></h2></div><p>在音乐、品牌与智能技术的交汇处，<br/>探索可被感知的创意表达。</p></div><div className="project-list">{projects.map((p) => p.gallery ? <section className="stage-gallery-project" key={p.no}><div className="stage-gallery-heading"><span>{p.no} — {p.type}</span><span>DRAG TO EXPLORE →</span></div><CircularGallery items={stageGallery}/><div className="stage-gallery-title"><h3>{p.title}</h3><p>{p.sub}</p></div></section> : <BorderGlow className="project-glow" key={p.no} backgroundColor="#3a3027"><TiltedCard imageSrc={p.image} altText={p.title} mediaContent={p.collage ? <div className="concert-triptych"><img src="/images/concert-city.webp" alt="音乐会城市合影" loading="lazy" decoding="async"/><img src="/images/concert-theatre.webp" alt="歌剧院合影" loading="lazy" decoding="async"/><img src="/images/concert-backstage.webp" alt="舞台后台" loading="lazy" decoding="async"/><ConcertNotes notes={p.notes}/></div> : p.mentors ? <div className="mentor-triptych"><img src="/images/mentor-blagoj.jpg" alt="Blagoj Nacoski"/><img src="/images/mentor-massimo.jpg" alt="Teatro Massimo"/><img src="/images/mentor-letizia.jpg" alt="Letizia Colajanni"/></div> : null} overlayContent={<><div className="project-shade"></div><div className="project-meta"><span>{p.no} — {p.type}</span><span>VIEW CASE <Arrow /></span></div><div className="project-title"><h3>{p.title}</h3><p>{p.sub}</p></div></>}/></BorderGlow>)}</div></section>

    <section className="strength section" id="strength"><div className="section-tag">03 / CAPABILITY</div><div className="strength-intro"><h2>多重语境，<br/><span>同一种敏锐。</span></h2><p>专业训练赋予我对细节、节奏和情感的长期感知；跨学科实践让我能够在复杂问题中找到清晰的表达。</p></div><BorderGlow className="strength-glow"><div className="skill-grid"><article><small>01</small><h3>品牌视觉<br/>BRANDING</h3><p>从策略洞察到视觉系统，构建有记忆点的品牌体验。</p><b>IDENTITY / ART DIRECTION</b></article><article><small>02</small><h3>AI 创意设计<br/>AI CREATIVE</h3><p>熟悉生成式 AI 工具，将技术能力转化为高效的创意生产力。</p><b>CHATGPT / GEMINI / GENERATIVE</b></article><article><small>03</small><h3>声音与影像<br/>SOUND &amp; MOTION</h3><p>掌握音频编辑与视频剪辑，让视觉叙事拥有更完整的感官维度。</p><b>AU / PREMIERE / CAPCUT</b></article><article><small>04</small><h3>舞台表达<br/>PERFORMANCE</h3><p>意式美声训练与舞台经验，带来面对人群时稳定且真诚的沟通。</p><b>TENOR / BEL CANTO</b></article></div></BorderGlow></section>

    <section className="education section"><div className="section-tag">04 / BACKGROUND</div><div className="education-head"><h2>THE CRAFT<br/><span>BEHIND THE VOICE.</span></h2><p>从音乐学院到歌剧舞台，每一步训练都在塑造我对专业、审美与协作的理解。</p></div><BorderGlow className="timeline-glow"><div className="timeline"><article><span>2023 — 2026</span><div><h3>文森佐·贝里尼国立音乐学院</h3><p>声乐表演硕士（歌剧方向） · 意大利卡尔塔尼塞塔</p></div><b>TOP 5%</b></article><article><span>2025 — 2026</span><div><h3>国际音乐季与专业大师班</h3><p>Festa della Musica / Marco Filippo Romano Masterclass</p></div><b>STAGE</b></article><article><span>2020 — 2024</span><div><h3>北京科技大学天津学院</h3><p>音乐表演学士 · 三年院系奖学金</p></div><b>TOP 5%</b></article></div></BorderGlow></section>

    <footer id="contact"><div className="footer-orb"></div><div className="footer-top"><span>05 / CONTACT</span><span>AVAILABLE FOR SELECTIVE COLLABORATIONS</span></div><div className="footer-center"><p>有一个值得被听见的想法？</p><a href="mailto:davideccc1210@outlook.com">LET'S MAKE<br/><em>IT RESONATE.</em> <Arrow /></a></div><div className="footer-bottom"><span>© 2026 DAI XINCHEN</span><div><a href="mailto:davideccc1210@outlook.com">EMAIL</a><a href="#home">BACK TO TOP ↑</a></div><span>ITALY / CHINA</span></div></footer></div></div>
  </main>
}
createRoot(document.getElementById('root')).render(<App />);
