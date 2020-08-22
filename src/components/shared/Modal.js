import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import gsap from 'gsap';

import Backdrop from './Backdrop';

const ModalOverlay = ({ className, style, header, headerClass, onSubmit, contentClass, children, footerClass, footer }) => {
  const content = (
    <div className={`modal ${className ? className : ''}`} style={style}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={onSubmit ? onSubmit : event => event.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>
          {children}
        </div>
        <footer className={`modal__footer ${footerClass}`}>
          {footer}
        </footer>
      </form>
    </div>
  )
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

function Modal(props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (props.show) {
      setIsMounted(true)
    } else {
      if (isMounted) {
        gsap.fromTo('.modal', .5, { scale: 1, x: '-50%', y: '-50%' }, { scale: 0, y: '-50%', x: '-50%', autoAlpha: 0, ease: 'power2.out', onComplete: () => setIsMounted(false) })
      }
    }
  }, [props.show, isMounted])

  useEffect(() => {
    if (isMounted) {
      gsap.fromTo('.modal', .5, { scale: 0, y: '-50%', x: '-50%' }, { scale: 1, y: '-50%', x: '-50%', autoAlpha: 1, ease: 'power2.out' })
    }
  }, [isMounted])
  return (
    <>
      <Backdrop show={props.show} onClick={props.onCancel} />
      {isMounted ? <ModalOverlay {...props} /> : null}
    </>
  )
}

export default Modal
