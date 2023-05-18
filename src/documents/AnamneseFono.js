/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import axios from 'axios'
import moment from 'moment';
import logo from '../images/paulodetarso_logo.png'
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import imprimir from '../images/imprimir.svg';

import EvolucaoTexto from '../components/EvolucaoTexto';

// viewdocumento 111(form), 112(pdf), 113(busy).
function AnamneseFono() {

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

  let camposusados = [67, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 203, 204]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CREFONO' && conselho == 'CREFONO') {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        setregistros_antigos(x.filter(item => item.evolucao == 'ANAMNESE - CREFONO' && item.idevolucao < iddocumento));
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
  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
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
        style={{
          display: printdocumento == 1 ? 'none' : 'flex',
          marginTop: 20, marginBottom: 20
        }}>
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

  // ESCALA PARD (showescala = 16).
  const [pardscore, setpardscore] = useState(0);

  const [escapeoralanterior, setoralescapeanterior] = useState(0);
  const [tempotransitooraladequado, settempotransitooraladequado] = useState(0);
  const [refluxonasal, setrefluxonasal] = useState(0);
  const [numerodegluticoes, setnumerodegluticoes] = useState(0);
  const [residuooral, setresiduooral] = useState(0);
  const [elevacaolaringea, setelevacaolaringea] = useState(0);
  const [tosse, settosse] = useState(0);
  const [engasgo, setengasgo] = useState(0);
  const [auscultacervicallimpa, setauscultacervicallimpa] = useState(0);
  const [qualidadevocaladequada, setqualidadevocaladequada] = useState(0);
  const [sato2, setsao2] = useState(0);
  const [cianose, setcianose] = useState(0);
  const [broncoespasmo, setbroncoespasmo] = useState(0);
  const [fc, setfc] = useState(0);
  const [fr, setfr] = useState(0);

  const insertPard = () => {
    setpardscore(
      escapeoralanterior + tempotransitooraladequado + refluxonasal +
      numerodegluticoes + residuooral + elevacaolaringea + tosse +
      engasgo + auscultacervicallimpa + qualidadevocaladequada + sato2 +
      cianose + broncoespasmo + fc + fr);
    var significado = '';
    if (pardscore < 5) {
      significado = 'DEGLUTIÇÃO NORMAL';
    } else if (pardscore > 4 && pardscore < 10) {
      significado = 'DEGLUTIÇÃO FUNCIONAL';
    } else if (pardscore > 9 && pardscore < 15) {
      significado = 'DISFAGIA OROFARÍNGEA LEVE';
    } else if (pardscore > 14 && pardscore < 20) {
      significado = 'DISFAGIA OROFARÍNGEA LEVE A MODERADA';
    } else if (pardscore > 19 && pardscore < 25) {
      significado = 'DISFAGIA OROFARÍNGEA MODERADA';
    } else if (pardscore > 24 && pardscore < 30) {
      significado = 'DISFAGIA OROFARÍNGEA MODERADA A GRAVE';
    } else {
      significado = 'DISFAGIA OROFARÍNGEA GRAVE';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 16,
      ds_escala: 'PARD',
      valor_resultado: pardscore,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      // loadEscalas();
    })
  }
  const updatePardValor = () => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      var id = x
        .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 204)
        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
      // atualizando registro.  
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        idcampo: 204,
        idopcao: 675,
        opcao: 'ESCALA - PARD',
        valor: pardscore,
        idevolucao: iddocumento
      }
      console.log(obj);
      axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj);
    });
  }
  function Pard() {
    return (
      <div className="menucontainer"
        style={{
          display: printdocumento == 1 ? 'none' : 'flex',
          marginTop: 20, marginBottom: 20
        }}>
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{'AVALIAÇÃO DE RISCO PARA DISFAGIA'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="green-button"
              onClick={() => { insertPard(); updatePardValor() }}
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
        id="FORMULÁRIO - ANAMNESE FONO"
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

          <div style={{ width: '100%', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DA FONOAUDIOLOGIA</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA DOENÇA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoMultipla idcampo={77} campo={'DIAGNÓSTICO ADMISSIONAL'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={78} campo={'OUTROS DIAGNÓSTICOS'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={79} campo={'ESTADO DE ALERTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={80} campo={'ORIENTADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={81} campo={'DISPOSITIVOS'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={82} campo={'TIPO DE CÂNULA TQT'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={83} campo={'NÚMERO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={2} width={150}></EvolucaoTexto>
            <EvolucaoTexto idcampo={84} campo={'MODELO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={100} width={150}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={85} campo={'CUFF'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={86} campo={'VIA DE ALIMENTAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={87} campo={'DIETA POR VIA ORAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={88} campo={'HIDRATAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={89} campo={'ESPESSANTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={90} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={91} campo={'EXPRESSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={93} campo={'COGNIÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <div style={{ width: '100%', fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>MOTRICIDADE OROFACIAL</div>
            <EvolucaoSelecaoSimples idcampo={94} campo={'SIMETRIA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={95} campo={'RIGIDEZ'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={96} campo={'MOBILIDADE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={97} campo={'SENSIBILIDADE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={98} campo={'COORDENAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={99} campo={'ARTICULAÇÃO TEMPOROMANDIBULAR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={100} campo={'ARCADA DENTÁRIA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={101} campo={'PRÓTESE DENTÁRIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoSimples idcampo={102} campo={'HIGIENE ORAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={103} campo={'SALIVA'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <div style={{ width: '100%', fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>{'AVALIAÇÃO DE RISCO PARA DISFAGIA (PARD)'}</div>
            <Pard></Pard>
            <EvolucaoTexto idcampo={204} campo={'ESCALA PARD'} obrigatorio={1} tipo={'card'} lenght={10} width={150}></EvolucaoTexto>

            <EvolucaoSelecaoSimples idcampo={104} campo={'CONCLUSÃO - PARD'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <Fois></Fois>
            <EvolucaoTexto idcampo={203} campo={'ESCALA FOIS'} obrigatorio={1} tipo={'card'} lenght={10} width={150}></EvolucaoTexto>

            <div style={{ width: '100%', fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>{'CONDUTA'}</div>
            <EvolucaoSelecaoSimples idcampo={105} campo={'DIETA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={106} campo={'CONSISTÊNCIA DO ALIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={107} campo={'CONSISTÊNCIA DO LÍQUIDO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={108} campo={'VÍNCULO COM O SETOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
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
      </div >
    )
  };

  function printDiv() {
    setprintdocumento(1);
    setTimeout(() => {
      var divContents = document.getElementById("FORMULÁRIO - ANAMNESE FONO").innerHTML;
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
    <div style={{ display: tipodocumento == 'ANAMNESE - CREFONO' && conselho == 'CREFONO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
    </div>
  )
}

export default AnamneseFono;