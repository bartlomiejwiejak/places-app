import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import gsap from 'gsap';

function Backdrop({ onClick, show }) {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (show) {
      setIsMounted(true);
    }
    else {
      if (isMounted) {
        gsap.to('.backdrop', .5, { autoAlpha: 0, ease: 'power2.out', onComplete: () => setIsMounted(false) })
      }
    }
  }, [show, isMounted])

  useEffect(() => {
    if (isMounted) {
      gsap.to('.backdrop', .5, { autoAlpha: 1, ease: 'power2.out' })
    }
  }, [isMounted])

  return ReactDOM.createPortal(
    isMounted && <div onClick={onClick} className="backdrop"></div>,
    document.getElementById('backdrop-hook')
  )
}

export default Backdrop
