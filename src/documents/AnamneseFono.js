/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';
import logo from '../images/paulodetarso_logo.png';

// viewdocumento 111(form), 112(pdf), 113(busy).
function AnamneseFono() {

  console.log('ANAMNESE FONO!!!')
  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
    idatendimento,
    conselho,
    tipodocumento,
    camposopcoes,
    setregistros_atuais, registros_atuais,
    iddocumento,
    idpaciente,
    printdocumento,
    setprintdocumento,
    nomeunidade, box,
    datadocumento,
    nomepaciente, nomemae, dn,
    nomeusuario, conselhousuario,
  } = useContext(Context);

  const [random, setrandom] = useState(null);
  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CREFONO') {
      setrandom(Math.random());
    }
  }, [tipodocumento]);

  // funções para montagem dos campos estruturados do documento.
  const evolucaoSelecaoSimples = (idcampo, campo, obrigatorio, width) => {
    if (tipodocumento == 'ANAMNESE - CREFONO') {
      const updateValor = (item, opcao, valor) => {
        axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
          var x = [0, 1];
          x = response.data.rows;
          // já existe um registro deste campo estruturado para o documento.
          if (x
            .filter(valor => valor.idevolucao == iddocumento && valor.idatendimento == idatendimento && valor.idcampo == idcampo).length > 0) {
            var id = x
              .filter(valor => valor.idevolucao == iddocumento && valor.idatendimento == idatendimento && valor.idcampo == idcampo)
              .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
            // atualizando registro.  
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj).then(() => {
              // loadCamposValores();
              console.log('ID:' + id);
              console.log(obj);
              setTimeout(() => {
                var botoes = document.getElementById("campo" + campo + random).getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById('opcao' + item.id + random).className = 'red-button';
              }, 500);
            });
          } else {
            // inserindo o registro de campo.
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: item.opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
              // loadCamposValores();
              console.log(obj);
              setTimeout(() => {
                var botoes = document.getElementById("campo" + campo + random).getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById('opcao' + item.id + random).className = 'red-button';
              }, 500);
            });
          }
        });
      }
      // alerta para campo obrigatório em branco.
      const alertaEmBranco = () => {
        return (
          <div
            id={"alerta" + campo + random}
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
      return (
        <div style={{ display: tipodocumento != '' ? 'flex' : 'none' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              alignContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: 'white',
              borderStyle: 'solid',
              borderWidth: 5,
              padding: 2.5,
              margin: 2.5,
              breakInside: 'avoid',
            }}
          >
            {alertaEmBranco()}
            <div
              id={"campo" + campo + random}
              onMouseLeave={() => {
                if (
                  obrigatorio == 1 &&
                  document.getElementById("campo" + campo + random).getElementsByClassName("red-button").length < 1) {
                  document.getElementById("alerta" + campo + random).style.display = 'flex';
                } else {
                  document.getElementById("alerta" + campo + random).style.display = 'none';
                }
              }}
              style={{
                display: printdocumento == 0 ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center', flexWrap: 'wrap',
              }}>
              <div className='title2center'>{campo}</div>
              <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
                pointerEvents: conselhousuario == 'CREFONO' ? 'auto' : 'none',
              }}>
                {camposopcoes.filter(item => item.idcampo == idcampo).map(item => (
                  <div id={'opcao' + item.id + random}
                    title={'opcao' + item.id + random}
                    className={registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo).map(valor => valor.valor) == item.opcao ? 'red-button' : 'blue-button'}
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                    onClick={() => {
                      registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo).map(item => {
                        var obj = {
                          idpct: idpaciente,
                          idatendimento: idatendimento,
                          data: moment(),
                          idcampo: item.idcampo,
                          idopcao: item.idopcao,
                          opcao: item.opcao,
                          valor: null,
                          idevolucao: iddocumento
                        }
                        axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + item.id, obj);
                      });
                      updateValor(item, item.opcao, item.opcao);
                    }}
                  >
                    {item.opcao}
                  </div>
                ))}
              </div>
            </div>
            <div id={"print" + random}
              style={{
                display: printdocumento == 1 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center', alignSelf: 'center',
                borderRadius: 5,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                padding: 2.5,
                margin: 2.5,
                width: width,
                pageBreakInside: 'avoid',
              }}
            >
              <div
                style={{
                  color: 'black', fontWeight: 'bold', alignSelf: 'center',
                  fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                  fontSize: 10,
                  textAlign: 'center',
                }}>
                {campo}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  pointerEvents: conselhousuario == 'CREFONO' ? 'auto' : 'none',
                }}
              >
                {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
                  return (
                    <div id={'print_opcao' + random}
                      className='blue-button'
                      style={{
                        backgroundColor: registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo).map(valor => valor.valor) == item.opcao ? 'rgb(0, 0, 0, 0.1)' : 'transparent',
                        borderRadius: 5,
                        padding: 2.5,
                        margin: 2.5,
                        maxWidth: 200,
                        color: registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo).map(valor => valor.valor) == item.opcao ? 'black' : 'grey',
                        fontSize: 10,
                        fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                        textAlign: 'center',
                      }}
                    >
                      {item.opcao}
                    </div>
                  )
                }
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  const evolucaoSelecaoMultipla = (idcampo, campo, obrigatorio, width) => {
    if (tipodocumento == 'ANAMNESE - CREFONO') {
      const updateValor = (item, valor, id) => {
        axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
          var x = [0, 1];
          x = response.data.rows;
          if (x
            .filter(valor => valor.idevolucao == iddocumento && valor.idatendimento == idatendimento && valor.idcampo == item.idcampo && valor.idopcao == item.id).length > 0) {
            // atualizando registro.  
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: item.opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            console.log('ATUALIZAR');
            console.log(obj);
            axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj).then(() => {
              // loadCamposValores();
              setTimeout(() => {
                if (valor == 'SIM') {
                  document.getElementById('opcao' + item.id + random).className = 'red-button';
                } else {
                  document.getElementById('opcao' + item.id + random).className = 'blue-button';
                }
              }, 500);
            });
          } else {
            // inserindo o registro de campo.
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: item.opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
              // loadCamposValores();
              console.log('INSERIR:');
              console.log(obj);
              setTimeout(() => {
                if (valor == 'SIM') {
                  document.getElementById('opcao' + item.id + random).className = 'red-button';
                } else {
                  document.getElementById('opcao' + item.id + random).className = 'blue-button';
                }
              }, 500);
            });
          }
        })
      }
      // alerta para campo obrigatório em branco.
      const alertaEmBranco = () => {
        return (
          <div
            id={"alerta" + campo + random}
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
      return (
        <div style={{ display: tipodocumento != '' ? 'flex' : 'none' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              alignContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: 'white',
              borderStyle: 'solid',
              borderWidth: 5,
              padding: 2.5,
              margin: 2.5,
              breakInside: 'avoid',
            }}
          >
            {alertaEmBranco()}
            <div
              id={"campo" + campo + random}
              onMouseLeave={() => {
                if (
                  obrigatorio == 1 &&
                  document.getElementById("campo" + campo + random).getElementsByClassName("red-button").length < 1) {
                  document.getElementById("alerta" + campo + random).style.display = 'flex';
                } else {
                  document.getElementById("alerta" + campo + random).style.display = 'none';
                }
              }}
              style={{
                display: printdocumento == 0 ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center', flexWrap: 'wrap',
              }}>
              <div className='title2center'>{campo}</div>
              <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
                pointerEvents: conselhousuario == 'CREFONO' ? 'auto' : 'none',
              }}>
                {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
                  let valor = registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.idopcao == item.id).map(item => item.valor).pop();
                  let id = registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.idopcao == item.id).map(item => item.id).pop();
                  console.log(valor + ' - ' + id);
                  return (
                    <div id={'opcao' + item.id + random}
                      className={registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.valor) == 'SIM' ? 'red-button' : 'blue-button'}
                      style={{ paddingLeft: 10, paddingRight: 10 }}
                      onClick={() => {
                        if (valor == 'NÃO' || id == undefined) {
                          valor = 'SIM';
                          updateValor(item, 'SIM', id);
                        } else {
                          valor = 'NÃO';
                          updateValor(item, 'NÃO', id);
                        }
                      }}
                    >
                      {item.opcao}
                    </div>
                  )
                })}
              </div>
            </div>
            <div id={"print" + random}
              style={{
                display: printdocumento == 1 ? 'flex' : 'none',
                flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
                alignContent: 'center',
                alignItems: 'center', alignSelf: 'center',
                borderRadius: 5,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                padding: 2.5,
                margin: 2.5,
                width: width,
                pageBreakInside: 'avoid',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    color: 'black', fontWeight: 'bold', alignSelf: 'center',
                    fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                    fontSize: 10,
                    textAlign: 'center',
                  }}>
                  {campo}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    pointerEvents: conselhousuario == 'CREFONO' ? 'auto' : 'none',
                  }}
                >
                  {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
                    return (
                      <div id={'print_opcao' + random}
                        className='blue-button'
                        style={{
                          paddingLeft: 5, paddingRight: 5,
                          backgroundColor: registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.valor).pop() == 'SIM' ? 'rgb(0, 0, 0, 0.1)' : 'transparent',
                          borderRadius: 5,
                          maxWidth: 200,
                          padding: 2.5,
                          margin: 2.5,
                          color: registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.valor) == 'SIM' ? 'black' : 'grey',
                          fontSize: 10,
                          fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                          textAlign: 'center',
                        }}
                      >
                        {item.opcao}
                      </div>
                    )
                  }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div >
      );
    }
  }

  const evolucaoTexto = (idcampo, campo, obrigatorio, tipo, length, width, valor_escala) => {
    if (tipodocumento == 'ANAMNESE - CREFONO') {
      const updateValor = (item, opcao, valor) => {
        axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
          var x = [0, 1];
          x = response.data.rows;
          // já existe um registro deste campo estruturado para o documento.
          if (x
            .filter(valor => valor.idevolucao == iddocumento && valor.idatendimento == idatendimento && valor.idcampo == idcampo).length > 0) {
            var id = x
              .filter(valor => valor.idevolucao == iddocumento && valor.idatendimento == idatendimento && valor.idcampo == idcampo)
              .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj);
          } else {
            // inserindo o registro de campo.
            var obj = {
              idpct: idpaciente,
              idatendimento: idatendimento,
              data: moment(),
              idcampo: idcampo,
              idopcao: item.id,
              opcao: item.opcao,
              valor: valor,
              idevolucao: iddocumento
            }
            axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj);
          }
        });
      }
      // alerta para campo obrigatório em branco.
      const alertaEmBranco = () => {
        return (
          <div
            id={"alerta" + campo + random}
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
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          breakInside: 'avoid',
          margin: 2.5, padding: 2.5,
        }}>
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
              padding: 2.5,
              margin: 2.5,
              alignSelf: 'center',
            }}
          >
            <div className='title2center'>{campo}</div>
            <div
              id="texto"
              style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center',
                pointerEvents: conselhousuario == 'CREFONO' ? 'auto' : 'none',
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
                          document.getElementById("alerta" + campo + random).style.display = 'flex';
                        } else {
                          document.getElementById("alerta" + campo + random).style.display = 'none';
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
                          margin: 2.5,
                          width: width,
                          height: 100,
                        }}
                        onKeyUp={() => {
                          clearTimeout(timeout);
                          timeout = setTimeout(() => {
                            updateValor(item, item.opcao, document.getElementById('opcao' + item.id + random).value.toUpperCase())
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
                              updateValor(item, item.opcao, document.getElementById('opcao' + item.id + random).value);
                            }
                          }, 3000);
                        }}
                        defaultValue={moment().format('DD/MM/YYYY')}
                        style={{
                          alignSelf: 'center',
                          width: width,
                          padding: 2.5,
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
                        padding: 2.5,
                        margin: 2.5,
                      }}>
                      <div>{valor_escala}</div>
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
                          padding: 2.5,
                          margin: 2.5,
                          width: width,
                        }}
                        onKeyUp={() => {
                          clearTimeout(timeout);
                          timeout = setTimeout(() => {
                            updateValor(item, item.opcao, document.getElementById('opcao' + item.id + random).value.toUpperCase())
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
              borderRadius: 5,
              borderColor: 'black',
              borderStyle: 'solid',
              borderWidth: 1,
              padding: 2.5,
              margin: 2.5,
              width: width,
              alignContent: 'center',
              alignSelf: 'center',
              pageBreakInside: 'avoid',
            }}
          >
            <div className='title2center'
              style={{
                color: 'black', fontWeight: 'bold', alignSelf: 'center',
                fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                fontSize: 10,
                textAlign: 'center',
              }}>
              {campo}
            </div>
            {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
              var x = registros_atuais.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
              if (tipo == "textarea") {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'rgb(0, 0, 0, 0.1)',
                      borderRadius: 5,
                      width: width - 5,
                      minWidth: width - 5,
                      maxWidth: width - 5,
                      padding: 2.5,
                      margin: 2.5,
                      minHeight: 100,
                      color: 'black',
                      fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                      fontSize: 10,
                      alignSelf: 'center',
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {x}
                    </div>
                  </div>
                )
              } else if (tipo == "card") {
                return (
                  <div className='blue-button'
                    style={{
                      backgroundColor: 'rgb(0, 0, 0, 0.1)',
                      width: 40, height: 40,
                      padding: 2.5,
                      margin: 2.5,
                      color: 'black',
                      fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                      fontSize: 10,
                    }}>
                    {x}
                  </div>
                )
              } else {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'rgb(0, 0, 0, 0.1)',
                      borderRadius: 5,
                      width: width - 10,
                      minWidth: width - 5,
                      maxWidth: width - 5,
                      padding: 2.5,
                      margin: 2.5,
                      height: 15,
                      color: 'black',
                      fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                      fontSize: 10,
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    {x}
                  </div>
                )
              }
            }
            )}
          </div>
        </div>
      );
    }
  }

  // ESCALA PARD (showescala = 16).
  function Pard() {
    const [pardscore, setpardscore] = useState(registros_atuais.filter(item => item.idcampo == 204).map(item => item.valor).slice(-1));
    const [escapeoralanterior, setescapeoralanterior] = useState(0);
    const [tempotransitooraladequado, settempotransitooraladequado] = useState(0);
    const [refluxonasal, setrefluxonasal] = useState(0);
    const [numerodegluticoes, setnumerodegluticoes] = useState(0);
    const [residuooral, setresiduooral] = useState(0);
    const [elevacaolaringea, setelevacaolaringea] = useState(0);
    const [tosse, settosse] = useState(0);
    const [engasgo, setengasgo] = useState(0);
    const [auscultacervicallimpa, setauscultacervicallimpa] = useState(0);
    const [qualidadevocaladequada, setqualidadevocaladequada] = useState(0);
    const [sato2, setsato2] = useState(0);
    const [cianose, setcianose] = useState(0);
    const [broncoespasmo, setbroncoespasmo] = useState(0);
    const [fc, setfc] = useState(0);
    const [fr, setfr] = useState(0);

    var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
    const insertPard = () => {
      setpardscore(
        (parseInt(escapeoralanterior) + parseInt(tempotransitooraladequado) + parseInt(refluxonasal) +
          parseInt(numerodegluticoes) + parseInt(residuooral) + parseInt(elevacaolaringea) + parseInt(tosse) +
          parseInt(engasgo) + parseInt(auscultacervicallimpa) + parseInt(qualidadevocaladequada) +
          parseInt(document.getElementById('inputPardSao2').value) +
          cianose + broncoespasmo +
          parseInt(document.getElementById('inputPardFc').value) +
          parseInt(document.getElementById('inputPardFr').value)));

      console.log(pardscore)
      var significado = '';
      if (pardscore < 5) {
        significado = 'DEGLUTIÇÃO NORMAL';
      } else if (pardscore > 4 && pardscore < 10) {
        significado = 'DEGLUTIÇÃO FUNCIONAL';
      } else if (pardscore > 9 && pardscore < 15) {
        significado = 'DISFAGIA OROFARÍNGEA LEVE';
      } else if (pardscore > 14 && pardscore < 20) {
        significado = 'DISFAGIA OROFARÍNGEA LEVE A MODERADA';
      } else if (pardscore > 19 && pardscore < 25) {
        significado = 'DISFAGIA OROFARÍNGEA MODERADA';
      } else if (pardscore > 24 && pardscore < 30) {
        significado = 'DISFAGIA OROFARÍNGEA MODERADA A GRAVE';
      } else {
        significado = 'DISFAGIA OROFARÍNGEA GRAVE';
      }
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        cd_escala: 16,
        ds_escala: 'PARD',
        valor_resultado: pardscore,
        ds_resultado: significado,
        idprofissional: 0,
        status: 1,
      }
      axios.post(htmlghapinsertescala, obj).then(() => {
        // loadEscalas();
      })
    }
    const updatePardValor = () => {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        // atualizando registro.  
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: 204,
          idopcao: 676,
          opcao: 'ESCALA - PARD',
          valor: pardscore,
          idevolucao: iddocumento
        }
        console.log(obj);
        axios.post('http://192.168.100.6:3333/insert_evolucao_valor/', obj);
      });
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="menucontainer"
          style={{
            display: printdocumento == 1 ? 'none' : 'flex',
            marginTop: 20, marginBottom: 20
          }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'AVALIAÇÃO DE RISCO PARA DISFAGIA'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="green-button"
                onClick={() => { insertPard(); updatePardValor() }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div>
            <div
              className="corpo">
              <div
                className="scroll"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  marginBottom: 5,
                  width: '60vw', height: '50vh',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <div className="title2center">ESCAPE ORAL ANTERIOR</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={escapeoralanterior == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setescapeoralanterior(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={escapeoralanterior == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setescapeoralanterior(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">TEMPO DE TRÂNSITO ORAL ADEQUADO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={tempotransitooraladequado == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settempotransitooraladequado(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={tempotransitooraladequado == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settempotransitooraladequado(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">REFLUXO NASAL</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={refluxonasal == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setrefluxonasal(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={refluxonasal == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setrefluxonasal(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">NÚMERO DE DEGLUTIÇÕES</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={numerodegluticoes == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setnumerodegluticoes(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={numerodegluticoes == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setnumerodegluticoes(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">RESÍDUO ORAL</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={residuooral == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setresiduooral(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={residuooral == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setresiduooral(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">ELEVAÇÃO LARÍNGEA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={elevacaolaringea == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setelevacaolaringea(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={elevacaolaringea == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setelevacaolaringea(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">TOSSE</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={tosse == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settosse(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={tosse == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settosse(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">ENGASGO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={engasgo == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setengasgo(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={engasgo == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setengasgo(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">AUSCULTA CERVICAL LIMPA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={auscultacervicallimpa == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setauscultacervicallimpa(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={auscultacervicallimpa == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setauscultacervicallimpa(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">QUALIDADE VOCAL ADEQUADA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={qualidadevocaladequada == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setqualidadevocaladequada(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={qualidadevocaladequada == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setqualidadevocaladequada(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">SATURAÇÃO DE OXIGÊNIO</div>
                <input
                  id='inputPardSao2'
                  autoComplete="off"
                  className="input"
                  placeholder="SAO2"
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'SAO2')}
                  title={"SAO2"}
                  type="number"
                  maxLength={3}
                  style={{ width: 100 }}
                ></input>
                <div className="title2center">CIANOSE</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={cianose == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setcianose(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={cianose == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setcianose(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">BRONCOESPASMO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={broncoespasmo == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setbroncoespasmo(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={broncoespasmo == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setbroncoespasmo(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>
                <div className="title2center">FREQUÊNCIA CARDÍACA</div>
                <input
                  id='inputPardFc'
                  autoComplete="off"
                  className="input"
                  placeholder="FC"
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'FC')}
                  title={"FC"}
                  type="number"
                  maxLength={3}
                  style={{ width: 100 }}
                ></input>
                <div className="title2center">FREQUÊNCIA RESPIRATÓRIA</div>
                <input
                  id='inputPardFr'
                  autoComplete="off"
                  className="input"
                  placeholder="FR"
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'FR')}
                  title={"FR"}
                  type="number"
                  maxLength={2}
                  style={{ width: 100 }}
                ></input>
                <div className="title2">RESULTADO</div>
                <div className='blue-button' style={{ width: 100, marginBottom: 25 }}>{pardscore}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ESCALA DE FOIS NA ORIGEM (showescala = 4).
  function FoisOrigem() {
    var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
    const [nivel, setnivel] = useState(registros_atuais.filter(item => item.idcampo == 208).map(item => item.valor).slice(-1));
    const insertFois = () => {
      var significado = '';
      if (nivel == 1) {
        significado = 'NADA POR VIA ORAL.';
      } else if (nivel == 2) {
        significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).';
      } else if (nivel == 3) {
        significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.';
      } else if (nivel == 4) {
        significado = 'VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.';
      } else if (nivel == 5) {
        significado = 'VIA ORAL TOTAL, COM MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.';
      } else if (nivel == 6) {
        significado = 'VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.';
      } else {
        significado = 'VIA ORAL TOTAL, SEM RESTRIÇÕES';
      }
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        cd_escala: 4,
        ds_escala: 'FOIS',
        valor_resultado: nivel,
        ds_resultado: significado,
        idprofissional: 0,
        status: 1,
      }
      axios.post(htmlghapinsertescala, obj).then(() => {
        console.log(obj);
      });
    }
    const updateFoisValor = () => {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        var id = x
          .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 203)
          .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
        // atualizando registro.  
        console.log('ID: ' + id);
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: 208,
          idopcao: 680,
          opcao: 'ESCALA - FOIS',
          valor: nivel,
          idevolucao: iddocumento
        }
        console.log(obj);
        axios.post('http://192.168.100.6:3333/insert_evolucao_valor/', obj);
      });
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="menucontainer"
          style={{ display: printdocumento == 1 ? 'none' : 'flex', marginTop: 20, marginBottom: 20 }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FOIS (CLASSIFICAÇÃO NA ORIGEM)'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="green-button"
                onClick={() => {
                  insertFois();
                  updateFoisValor()
                }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div>
            <div
              className="corpo" style={{ paddingBottom: 0 }}>
              <div
                className="scroll"
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  marginBottom: 5, flexWrap: 'wrap',
                  width: '60vw', height: '50vh'
                }}>
                <button
                  onClick={() => { setnivel(1) }}
                  className={nivel == 1 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  NADA POR VIA ORAL
                </button>
                <button
                  onClick={() => { setnivel(2) }}
                  className={nivel == 2 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).
                </button>
                <button
                  onClick={() => { setnivel(3) }}
                  className={nivel == 3 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.
                </button>
                <button
                  onClick={() => { setnivel(4) }}
                  className={nivel == 4 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, minHeight: 150, padding: 10 }}>
                  VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.
                </button>
                <button
                  onClick={() => { setnivel(5) }}
                  className={nivel == 5 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.
                </button>
                <button
                  onClick={() => { setnivel(6) }}
                  className={nivel == 6 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.
                </button>
                <button
                  onClick={() => { setnivel(7) }}
                  className={nivel == 7 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, SEM RESTRIÇÕES.
                </button>
              </div>
            </div>
          </div>
          <div className="title2">RESULTADO</div>
          <div className='blue-button' style={{ width: 75, marginBottom: 25 }}>{nivel}</div>
        </div>
      </div>
    );
  }

  function FoisAdmissao() {
    var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
    const [nivel, setnivel] = useState(registros_atuais.filter(item => item.idcampo == 203).map(item => item.valor).slice(-1));
    const insertFois = () => {
      var significado = '';
      if (nivel == 1) {
        significado = 'NADA POR VIA ORAL.';
      } else if (nivel == 2) {
        significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).';
      } else if (nivel == 3) {
        significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.';
      } else if (nivel == 4) {
        significado = 'VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.';
      } else if (nivel == 5) {
        significado = 'VIA ORAL TOTAL, COM MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.';
      } else if (nivel == 6) {
        significado = 'VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.';
      } else {
        significado = 'VIA ORAL TOTAL, SEM RESTRIÇÕES';
      }
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        cd_escala: 4,
        ds_escala: 'FOIS',
        valor_resultado: nivel,
        ds_resultado: significado,
        idprofissional: 0,
        status: 1,
      }
      axios.post(htmlghapinsertescala, obj).then(() => {
        console.log(obj);
      });
    }
    const updateFoisValor = () => {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        var id = x
          .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 203)
          .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
        // atualizando registro.  
        console.log('ID: ' + id);
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: 203,
          idopcao: 675,
          opcao: 'ESCALA - FOIS',
          valor: nivel,
          idevolucao: iddocumento
        }
        console.log(obj);
        axios.post('http://192.168.100.6:3333/insert_evolucao_valor/', obj);
      });
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="menucontainer"
          style={{ display: printdocumento == 1 ? 'none' : 'flex', marginTop: 20, marginBottom: 20 }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FOIS (CLASSIFICAÇÃO APÓS AVALIAÇÃO ADMISSIONAL)'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="green-button"
                onClick={() => {
                  insertFois();
                  updateFoisValor()
                }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div>
            <div
              className="corpo" style={{ paddingBottom: 0 }}>
              <div
                className="scroll"
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  marginBottom: 5, flexWrap: 'wrap',
                  width: '60vw', height: '50vh'
                }}>
                <button
                  onClick={() => { setnivel(1) }}
                  className={nivel == 1 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  NADA POR VIA ORAL
                </button>
                <button
                  onClick={() => { setnivel(2) }}
                  className={nivel == 2 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).
                </button>
                <button
                  onClick={() => { setnivel(3) }}
                  className={nivel == 3 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.
                </button>
                <button
                  onClick={() => { setnivel(4) }}
                  className={nivel == 4 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, minHeight: 150, padding: 10 }}>
                  VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.
                </button>
                <button
                  onClick={() => { setnivel(5) }}
                  className={nivel == 5 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.
                </button>
                <button
                  onClick={() => { setnivel(6) }}
                  className={nivel == 6 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.
                </button>
                <button
                  onClick={() => { setnivel(7) }}
                  className={nivel == 7 ? "red-button" : "blue-button"}
                  style={{ width: 200, height: 200, padding: 10 }}>
                  VIA ORAL TOTAL, SEM RESTRIÇÕES.
                </button>
              </div>
            </div>
          </div>
          <div className="title2">RESULTADO</div>
          <div className='blue-button' style={{ width: 75, marginBottom: 25 }}>{nivel}</div>
        </div>
      </div>
    );
  }

  function Campos() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - ANAMNESE - CREFONO"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '70vw',
          height: printdocumento == 0 ? 'calc(60vh - 10px)' : '',
          scrollBehavior: 'smooth',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          alignSelf: 'center',
          alignItems: 'center',
          opacity: statusdocumento == 1 || statusdocumento == 2 ? 0.7 : 1,
          position: 'relative',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
        }}
      >
        <button id="print-button"
          className="green-button noprint"
          title="IMPRIMIR EVOLUÇÃO."
          onClick={() => { printDiv() }}
          style={{
            display: printdocumento == 1 ? 'none' : 'flex',
            position: 'sticky',
            top: 0, right: 0,
            marginTop: 0,
            width: 50, minWidth: 50,
            height: 50, minHeight: 50,
            alignSelf: 'flex-end',
            zIndex: 20
          }}
        >
          <img
            alt=""
            src={imprimir}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </button>
        <div
          style={{
            display: 'flex',
            pointerEvents: statusdocumento == 1 || statusdocumento == 2 ? 'none' : 'auto',
            fontFamily: 'Helvetica', alignContent: 'center', alignItems: 'center',
          }}>
          <div id="CORPO DO DOCUMENTO - ANAMNESE - CREFONO"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DA FONOAUDIOLOGIA</div>
            {evolucaoTexto(67, 'HISTÓRIA DA MOLÉSTIA ATUAL', 1, 'textarea', 2000, 600)}
            {evolucaoSelecaoMultipla(77, 'DIAGNÓSTICO ADMISSIONAL', 1)}
            {evolucaoTexto(78, 'OUTROS DIAGNÓSTICOS', 1, 'textarea', 2000, 600)}
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO CLÍNICA</div>
            {evolucaoSelecaoSimples(79, 'ESTADO DE ALERTA', 1)}
            {evolucaoSelecaoSimples(80, 'ORIENTADO', 1)}
            {evolucaoSelecaoSimples(81, 'DISPOSITIVOS', 1)}
            {evolucaoSelecaoSimples(82, 'TIPO DE CÂNULA TQT', 1)}
            {evolucaoTexto(83, 'NÚMERO DA CÂNULA DE TQT', 1, 'input', 2, 150)}
            {evolucaoTexto(84, 'MODELO DA CÂNULA DE TQT', 1, 'input', 100, 150)}
            {evolucaoSelecaoSimples(85, 'CUFF', 1)}
            {evolucaoSelecaoSimples(86, 'VIA DE ALIMENTAÇÃO', 1)}
            {evolucaoSelecaoSimples(87, 'DIETA POR VIA ORAL', 1)}
            {evolucaoSelecaoSimples(88, 'HIDRATAÇÃO', 1)}
            {evolucaoSelecaoSimples(89, 'ESPESSANTE', 1)}
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>COMUNICAÇÃO</div>
            {evolucaoSelecaoSimples(90, 'COMPREENSÃO', 1)}
            {evolucaoSelecaoSimples(91, 'EXPRESSÃO', 1)}
            {evolucaoSelecaoSimples(92, 'ALTERAÇÕES DA FALA', 1)}
            {evolucaoSelecaoSimples(93, 'COGNIÇÃO', 1)}
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>MOTRICIDADE OROFACIAL</div>
            {evolucaoSelecaoSimples(94, 'SIMETRIA', 1)}
            {evolucaoSelecaoSimples(95, 'RIGIDEZ', 1)}
            {evolucaoSelecaoSimples(96, 'MOBILIDADE', 1)}
            {evolucaoSelecaoSimples(97, 'SENSIBILIDADE', 1)}
            {evolucaoSelecaoSimples(98, 'COORDENAÇÃO', 1)}
            {evolucaoSelecaoSimples(99, 'ARTICULAÇÃO TEMPOROMANDIBULAR', 1)}
            {evolucaoSelecaoSimples(100, 'ARCADA DENTÁRIA', 1)}
            {evolucaoSelecaoMultipla(101, 'PRÓTESE DENTÁRIA', 1)}
            {evolucaoSelecaoSimples(102, 'HIGIENE ORAL', 1)}
            {evolucaoSelecaoSimples(103, 'SALIVA', 1)}
            <div className="title2center" style={{ fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>{'AVALIAÇÃO DE RISCO PARA DISFAGIA (PARD)'}</div>
            <div style={{ display: printdocumento == 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
              <Pard></Pard>
              <FoisOrigem></FoisOrigem>
              <FoisAdmissao></FoisAdmissao>
            </div>
            {evolucaoSelecaoSimples(104, 'CONCLUSÃO - PARD', 1)}
            <div style={{ width: '100%', fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>{'CONDUTA'}</div>
            {evolucaoSelecaoSimples(105, 'DIETA', 1)}
            {evolucaoSelecaoSimples(106, 'CONSISTÊNCIA DO ALIMENTO', 1)}
            {evolucaoSelecaoSimples(107, 'CONSISTÊNCIA DO LÍQUIDO', 1)}
            {evolucaoSelecaoSimples(108, 'VÍNCULO COM O SETOR', 1)}
            {evolucaoTexto(206, 'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:', 1, "textarea", 10, 600)}
          </div>
        </div>
      </div>
    )
  };

  function Header() {
    return (
      <div id="CABEÇALHO" className='print'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          fontFamily: 'Helvetica',
          margin: 5,
          height: 130,
        }}>
        <div id='logo + nome do hospital + id do documento'
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <img id="logo"
              alt=""
              src={logo}
              style={{
                margin: 0,
                width: 150, height: 60,
                alignSelf: 'center',
              }}
            ></img>
            <div id="nome do hospital"
              style={{ fontSize: 18, textAlign: 'center', padding: 20, fontWeight: 'bold', alignSelf: 'center' }}>
              {'CLÍNICA DE TRANSIÇÃO PAULO DE TARSO'}
            </div>
          </div>
          <div id="id do documento"
            style={{
              display: 'flex',
              flexDirection: 'column', justifyContent: 'center', padding: 5, backgroundColor: '#f2f2f2', borderRadius: 5, margin: 5, alignSelf: 'center'
            }}>
            <div style={{ fontSize: 10, margin: 2.5, marginTop: 0, textAlign: 'right' }}>{'ATENDIMENTO: ' + idatendimento}</div>
            <div style={{ fontSize: 10, margin: 2.5, textAlign: 'right' }}>{nomeunidade + ' - ' + box}</div>
            <div style={{ fontSize: 10, margin: 2.5, marginBottom: 0, textAlign: 'right' }}>{'EMITIDO EM: ' + moment(datadocumento).format('DD/MM/YYYY - HH:mm')}</div>
          </div>
        </div>
        <div id="nome do paciente + id do paciente"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <div style={{ fontSize: 14, margin: 5, fontWeight: 'bold', alignSelf: 'flex-start' }}>{'PACIENTE: ' + nomepaciente}</div>
          <div style={{ fontSize: 12, margin: 5, marginTop: 0, marginBottom: 0, alignSelf: 'flex-start' }}>{'MÃE: ' + nomemae}</div>
          <div style={{ flexDirection: 'row', margin: 5, marginTop: 2.5, alignSelf: 'flex-start' }}>
            <div style={{ fontSize: 12, margin: 0 }}>{'DN: ' + dn + ' (' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</div>
          </div>
        </div>
      </div>
    )
  }

  function Footer() {
    return (
      <div id="RODAPÉ" className='print'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          fontFamily: 'Helvetica',
          margin: 5,
          height: 130,
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <div style={{ fontSize: 10, margin: 5 }}>{'DOCUMENTO ASSINADO DIGITALMENTE POR:'}</div>
          <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{nomeusuario}</div>
          <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{conselho}</div>
        </div>
        <div style={{ width: 50, height: 50, backgroundColor: 'grey', borderRadius: 5, alignSelf: 'flex-end' }}>
        </div>
      </div >
    )
  }

  function Print() {
    return (
      <div id="IMPRESSÃO - ANAMNESE - CREFONO" className="print">
        <table style={{ width: '100%' }}>
          <thead style={{ width: 140, width: '100%' }}>
            <tr style={{ width: 140, width: '100%' }}>
              <td style={{ width: 140, width: '100%' }}>
                <Header></Header>
              </td>
            </tr>
          </thead>
          <tbody style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div id="campos"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    breakInside: 'auto', alignSelf: 'center', width: '100%'
                  }}>
                  <Campos></Campos>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot style={{ width: 140, width: '100%' }}>
            <tr style={{ width: 140, width: '100%' }}>
              <td style={{ width: 140, width: '100%' }}>
                <Footer></Footer>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  };

  function printDiv() {
    console.log('PREPARANDO REGISTROS ATUAIS PARA IMPRESSÃO');
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
      console.log(x.filter(item => item.idevolucao == iddocumento).length);
      setprintdocumento(1);
      setTimeout(() => {
        let printdocument = document.getElementById("IMPRESSÃO - ANAMNESE - CREFONO").innerHTML;
        var a = window.open('  ', '  ', 'width=' + '1024px' + ', height=' + '800px');
        a.document.write('<html>');
        a.document.write(printdocument);
        a.document.write('</html>');
        a.print();
        a.close();
        setprintdocumento(0);
      }, 1000);
    });
  }
  // renderização dos componentes.
  return (
    <div style={{
      display: tipodocumento == 'ANAMNESE - CREFONO' && conselho == 'CREFONO' && statusdocumento != null ? 'flex' : 'none',
      flexDirection: 'column', justifyContent: 'center',
    }}>
      <Campos></Campos>
      <div>
        <Print></Print>
      </div>
    </div>
  )
}

export default AnamneseFono;