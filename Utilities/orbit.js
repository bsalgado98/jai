const orbit = (radius, orbitSpeed) => {
    return {
      x: (Math.sin((Date.now()%orbitSpeed)/orbitSpeed * Math.PI * 2) * radius),
      y: (Math.cos((Date.now()%orbitSpeed)/orbitSpeed * Math.PI * 2) * radius),
      z: (Math.sin((Date.now()%orbitSpeed)/orbitSpeed * Math.PI * 2) * radius)
    };
  }
  export default orbit