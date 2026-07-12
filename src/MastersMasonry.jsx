import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Masonry from './Masonry';

const masters = [
  { id: '01', img: '/images/master-01.png', alt: 'Britten concert poster', caption: 'Britten · Seven Sonnets' },
  { id: '02', img: '/images/master-02.png', alt: 'Teatro Massimo poster', caption: 'Teatro Massimo · La Navarraise' },
  { id: '03', img: '/images/master-03.png', alt: 'Blagoj Nacoski interview', caption: 'La Platea · Artist portrait' },
  { id: '04', img: '/images/master-04.png', alt: 'Opera stage review', caption: 'Première Loge · Opera review' },
  { id: '05', img: '/images/master-05.png', alt: 'Concert portrait', caption: 'Concert memories' },
  { id: '06', img: '/images/master-06.jpg', alt: 'OperaClick review', caption: 'OperaClick · Critical acclaim' },
  { id: '07', img: '/images/master-07.jpg', alt: 'Letizia Colajanni profile', caption: 'Letizia Colajanni · Vocal mentor' }
];

export default function MastersMasonry() {
  const [host, setHost] = useState(null);
  useEffect(() => {
    const nightProject = document.querySelector('.stage-gallery-project');
    if (!nightProject || nightProject.nextElementSibling?.classList.contains('masters-masonry-host')) return undefined;
    const element = document.createElement('div');
    element.className = 'masters-masonry-host';
    nightProject.insertAdjacentElement('afterend', element);
    setHost(element);
    return () => element.remove();
  }, []);
  if (!host) return null;
  return createPortal(<section className="masters-section" aria-label="我的大师"><header><p>03 / MASTERS &amp; MENTORS</p><h2>我的大师</h2><span>OPERA · BEL CANTO · STAGE CRAFT</span></header><Masonry items={masters} /></section>, host);
}
