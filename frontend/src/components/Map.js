import React, { useRef, useEffect } from 'react'

function Map({ className, style, zoom, center }) {
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker({ position: center, map: map })
  }, [center, zoom])

  return (
    <div ref={mapRef} className={`map ${className}`} style={style}>
    </div>
  )
}

export default Map
