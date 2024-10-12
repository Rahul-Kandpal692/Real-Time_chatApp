import React from 'react'
import Particles  from "react-tsparticles"
import particlesConfig from './config/particlesConfig'
const ParticlesBackground = () => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: -1 }}>
    <Particles params={particlesConfig}></Particles>
    </div>
      

  )
}

export default ParticlesBackground
