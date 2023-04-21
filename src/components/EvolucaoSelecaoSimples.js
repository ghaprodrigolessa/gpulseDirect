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
    printdocumento, setprintdocumento,
    registros_atuais, setregistros_atuais,
    selectedcategoria,
  } = useContext(Context)

  const [registros, setregistros] = useState([]);
  const [random, setrandom] = useState(null);
  useEffect(() => {
    if (statusdocumento != null) {
      // console.log('RENDERIZOU - EVOLUÇÃO SIMPLES');
      setregistros(registros_atuais);
      setrandom(Math.random());
    }
  }, [registros_atuais, statusdocumento]);

  const updateValor = (item, opcao, valor) => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo && valor.opcao == opcao)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
      // console.log('ID:' + id)
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
      // console.log(obj);
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj).then(() => {
        setTimeout(() => {
          var botoes = document.getElementById("campo" + random).getElementsByClassName("red-button");
          for (var i = 0; i < botoes.length; i++) {
            botoes.item(i).className = "blue-button";
          }
          document.getElementById('opcao' + item.id + random).className = 'red-button';
          // console.log("campo" + random);
          // console.log('opcao' + item.id + random);
        }, 500);
      });
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
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          {camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var x = registros.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == idcampo && valor.idopcao == item.id).map(item => item.valor);
            return (
              <div id={'opcao' + item.id + random}
                title={'opcao' + item.id + random}
                className={x != '' ? 'red-button' : 'blue-button'}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                onClick={() => {
                  // limpando todas as opções.
                  registros.filter(valor => valor.idevolucao == iddocumento && valor.idcampo == item.idcampo).map(item => {
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
            )
          }
          )}
        </div>
      </div>
      <div id={"print" + random}
        style={{
          display: printdocumento == 1 ? 'flex' : 'none',
          flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
          borderRadius: 5,
          borderColor: 'black',
          borderStyle: 'solid',
          borderWidth: 1,
          padding: 5,
          margin: 2.5,
          pageBreakInside: 'avoid',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: 'black', fontWeight: 'bold', alignSelf: 'center',
              fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
              fontSize: 12,
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
              var x = registros.filter(valor => valor.idcampo == item.idcampo).map(item => item.valor);
              return (
                <div id={'print_opcao' + random}
                  className={x == item.opcao ? 'red-button' : 'blue-button'}
                  style={{
                    paddingLeft: 5, paddingRight: 5,
                    backgroundColor: x == item.opcao ? 'rgb(0, 0, 0, 0.2)' : 'transparent',
                    borderRadius: 5,
                    margin: 2.5,
                    padding: 5,
                    maxWidth: 200,
                    color: x == item.opcao ? 'black' : 'grey',
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
    </div >
  );
}

export default EvolucaoSelecaoSimples;