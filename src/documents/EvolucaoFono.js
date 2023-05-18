/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import axios from 'axios'
import moment from 'moment';
import logo from '../images/paulodetarso_logo.png'
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';

import EvolucaoTexto from '../components/EvolucaoTexto';

// viewdocumento 111(form), 112(pdf), 113(busy).
function EvolucaoFono() {

  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
    printdocumento, setprintdocumento,
    idatendimento,
    nomeunidade, box,
    datadocumento,
    nomepaciente, nomemae, dn,
    nomeusuario, conselho,
    tipodocumento,
    camposopcoes, setcamposopcoes,
    camposvalores, setcamposvalores,
    registros_atuais, setregistros_atuais,
    registros_antigos, setregistros_antigos,
    idcampo, setidcampo,
    iddocumento,
    idselecteddocumento,
    setstatusdocumento,
    idpaciente,
    selectedcategoria,
  } = useContext(Context);

  let camposusados = [79, 80, 109, 81, 82, 83, 84, 85, 110, 111, 90, 91, 92, 86, 87, 88, 89, 112, 113, 114, 115, 105, 106, 107, 116, 117, 118, 119, 120, 121, 122, 47, 48, 203]

  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  useEffect(() => {
    if (tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFONO' && conselho == 'CREFONO') {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        setregistros_antigos(x.filter(item => item.evolucao == 'EVOLUÇÃO ESTRUTURADA - CREFONO' && item.idevolucao < iddocumento));
        setcamposvalores(x.rows);
        if (statusdocumento == -2) {
          console.log('COPIA VALOR DA EVOLUÇÃO SELECIONADA');
          camposusados.map(item => x.filter(valor => valor.idcampo == item && valor.idevolucao == idselecteddocumento).map(item => copiaValor(item)));
          setTimeout(() => {
            axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
              var x = [0, 1];
              x = response.data.rows;
              setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
              setstatusdocumento(0);
            });
          }, 1000);
        } else if (statusdocumento == -1 && iddocumento != 0) {
          console.log('CRIA VALOR NOVO');
          if (registros_antigos.length > 0) {
            var lastid = null;
            var htmlghapevolucoes = process.env.REACT_APP_API_CLONE_EVOLUCOES;
            axios.get(htmlghapevolucoes + idpaciente).then((response) => {
              var x = [0, 1];
              var y = [0, 1];
              x = response.data;
              y = x.rows;
              var lastevolution = y.sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento).slice(-1);
              lastid = lastevolution.map(item => item.id).pop();
              console.log(lastid);
              console.log('ANTIGOS!')
              camposusados.map(item => registros_antigos.filter(valor => valor.idcampo == item && valor.idevolucao == lastid - 1).map(item => insertValor(item, item.idcampo, item.idopcao, item.valor)));
            });
          } else {
            camposusados.map(item => camposopcoes.filter(valor => valor.idcampo == item).map(item => insertValor(item, item.idcampo, item.id, null)));
          }
          setTimeout(() => {
            axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
              var x = [0, 1];
              x = response.data.rows;
              setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
              setstatusdocumento(0);
            });
          }, 1000);
        } else if (statusdocumento > -1) {
          setregistros_atuais([]);
          console.log('RECUPERANDO VALOR DO DOCUMENTO');
          axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
            var x = [0, 1];
            x = response.data.rows;
            setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
          });
        }
      });
    }
  }, [statusdocumento, tipodocumento, selectedcategoria]);

  const insertValor = (item, idcampo, idopcao, valor) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: idopcao,
      opcao: item.opcao,
      valor: valor,
      idevolucao: iddocumento
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
    });
  }

  const copiaValor = (item) => {
    // inserindo registro.  
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: item.idcampo,
      idopcao: item.idopcao,
      opcao: item.opcao,
      valor: item.valor,
      idevolucao: iddocumento // id do documento recém-criado.
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
      // loadCamposValores();
    });
  }

  // ESCALA DE FOIS (showescala = 4).
  const [nivel, setnivel] = useState(7);
  const insertFois = () => {
    var significado = '';
    if (nivel == 1) {
      significado = 'NADA POR VIA ORAL.';
    } else if (nivel == 2) {
      significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).';
    } else if (nivel == 3) {
      significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.';
    } else if (nivel == 4) {
      significado = 'VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.';
    } else if (nivel == 5) {
      significado = 'VIA ORAL TOTAL, COM MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.';
    } else if (nivel == 6) {
      significado = 'VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.';
    } else {
      significado = 'VIA ORAL TOTAL, SEM RESTRIÇÕES';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 4,
      ds_escala: 'FOIS',
      valor_resultado: nivel,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      // loadEscalas();
    })
  }
  const updateFoisValor = () => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 203)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
      // atualizando registro.  
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        idcampo: 203,
        idopcao: 675,
        opcao: 'ESCALA - FOIS',
        valor: nivel,
        idevolucao: iddocumento
      }
      console.log(obj);
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj);
    });
  }

  function Fois() {
    return (
      <div className="menucontainer"
        style={{ display: printdocumento == 1 ? 'none' : 'flex', marginTop: 20, marginBottom: 20 }}>
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{'ESCALA DE FOIS'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="green-button"
              onClick={() => { insertFois(); updateFoisValor() }}
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
        <div>
          <div
            className="corpo">
            <div
              className="scroll"
              style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'center',
                marginBottom: 5, flexWrap: 'wrap',
                width: '60vw', height: '50vh'
              }}>
              <button
                onClick={() => { setnivel(1) }}
                className={nivel == 1 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                NADA POR VIA ORAL
              </button>
              <button
                onClick={() => { setnivel(2) }}
                className={nivel == 2 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).
              </button>
              <button
                onClick={() => { setnivel(3) }}
                className={nivel == 3 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.
              </button>
              <button
                onClick={() => { setnivel(4) }}
                className={nivel == 4 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, minHeight: 150, padding: 10 }}>
                VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.
              </button>
              <button
                onClick={() => { setnivel(5) }}
                className={nivel == 5 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.
              </button>
              <button
                onClick={() => { setnivel(6) }}
                className={nivel == 6 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.
              </button>
              <button
                onClick={() => { setnivel(7) }}
                className={nivel == 7 ? "red-button" : "blue-button"}
                style={{ width: 200, height: 200, padding: 10 }}>
                VIA ORAL TOTAL, SEM RESTRIÇÕES.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - EVOLUÇÃO FONO"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '70vw',
          height: '50vh',
          scrollBehavior: 'smooth',
          paddingRight: 10,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          alignSelf: 'center',
          opacity: statusdocumento == 1 || statusdocumento == 2 ? 0.7 : 1,
          position: 'relative',
          fontFamily: 'Helvetica',
          pageBreakInside: 'avoid',
        }}
      >
        <button id="print-button"
          className="green-button noprint"
          title="IMPRIMIR EVOLUÇÃO."
          onClick={() => { printDiv() }}
          style={{
            display: printdocumento == 1 ? 'none' : 'flex',
            position: 'sticky',
            top: 0, left: 0,
            marginTop: 0,
            width: 50, minWidth: 50,
            height: 50, minHeight: 50,
            alignSelf: 'flex-end',
            zIndex: 20
          }}
        >
          <img
            alt=""
            src={imprimir}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </button>
        <div
          style={{
            pointerEvents: statusdocumento == 1 || statusdocumento == 2 ? 'none' : 'auto',
            fontFamily: 'Helvetica',
          }}>
          <div fixed={true} id="CABEÇALHO" style={{
            display: printdocumento == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 2.5,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            fontFamily: 'Helvetica',
            margin: 2.5,
            marginTop: 5,
            height: 130,
          }}>
            <div id='logo + nome do hospital + id do documento'
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <img id="logo"
                  alt=""
                  src={logo}
                  style={{
                    margin: 0,
                    width: 80, height: 60,
                    alignSelf: 'center',
                  }}
                ></img>
                <div id="nome do hospital"
                  style={{ fontSize: 18, textAlign: 'center', padding: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                  {'CLÍNICA DE TRANSIÇÃO PAULO DE TARSO'}
                </div>
              </div>
              <div id="id do documento"
                style={{
                  display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', padding: 5, backgroundColor: '#f2f2f2', borderRadius: 5, margin: 5, alignSelf: 'center'
                }}>
                <div style={{ fontSize: 10, margin: 2.5, marginTop: 0, textAlign: 'right' }}>{'ATENDIMENTO: ' + idatendimento}</div>
                <div style={{ fontSize: 10, margin: 2.5, textAlign: 'right' }}>{nomeunidade + ' - ' + box}</div>
                <div style={{ fontSize: 10, margin: 2.5, marginBottom: 0, textAlign: 'right' }}>{'EMITIDO EM: ' + moment(datadocumento).format('DD/MM/YYYY - HH:mm')}</div>
              </div>
            </div>
            <div id="nome do paciente + id do paciente">
              <div style={{ fontSize: 14, margin: 5, fontWeight: 'bold' }}>{'PACIENTE: ' + nomepaciente}</div>
              <div style={{ fontSize: 10, margin: 5, marginTop: 0, marginBottom: 0 }}>{'MÃE: ' + nomemae}</div>
              <div style={{ flexDirection: 'row', margin: 5, marginTop: 2.5 }}>
                <div style={{ fontSize: 10, margin: 0 }}>{'DN: ' + dn + ' (' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO INICIAL</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>

            <EvolucaoSelecaoSimples idcampo={79} campo={'ESTADO DE ALERTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={80} campo={'ORIENTADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={109} campo={'RESPIRAÇÃO ESPONTÂNEA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={81} campo={'DISPOSITIVOS'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={82} campo={'TIPO DE CÂNULA TQT'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={83} campo={'NÚMERO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={2} width={150}></EvolucaoTexto>
            <EvolucaoTexto idcampo={84} campo={'MODELO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={100} width={150}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={85} campo={'CUFF'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <EvolucaoSelecaoSimples idcampo={110} campo={'INDICAÇÃO PARA DESMAME DE VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={111} campo={'CRITÉRIOS DE EXCLUSÃO PARA DESMAME DE VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1}></EvolucaoSelecaoMultipla>

            <EvolucaoSelecaoSimples idcampo={90} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={91} campo={'EXPRESSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <EvolucaoSelecaoSimples idcampo={86} campo={'VIA DE ALIMENTAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={87} campo={'DIETA POR VIA ORAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={88} campo={'HIDRATAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={89} campo={'ESPESSANTE'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <EvolucaoSelecaoSimples idcampo={112} campo={'APETITE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={113} campo={'CRITÉRIO PARA BLUE DYE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={114} campo={'RESULTADO DO TESTE BLUE DYE'} obrigatorio={1} tipo={'textarea'} lenght={300} width={300}></EvolucaoTexto>
            <EvolucaoTexto idcampo={115} campo={'EVOLUÇÃO FONOAUDIOLÓGICA'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={300}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={105} campo={'DIETA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={106} campo={'CONSISTÊNCIA DO ALIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={107} campo={'CONSISTÊNCIA DO LÍQUIDO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={116} campo={'MODO DE OFERTA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={117} campo={'CONDUTA FONOAUDIOLÓGICA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <div style={{ fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>ESCALA DE FOIS APÓS ABORDAGEM</div>

            <Fois></Fois>
            <EvolucaoTexto idcampo={203} campo={'ESCALA FOIS'} obrigatorio={1} tipo={'input'} lenght={10} width={150}></EvolucaoTexto>

            <EvolucaoSelecaoSimples idcampo={118} campo={'DESMAME DE VIA ALIMENTAR ALTERNATIVA EFETIVADO DURANTE ESTA INTERNAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={119} campo={'DATA DE EFETIVAÇÃO DO DESMAME DA VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} tipo={'date'} lenght={10} width={150}></EvolucaoTexto>
            <EvolucaoTexto idcampo={120} campo={'JUSTIFICATIVA PARA A NÃO EFETIVAÇÃO DO DESMAME DA VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} tipo={'date'} lenght={10} width={150}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={121} campo={'VÍNCULO COM O SETOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={122} campo={'PROGNÓSTICO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={47} campo={'TRANSIÇÃO DE CUIDADOS'} obrigatorio={1} tipo={"textarea"} length={2000} width={200}></EvolucaoTexto>
            <EvolucaoTexto idcampo={48} campo={'DISCUSSÃO INTERDISCIPLINAR'} obrigatorio={1} tipo={"textarea"} length={2000} width={200}></EvolucaoTexto>
          </div>

          <div id="assinatura"
            style={{
              display: printdocumento == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center', alignSelf: 'center', width: '100%',
              alignContent: 'center', textAlign: 'center',
              marginTop: 20,
            }}>
            <div style={{ fontSize: 10, margin: 5 }}>{'DOCUMENTO ASSINADO DIGITALMENTE POR:'}</div>
            <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{nomeusuario}</div>
            <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{conselho}</div>
          </div>

        </div>
      </div>
    )
  };

  function printDiv() {
    setprintdocumento(1);
    setTimeout(() => {
      var divContents = document.getElementById("FORMULÁRIO - EVOLUÇÃO FONO").innerHTML;
      var a = window.open();
      a.document.write('<html>');
      a.document.write(divContents);
      a.document.write('</body></html>');
      a.print();
      a.close();
      setprintdocumento(0);
    }, 1000);
  }

  // renderização dos componentes.
  return (
    <div style={{ display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFONO' && conselho == 'CREFONO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
    </div>
  )
}

export default EvolucaoFono;