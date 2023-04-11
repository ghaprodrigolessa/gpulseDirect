/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoSimples({ idcampo, campo, obrigatorio }) {

  const {
    idpaciente, idatendimento,
    iddocumento,
    camposopcoes,
    camposvalores, setcamposvalores,
    statusdocumento, setstatusdocumento,
    idselecteddocumento,
    selectedcampo, setselectedcampo,
    printdocumento, setprintdocumento
  } = useContext(Context)

  let htmlinsertvalor = process.env.REACT_INSERT_EVOLUCAO_VALOR;
  let htmldeletevalor = process.env.REACT_DELETE_EVOLUCAO_VALOR;

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
            setstatusdocumento(0);
          });
        }, 1000);

      } else if (statusdocumento == -1 && iddocumento != 0 && registros_antigos.length == 0) {
        // cria um registro baseado nos campos de seleção única (valor padrão 'SELECIONE').
        console.log('CRIA VALOR NOVO - SELEÇÃO ÚNICA');
        camposopcoes.filter(item => item.idcampo == idcampo).slice(-1).map(item => insertValor(item, 'NÃO'));

        setTimeout(() => {
          axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
            var x = [0, 1];
            x = response.data.rows;
            setregistros_atuais(x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento));
            setstatusdocumento(0);
          });
        }, 1000);

      } else {
        console.log('RECUPERANDO VALOR DO DOCUMENTO');
        // setregistros_antigos([]);
        camposopcoes.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento).map(item => registros_atuais.push(item));
      }
    });
  }, [statusdocumento]);

  const insertValor = (item, valor) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: item.id,
      opcao: campo,
      valor: 'SELECIONE',
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

  const loadCamposValores = () => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      console.log('CARREGANDO VALORES DE CAMPOS');
      var x = [0, 1];
      x = response.data;
      setcamposvalores(x.rows);
    });
  }

  const updateValor = (item, valor) => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo && valor.opcao == campo)
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

  return (
    <div>
      <div id="form"
        style={{
          display: printdocumento == 1 ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: 5,
          borderColor: 'white',
          borderStyle: 'solid',
          borderWidth: 5,
          padding: 10,
          margin: 5,
        }}
      >
        <div className='title2center'>{campo}</div>
        {alertaEmBranco(idcampo)}
        <div
          id={"seletor" + idcampo}
          onMouseLeave={() => {
            if (
              obrigatorio == 1 &&
              document.getElementById("seletor" + idcampo).getElementsByClassName("red-button").length < 1) {
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
            return (
              <div id={'opcao' + item.id}
                className={x == item.opcao ? 'red-button' : 'blue-button'}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                onClick={() => {
                  // document.getElementById('opcao' + item.id).className = 'red-button';
                  updateValor(item, item.opcao);
                  x = item.opcao;
                  setTimeout(() => {

                    var botoes = document.getElementById("seletor" + idcampo).getElementsByClassName("red-button");
                    for (var i = 0; i < botoes.length; i++) {
                      botoes.item(i).className = "blue-button";
                    }
                    document.getElementById('opcao' + item.id).className = 'red-button';
                    x = item.valor

                  }, 500);
                }}
              >
                {item.opcao}
              </div>
            )
          }
          )}
        </div>
      </div>
      <div id="print"
        style={{
          display: printdocumento == 1 ? 'flex' : 'none',
          flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
          borderRadius: 5,
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 1,
          padding: 10,
          margin: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: 'black', fontWeight: 'bold', alignSelf: 'center',
              marginTop: 10,
              fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
              fontSize: 14,
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
            }}
          >
            {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
              var x = registros_atuais.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
              return (
                <div id={'opcao' + item.id}
                  className={x == item.opcao ? 'red-button' : 'blue-button'}
                  style={{
                    paddingLeft: 10, paddingRight: 10,
                    backgroundColor: x == item.opcao ? 'rgb(0, 0, 0, 0.2)' : 'transparent',
                    borderRadius: 5,
                    margin: 10,
                    padding: 10,
                    minWidth: 100,
                    maxWidth: 300,
                    color: x == item.opcao ? 'black' : 'grey',
                    fontSize: 12,
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
    </div >
  );
}

export default EvolucaoSelecaoSimples;