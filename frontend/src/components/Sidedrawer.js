import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import gsap from 'gsap';

function Sidedrawer({ children, isSidedrawerOpen, onClick }) {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isSidedrawerOpen) {
      setIsMounted(true)
    }
    else {
      if (isMounted) {
        gsap.to('.side-drawer', 1, { x: '-100%', ease: 'power2.out', onComplete: () => setIsMounted(false) })
      }
    }
  }, [isSidedrawerOpen, isMounted])

  useEffect(() => {
    if (isMounted) {
      gsap.to('.side-drawer', 1, { x: 0, ease: 'power2.out' })
    }
  }, [isMounted])

  const content = isMounted ? <aside onClick={onClick} className='side-drawer'>{children}</aside> : null;

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
}

export default Sidedrawer
