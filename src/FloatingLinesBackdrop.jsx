import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FloatingLines from './FloatingLines';
const warmLineGradient = ['#ffe2a8', '#c67632', '#5b3026'];

export default function FloatingLinesBackdrop() {
  const [hosts, setHosts] = useState([]);
  useEffect(() => {
    const sections = document.querySelectorAll('.lower-fluid-content > .section, .lower-fluid-content > footer');
    const created = Array.from(sections).map((section, index) => {
      const element = document.createElement('div');
      element.className = 'floating-lines-host';
      element.dataset.floatingPage = String(index);
      section.prepend(element);
      return element;
    });
    setHosts(created);
    return () => created.forEach(element => element.remove());
  }, []);
  return hosts.map((host, index) => createPortal(<FloatingLines interactive linesGradient={warmLineGradient} />, host, `floating-page-${index}`));
}
