/* eslint eqeqeq: "off" */
import React, { useContext } from 'react'
import Logo from '../components/Logo'
import logoff from '../images/power.svg'
import back from '../images/back.svg'
import foto from '../images/3x4.jpg'
import { Link } from 'react-router-dom'
import Context from '../Context'

function Header({ link, titulo }) {
  // estados globais.
  // recuperando estados globais.
  const {
    nomeusuario,
  } = useContext(Context)

  // renderização do componente.
  return (
    <div
      id="HEADER"
      className="corescura"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '18vh',
        minHeight: 120,
        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{
        display: 'flex', textAlign: 'left',
        flexDirection: 'row', justifyContent: 'flex-start',
        alignItems: window.innerWidth < 426 ? 'center' : 'flex-start', 
        alignSelf: window.innerWidth < 426 ? 'center' : 'flex-start',
        width: '100%'
      }}>
        <div style={{ margin: 10, marginRight: 0, display: window.innerWidth > 400 ? 'flex' : 'none' }}>
          <Logo height={100} width={100}></Logo>
        </div>
        <img
          alt=""
          id="logo"
          src={foto}
          style={{
            display: link === "/prontuario" ? 'flex' : 'none',
            margin: 0,
            marginLeft: 5,
            marginRight: 5,
            padding: 0,
            borderRadius: 5,
            height: 0.15 * window.innerHeight,
          }}
        ></img>
        <div
          className="title1"
          style={{
            flexDirection: 'column',
            height: window.innerWidth < 426 ? '' : '',
            alignSelf: 'center', verticalAlign: 'center',
            justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start',
            textAlign: window.innerWidth < 426 ? 'center' : 'left',
            color: '#ffffff',
            padding: 5,
          }}
        >
          {titulo}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'right',
          margin: 10,
          width: 300,
        }}
      >
        <div
          className="title2"
          style={{
            position: 'sticky',
            justifyContent: 'flex-end', marginRight: 0,
            verticalAlign: 'center',
            color: '#ffffff', textAlign: 'right',
          }}
        >
          {'OLÁ, ' + JSON.stringify(nomeusuario).substring(1, JSON.stringify(nomeusuario).length - 2).split(" ").slice(0, 1)}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <Link
            to={link}
            className="blue-button"
            title="VOLTAR."
            style={{
              width: 50,
              height: 50,
              margin: 2.5,
              padding: 20,
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 5,
                height: 25,
                width: 25,
              }}
            ></img>
          </Link>
          <Link
            to="/"
            className="blue-button"
            title="FAZER LOGOFF."
            style={{
              display: 'flex',
              width: 50,
              height: 50,
              margin: 2.5,
              padding: 20,
            }}
          >
            <img
              alt=""
              src={logoff}
              style={{
                margin: 5,
                height: 25,
                width: 25,
              }}
            ></img>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
