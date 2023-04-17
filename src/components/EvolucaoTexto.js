/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoTexto({ idcampo, campo, obrigatorio, tipo, length, width }) {

  const {
    idpaciente, idatendimento,
    iddocumento, idselecteddocumento,
    camposopcoes, camposvalores,
    setcamposvalores, printdocumento,
    statusdocumento, setstatusdocumento,
    registros_atuais,
  } = useContext(Context)

  const updateValor = (item, valor) => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
      console.log('ID:' + id)
      // atualizando registro.  
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        idcampo: idcampo,
        idopcao: item.id,
        opcao: campo,
        valor: valor,
        idevolucao: iddocumento
      }
      console.log(obj);
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj).then(() => {
        // loadCamposValores();
      });
    });
  }

  // alerta para campo obrigatório em branco.
  const alertaEmBranco = (id) => {
    return (
      <div
        id={"alerta" + id}
        className='red-button fade-in'
        title='CAMPO EM BRANCO!'
        style={{
          display: 'none',
          position: 'absolute', top: 10, right: 10,
          borderRadius: 50,
        }}>
        {'!'}
      </div>
    )
  }

  var timeout = null;
  return (
    <div>
      <div id="form"
        style={{
          display: printdocumento == 0 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: 5,
          borderColor: 'white',
          borderStyle: 'solid',
          borderWidth: 5,
          padding: 10,
          margin: 5,
          width: width,
          alignSelf: 'center'
        }}
      >
        <div className='title2center'>{campo}</div>
        <div
          id="texto"
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center',
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
            if (tipo == "textarea") {
              return (
                <div style={{ position: 'relative' }}
                  onMouseLeave={() => {
                    if (
                      obrigatorio == 1 &&
                      document.getElementById('opcao' + iddocumento + item.id).value == '') {
                      document.getElementById("alerta" + idcampo).style.display = 'flex';
                    } else {
                      document.getElementById("alerta" + idcampo).style.display = 'none';
                    }
                  }}
                >
                  {alertaEmBranco(idcampo)}
                  <textarea
                    autoComplete="off"
                    className="textarea"
                    placeholder="..."
                    onFocus={(e) => {
                      (e.target.placeholder = '');
                    }}
                    onBlur={(e) => (e.target.placeholder = '...')}
                    title={""}
                    type="text"
                    maxLength={length}
                    id={'opcao' + iddocumento + item.id}
                    defaultValue={x}
                    style={{
                      alignSelf: 'center',
                      height: 100,
                      width: width - 35,
                      margin: 2.5,
                    }}
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        updateValor(item, document.getElementById("text" + idcampo).value.toUpperCase())
                      }, 2000);
                    }}
                  ></textarea>
                </div>
              )
            } else if (tipo == "date") {
              return (
                <div style={{ position: 'relative' }}>
                  {alertaEmBranco(idcampo)}
                  <input
                    autoComplete="off"
                    placeholder="DATA"
                    className="textarea"
                    type="text"
                    id={'opcao' + iddocumento + item.id}
                    title="FORMATO: DD/MM/YYYY"
                    onClick={() => document.getElementById('opcao' + iddocumento + item.id).value = ''}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'DATA')}
                    onKeyUp={() => {
                      var x = document.getElementById('opcao' + iddocumento + item.id).value;
                      if (x.length == 2) {
                        x = x + '/';
                        document.getElementById('opcao' + iddocumento + item.id).value = x;
                      }
                      if (x.length == 5) {
                        x = x + '/'
                        document.getElementById('opcao' + iddocumento + item.id).value = x;
                      }
                      clearTimeout(timeout);
                      var date = moment(document.getElementById('opcao' + iddocumento + item.id).value, 'DD/MM/YYYY', true);
                      timeout = setTimeout(() => {
                        if (date.isValid() == false) {
                          document.getElementById('opcao' + iddocumento + item.id).value = '';
                        } else {
                          document.getElementById('opcao' + iddocumento + item.id).value = moment(date).format('DD/MM/YYYY');
                          updateValor(item, document.getElementById('opcao' + iddocumento + item.id).value);
                        }
                      }, 3000);
                    }}
                    defaultValue={moment().format('DD/MM/YYYY')}
                    style={{
                      alignSelf: 'center',
                      width: width - 35,
                      margin: 2.5,
                      borderStyle: 'none',
                      textAlign: 'center',
                    }}
                  ></input>
                </div>
              )
            } else {
              return (
                <div
                  style={{ position: 'relative' }}>
                  {alertaEmBranco(idcampo)}
                  <input
                    autoComplete="off"
                    className="input"
                    placeholder="..."
                    onFocus={(e) => {
                      (e.target.placeholder = '');
                    }}
                    onBlur={(e) => (e.target.placeholder = '...')}
                    title={""}
                    type="text"
                    maxLength={length}
                    id={"text" + idcampo}
                    defaultValue={x}
                    style={{
                      alignSelf: 'center',
                      margin: 2.5,
                      width: width - 35,
                    }}
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        updateValor(item, document.getElementById('opcao' + iddocumento + item.id).value.toUpperCase())
                      }, 2000);
                    }}
                  ></input>
                </div>
              )
            }
          }
          )}
        </div>
      </div>
      <div id="print"
        style={{
          display: printdocumento == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 5,
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 1,
          padding: 5,
          margin: 2.5,
          width: width,
          pageBreakInside: 'avoid',
        }}
      >
        <div className='title2center'
          style={{
            color: 'black', fontWeight: 'bold', alignSelf: 'center',
            fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
            fontSize: 12,
            textAlign: 'center',
          }}>
          {campo}
        </div>
        <div
          id="texto"
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
            if (tipo == "textarea") {
              return (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      alignSelf: 'center',
                      height: 100,
                      width: width - 15,
                      backgroundColor: 'rgb(0, 0, 0, 0.2)',
                      borderRadius: 5,
                      padding: 5,
                      color: 'black',
                      fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                      fontSize: 10,
                    }}
                  >
                    {x}
                  </div>
                </div>
              )
            } else {
              return (
                <div
                  style={{ position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        alignSelf: 'center',
                        height: 19,
                        width: width - 15,
                        backgroundColor: 'rgb(0, 0, 0, 0.1)',
                        borderRadius: 5,
                        padding: 5,
                        color: 'black',
                        fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                        fontSize: 10,
                      }}
                    >{x}
                    </div>
                  </div>
                </div>
              )
            }
          }
          )}
        </div>
      </div>
    </div>
  );
}

export default EvolucaoTexto;