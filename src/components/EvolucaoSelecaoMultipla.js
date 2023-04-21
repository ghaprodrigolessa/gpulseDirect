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
    camposopcoes, camposvalores,
    setcamposvalores,
    idselecteddocumento,
    printdocumento, setprintdocumento,
    registros_atuais
  } = useContext(Context)

  const [registros, setregistros] = useState([]);
  const [random, setrandom] = useState(null);
  useEffect(() => {
    if (statusdocumento != null) {
      setregistros(registros_atuais);
      setrandom(Math.random());
    }
  }, [registros_atuais, statusdocumento]);

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
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj);
  }

  const updateValor = (item, valor) => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo && valor.opcao == item.opcao)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
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

  return (
    <div>
      <div id={"form" + random}
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
        {alertaEmBranco()}
        <div
          id={"campo" + random}
          onMouseLeave={() => {
            if (
              obrigatorio == 1 &&
              document.getElementById("campo" + random).getElementsByClassName("red-button").length < 1) {
              document.getElementById("alerta" + random).style.display = 'flex';
            } else {
              document.getElementById("alerta" + random).style.display = 'none';
            }
          }}
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.idevolucao == iddocumento && valor.opcao == item.opcao).map(item => item.valor);
            return (
              <div id={'opcao' + item.id + random}
                className={x == 'SIM' ? 'red-button' : 'blue-button'}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                onClick={() => {
                  if (x == 'NÃO' || x == '') {
                    document.getElementById('opcao' + item.id + random).className = 'red-button';
                    updateValor(item, 'SIM', item.opcao);
                    x = 'SIM'
                  } else {
                    document.getElementById('opcao' + item.id + random).className = 'blue-button';
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
          padding: 5,
          margin: 2.5,
          pageBreakInside: 'avoid',
        }}>
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
          id={"seletor" + idcampo}
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros_atuais.filter(valor => valor.opcao == item.opcao).map(item => item.valor);
            return (
              <div id={'opcao' + item.id + random}
                className={x == 'SIM' ? 'red-button' : 'blue-button'}
                style={{
                  paddingLeft: 5, paddingRight: 5,
                  backgroundColor: x == 'SIM' ? 'rgb(0, 0, 0, 0.2)' : 'transparent',
                  borderRadius: 5,
                  margin: 2.5,
                  padding: 5,
                  maxWidth: 200,
                  color: x == 'SIM' ? 'black' : 'grey',
                  fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                  fontSize: 10,
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