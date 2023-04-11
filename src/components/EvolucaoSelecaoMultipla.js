/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoMultipla({ idcampo, campo, obrigatorio }) {

  const {
    idpaciente, idatendimento,
    iddocumento, tipodocumento,
    statusdocumento, setstatusdocumento,
    camposopcoes,
    setcamposvalores,
    idselecteddocumento,
    printdocumento, setprintdocumento,
  } = useContext(Context)

  let htmlinsertvalor = process.env.REACT_INSERT_EVOLUCAO_VALOR;
  let htmlupdatevalor = process.env.REACT_UPDATE_EVOLUCAO_VALOR;
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
        console.log('ITENS A COPIAR: ' + x.filter(item => item.idevolucao == idselecteddocumento && item.idcampo == idcampo).length);
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
        // cria registros baseados nos campos de seleção múltipla (valor padrão 'NÃO').
        console.log('CRIA VALOR NOVO');
        camposopcoes.filter(item => item.idcampo == idcampo).map(item => insertValor(item, 'NÃO'));

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

  var registros = [];
  const loadCamposValores = () => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      registros = x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento);
      setcamposvalores(x.rows);
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

  const insertValor = (item, valor) => {
    // inserindo registro.  
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: item.id,
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
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo && valor.opcao == item.opcao)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
      console.log('ID:' + id)
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
      console.log(obj);
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj).then(() => {
        loadCamposValores();
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
      <div id='form'
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
        }}>
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
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.opcao == item.opcao).map(item => item.valor);
            return (
              <div id={'opcao' + item.id}
                className={x == 'SIM' ? 'red-button' : 'blue-button'}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                onClick={() => {
                  if (x == 'NÃO' || x == '') {
                    document.getElementById('opcao' + item.id).className = 'red-button';
                    updateValor(item, 'SIM', item.opcao);
                    x = 'SIM'
                  } else {
                    document.getElementById('opcao' + item.id).className = 'blue-button';
                    updateValor(item, 'NÃO', item.opcao);
                    x = 'NÃO';
                  }
                }}
              >
                {item.opcao}
              </div>
            )
          }
          )}
        </div>
      </div>
      <div id='print'
        style={{
          display: printdocumento == 1 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center',
          borderRadius: 5,
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 1,
          padding: 10,
          margin: 5,
        }}>
        <div className='title2center'
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
          id={"seletor" + idcampo}
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.opcao == item.opcao).map(item => item.valor);
            return (
              <div id={'opcao' + item.id}
                className={x == 'SIM' ? 'red-button' : 'blue-button'}
                style={{
                  paddingLeft: 10, paddingRight: 10,
                  backgroundColor: x == 'SIM' ? 'rgb(0, 0, 0, 0.2)' : 'transparent',
                  borderRadius: 5,
                  margin: 10,
                  padding: 10,
                  minWidth: 100,
                  maxWidth: 300,
                  color: x == 'SIM' ? 'black' : 'grey',
                  fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                  fontSize: 12,
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
  );
}

export default EvolucaoSelecaoMultipla;