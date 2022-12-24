/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';

function Modal({ valor, mensagem, codigo }) {
  const [viewtoast, setviewtoast] = useState(0);
  useEffect(() => {
    setviewtoast(valor);
  }, [valor])

  if (viewtoast === 1) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div
            className="secondary"
            style={{
              alignItems: 'center',
              textAlign: 'center',
              padding: 25,
              minHeight: 50,
              maxHeight: 300,
              minWidth: 100,
              maxWidth: 300,
              color: '#1f7a8c',
              fontWeight: 'bold',
            }}>
            {mensagem}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              className="red-button"
              onClick={() => viewtoast(0)}
              style={{
                marginTop: 35,
              }}
            >
              CANCELAR
            </button>
            <button
              className="green-button"
              onClick={() => codigo}
              style={{
                marginTop: 35,
                marginRight: 0,
              }}
            >
              CONFIRMAR
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Modal;
