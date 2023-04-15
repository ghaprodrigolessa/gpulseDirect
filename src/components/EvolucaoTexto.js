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

  let htmlinsertvalor = process.env.REACT_INSERT_EVOLUCAO_VALOR;
  let htmldeletevalor = process.env.REACT_DELETE_EVOLUCAO_VALOR;

  /*
  const [registros_antigos, setregistros_antigos] = useState([]);
  const [registros_atuais, setregistros_atuais] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais([]);
      setregistros_antigos(x.filter(item => item.idcampo == idcampo && item.idevolucao < iddocumento));
      setregistros_atuais(x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento));
      setcamposvalores(x.rows);
      if (statusdocumento == -2) {
        // novo documento (copia registros do documento anterior).
        console.log('COPIA VALOR DA EVOLUÇÃO ANTERIOR');
        x.filter(item => item.idevolucao == idselecteddocumento && item.idcampo == idcampo).map(item => copiaValor(item, item.valor));

        setTimeout(() => {
          axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
            var x = [0, 1];
            x = response.data.rows;
            setregistros_atuais(x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento));
            // setstatusdocumento(0);
          });
        }, 1000);

      } else if (statusdocumento == -1 && iddocumento != 0 && registros_antigos.length == 0) {
        // cria um registro baseado nos campos de seleção única (valor padrão 'SELECIONE').
        console.log('CRIA VALOR NOVO - SELEÇÃO ÚNICA');
        camposopcoes.filter(item => item.idcampo == idcampo).slice(-1).map(item => insertValor(item, '...'));

        setTimeout(() => {
          axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
            var x = [0, 1];
            x = response.data.rows;
            setregistros_atuais(x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento));
            // setstatusdocumento(0);
          });
        }, 1000);

      } else if (statusdocumento > -1 || statusdocumento == -2) {
        console.log('RECUPERANDO VALOR DO DOCUMENTO');
        // setregistros_antigos([]);
        camposopcoes.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento).map(item => registros_atuais.push(item));
      }
    });
  }, [statusdocumento]);

  */

  const insertValor = (item, valor) => {
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
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
    });
  }

  const copiaValor = (item, valor) => {
    // inserindo registro.  
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: item.idopcao,
      opcao: item.opcao,
      valor: valor,
      idevolucao: iddocumento // id do documento recém-criado.
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
      // loadCamposValores();
    });
  }

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

  /*
  Cada clique em uma das opções de seleção para o campo respondido, gera um registro no banco 
  de dados, para o documento em preenchimento.
  Quando este documento é consultado, os últimos registros para cada opção de campo serão exibidos. 
  */

  var timeout = null;
  return (
    <div>
      <div id="form"
        style={{
          display: printdocumento == 0 ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 5,
          borderColor: 'white',
          borderStyle: 'solid',
          borderWidth: 5,
          padding: 10,
          margin: 5,
          width: width,
        }}
      >
        <div className='title2center'>{campo}</div>
        <div
          id="texto"
          onMouseLeave={() => {
            if (
              obrigatorio == 1 &&
              document.getElementById("text" + idcampo).value == '') {
              document.getElementById("alerta" + idcampo).style.display = 'flex';
            } else {
              document.getElementById("alerta" + idcampo).style.display = 'none';
            }
          }}
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
            if (tipo == "textarea") {
              return (
                <div style={{ position: 'relative' }}>
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
                    id={"text" + idcampo}
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
                        updateValor(item, document.getElementById("text" + idcampo).value.toUpperCase())
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