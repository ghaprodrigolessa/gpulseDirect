/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import save from '../images/salvar.svg';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';

function AptEscalaPPS({ viewescalapps }) {
  // recuperando estados globais (Context.API).
  const {
    idatendimento
  } = useContext(Context)
  var html = 'https://pulsarapp-server.herokuapp.com';

  const [data, setdata] = useState(moment().format('DD/MM/YYYY'));
  const [valor, setvalor] = useState('100%');
  const [deambulacao, setdeambulacao] = useState(0);
  const [atividade, setatividade] = useState(0);
  const [autocuidado, setautocuidado] = useState(0);
  const [ingestao, setingestao] = useState(0);
  const [niveldeconsciencia, setniveldeconsciencia] = useState(0);

  // crud.
  const [listaPPS, setlistaPPS] = useState([])
  const loadPPS = () => {
    axios.get(html + "/pps").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistaPPS(x.filter(item => item.idatendimento == idatendimento));
    });
  }

  const selectPPS = (item) => {
    setdata(item.data);
    setvalor(item.valor);
    setdeambulacao(item.deambulacao);
    setatividade(item.atividade);
    setautocuidado(item.autocuidado);
    setingestao(item.ingestao);
    setniveldeconsciencia(item.niveldeconsciencia);
  }

  const createPPS = () => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      deambulacao: deambulacao,
      atividade: atividade,
      autocuidado: autocuidado,
      ingestao: ingestao,
      niveldeconsciencia: niveldeconsciencia,
    }
    axios.post(html + '/createpps', obj).then(() => {
    });
  }

  const updatePPS = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      deambulacao: deambulacao,
      atividade: atividade,
      autocuidado: autocuidado,
      ingestao: ingestao,
      niveldeconsciencia: niveldeconsciencia,
    }
    axios.post(html + '/updatepps/' + item.id, obj).then(() => {
    });
  }

  const deletePPS = (item) => {
    axios.get(html + "/deletepps/'" + item.id + "'").then(() => {
    });
  }

  // componentes da escala.
  function ListaPPS() {
    return (
      <div className="scroll">
        {listaPPS.map(item => (
          <div className="row">
            <button onClick={() => selectPPS(item)}>{item.data}</button>
          </div>
        ))}
      </div>
    )
  }

  function Deambulacao() {
    return (
      <div id="DEAMBULAÇÃO">
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: deambulacao == 1 ? 1 : 0.5 }} onClick={() => setdeambulacao(1)}>
          COMPLETA
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: deambulacao == 2 ? 1 : 0.5 }} onClick={() => setdeambulacao(2)}>
          REDUZIDA
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: deambulacao == 3 ? 1 : 0.5 }} onClick={() => setdeambulacao(3)}>
          SENTADO OU DEITADO
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: deambulacao == 4 ? 1 : 0.5 }} onClick={() => setdeambulacao(4)}>
          ACAMADO
        </button>
      </div>
    )
  }

  function AtividadeEvidenciaDaDoenca() {
    return (
      <div id="ATIVIDADE E EVIDÊNCIA DA DOENÇA">
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: atividade == 1 ? 1 : 0.5 }} onClick={() => setatividade(1)}>
          NORMAL. SEM EVIDÊNCIA DE DOENÇA
        </button>
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: atividade == 2 ? 1 : 0.5 }} onClick={() => setatividade(2)}>
          NORMAL. ALGUMA EVIDÊNCIA DE DOENÇA
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: atividade == 3 ? 1 : 0.5 }} onClick={() => setatividade(3)}>
          COM ESFORÇO. ALGUMA EVIDÊNCIA DE DOENÇA
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: atividade == 4 ? 1 : 0.5 }} onClick={() => setatividade(4)}>
          INCAPAZ PARA O TRABALHO. ALGUMA EVIDÊNCIA DE DOENÇA
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: atividade == 5 ? 1 : 0.5 }} onClick={() => setatividade(5)}>
          INCAPAZ DE REALIZAR HOBBIES. DOENÇA SIGNIFICATIVA
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: atividade == 6 ? 1 : 0.5 }} onClick={() => setatividade(6)}>
          INCAPAZ PARA QUALQUER TRABALHO. DOENÇA EXTENSA
        </button>
      </div>
    )
  }

  function AutoCuidado() {
    return (
      <div id="AUTOCUIDADO">
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: autocuidado == 1 ? 1 : 0.5 }} onClick={() => setautocuidado(1)}>
          COMPLETO
        </button>
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: autocuidado == 2 ? 1 : 0.5 }} onClick={() => setautocuidado(2)}>
          ASSISTÊNCIA OCASIONAL
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: autocuidado == 3 ? 1 : 0.5 }} onClick={() => setautocuidado(3)}>
          ASSISTÊNCIA CONSIDERÁVEL
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: autocuidado == 4 ? 1 : 0.5 }} onClick={() => setautocuidado(4)}>
          ASSISTÊNCIA QUASE COMPLETA
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: autocuidado == 5 ? 1 : 0.5 }} onClick={() => setautocuidado(5)}>
          DEPENDÊNCIA COMPLETA
        </button>
      </div>
    )
  }

  function Ingestao() {
    return (
      <div id="INGESTÃO">
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: ingestao == 1 ? 1 : 0.5 }} onClick={() => setingestao(1)}>
          NORMAL
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: ingestao == 2 ? 1 : 0.5 }} onClick={() => setingestao(2)}>
          REDUZIDA
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: ingestao == 3 ? 1 : 0.5 }} onClick={() => setingestao(3)}>
          INGESTÃO LIMITADA A COLHERADAS
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: ingestao == 4 ? 1 : 0.5 }} onClick={() => setingestao(4)}>
          CUIDADOS COM A BOCA
        </button>
      </div>
    )
  }

  function NivelDeConsciencia() {
    return (
      <div id="NÍVEL DE CONSCIÊNCIA">
        <button className="green-button" style={{ margin: 10, width: '50vw', opacity: niveldeconsciencia == 1 ? 1 : 0.5 }} onClick={() => setniveldeconsciencia(1)}>
          COMPLETA
        </button>
        <button className="yellow-button" style={{ margin: 10, width: '50vw', opacity: niveldeconsciencia == 2 ? 1 : 0.5 }} onClick={() => setniveldeconsciencia(2)}>
          PERÍODOS DE CONFUSÃO
        </button>
        <button className="red-button" style={{ margin: 10, width: '50vw', opacity: niveldeconsciencia == 3 ? 1 : 0.5 }} onClick={() => setniveldeconsciencia(3)}>
          CONFUSO OU EM COMA
        </button>
      </div>
    )
  }

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewescalapps);
  useEffect(() => {
    if (viewescalapps !== 0) {
      setviewcomponent(viewescalapps);
    } else {
    }
  }, [viewescalapps])

  return (
    <div className="menucover fade-in"
      style={{ zIndex: 9, display: viewcomponent == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="menucontainer">
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{viewcomponent == 1 ? 'INSERIR ESCALA PPS' : 'EDITAR ESCALA PPS'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="red-button" onClick={() => setviewcomponent(0)}>
              <img
                alt=""
                src={deletar}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
            <button className="green-button"
            // onClick={viewcomponent == 1 ? () => insertScale() : () => updateScale()}
            >
              <img
                alt=""
                src={save}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
          </div>
        </div>
        <div className="corpo" style={{ height: '80vh' }}>
          <div className="scroll">
            <div className="title2center">DEAMBULAÇÃO</div>
            <Deambulacao></Deambulacao>
            <div className="title2center">ATIVIDADE E EVIDÊNCIA DE DOENÇA</div>
            <AtividadeEvidenciaDaDoenca></AtividadeEvidenciaDaDoenca>
            <div className="title2center">AUTOCUIDADO</div>
            <AutoCuidado></AutoCuidado>
            <div className="title2center">INGESTÃO</div>
            <Ingestao></Ingestao>
            <div className="title2center">NÍVEL DE CONSCIÊNCIA</div>
            <NivelDeConsciencia></NivelDeConsciencia>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AptEscalaPPS;