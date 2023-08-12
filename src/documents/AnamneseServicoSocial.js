/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';
import logo from '../images/paulodetarso_logo.png';

// viewdocumento 111(form), 112(pdf), 113(busy).
function AnamneseServicoSocial() {

  console.log('ANAMNESE SERVIÇO SOCIAL!!!')
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
    if (tipodocumento == 'ANAMNESE - CRESS') {
      setrandom(Math.random());
    }
  }, [tipodocumento]);

  // funções para montagem dos campos estruturados do documento.
  const evolucaoSelecaoSimples = (idcampo, campo, obrigatorio, width) => {
    if (tipodocumento == 'ANAMNESE - CRESS') {
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
                pointerEvents: conselhousuario == 'CRESS' ? 'auto' : 'none',
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
                  pointerEvents: conselhousuario == 'CRESS' ? 'auto' : 'none',
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
    if (tipodocumento == 'ANAMNESE - CRESS') {
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
                pointerEvents: conselhousuario == 'CRESS' ? 'auto' : 'none',
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
                    pointerEvents: conselhousuario == 'CRESS' ? 'auto' : 'none',
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
    if (tipodocumento == 'ANAMNESE - CRESS') {
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
                pointerEvents: conselhousuario == 'CRESS' ? 'auto' : 'none',
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

  function Gijon() {
    // ESCALA DE GIJÓN (showescala = 9).
    const [situacaofamiliar, setsituacaofamiliar] = useState(0);
    const [situacaoeconomica, setsituacaoeconomica] = useState(0);
    const [relacoessociais, setrelacoessociais] = useState(0);
    const [contatofamilia, setcontatofamilia] = useState(0);
    const [apoioredesocial, setapoioredesocial] = useState(0);
    const [habitacao, sethabitacao] = useState(-1);
    const [gijonscore, setgijonscore] = useState(registros_atuais.filter(item => item.idcampo == 205).map(item => item.valor).slice(-1));;

    var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
    const insertGijon = () => {
      var score = (situacaofamiliar + situacaoeconomica + relacoessociais + contatofamilia + apoioredesocial + habitacao);
      setgijonscore(score);
      var significado = '';
      if (score < 10) {
        significado = 'BOA SITUAÇÃO SOCIAL';
      } else if (score > 9 && score < 15) {
        significado = 'RISCO SOCIAL';
      } else {
        significado = 'PROBLEMA SOCIAL';
      }
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        cd_escala: 9,
        ds_escala: 'GIJÓN',
        valor_resultado: gijonscore,
        ds_resultado: significado,
        idprofissional: 0,
        status: 1,
      }
      axios.post(htmlghapinsertescala, obj);
    }

    const updateGijonValor = () => {
      var score = (situacaofamiliar + situacaoeconomica + relacoessociais + contatofamilia + apoioredesocial + habitacao);
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        var id = x
          .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 205)
          .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
        // atualizando registro.  
        console.log('ID: ' + id);
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: 205,
          idopcao: 677,
          opcao: 'ESCALA - GIJON',
          valor: score,
          idevolucao: iddocumento
        }
        console.log(obj);
        axios.post('http://192.168.100.6:3333/insert_evolucao_valor/', obj);
      });
    }

    const setActive = (escala, btn) => {
      var botoes = document.getElementById(escala).getElementsByClassName("red-button");
      for (var i = 0; i < botoes.length; i++) {
        botoes.item(i).className = "blue-button";
      }
      document.getElementById(btn).className = "red-button"
    }

    return (
      <div className="menucontainer" style={{ width: '60vw' }}>
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{'ESCALA DE GIJÓN'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="green-button"
              onClick={() => { insertGijon(); updateGijonValor() }}
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
        <div
          className="corpo">
          <div>
            <div className="scroll"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                marginBottom: 5, height: '60vh',
                alignSelf: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <div className="title2center">SITUAÇÃO FAMILIAR</div>
              <div id="SITUACAO_FAMILIAR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="sf1"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(0); setActive("SITUACAO_FAMILIAR", "sf1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE COM A FAMÍLIA SEM DEPENDÊNCIA FÍSICA OU PSÍQUICA
                </button>
                <button id="sf2"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(1); setActive("SITUACAO_FAMILIAR", "sf2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE COM CONJUJE/ COMPANHEIRO DE SIMILARIDADE
                </button>
                <button id="sf3"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(2); setActive("SITUACAO_FAMILIAR", "sf3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE COM A FAMÍLIA E/OU CONJUGUE/COMPANHEIRO COM ALGUM GRAU DE DEPENDÊNCIA
                </button>
                <button id="sf4"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(3); setActive("SITUACAO_FAMILIAR", "sf4") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE COM PESSOAS QUE NÃO SÃO FAMILIARES POR LAÇOS SANGUÍNEOS
                </button>
                <button id="sf5"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(4); setActive("SITUACAO_FAMILIAR", "sf5") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE SOZINHO, MAS TEM FAMILIARES PRÓXIMOS
                </button>
                <button id="sf6"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(5); setActive("SITUACAO_FAMILIAR", "sf6") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VIVE SOZINHO, SEM FILHOS OU FAMILIARES PRÓXIMOS
                </button>
                <button id="sf7"
                  className="blue-button"
                  onClick={() => { setsituacaofamiliar(6); setActive("SITUACAO_FAMILIAR", "sf7") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  {"ESTÁ INSTITUCIONALIZADO (LONGA PERMANÊNCIA)"}
                </button>
              </div>
              <div className="title2center">SITUAÇÃO ECONÔMICA</div>
              <div id="SITUACAO_ECONOMICA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="se1"
                  className="blue-button"
                  onClick={() => { setsituacaoeconomica(0); setActive("SITUACAO_ECONOMICA", "se1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  MAIS DE 3 SALÁRIOS MÍNIMOS
                </button>
                <button id="se2"
                  className="blue-button"
                  onClick={() => { setsituacaoeconomica(1); setActive("SITUACAO_ECONOMICA", "se2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  DE 2 A 3 SALÁRIOS MÍNIMOS
                </button>
                <button id="se3"
                  className="blue-button"
                  onClick={() => { setsituacaoeconomica(2); setActive("SITUACAO_ECONOMICA", "se3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  DE 1 A 2 SALÁRIOS MÍNIMOS
                </button>
                <button id="se4"
                  className="blue-button"
                  onClick={() => { setsituacaoeconomica(3); setActive("SITUACAO_ECONOMICA", "se4") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  ABAIXO DE 1 SALÁRIO MÍNIMO
                </button>
                <button id="se5"
                  className="blue-button"
                  onClick={() => { setsituacaoeconomica(4); setActive("SITUACAO_ECONOMICA", "se5") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  SEM RENDIMENTO
                </button>
              </div>
              <div className="title2center">RELAÇÕES SOCIAIS</div>
              <div id="RELACOES_SOCIAIS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="rl1"
                  className="blue-button"
                  onClick={() => { setrelacoessociais(0); setActive("RELACOES_SOCIAIS", "rl1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  RELAÇÕES SOCIAIS, VIDA SOCIAL ATIVA
                </button>
                <button id="rl2"
                  className="blue-button"
                  onClick={() => { setrelacoessociais(1); setActive("RELACOES_SOCIAIS", "rl2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  RELAÇÕES SOCIAIS SÓ COM FAMÍLIA E VIZINHOS, SAI DE CASA
                </button>
                <button id="rl3"
                  className="blue-button"
                  onClick={() => { setrelacoessociais(2); setActive("RELACOES_SOCIAIS", "rl3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  APENAS SE RELACIONA COM A FAMÍLIA OU VIZINHOS, SAI DE CASA
                </button>
                <button id="rl4"
                  className="blue-button"
                  onClick={() => { setrelacoessociais(3); setActive("RELACOES_SOCIAIS", "rl4") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  NÃO SAI DE CASA, RECEBE FAMÍLIA OU VISITAS
                </button>
                <button id="rl5"
                  className="blue-button"
                  onClick={() => { setrelacoessociais(4); setActive("RELACOES_SOCIAIS", "rl5") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  NÃO SAI DE CASA NEM RECEBE VISITAS
                </button>
              </div>
              <div className="title2center">CONTATO COM A FAMÍLIA</div>
              <div id="CONTATO_FAMILIA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="cf1"
                  className="blue-button"
                  onClick={() => { setcontatofamilia(0); setActive("CONTATO_FAMILIA", "cf1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  QUINZENAL / SEMANAL / DIÁRIO
                </button>
                <button id="cf2"
                  className="blue-button"
                  onClick={() => { setcontatofamilia(1); setActive("CONTATO_FAMILIA", "cf2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  MENSAL
                </button>
                <button id="cf3"
                  className="blue-button"
                  onClick={() => { setcontatofamilia(2); setActive("CONTATO_FAMILIA", "cf3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  4 A 11 VEZES AO ANO
                </button>
                <button id="cf4"
                  className="blue-button"
                  onClick={() => { setcontatofamilia(3); setActive("CONTATO_FAMILIA", "cf4") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  1 A 3 VEZES AO ANO
                </button>
                <button id="cf5"
                  className="blue-button"
                  onClick={() => { setcontatofamilia(4); setActive("CONTATO_FAMILIA", "cf5") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  SEM CONTATO
                </button>
              </div>
              <div className="title2center">APOIO DE REDE SOCIAL</div>
              <div id="REDE_SOCIAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="rs1"
                  className="blue-button"
                  onClick={() => { setapoioredesocial(0); setActive("REDE_SOCIAL", "rs1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  COM APOIO DE FAMILIAR OU DE VIZINHOS
                </button>
                <button id="rs2"
                  className="blue-button"
                  onClick={() => { setapoioredesocial(1); setActive("REDE_SOCIAL", "rs2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  VOLUNTARIADO SOCIAL, AJUDA DOMICILIÁRIA
                </button>
                <button id="rs3"
                  className="blue-button"
                  onClick={() => { setapoioredesocial(2); setActive("REDE_SOCIAL", "rs3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  NÃO TEM APOIO
                </button>
                <button id="rs4"
                  className="blue-button"
                  onClick={() => { setapoioredesocial(3); setActive("REDE_SOCIAL", "rs4") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  COM CRITÉRIOS PARA INGRESSO EM INSTITUIÇÃO GERIÁTRICA
                </button>
                <button id="rs5"
                  className="blue-button"
                  onClick={() => { setapoioredesocial(4); setActive("REDE_SOCIAL", "rs5") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  TEM CUIDADOS PERMANENTES
                </button>
              </div>
              <div className="title2center">HABITAÇÃO</div>
              <div id="HABITAÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button id="hab1"
                  className="blue-button"
                  onClick={() => { sethabitacao(0); setActive("HABITAÇÃO", "hab1") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  ADEQUADA ÀS NECESSIDADES
                </button>
                <button id="hab2"
                  className="blue-button"
                  onClick={() => { sethabitacao(1); setActive("HABITAÇÃO", "hab2") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  BARREIRAS ARQUITETÔNICAS NA CASA/ENTRADA
                </button>
                <button id="hab3"
                  className="blue-button"
                  onClick={() => { sethabitacao(2); setActive("HABITAÇÃO", "hab3") }}
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  UMIDADE, FRACAS CONDIÇÕES DE HIGIENE, AUSÊNCIA DE ÁGUA OU INFRAESTRUTURA
                </button>
              </div>
              <div className="title2">RESULTADO</div>
              <div className='blue-button' style={{ width: 75 }}>{gijonscore}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Campos() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - ANAMNESE - CRESS"
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
          <div id="CORPO DO DOCUMENTO - ANAMNESE - CRESS"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DO SERVIÇO SOCIAL</div>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE SOCIAL REALIZADA COM:</div>
            {evolucaoTexto(123, 'NOME DO ACOMPANHANTE', 1, 'input', 200, 600)}
            {evolucaoTexto(124, 'GRAU DE PARENTESCO', 1, 'input', 200, 600)}
            {evolucaoTexto(125, 'CONTATO DO ACOMPANHANTE', 1, 'input', 200, 600)}
            {evolucaoSelecaoSimples(126, 'RELIGIÃO', 1)}
            {evolucaoTexto(127, 'OUTRA RELIGIÃO', 1, 'input', 200, 600)}
            {evolucaoSelecaoSimples(128, 'GRAU DE INSTRUÇÃO', 1)}
            {evolucaoSelecaoSimples(129, 'ESTADO CIVIL', 1)}
            {evolucaoSelecaoSimples(130, 'POSSUI FILHOS', 1)}
            {evolucaoSelecaoSimples(131, 'TRABALHA ATUALMENTE', 1)}
            {evolucaoSelecaoSimples(132, 'POSSUI BENEFÍCIO', 1)}
            {evolucaoSelecaoSimples(133, 'REPRESENTANTE LEGAL', 1)}
            {evolucaoSelecaoSimples(134, 'TABAGISTA', 1)}
            {evolucaoSelecaoSimples(135, 'ETILISTA', 1)}
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>{'COMPOSIÇÃO FAMILIAR (COM QUEM O PACIENTE RESIDE)'}</div>
            {evolucaoTexto(136, 'NOME DO PARENTE DE REFERÊNCIA', 1, 'input', 200, 600)}
            {evolucaoTexto(137, 'GRAU DE PARENTESCO', 1, 'input', 200, 600)}
            {evolucaoTexto(138, 'IDADE DO PARENTE', 1, 'input', 3, 150)}
            {evolucaoTexto(139, 'ESTADO CIVIL DO PARENTE', 1, 'input', 200, 600)}
            {evolucaoTexto(140, 'OCUPAÇÃO DO PARENTE', 1, 'input', 200, 600)}
            {evolucaoTexto(141, 'CONTATO DO PARENTE', 1, 'input', 200, 600)}
            {evolucaoTexto(142, 'ENDEREÇO ATUAL', 1, 'input', 2000, 600)}
            {evolucaoTexto(143, 'CENTRO DE SAÚDE E EQUIPE DE REFERÊNCIA', 1, 'input', 2000, 600)}
            {evolucaoTexto(144, 'ENDEREÇO PÓS ALTA', 1, 'input', 2000, 600)}
            {evolucaoTexto(145, 'OBSERVAÇÕES - ANAMNESE DO SERVIÇO SOCIAL', 1, 'textarea', 2000, 600)}
            <Gijon></Gijon>
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
      <div id="IMPRESSÃO - ANAMNESE - CRESS" className="print">
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
        let printdocument = document.getElementById("IMPRESSÃO - ANAMNESE - CRESS").innerHTML;
        var a = window.open('  ', '  ', 'width=' + '1024px' + ', height=' + '800px');
        a.document.write('<html>');
        a.document.write(printdocument);
        a.document.write('</html>');
        a.print();
        setprintdocumento(0);
      }, 1000);
    });
  }
  // renderização dos componentes.
  return (
    <div style={{
      display: tipodocumento == 'ANAMNESE - CRESS' && conselho == 'CRESS' && statusdocumento != null ? 'flex' : 'none',
      flexDirection: 'column', justifyContent: 'center',
    }}>
      <Campos></Campos>
      <div>
        <Print></Print>
      </div>
    </div>
  )
}

export default AnamneseServicoSocial;