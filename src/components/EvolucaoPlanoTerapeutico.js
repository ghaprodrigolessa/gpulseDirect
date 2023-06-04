/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoPlanoTerapeutico({ width, especialidade }) {

  const {
    idpaciente, idatendimento,
    iddocumento, idselecteddocumento,
    camposopcoes, camposvalores,
    setcamposvalores, printdocumento,
    statusdocumento, setstatusdocumento,
    registros_atuais,
    objetivos,
    metas,
    tipodocumento, conselho
  } = useContext(Context)

  const [random, setrandom] = useState(null);
  const [valor, setvalor] = useState(null);
  // OBJETIVOS: 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado.
  // METAS: 0 = a validar, 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
  useEffect(() => {
    let resumo = null;
    setrandom(Math.random());
    resumo =
      'OBJETIVOS SECUNDÁRIOS ATIVOS:'
      +
      objetivos.filter(item => item.statusobjetivo == 1 && item.tipoobjetivo == 2).map(item => '\n' + item.objetivo) +
      '\n\n'
      +
      'METAS ATIVAS:'
      +
      metas.filter(item => item.status == 0).map(item => '\n' + item.meta);
    setvalor(resumo);
  }, [statusdocumento, iddocumento]);

  const insertValor = (valor) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: 206,
      idopcao: 678,
      opcao: 'RESUMO PLANO TERAPÊUTICO',
      valor: valor,
      idevolucao: iddocumento
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
    });
  }

  return (
    <div>
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
          padding: 10,
          margin: 5,
          alignSelf: 'center'
        }}
      >
        <div className='title2center'>{'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE'}</div>
        <div
          id="texto"
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center',
          }}>
          <div style={{ position: 'relative' }}>
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
              id={'opcao' + random}
              defaultValue={valor}
              style={{
                alignSelf: 'center',
                height: 100,
                width: width,
                maxWidth: '',
                minWidth: '',
                margin: 2.5,
              }}
            ></textarea>
          </div>
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
          {'RESUMO DO PLANO TERAPÊUTICO PARA ' + especialidade}
        </div>
        <div
          id="texto"
          style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
          <div
            style={{
              overflowWrap: 'break-word',
              whiteSpace: 'pre-line',
              alignSelf: 'center',
              width: '90vw',
              backgroundColor: 'rgb(0, 0, 0, 0.1)',
              borderRadius: 5,
              padding: 5,
              color: 'black',
              fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
              fontSize: 10,
            }}
          >{valor}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvolucaoPlanoTerapeutico;