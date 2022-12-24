import React, { useState, useContext, useCallback } from 'react';
import Context from '../Context';

// componente visual (não setável).
function AptIVCF() {
  const {
    // APT IVCF / curva de Moraes.
    ivcf, setivcf,
  } = useContext(Context)

  return (
    <div id="IVCF" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div id="título"
        className="title4">FRAGILIDADE CLINICO-FUNCIONAL
      </div>
      <div id="fundo"
        style={{
          opacity: 1,
          position: 'relative',
          //width: '70vw',
          height: window.innerWidth < 400 ? '20vw' : '',
          margin: 15,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f5b041',
          borderRight: '70vw solid transparent',
          borderBottom: '10vw solid #52be80',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          display: window.innerWidth > 400 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
        }}>
        <div style={{ position: 'absolute', left: '3vw', top: '3.5vw', color: '#ffffff' }} className="title2center">ENVELHECIMENTO FISIOLÓGICO (SENESCÊNCIA)</div>
        <div style={{ position: 'absolute', left: '56vw', top: '1vw', color: '#ffffff' }} className="title2center">ENVELHECIMENTO PATOLÓGICO (SENILIDADE)</div>
        <button className="green-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '-0.7vw', left: '2vw'
        }}>
          01
        </button>
        <button className="green-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '0.3vw', left: '9vw'
        }}>
          02
        </button>
        <button className="green-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '1.3vw', left: '16vw'
        }}>
          03
        </button>
        <button className="yellow-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '2.3vw', left: '23vw'
        }}>
          04
        </button>
        <button className="yellow-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '3.3vw', left: '30vw'
        }}>
          05
        </button>
        <button className="red-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '4.3vw', left: '37vw'
        }}>
          06
        </button>
        <button className="red-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '5.3vw', left: '44vw'
        }}>
          07
        </button>
        <button className="red-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '6.3vw', left: '51vw'
        }}>
          08
        </button>
        <button className="red-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '7.3vw', left: '58vw'
        }}>
          09
        </button>
        <button className="red-button" style={{
          position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
          borderRadius: 50, top: '8.3vw', left: '65vw'
        }}>
          10
        </button>
      </div>
      <div id="estratos"
        style={{
          position: 'relative',
          width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <div
          className={ivcf < 4 ? "green-button" : ivcf > 3 && ivcf < 6 ? "yellow-button" : "red-button"}
          style={{
            display: window.innerWidth > 400 ? 'none' : 'flex',
            borderRadius: 50, height: '20vw', width: '20vw',
            borderWidth: 5, borderColor: '#f2f2f2', borderStyle: 'solid', boxShadow: 'none', 
            position: 'absolute', top: 0, bottom: 0, left: 0,
          }}
        >
          <div>IVCF</div>
          <div style={{ fontSize: 20 }}>{ivcf}</div>
        </div>
        <button className="green-button"
          style={{
            width: window.innerWidth > 400 ? '25%' : '70vw',
            height: window.innerWidth > 400 ? 100 : '20vw',
            display: window.innerWidth > 400 || (window.innerWidth < 400 && ivcf < 4) ? 'flex' : 'none',
            opacity: ivcf < 4 ? 1 : 0.3, padding: 10,
            flexDirection: 'column', justifyContent: 'center',
            marginLeft: window.innerWidth > 400 ? '' : 50,
          }}>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>IDOSO ROBUSTO</div>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>AUSÊNCIA DE DECLÍNIO FUNCIONAL</div>
        </button>
        <button className="yellow-button"
          style={{
            width: window.innerWidth > 400 ? '20%' : '70vw',
            height: window.innerWidth > 400 ? 100 : '20vw',
            display: window.innerWidth > 400 || (window.innerWidth < 400 && ivcf > 3 && ivcf < 6) ? 'flex' : 'none',
            opacity: ivcf > 3 && ivcf < 6 ? 1 : 0.3, padding: 10,
            flexDirection: 'column', justifyContent: 'center',
            marginLeft: window.innerWidth > 400 ? '' : 50,
          }}>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>IDOSO EM RISCO DE FRAGILIZAÇÃO</div>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>DECLÍNIO FUNCIONAL IMINENTE</div>
        </button>
        <button className="red-button"
          style={{
            width: window.innerWidth > 400 ? '45%' : '70vw',
            height: window.innerWidth > 400 ? 100 : '20vw',
            display: window.innerWidth > 400 || (window.innerWidth < 400 && ivcf > 5) ? 'flex' : 'none',
            opacity: ivcf > 5 ? 1 : 0.3, padding: 10,
            flexDirection: 'column', justifyContent: 'center',
            marginLeft: window.innerWidth > 400 ? '' : 50,
          }}>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>IDOSO FRÁGIL</div>
          <div className="title2center" style={{ color: '#ffffff', margin: 0, padding: 0 }}>DECLÍNIO FUNCIONAL ESTABELECIDO</div>
        </button>
      </div >
    </div >
  )
}

export default AptIVCF;