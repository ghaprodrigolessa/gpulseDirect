/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoSimples({ idcampo, campo, obrigatorio }) {

  const {

    idpaciente, idatendimento,
    iddocumento,
    camposopcoes,
    camposvalores,
  } = useContext(Context)

  let htmlinsertvalor = process.env.REACT_INSERT_EVOLUCAO_VALOR;
  let htmldeletevalor = process.env.REACT_DELETE_EVOLUCAO_VALOR;

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
  var x = camposvalores.sort((a, b) => moment(a) > moment(b) ? -1 : 1).filter(item => item.idevolucao == iddocumento && item.idcampo == idcampo).slice(-1).map(item => item.valor);
  console.log('VALOR DE X: ' + x);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div className='title2center' style={{ marginTop: 20 }}>{campo}</div>
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
          return (
            <div id={'opcao' + item.id}
              className={x == item.opcao ? 'red-button' : 'blue-button'}
              style={{ paddingLeft: 10, paddingRight: 10 }}
              onClick={() => {
                var botoes = document.getElementById("seletor" + idcampo).getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById('opcao' + item.id).className = 'red-button';
                x = item.opcao
                insertValor(item, item.opcao);
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

export default EvolucaoSelecaoSimples;