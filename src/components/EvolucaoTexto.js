/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoTexto({ idcampo, campo, obrigatorio, tipo, tamanho }) {

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
  
  var timeout = null;
  console.log('VALOR DE X: ' + x);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div className='title2center' style={{ marginTop: 20 }}>{campo}</div>
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
                  maxLength={tamanho}
                  id={"text" + idcampo}
                  defaultValue={x}
                  style={{
                    width: '90%', alignSelf: 'center',
                    height: 100
                  }}
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      insertValor(item, document.getElementById("text" + idcampo).value.toUpperCase())
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
                  maxLength={tamanho}
                  id={"text" + idcampo}
                  defaultValue={x}
                  style={{
                    width: '90%', alignSelf: 'center',
                  }}
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      insertValor(item, document.getElementById("text" + idcampo).value)
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
  );
}

export default EvolucaoTexto;