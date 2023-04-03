/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoMultipla({ idcampo, campo, obrigatorio }) {

  const {
    idpaciente, idatendimento,
    iddocumento, tipodocumento, statusdocumento,
    camposopcoes,
    setcamposvalores, camposvalores
  } = useContext(Context)

  let htmlinsertvalor = process.env.REACT_INSERT_EVOLUCAO_VALOR;
  let htmlupdatevalor = process.env.REACT_UPDATE_EVOLUCAO_VALOR;
  let htmldeletevalor = process.env.REACT_DELETE_EVOLUCAO_VALOR;

  const insertValor = (item, valor) => {
    // inserindo registro.  
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: item.id,
      opcao: item.opcao,
      valor: valor.toString(),
      idevolucao: iddocumento
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
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
      console.log('CARREGANDO VALORES DE CAMPOS');
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      var id = y.sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo && valor.opcao == item.opcao).slice(-1).map(item => item.id);
      console.log('ID:' + id)
      // inserindo registro.  
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
    <div style={{ position: 'relative' }}>
      <div className='title2center' style={{ marginTop: 10 }}>{campo}</div>
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

          var x = 'NÃO';
          if (statusdocumento == -1 && iddocumento != 0) {
            // inserindo primeira evolução, copiar valores mais recentes (registrados em outros documentos).
            x = camposvalores.sort((a, b) => moment(a) > moment(b) ? -1 : 1).filter(valor => valor.opcao == item.opcao).slice(-1).map(item => item.valor);
            console.log('VALOR MAIS RECENTE >> ' + x);
            if (x == undefined) {
              // nada...
            } else {
              insertValor(item, 'NÃO');
            }
          } else if (statusdocumento == -2 && iddocumento != 0) {
            // inserindo cópia de evolução >> recuperar valores da evolução anterior.
            x = camposvalores.filter(valor => valor.idevolucao == iddocumento - 1 && valor.opcao == item.opcao).sort((a, b) => moment(a) > moment(b) ? -1 : 1).map(item => item.valor);
            console.log('VALOR COPIADO >> ' + x);
            insertValor(item, x);
          } else if ((statusdocumento == 0 || statusdocumento == 1 || statusdocumento == 2) && iddocumento != 0) {
            // consultando evolução >> recuperar valores da evolução.
            x = camposvalores.filter(valor => valor.idevolucao == iddocumento && valor.opcao == item.opcao).sort((a, b) => moment(a) > moment(b) ? -1 : 1).map(item => item.valor);
            console.log('VALOR RECUPERADO >> ' + x);
          }

          return (
            <div id={'opcao' + item.id}
              onLoad={() => {
                x == 'SIM' ? document.getElementById('opcao' + item.id).className = 'red-button' : document.getElementById('opcao' + item.id).className = 'blue-button';
              }}
              className={x == 'SIM' ? 'red-button' : 'blue-button'}
              style={{ paddingLeft: 10, paddingRight: 10 }}
              onClick={() => {
                // document.getElementById('opcao' + item.id).classList.toggle('red-button');
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
  );
}

export default EvolucaoSelecaoMultipla;