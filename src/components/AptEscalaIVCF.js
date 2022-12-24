/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';

function AptEscalaIVCF({ viewescalaivcf }) {
  // recuperando estados globais (Context.API).
  const {
    idatendimento
  } = useContext(Context)
  var html = 'https://pulsarapp-server.herokuapp.com';

  const [data, setdata] = useState(moment().format('DD/MM/YYYY'));
  const [percepcaosaude, setpercepcaosaude] = useState(0);
  const [fazercompras, setfazercompras] = useState(0);
  const [pagarcontas, setpagarcontas] = useState(0);
  const [trabalhosdomesticos, settrabalhosdomesticos] = useState(0);

  const [banhosozinho, setbanhosozinho] = useState(0);

  const [esquecimentofamilia, setesquecimentofamilia] = useState(0);
  const [pioraesquecimento, setpioraesquecimento] = useState(0);
  const [esquecimentocotidiano, setesquecimentocotidiano] = useState(0);

  const [desanimo, setdesanimo] = useState(0);
  const [anedonia, setanedonia] = useState(0);

  const [elevammss, setelevammss] = useState(0);
  const [pinca, setpinca] = useState(0);
  const [perdapeso, setperdapeso] = useState(0);
  const [imc, setimc] = useState(0);
  const [panturrilhas, setpanturrilhas] = useState(0);
  const [velocidade, setvelocidade] = useState(0);
  const [marcha, setmarcha] = useState(0);
  const [quedas, setquedas] = useState(0);
  const [incontinencia, setincontinencia] = useState(0);

  const [visao, setcvisao] = useState(0);
  const [audicao, setaudicao] = useState(0);

  const [polipatologia, setpolipatologia] = useState(0);
  const [polifarmacia, setpolifarmacia] = useState(0);
  const [internacao, setinternacao] = useState(0);


  const [valor, setvalor] = useState('100%');

  // crud.
  const [listaIVCF, setlistaIVCF] = useState([])
  const loadIVCF = () => {
    axios.get(html + "/ivcf").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistaIVCF(x.filter(item => item.idatendimento == idatendimento));
    });
  }

  const selectIVCF = (item) => {
    setdata(item.data);
    // ...
  }

  const createIVCF = () => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      // ...
    }
    axios.post(html + '/createivcf', obj).then(() => {
    });
  }

  const updateIVCF = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      // ...
    }
    axios.post(html + '/updateivcf/' + item.id, obj).then(() => {
    });
  }

  const deleteIVCF = (item) => {
    axios.get(html + "/deleteivcf/'" + item.id + "'").then(() => {
    });
  }

  // lista de registros da escala.
  function ListaIVCF() {
    return (
      <div className="scroll">
        {listaIVCF.map(item => (
          <div className="row">
            <button onClick={() => selectIVCF(item)}>{item.data}</button>
          </div>
        ))}
      </div>
    )
  }

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewescalaivcf);
  useEffect(() => {
    if (viewescalaivcf !== 0) {
      setviewcomponent(viewescalaivcf);
    } else {
    }
  }, [viewescalaivcf])

  return (
    <div className="menucover fade-in"
      style={{ zIndex: 9, display: viewcomponent == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="menucontainer"
        style={{ display: viewcomponent == 1 ? 'flex' : 'none' }}>
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{'IVCF'}</div>
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
            // onClick={() => insertIVCF()}
            >
              <img
                alt=""
                src={salvar}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
          </div>
        </div>
        <div className="corpo">
          <div className="scroll"
            style={{
              display: 'flex', flexDirection: 'column',
              backgroundColor: 'transparent', borderColor: 'transparent', height: '70vh', width: '80vw'
            }}>
            <div id="AUTO-PERCEPÇÃO DA SAÚDE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title4">AUTO-PERCEPÇÃO DA SAÚDE</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>EXCELENTE, MUITO BOA OU BOA</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>REGULAR OU RUIM</button>
              </div>
            </div>

            <div id="ATIVIDADES DA VIDA DIÁRIA" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title4" style={{ marginTop: 20 }}>ATIVIDADES DE VIDA DIÁRIA</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="title2center">AVD INSTRUMENTAL</div>
                <div id="AVD INSTRUMENTAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE FAZER COMPRAS</button>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE CONTROLAR O DINHEIRO E DE PAGAR CONTAS</button>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE REALIZAR PEQUENOS TRABALHOS DOMÉSTICOS</button>
                </div>
                <div className="title2center">AVD BÁSICA</div>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE TOMAR BANHO SOZINHO</button>
              </div>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COGNIÇÃO</div>
            <div id="COGNIÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ESQUECIMENTO PERCEBIDO POR FAMILIARES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PIORA DO ESQUECIMENTO NOS ÚLTIMOS MESES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ESQUECIMENTO IMPEDE A REALIZAÇÃO DE ATIVIDADES COTIDIANAS?</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>HUMOR</div>
            <div id="HUMOR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DESÂNIMO OU TRISTEZA NO ÚLTIMO MÊS</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PIORA DO ESQUECIMENTO NOS ÚLTIMOS MESES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ANEDONIA NO ÚLTIMO MÊS?</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>MOBILIDADE</div>
            <div id="MOBILIDADE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title2center" style={{ marginTop: 20 }}>ALCANCE, PREENSÃO E PINÇA</div>
              <div id="ALCANCE, PREENSÃO E PINÇA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCAPAZ DE ELEVAR MMSS ACIMA DO OMBRO</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCAPAZ DE MANUSEAR OU SEGURAR OBJETOS PEQUENOS?</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>CAPACIDADE AERÓBICA E MUSCULAR</div>
              <div id="CAPACIDADE AERÓBICA E MUSCULAR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'PERDA DE PESO (4.5KG EM UM ANO, 6KG EM 6 MESES, 3KG EM UM MÊS)'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'IMC < 22Kg/m2'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'CIRC. DE PANTURRILHA < 31cm'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'TESTE DE VELOCIDADE > 5s'}</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>MARCHA</div>
              <div id="MARCHA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ALTERAÇÃO DE MARCHA IMPEDE ATIVIDADES COTIDIANAS</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DUAS OU MAIS QUEDAS NO ÚLTIMO ANO</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>CONTINÊNCIA ESFINCTERIANA</div>
              <div id="CONTINÊNCIA ESFINCTERIANA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCONTINÊNCIA URINÁRIA OU FECAL</button>
              </div>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COMUNICAÇÃO</div>
            <div id="COMUNICAÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PROBLEMA DE VISÃO IMPEDE ATIVIDADES COTIDIANAS</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PROBLEMA DE AUDIÇÃO IMPEDE ATIVIDADES COTIDIANAS</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COMORBIDADES MÚLTIPLAS</div>
            <div id="COMORBIDADES MÚLTIPLAS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>CINCO OU MAIS DOENÇAS CRÔNICAS</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>CINCO OU MAIS MEDICAMENTOS DIFERENTES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INTERNAÇÃO NOS ÚLTIMOS 6 MESES</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AptEscalaIVCF;