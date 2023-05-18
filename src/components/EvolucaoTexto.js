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

  const [registros, setregistros] = useState([]);
  const [random, setrandom] = useState(null);
  useEffect(() => {
    if (statusdocumento != null) {
      setregistros(registros_atuais);
      setrandom(Math.random());
    }
  }, [registros_atuais, statusdocumento]);

  const updateValor = (item, valor) => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
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
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj);
    });
  }

  // alerta para campo obrigatório em branco.
  const alertaEmBranco = () => {
    return (
      <div
        id={"alerta" + random}
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
      <div id={"form" + random}
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
          // width: width,
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
                      document.getElementById('opcao' + item.id + random).value == '') {
                      document.getElementById("alerta" + random).style.display = 'flex';
                    } else {
                      document.getElementById("alerta" + random).style.display = 'none';
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
                    id={'opcao' + item.id + random}
                    defaultValue={x}
                    style={{
                      alignSelf: 'center',
                      height: 100,
                      width: width,
                      maxWidth: '',
                      minWidth: '',
                      margin: 2.5,
                    }}
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        updateValor(item, document.getElementById('opcao' + item.id + random).value.toUpperCase())
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
                    id={'opcao' + item.id + random}
                    title="FORMATO: DD/MM/YYYY"
                    onClick={() => document.getElementById('opcao' + item.id + random).value = ''}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'DATA')}
                    onKeyUp={() => {
                      var x = document.getElementById('opcao' + item.id + random).value;
                      if (x.length == 2) {
                        x = x + '/';
                        document.getElementById('opcao' + item.id + random).value = x;
                      }
                      if (x.length == 5) {
                        x = x + '/'
                        document.getElementById('opcao' + item.id + random).value = x;
                      }
                      clearTimeout(timeout);
                      var date = moment(document.getElementById('opcao' + item.id + random).value, 'DD/MM/YYYY', true);
                      timeout = setTimeout(() => {
                        if (date.isValid() == false) {
                          document.getElementById('opcao' + item.id + random).value = '';
                        } else {
                          document.getElementById('opcao' + item.id + random).value = moment(date).format('DD/MM/YYYY');
                          updateValor(item, document.getElementById('opcao' + item.id + random).value);
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
            } else if (tipo == "card") {
              return (
                <div className='blue-button'
                  style={{
                    padding: 5,
                  }}>
                  <div>{x}</div>
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
                    id={'opcao' + item.id + random}
                    defaultValue={x}
                    style={{
                      alignSelf: 'center',
                      margin: 2.5,
                      width: width - 35,
                    }}
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        updateValor(item, document.getElementById('opcao' + item.id + random).value.toUpperCase())
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
            } else if (tipo == "card") {
              return (
                <div className='blue-button'
                  style={{
                    backgroundColor: 'rgb(0, 0, 0, 0.1)',
                    color: 'black',
                    fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                    fontSize: 10,
                  }}>
                  <div>{x}</div>
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