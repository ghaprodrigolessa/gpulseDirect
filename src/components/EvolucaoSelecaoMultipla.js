/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoMultipla({ idcampo, campo, obrigatorio, width }) {

  const {
    idpaciente, idatendimento,
    iddocumento,
    statusdocumento,
    camposopcoes,
    printdocumento,
    registros_atuais,
  } = useContext(Context);

  const [random, setrandom] = useState(null);
  console.log("SELEÇÃO MÚLTIPLA!!")
  useEffect(() => {
    if (statusdocumento != null) {
      setrandom(Math.random());
    }
  }, [statusdocumento]);

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

  function FormMulti() {
    const [x, setx] = useState(registros_atuais.filter(valor => valor.idevolucao == iddocumento));
    return (
      <div>
        {
          camposopcoes.filter(item => item.idcampo == idcampo).map(item => {
            var y = x.filter(valor => valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.valor);
            return (
              <div id={'opcao' + item.id + random}
                className={y == 'SIM' ? 'red-button' : 'blue-button'}
                title={y}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                onClick={() => {
                  if (y == 'NÃO') {
                    y = 'SIM';
                    updateValor(item, 'SIM', x.filter(valor => valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.id));
                  } else {
                    y = 'NÃO';
                    updateValor(item, 'NÃO', x.filter(valor => valor.idcampo == item.idcampo && valor.idopcao == item.id).map(valor => valor.id));
                  }
                }}
              >
                {item.opcao}
              </div>
            )
          }
          )
        }
      </div>
    )
  }

  function PrintMulti() {
    return (
      <div>
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
          <FormMulti></FormMulti>
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
          width: width
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
          <PrintMulti></PrintMulti>
        </div>
      </div>
    </div>
  );
}

export default EvolucaoSelecaoMultipla;