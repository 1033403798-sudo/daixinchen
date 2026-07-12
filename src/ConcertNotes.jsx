import { useState } from 'react';
import LineSidebar from './LineSidebar';

export default function ConcertNotes({ notes }) {
  const [active, setActive] = useState(0);
  return <article className="concert-notes concert-notes-sidebar"><p className="concert-notes-kicker">CONCERT NOTES / 2025—2026</p><div className="concert-notes-layout"><LineSidebar items={notes.map(([heading]) => heading)} defaultActive={0} onItemHover={setActive}/><section className="concert-note-detail"><h4>{notes[active][0]}</h4><p>{notes[active][1]}</p></section></div></article>;
}
