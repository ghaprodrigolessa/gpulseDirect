/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import EvolucaoTexto from '../components/EvolucaoTexto';
import { PrintDocument } from './PrintDocument';
import { gravaRegistrosDocumentos } from '../components/gravaRegistrosDocumentos';

// viewdocumento 111(form), 112(pdf), 113(busy).
function AnamneseFono() {

  const {
    statusdocumento,
    idatendimento,
    conselho,
    tipodocumento,
    camposopcoes,
    setregistros_atuais,
    registros_atuais,
    setregistros_antigos,
    iddocumento,
    idselecteddocumento,
    setstatusdocumento,
    idpaciente,
    objetivos,
    metas,
    selectedcategoria,
    printdocumento,
    setprintdocumento,
  } = useContext(Context);

  let camposusados = [67, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 203, 204]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CREFONO' && conselho == 'CREFONO') {
      {
        gravaRegistrosDocumentos(
          camposusados,
          statusdocumento,
          idatendimento,
          camposopcoes,
          setregistros_atuais,
          setregistros_antigos,
          iddocumento,
          idselecteddocumento,
          setstatusdocumento,
          idpaciente,
          objetivos,
          metas,
        )
      };
    }
  }, [statusdocumento, tipodocumento, selectedcategoria]);

  // ESCALA DE FOIS (showescala = 4).
  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  function Fois() {
    const [nivel, setnivel] = useState(registros_atuais.filter(item => item.idcampo == 203).map(item => item.valor));
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
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
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
    return (
      <div>
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
        <EvolucaoTexto idcampo={203} campo={'ESCALA FOIS'} obrigatorio={1} tipo={'card'} lenght={10} width={150} valor_escala={nivel}></EvolucaoTexto>
      </div>
    );
  }

  // ESCALA PARD (showescala = 16).
  function Pard() {
    const [pardscore, setpardscore] = useState(registros_atuais.filter(item => item.idcampo == 204).map(item => item.valor));
    const [escapeoralanterior, setescapeoralanterior] = useState(0);
    const [tempotransitooraladequado, settempotransitooraladequado] = useState(0);
    const [refluxonasal, setrefluxonasal] = useState(0);
    const [numerodegluticoes, setnumerodegluticoes] = useState(0);
    const [residuooral, setresiduooral] = useState(0);
    const [elevacaolaringea, setelevacaolaringea] = useState(0);
    const [tosse, settosse] = useState(0);
    const [engasgo, setengasgo] = useState(0);
    const [auscultacervicallimpa, setauscultacervicallimpa] = useState(0);
    const [qualidadevocaladequada, setqualidadevocaladequada] = useState(0);
    const [sato2, setsato2] = useState(0);
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
    return (
      <div>
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
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  marginBottom: 5,
                  width: '60vw', height: '50vh'
                }}>

                <div className="title2center">ESCAPE ORAL ANTERIOR</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={escapeoralanterior == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setescapeoralanterior(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={escapeoralanterior == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setescapeoralanterior(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">TEMPO DE TRÂNSITO ORAL ADEQUADO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={tempotransitooraladequado == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settempotransitooraladequado(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={tempotransitooraladequado == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settempotransitooraladequado(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">REFLUXO NASAL</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={refluxonasal == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setrefluxonasal(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={refluxonasal == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setrefluxonasal(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">NÚMERO DE DEGLUTIÇÕES</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={numerodegluticoes == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setnumerodegluticoes(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={numerodegluticoes == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setnumerodegluticoes(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">RESÍDUO ORAL</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={residuooral == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setresiduooral(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={residuooral == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setresiduooral(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">ELEVAÇÃO LARÍNGEA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={elevacaolaringea == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setelevacaolaringea(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={elevacaolaringea == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setelevacaolaringea(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">TOSSE</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={tosse == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settosse(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={tosse == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => settosse(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">ENGASGO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={engasgo == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setengasgo(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={engasgo == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setengasgo(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">AUSCULTA CERVICAL LIMPA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={auscultacervicallimpa == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setauscultacervicallimpa(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={auscultacervicallimpa == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setauscultacervicallimpa(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">QUALIDADE VOCAL ADEQUADA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={qualidadevocaladequada == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setqualidadevocaladequada(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={qualidadevocaladequada == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setqualidadevocaladequada(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">SATURAÇÃO DE OXIGÊNIO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={sato2 == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setsato2(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={sato2 == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setsato2(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">CIANOSE</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={cianose == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setcianose(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={cianose == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setcianose(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">BRONCOESPASMO</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={broncoespasmo == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setbroncoespasmo(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={broncoespasmo == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setbroncoespasmo(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">FREQUÊNCIA CARDÍACA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={fc == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setfc(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={fc == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setfc(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

                <div className="title2center">FREQUÊNCIA RESPIRATÓRIA</div>
                <div style={{ display: 'flex', flexDirection: 'row', height: 75, width: '100%', justifyContent: 'center' }}>
                  <div
                    className={fr == 2 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setfr(2)}
                  >
                    LÍQUIDO
                  </div>
                  <div
                    className={fr == 1 ? 'red-button' : 'blue-button'}
                    style={{ width: 200 }}
                    onClick={() => setfr(1)}
                  >
                    PASTOSO/SÓLIDO
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <EvolucaoTexto idcampo={204} campo={'ESCALA PARD'} obrigatorio={1} tipo={'card'} lenght={10} width={150} valor_escala={pardscore}></EvolucaoTexto>
      </div>
    );
  }

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - ANAMNESE CREFONO"
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
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="title2center" style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE FONOAUDIOLÓGICA</div>
            <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA MOLÉSTIA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoMultipla idcampo={77} campo={'DIAGNÓSTICO ADMISSIONAL'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={78} campo={'OUTROS DIAGNÓSTICOS'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO CLÍNICA</div>
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
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>COMUNICAÇÃO</div>
            <EvolucaoSelecaoSimples idcampo={90} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={91} campo={'EXPRESSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={93} campo={'COGNIÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>MOTRICIDADE OROFACIAL</div>
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
            <div className="title2center" style={{ fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>{'AVALIAÇÃO DE RISCO PARA DISFAGIA (PARD)'}</div>
            <Pard></Pard>
            <EvolucaoSelecaoSimples idcampo={104} campo={'CONCLUSÃO - PARD'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <Fois></Fois>
            <div style={{ width: '100%', fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>{'CONDUTA'}</div>
            <EvolucaoSelecaoSimples idcampo={105} campo={'DIETA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={106} campo={'CONSISTÊNCIA DO ALIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={107} campo={'CONSISTÊNCIA DO LÍQUIDO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={108} campo={'VÍNCULO COM O SETOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={'60vw'}></EvolucaoTexto>
          </div>
        </div>
      </div >
    )
  };

  function printDiv() {
    console.log('PREPARANDO REGISTROS ATUAIS PARA IMPRESSÃO');
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
      console.log(x.filter(item => item.idevolucao == iddocumento).length);
      setprintdocumento(1);
      setTimeout(() => {
        let printdocument = document.getElementById("PRINTDOCUMENT - ANAMNESE CREFONO").innerHTML;
        var a = window.open('  ', '  ', 'width=' + '1024px' + ', height=' + '800px');
        a.document.write('<html>');
        a.document.write(printdocument);
        a.document.write('</html>');
        a.print();
        a.close();
        setprintdocumento(0);
      }, 1000);
    });
  }

  // renderização dos componentes.
  return (
    <div style={{ display: tipodocumento == 'ANAMNESE - CREFONO' && conselho == 'CREFONO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - ANAMNESE CREFONO' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default AnamneseFono;