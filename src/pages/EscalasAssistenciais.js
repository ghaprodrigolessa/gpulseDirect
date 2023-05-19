/* eslint-disable */
/* eslint eqeqeq: "off" */
/* eslint react-hooks/exhaustive-deps: "off" */
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import useInterval from 'react-useinterval';
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import Toast from '../components/Toast';

function EscalasAssistenciais() {

  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  // recuperando estados globais (Context.API).
  const {
    idatendimento, idpaciente,
    showescala, setshowescala,
    listescalas, setlistescalas,
    dn,
    arraylistescalas, setarraylistescalas,
  } = useContext(Context)

  // destacando botões selecionados nas escalas.
  const setActive = (escala, btn) => {
    var botoes = document.getElementById(escala).getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    document.getElementById(btn).className = "red-button"
  }

  // destacando botões selecionados nas escalas.
  const setMultiplo = (btn) => {
    document.getElementById(btn).classList.toggle("red-button");
  }

  var htmlghapescalas = process.env.REACT_APP_API_CLONE_ESCALAS;
  const loadEscalas = () => {
    axios.get(htmlghapescalas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setarraylistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setTimeout(() => {
        setshowescala(0);
      }, 2000);
    });
  }

  const checkEscala = (elementos, funcao) => {
    console.log(elementos);
    if (elementos.filter(item => parseInt(item) < 0).length == 0) {
      funcao();
    } else {
      toast(1, '#ec7063', 'PREENCHIMENTO INCOMPLETO', 2000);
    }
  }

  const checkEscalaMultipla = (elementos, funcao) => {
    console.log(elementos);
    if (elementos.filter(item => parseInt(item) > 0).length > 0) {
      funcao();
    } else {
      toast(1, '#ec7063', 'PREENCHIMENTO INCOMPLETO', 2000);
    }
  }

  // ESCALA DE BRADEN (showescala = 1).
  let percepcao = -1;
  let umidade = -1;
  let atividade = -1;
  let mobilidade = -1;
  let nutricao = -1;
  let friccao = -1;
  const insertBraden = () => {
    var valor = percepcao + umidade + atividade + mobilidade + nutricao + friccao;
    var significado = '';
    if (valor > 14) {
      significado = 'RISCO BAIXO';
    } else if (valor > 12 && valor < 15) {
      significado = 'RISCO MODERADO';
    } else {
      significado = 'RISCO MUITO ALTO'
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 1,
      ds_escala: 'BRADEN',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }

  const Braden = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer" style={{ width: '95%', height: '80%' }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE BRADEN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([percepcao, umidade, atividade, mobilidade, nutricao, friccao], insertBraden)}
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
          <div
            className="corpo" style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'flex-start',
            }}>
            <div id="master" className="scroll">
              <div
                id="BRADEN1"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center' }}>PERCEPÇÃO SENSORIAL:</div>
                <button
                  id="btnBraden11"
                  // eslint-disable-next-line
                  onClick={() => { percepcao = 1; setActive("BRADEN1", "btnBraden11") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  id="btnBraden12"
                  // eslint-disable-next-line
                  onClick={() => { percepcao = 2; setActive("BRADEN1", "btnBraden12") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  MUITO LIMITADO
                </button>
                <button
                  id="btnBraden13"
                  // eslint-disable-next-line
                  onClick={() => { percepcao = 3; setActive("BRADEN1", "btnBraden13") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  id="btnBraden14"
                  // eslint-disable-next-line
                  onClick={() => { percepcao = 4; setActive("BRADEN1", "btnBraden14") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NENHUMA LIMITAÇÃO
                </button>
              </div>
              <div
                id="BRADEN2"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>UMIDADE:</div>
                <button
                  id="btnBraden21"
                  // eslint-disable-next-line
                  onClick={() => { umidade = 1; setActive("BRADEN2", "btnBraden21") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  COMPLETAMENTE MOLHADO
                </button>
                <button
                  id="btnBraden22"
                  // eslint-disable-next-line
                  onClick={() => { umidade = 2; setActive("BRADEN2", "btnBraden22") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  MUITO MOLHADO
                </button>
                <button
                  id="btnBraden23"
                  // eslint-disable-next-line
                  onClick={() => { umidade = 3; setActive("BRADEN2", "btnBraden23") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  OCASIONALMENTE MOLHADO
                </button>
                <button
                  id="btnBraden24"
                  // eslint-disable-next-line
                  onClick={() => { umidade = 4; setActive("BRADEN2", "btnBraden24") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  RARAMENTE MOLHADO
                </button>
              </div>
              <div
                id="BRADEN3"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>ATIVIDADE:</div>
                <button
                  id="btnBraden31"
                  // eslint-disable-next-line
                  onClick={() => { atividade = 1; setActive("BRADEN3", "btnBraden31") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ACAMADO
                </button>
                <button
                  id="btnBraden32"
                  // eslint-disable-next-line
                  onClick={() => { atividade = 2; setActive("BRADEN3", "btnBraden32") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  CONFINADO À CADEIRA
                </button>
                <button
                  id="btnBraden33"
                  // eslint-disable-next-line
                  onClick={() => { atividade = 3; setActive("BRADEN3", "btnBraden33") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ANDA OCASIONALMENTE
                </button>
                <button
                  id="btnBraden34"
                  // eslint-disable-next-line
                  onClick={() => { atividade = 4; setActive("BRADEN3", "btnBraden34") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ANDA FREQUENTEMENTE
                </button>
              </div>
              <div
                id="BRADEN4"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>MOBILIDADE:</div>
                <button
                  id="btnBraden41"
                  // eslint-disable-next-line
                  onClick={() => { mobilidade = 1; setActive("BRADEN4", "btnBraden41") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  id="btnBraden42"
                  // eslint-disable-next-line
                  onClick={() => { mobilidade = 2; setActive("BRADEN4", "btnBraden42") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  BASTANTE LIMITADO
                </button>
                <button
                  id="btnBraden43"
                  // eslint-disable-next-line
                  onClick={() => { mobilidade = 3; setActive("BRADEN4", "btnBraden43") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  id="btnBraden44"
                  // eslint-disable-next-line
                  onClick={() => { mobilidade = 4; setActive("BRADEN4", "btnBraden44") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NÃO APRESENTA LIMITAÇÕES
                </button>
              </div>
              <div
                id="BRADEN5"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>NUTRIÇÃO:</div>
                <button
                  id="btnBraden51"
                  // eslint-disable-next-line
                  onClick={() => { nutricao = 1; setActive("BRADEN5", "btnBraden51") }}
                  className="blue-button"
                  style={{ width: 150 }}>
                  MUITO POBRE
                </button>
                <button
                  id="btnBraden52"
                  // eslint-disable-next-line
                  onClick={() => { nutricao = 2; setActive("BRADEN5", "btnBraden52") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  PROVAVELMENTE INADEQUADA
                </button>
                <button
                  id="btnBraden53"
                  // eslint-disable-next-line
                  onClick={() => { nutricao = 3; setActive("BRADEN5", "btnBraden53") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ADEQUADA
                </button>
                <button
                  id="btnBraden54"
                  // eslint-disable-next-line
                  onClick={() => { nutricao = 4; setActive("BRADEN5", "btnBraden54") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  EXCELENTE
                </button>
              </div>
              <div
                id="BRADEN6"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>
                  FRICÇÃO E CISALHAMENTO:
                </div>
                <button
                  id="btnBraden61"
                  // eslint-disable-next-line
                  onClick={() => { friccao = 1; setActive("BRADEN6", "btnBraden61") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  PROBLEMA
                </button>
                <button
                  id="btnBraden62"
                  // eslint-disable-next-line
                  onClick={() => { friccao = 2; setActive("BRADEN6", "btnBraden62") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  PROBLEMA POTENCIAL
                </button>
                <button
                  id="btnBraden63"
                  // eslint-disable-next-line
                  onClick={() => { friccao = 3; setActive("BRADEN6", "btnBraden63") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10, marginRight: 145 }}>
                  NENHUM PROBLEMA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }, [showescala, listescalas, arraylistescalas]);

  // ESCALA DE MORSE (showescala = 2).
  let quedas = -1;
  let diagsec = -1;
  let auxilio = -1;
  let endovenosa = -1;
  let marcha = -1;
  let mental = -1;
  const insertMorse = () => {
    var valor = quedas + diagsec + auxilio + endovenosa + marcha + mental;
    var significado = '';
    if (valor < 41) {
      significado = 'RISCO MÉDIO';
    } else if (valor > 40 && valor < 52) {
      significado = 'RISCO ELEVADO';
    } else if (valor > 51) {
      significado = 'RISCO MUITO ELEVADO'
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 2,
      ds_escala: 'MORSE',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const Morse = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 2 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE MORSE'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([quedas, diagsec, auxilio, endovenosa, marcha, mental], insertMorse)}
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
          <div
            className="corpo">
            <div className="scroll" style={{ height: '60vh' }}>
              <div
                id="MORSE1"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>HISTÓRICO DE QUEDAS:</div>
                <button
                  id="btnMorse11"
                  onClick={() => { quedas = 0; setActive("MORSE1", "btnMorse11") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  id="btnMorse12"
                  onClick={() => { quedas = 25; setActive("MORSE1", "btnMorse12") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div
                id="MORSE2"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>DIAGNÓSTICO SECUNDÁRIO:</div>
                <button
                  id="btnMorse21"
                  onClick={() => { diagsec = 0; setActive("MORSE2", "btnMorse21") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  id="btnMorse22"
                  onClick={() => { diagsec = 15; setActive("MORSE2", "btnMorse22") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div
                id="MORSE3"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>AUXÍLIO NA DEAMBULAÇÃO:</div>
                <button
                  id="btnMorse31"
                  onClick={() => { auxilio = 0; setActive("MORSE3", "btnMorse31") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NENHUM, ACAMADO OU AUXILIADO POR PROFISSIONAL DE SAÚDE
                </button>
                <button
                  id="btnMorse32"
                  onClick={() => { auxilio = 15; setActive("MORSE3", "btnMorse32") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  MULETAS, BENGALA OU ANDADOR
                </button>
                <button
                  id="btnMorse33"
                  onClick={() => { auxilio = 30; setActive("MORSE3", "btnMorse33") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  MOBILIÁRIO OU PAREDE
                </button>
              </div>
              <div
                id="MORSE4"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>TERAPIA ENDOVENOSA OU CATETER VENOSO:</div>
                <button
                  id="btnMorse41"
                  onClick={() => { endovenosa = 0; setActive("MORSE4", "btnMorse41") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  id="btnMorse42"
                  onClick={() => { endovenosa = 20; setActive("MORSE4", "btnMorse42") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div
                id="MORSE5"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>MARCHA:</div>
                <button
                  id="btnMorse51"
                  onClick={() => { marcha = 0; setActive("MORSE5", "btnMorse51") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NORMAL, CADEIRANTE OU ACAMADO
                </button>
                <button
                  id="btnMorse52"
                  onClick={() => { marcha = 10; setActive("MORSE5", "btnMorse52") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  FRACA
                </button>
                <button
                  id="btnMorse53"
                  onClick={() => { marcha = 20; setActive("MORSE5", "btnMorse53") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  COMPROMETIDA, CAMBALEANTE
                </button>
              </div>
              <div
                id="MORSE6"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>ESTADO MENTAL:</div>
                <button
                  id="btnMorse61"
                  onClick={() => { mental = 0; setActive("MORSE6", "btnMorse61") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ORIENTADO E CAPAZ QUANTO A SUA LIMITAÇÃO
                </button>
                <button
                  id="btnMorse62"
                  onClick={() => { mental = 15; setActive("MORSE6", "btnMorse62") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SUPERESTIMA CAPACIDADES E ESQUECE LIMITAÇÕES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala, listescalas]);

  // ESCALA DE OXFORD (showescala = 3).
  const [grau, setgrau] = useState(0);
  const insertOxford = () => {
    var significado = '';
    if (grau == 0) {
      significado = 'AUSENTE';
    } else if (grau == 1) {
      significado = 'MÍNIMA';
    } else if (grau == 2) {
      significado = 'FRACA';
    } else if (grau == 3) {
      significado = 'REGULAR';
    } else if (grau == 4) {
      significado = 'BOA';
    } else if (grau == 5) {
      significado = 'NORMAL';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 3,
      ds_escala: 'OXFORD',
      valor_resultado: grau,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  function Oxford() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 3 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE OXFORD'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertOxford()}
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
          <div
            className="corpo">
            <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>FORÇA MUSCULAR:</div>
            <div className="scroll" style={{ height: '60vh', paddingRight: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 5 }}>
                <button
                  onClick={() => { setgrau(5) }}
                  className={grau === 5 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  NORMAL
                </button>
                <button
                  onClick={() => { setgrau(4) }}
                  className={grau === 4 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  BOA
                </button>
                <button
                  onClick={() => { setgrau(3) }}
                  className={grau === 3 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  REGULAR
                </button>
                <button
                  onClick={() => { setgrau(2) }}
                  className={grau === 2 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  FRACA
                </button>
                <button
                  onClick={() => { setgrau(1) }}
                  className={grau === 1 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  MÍNIMA
                </button>
                <button
                  onClick={() => { setgrau(0) }}
                  className={grau === 0 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  AUSENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
      loadEscalas();
    })
  }
  function Fois() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 4 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FOIS'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertFois()}
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
      </div>
    );
  }

  // ESCALA DE FUGULIN (showescala = 5).
  let estadomental = -1;
  let oxigenacao = -1;
  let sinaisvitais = -1;
  let motilidade = -1;
  let deambulacaofugulin = -1;
  let alimentacao = -1;
  let cuidadocorporal = -1;
  let eliminacao = -1;
  let terapeutica = -1;
  const insertFugulin = () => {
    var valor = estadomental + oxigenacao + sinaisvitais + motilidade + deambulacao + alimentacao + cuidadocorporal + eliminacao + terapeutica;
    var significado = '';
    if (valor < 18) {
      significado = 'CUIDADO MÍNIMO';
    } else if (valor > 17 && valor < 23) {
      significado = 'CUIDADO INTERMEDIÁRIO';
    } else if (valor > 22 && valor < 28) {
      significado = 'ALTA DEPENDÊNCIA';
    } else {
      significado = 'CUIDADO SEMI INTENSIVO';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 5,
      ds_escala: 'FUGULIN',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const Fugulin = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 5 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer" style={{ width: '90vw', height: '80vh' }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FUGULIN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([estadomental, oxigenacao, sinaisvitais, motilidade, deambulacaofugulin, alimentacao, cuidadocorporal, eliminacao, terapeutica], insertFugulin)}
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
          <div
            className="corpo">
            <div className="scroll" style={{ height: '60vh' }}>
              <div
                id="FUGULIN1"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>ESTADO MENTAL:</div>
                <button
                  id="btnFugulin11"
                  onClick={() => { estadomental = 4; setActive("FUGULIN1", "btnFugulin11") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCONSCIENTE
                </button>
                <button
                  id="btnFugulin12"
                  onClick={() => { estadomental = 3; setActive("FUGULIN1", "btnFugulin12") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  PERÍODOS DE INCONSCIÊNCIA
                </button>
                <button
                  id="btnFugulin13"
                  onClick={() => { estadomental = 2; setActive("FUGULIN1", "btnFugulin13") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  PERÍODOS DE DESORIENTAÇÃO NO TEMPO E NO ESPAÇO
                </button>
                <button
                  id="btnFugulin14"
                  onClick={() => { estadomental = 1; setActive("FUGULIN1", "btnFugulin14") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ORIENTAÇÃO NO TEMPO E NO ESPAÇO
                </button>
              </div>
              <div
                id="FUGULIN2"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>OXIGENAÇÃO:</div>
                <button
                  id="btnFugulin21"
                  onClick={() => { oxigenacao = 4; setActive("FUGULIN2", "btnFugulin21") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  VENTILAÇÃO MECÂNICA
                </button>
                <button
                  id="btnFugulin22"
                  onClick={() => { oxigenacao = 3; setActive("FUGULIN2", "btnFugulin22") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  USO CONTÍNUO DE MÁSCARA OU CATÉTER DE OXIGÊNIO
                </button>
                <button
                  id="btnFugulin23"
                  onClick={() => { oxigenacao = 2; setActive("FUGULIN2", "btnFugulin23") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  USO INTERMITENTE DE MÁSCARA OU CATÉTER DE OXIGÊNIO
                </button>
                <button
                  id="btnFugulin24"
                  onClick={() => { oxigenacao = 1; setActive("FUGULIN2", "btnFugulin24") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NÃO DEPENDE DE OXIGÊNIO
                </button>
              </div>
              <div
                id="FUGULIN3"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>SINAIS VITAIS:</div>
                <button
                  id="btnFugulin31"
                  onClick={() => { sinaisvitais = 4; setActive("FUGULIN3", "btnFugulin31") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  CONTROLE EM INTERVALOS MENORES OU IGUAIS A 2H
                </button>
                <button
                  id="btnFugulin32"
                  onClick={() => { sinaisvitais = 3; setActive("FUGULIN3", "btnFugulin32") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  CONTROLE EM INTERVALOS DE 4H
                </button>
                <button
                  id="btnFugulin33"
                  onClick={() => { sinaisvitais = 2; setActive("FUGULIN3", "btnFugulin33") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  CONTROLE EM INTERVALO DE 6H
                </button>
                <button
                  id="btnFugulin34"
                  onClick={() => { sinaisvitais = 1; setActive("FUGULIN3", "btnFugulin34") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  CONTROLE DE ROTINA (8H OU MAIS)
                </button>
              </div>
              <div
                id="FUGULIN4"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>MOTILIDADE:</div>
                <button
                  id="btnFugulin41"
                  onClick={() => { motilidade = 4; setActive("FUGULIN4", "btnFugulin41") }}
                  className="blue-button"
                  title="MUDANÇA DE DECÚBITO E MOVIMENTAÇÃO PASSIVA PROGRAMADAS E REALIZADAS PELA ENFERMAGEM."
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ DE MOVIMENTAR QUALQUER SEGMENTO CORPORAL
                </button>
                <button
                  id="btnFugulin42"
                  onClick={() => { motilidade = 3; setActive("FUGULIN4", "btnFugulin42") }}
                  className="blue-button"
                  title="MUDANÇA DE DECÚBITO E MOVIMENTAÇÃO PASSIVA AUXILIADA PELA ENFERMAGEM."
                  style={{ width: 150, padding: 10 }}>
                  DIFICULDADE PARA MOVIMENTAR SEGMENTOS CORPORAIS
                </button>
                <button
                  id="btnFugulin43"
                  onClick={() => { motilidade = 2; setActive("FUGULIN4", "btnFugulin43") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  LIMITAÇÃO DOS MOVIMENTOS
                </button>
                <button
                  id="btnFugulin44"
                  onClick={() => { motilidade = 1; setActive("FUGULIN4", "btnFugulin44") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  MOVIMENTA TODOS OS SEGMENTOS CORPORAIS
                </button>
              </div>
              <div
                id="FUGULIN5"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>DEAMBULAÇÃO:</div>
                <button
                  id="btnFugulin51"
                  onClick={() => { deambulacaofugulin = 4; setActive("FUGULIN5", "btnFugulin51") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  RESTRITO AO LEITO
                </button>
                <button
                  id="btnFugulin52"
                  onClick={() => { deambulacaofugulin = 3; setActive("FUGULIN5", "btnFugulin52") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  LOCOMOÇÃO ATRAVÉS DE CADEIRA DE RODAS
                </button>
                <button
                  id="btnFugulin53"
                  onClick={() => { deambulacaofugulin = 2; setActive("FUGULIN5", "btnFugulin53") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  NECESSITA DE AUXÍLIO PARA DEAMBULAR
                </button>
                <button
                  id="btnFugulin54"
                  onClick={() => { deambulacaofugulin = 1; setActive("FUGULIN5", "btnFugulin54") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AMBULANTE
                </button>
              </div>
              <div
                id="FUGULIN6"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>ALIMENTAÇÃO:</div>
                <button
                  id="btnFugulin61"
                  onClick={() => { alimentacao = 4; setActive("FUGULIN6", "btnFugulin61") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ATRAVÉS DE CATETER CENTRAL
                </button>
                <button
                  id="btnFugulin62"
                  onClick={() => { alimentacao = 3; setActive("FUGULIN6", "btnFugulin62") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  ATRAVÉS DE SONDA NASOGÁSTRICA
                </button>
                <button
                  id="btnFugulin63"
                  onClick={() => { alimentacao = 2; setActive("FUGULIN6", "btnFugulin63") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  POR BOCA COM AUXÍLIO
                </button>
                <button
                  id="btnFugulin64"
                  onClick={() => { alimentacao = 1; setActive("FUGULIN6", "btnFugulin64") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AUTO SUFICIENTE
                </button>
              </div>
              <div
                id="FUGULIN7"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>CUIDADO CORPORAL:</div>
                <button
                  id="btnFugulin71"
                  onClick={() => { cuidadocorporal = 4; setActive("FUGULIN7", "btnFugulin71") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  BANHO NO LEITO, HIGIENE ORAL REALIZADA PELA ENFERMAGEM
                </button>
                <button
                  id="btnFugulin72"
                  onClick={() => { cuidadocorporal = 3; setActive("FUGULIN7", "btnFugulin72") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  BANHO DE CHUVEIRO, HIGIENE ORAL REALIZADA PELA ENFERMAGEM
                </button>
                <button
                  id="btnFugulin73"
                  onClick={() => { cuidadocorporal = 2; setActive("FUGULIN7", "btnFugulin73") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AUXÍLIO NO BANHO DE CHUVEIRO E/OU NA HIGIENE ORAL
                </button>
                <button
                  id="btnFugulin74"
                  onClick={() => { cuidadocorporal = 1; setActive("FUGULIN7", "btnFugulin74") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AUTO SUFICIENTE
                </button>
              </div>
              <div
                id="FUGULIN8"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>ELIMINAÇÃO:</div>
                <button
                  id="btnFugulin81"
                  onClick={() => { eliminacao = 4; setActive("FUGULIN8", "btnFugulin81") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  EVACUAÇÃO NO LEITO E USO DE SONDA VESICAL PARA CONTROLE DA DIURESE
                </button>
                <button
                  id="btnFugulin82"
                  onClick={() => { eliminacao = 3; setActive("FUGULIN8", "btnFugulin82") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  USO DE COMADRE OU ELIMINAÇÕES NO LEITO
                </button>
                <button
                  id="btnFugulin83"
                  onClick={() => { eliminacao = 2; setActive("FUGULIN8", "btnFugulin83") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  USO DE VASO SANITÁRIO COM AUXÍLIO
                </button>
                <button
                  id="btnFugulin84"
                  onClick={() => { eliminacao = 1; setActive("FUGULIN8", "btnFugulin84") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AUTO SUFICIENTE
                </button>
              </div>
              <div
                id="FUGULIN9"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, textAlign: 'center', alignSelf: 'center' }}>TERAPÊUTICA:</div>
                <button
                  id="btnFugulin91"
                  onClick={() => { terapeutica = 4; setActive("FUGULIN9", "btnFugulin91") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  USO DE DROGAS VASOATIVAS PARA MANUTENÇÃO DE PA
                </button>
                <button
                  id="btnFugulin92"
                  onClick={() => { terapeutica = 3; setActive("FUGULIN9", "btnFugulin92") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  EV CONTÍNUA OU ATRAVÉS DE SONDA NASOGÁSTRICA
                </button>
                <button
                  id="btnFugulin93"
                  onClick={() => { terapeutica = 2; setActive("FUGULIN9", "btnFugulin93") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  EV INTERMITENTE
                </button>
                <button
                  id="btnFugulin94"
                  onClick={() => { terapeutica = 1; setActive("FUGULIN9", "btnFugulin94") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  IM OU VO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA DE BARTHEL (showescala = 6).
  let higienepessoal = -1;
  let banho = -1;
  let alimentacaobarthel = -1;
  let toalete = -1;
  let escadas = -1;
  let vestir = -1;
  let urina = -1;
  let intestino = -1;
  let deambulacao = -1;
  let cadeiraderodas = -1;
  let transferencia = -1;

  const insertBarthel = () => {
    let valor = higienepessoal + banho + alimentacaobarthel + toalete +
      escadas + vestir + urina + intestino + deambulacao + cadeiraderodas + transferencia;
    var significado = '';
    if (valor < 26) {
      significado = 'DEPENDÊNCIA TOTAL';
    } else if (valor > 25 && valor < 51) {
      significado = 'DEPENDÊNCIA SEVERA';
    } else if (valor > 50 && valor < 76) {
      significado = 'DEPENDÊNCIA MODERADA';
    } else if (valor > 75 && valor < 100) {
      significado = 'DEPENDÊNCIA LEVE';
    } else {
      significado = 'INDEPENDENTE';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 6,
      ds_escala: 'BARTHEL',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }

  const Barthel = useCallback(() => {
    return (
      <div className="menucover"
        style={{
          zIndex: 9, display: showescala == 6 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer" style={{ height: '80%', width: '95%' }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ÍNDICE DE BARTHEL'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([higienepessoal, banho, alimentacaobarthel, toalete, escadas, vestir, urina, intestino, deambulacao, cadeiraderodas, transferencia], insertBarthel)}
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
          <div
            className="corpo">
            <div className="scroll" style={{ height: '100%', width: '100%', justifyContent: 'flex-start' }}>
              <div
                id="BARTHEL1"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>HIGIENE PESSOAL:</div>
                <button
                  id="btnBarthel11"
                  onClick={() => { higienepessoal = 0; setActive("BARTHEL1", "btnBarthel11") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel12"
                  onClick={() => { higienepessoal = 1; setActive("BARTHEL1", "btnBarthel12") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel13"
                  onClick={() => { higienepessoal = 3; setActive("BARTHEL1", "btnBarthel13") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel14"
                  onClick={() => { higienepessoal = 4; setActive("BARTHEL1", "btnBarthel14") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel15"
                  onClick={() => { higienepessoal = 5; setActive("BARTHEL1", "btnBarthel15") }}
                  className="blue-button" style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL2"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>BANHO:</div>
                <button
                  id="btnBarthel21"
                  onClick={() => { banho = 0; setActive("BARTHEL2", "btnBarthel21") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel22"
                  onClick={() => { banho = 1; setActive("BARTHEL2", "btnBarthel22") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel23"
                  onClick={() => { banho = 3; setActive("BARTHEL2", "btnBarthel23") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel24"
                  onClick={() => { banho = 4; setActive("BARTHEL2", "btnBarthel24") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SUPERVISÃO POR SEGURANÇA
                </button>
                <button
                  id="btnBarthel25"
                  onClick={() => { banho = 5; setActive("BARTHEL2", "btnBarthel25") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  SEM ASSISTÊNCIA
                </button>
              </div>
              <div
                id="BARTHEL3"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>ALIMENTAÇÃO:</div>
                <button
                  id="btnBarthel31"
                  onClick={() => { alimentacaobarthel = 0; setActive("BARTHEL3", "btnBarthel31") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel32"
                  onClick={() => { alimentacaobarthel = 2; setActive("BARTHEL3", "btnBarthel32") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel33"
                  onClick={() => { alimentacaobarthel = 5; setActive("BARTHEL3", "btnBarthel33") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel34"
                  onClick={() => { alimentacaobarthel = 8; setActive("BARTHEL3", "btnBarthel34") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel35"
                  onClick={() => { alimentacaobarthel = 10; setActive("BARTHEL3", "btnBarthel35") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL4"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>TOALETE:</div>
                <button
                  id="btnBarthel41"
                  onClick={() => { toalete = 0; setActive("BARTHEL4", "btnBarthel41") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel42"
                  onClick={() => { toalete = 2; setActive("BARTHEL4", "btnBarthel42") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel43"
                  onClick={() => { toalete = 5; setActive("BARTHEL4", "btnBarthel43") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel44"
                  onClick={() => { toalete = 8; setActive("BARTHEL4", "btnBarthel44") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel45"
                  onClick={() => { toalete = 10; setActive("BARTHEL4", "btnBarthel45") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL5"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>SUBIR ESCADAS:</div>
                <button
                  id="btnBarthel51"
                  onClick={() => { escadas = 0; setActive("BARTHEL5", "btnBarthel51") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel52"
                  onClick={() => { escadas = 2; setActive("BARTHEL5", "btnBarthel52") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel53"
                  onClick={() => { escadas = 5; setActive("BARTHEL5", "btnBarthel53") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel54"
                  onClick={() => { escadas = 8; setActive("BARTHEL5", "btnBarthel54") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel55"
                  onClick={() => { escadas = 10; setActive("BARTHEL5", "btnBarthel55") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL6"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>VESTUÁRIO:</div>
                <button
                  id="btnBarthel61"
                  onClick={() => { vestir = 0; setActive("BARTHEL6", "btnBarthel61") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel62"
                  onClick={() => { vestir = 2; setActive("BARTHEL6", "btnBarthel62") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel63"
                  onClick={() => { vestir = 5; setActive("BARTHEL6", "btnBarthel63") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel64"
                  onClick={() => { vestir = 8; setActive("BARTHEL6", "btnBarthel64") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel65"
                  onClick={() => { vestir = 10; setActive("BARTHEL6", "btnBarthel65") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL7"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>BEXIGA:</div>
                <button
                  id="btnBarthel71"
                  onClick={() => { urina = 0; setActive("BARTHEL7", "btnBarthel71") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel72"
                  onClick={() => { urina = 2; setActive("BARTHEL7", "btnBarthel72") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel73"
                  onClick={() => { urina = 5; setActive("BARTHEL7", "btnBarthel73") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel74"
                  onClick={() => { urina = 8; setActive("BARTHEL7", "btnBarthel74") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel75"
                  onClick={() => { urina = 10; setActive("BARTHEL7", "btnBarthel75") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL8"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>INTESTINO:</div>
                <button
                  id="btnBarthel81"
                  onClick={() => { intestino = 0; setActive("BARTHEL8", "btnBarthel81") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel82"
                  onClick={() => { intestino = 2; setActive("BARTHEL8", "btnBarthel82") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel83"
                  onClick={() => { intestino = 5; setActive("BARTHEL8", "btnBarthel83") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel84"
                  onClick={() => { intestino = 8; setActive("BARTHEL8", "btnBarthel84") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel85"
                  onClick={() => { intestino = 10; setActive("BARTHEL8", "btnBarthel85") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL9.1"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>DEAMBULAÇÃO:</div>
                <button
                  id="btnBarthel9.11"
                  onClick={() => { deambulacao = 0; setActive("BARTHEL9.1", "btnBarthel9.11") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel9.12"
                  onClick={() => { deambulacao = 3; setActive("BARTHEL9.1", "btnBarthel9.12") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel9.13"
                  onClick={() => { deambulacao = 8; setActive("BARTHEL9.1", "btnBarthel9.13") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel9.14"
                  onClick={() => { deambulacao = 12; setActive("BARTHEL9.1", "btnBarthel9.14") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel9.15"
                  onClick={() => { deambulacao = 15; setActive("BARTHEL9.1", "btnBarthel9.15") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL9.2"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>CADEIRA DE RODAS:</div>
                <button
                  id="btnBarthel9.21"
                  onClick={() => { cadeiraderodas = 0; setActive("BARTHEL9.2", "btnBarthel9.21") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel9.22"
                  onClick={() => { cadeiraderodas = 1; setActive("BARTHEL9.2", "btnBarthel9.22") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel9.23"
                  onClick={() => { cadeiraderodas = 3; setActive("BARTHEL9.2", "btnBarthel9.23") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel9.24"
                  onClick={() => { cadeiraderodas = 4; setActive("BARTHEL9.2", "btnBarthel9.24") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel9.25"
                  onClick={() => { cadeiraderodas = 5; setActive("BARTHEL9.2", "btnBarthel9.25") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
              <div
                id="BARTHEL10"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ width: 150, minWidth: 150, textAlign: 'center', alignSelf: 'center' }}>TRANSFERÊNCIAS CADEIRA/CAMA:</div>
                <button
                  id="btnBarthel101"
                  onClick={() => { transferencia = 0; setActive("BARTHEL10", "btnBarthel101") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ
                </button>
                <button
                  id="btnBarthel102"
                  onClick={() => { transferencia = 3; setActive("BARTHEL10", "btnBarthel102") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA SUBSTANCIAL
                </button>
                <button
                  id="btnBarthel103"
                  onClick={() => { transferencia = 8; setActive("BARTHEL10", "btnBarthel103") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MODERADA
                </button>
                <button
                  id="btnBarthel104"
                  onClick={() => { transferencia = 12; setActive("BARTHEL10", "btnBarthel104") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  AJUDA MÍNIMA
                </button>
                <button
                  id="btnBarthel105"
                  onClick={() => { transferencia = 15; setActive("BARTHEL10", "btnBarthel105") }}
                  className="blue-button"
                  style={{ width: 150, padding: 10 }}>
                  INDEPENDENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA ANALÓGICA VISUAL (showescala = 7).
  const [eva, seteva] = useState(0);
  const insertEva = () => {
    var significado = '';
    if (eva < 1) {
      significado = 'DOR AUSENTE';
    } else if (eva > 0 && eva < 3) {
      significado = 'DOR LEVE';
    } else if (eva > 2 && eva < 8) {
      significado = 'DOR MODERADA';
    } else {
      significado = 'DOR INTENSA';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 7,
      ds_escala: 'EVA',
      valor_resultado: eva,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  function Eva() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 7 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA ANALÓGICA VISUAL DE DOR - EVA'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertEva()}
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
          <div
            className="corpo">
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <button
                  onClick={() => { seteva(1) }}
                  className={eva > 0 ? "red-button" : "green-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  1
                </button>
                <button
                  onClick={() => { seteva(2) }}
                  className={eva > 1 ? "red-button" : "green-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  2
                </button>
                <button
                  onClick={() => { seteva(3) }}
                  className={eva > 2 ? "red-button" : "yellow-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  3
                </button>
                <button
                  onClick={() => { seteva(4) }}
                  className={eva > 3 ? "red-button" : "yellow-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  4
                </button>
                <button
                  onClick={() => { seteva(5) }}
                  className={eva > 4 ? "red-button" : "yellow-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  5
                </button>
                <button
                  onClick={() => { seteva(6) }}
                  className={eva > 5 ? "red-button" : "yellow-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  6
                </button>
                <button
                  onClick={() => { seteva(7) }}
                  className={eva > 6 ? "red-button" : "yellow-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  7
                </button>
                <button
                  onClick={() => { seteva(8) }}
                  className={eva > 7 ? "red-button" : "purple-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  8
                </button>
                <button
                  onClick={() => { seteva(9) }}
                  className={eva > 8 ? "red-button" : "purple-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  9
                </button>
                <button
                  onClick={() => { seteva(10) }}
                  className={eva > 9 ? "red-button" : "purple-button"}
                  style={{ padding: 10, width: 50, minWidth: 50 }}>
                  10
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA DE RISCO ASPIRATIVO (showescala = 8).
  let bdea = -1; // boa deglutição e estado de alerta.
  let edentado = -1;
  let hop = -1; // higiene oral precária.
  let dpm = -1; // dieta pastosa mista.
  let vomito = -1;
  let espessante = -1;
  let sensorio = -1; // alteração do nível de consciência.
  let dispositivo = -1; // anse, ggt, tqt.

  const insertRiscoAspirativo = () => {
    let valor = bdea + edentado + hop + dpm + vomito + espessante + sensorio + dispositivo;
    var significado = '';
    if (valor < 3) {
      significado = 'BAIXO RISCO';
    } else if (valor > 2 && valor < 6) {
      significado = 'RISCO MODERADO';
    } else {
      significado = 'ALTO RISCO';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 8,
      ds_escala: 'RISCO ASPIRATIVO',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const RiscoAspirativo = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 8 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'RISCO ASPIRATIVO'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([bdea, edentado, hop, dpm, vomito, espessante, sensorio, dispositivo], insertRiscoAspirativo)}
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
          <div
            className="corpo">
            <div className="scroll" style={{ height: '80vh', justifyContent: 'flex-start' }}>
              <div id="RISCOASPIRA1" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>BOA DEGLUTIÇÃO E ESTADO DE ALERTA:</div>
                <button
                  id="btnRiscoAspira1"
                  onClick={() => { bdea = 0; setActive("RISCOASPIRA1", "btnRiscoAspira1") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira2"
                  onClick={() => { bdea = 1; setActive("RISCOASPIRA1", "btnRiscoAspira2") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>AUSÊNCIA DE DENTES:</div>
                <button
                  id="btnRiscoAspira3"
                  onClick={() => { edentado = 0; setActive("RISCOASPIRA2", "btnRiscoAspira3") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira4"
                  onClick={() => { edentado = 1; setActive("RISCOASPIRA2", "btnRiscoAspira4") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>HIGIENE ORAL PRECÁRIA:</div>
                <button
                  id="btnRiscoAspira5"
                  onClick={() => { hop = 1; setActive("RISCOASPIRA3", "btnRiscoAspira5") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira6"
                  onClick={() => { hop = 0; setActive("RISCOASPIRA3", "btnRiscoAspira6") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA4" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>DIETA PASTOSA/MISTA:</div>
                <button
                  id="btnRiscoAspira7"
                  onClick={() => { dpm = 1; setActive("RISCOASPIRA4", "btnRiscoAspira7") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira8"
                  onClick={() => { dpm = 0; setActive("RISCOASPIRA4", "btnRiscoAspira8") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA5" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>VÔMITO:</div>
                <button
                  id="btnRiscoAspira9"
                  onClick={() => { vomito = 1; setActive("RISCOASPIRA5", "btnRiscoAspira9") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira10"
                  onClick={() => { vomito = 0; setActive("RISCOASPIRA5", "btnRiscoAspira10") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA6" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>USO DE ESPESSANTE:</div>
                <button
                  id="btnRiscoAspira11"
                  onClick={() => { espessante = 1; setActive("RISCOASPIRA6", "btnRiscoAspira11") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira12"
                  onClick={() => { espessante = 0; setActive("RISCOASPIRA6", "btnRiscoAspira12") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA7" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>ALTERAÇÃO DO NÍVEL DE CONSCIÊNCIA:</div>
                <button
                  id="btnRiscoAspira13"
                  onClick={() => { sensorio = 1; setActive("RISCOASPIRA7", "btnRiscoAspira13") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira14"
                  onClick={() => { sensorio = 0; setActive("RISCOASPIRA7", "btnRiscoAspira14") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
              <div id="RISCOASPIRA8" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div className="title2" style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}>USO DE DISPOSITIVO (SNE, GTT, TQT):</div>
                <button
                  id="btnRiscoAspira15"
                  onClick={() => { dispositivo = 1; setActive("RISCOASPIRA8", "btnRiscoAspira15") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  SIM
                </button>
                <button
                  id="btnRiscoAspira16"
                  onClick={() => { dispositivo = 0; setActive("RISCOASPIRA8", "btnRiscoAspira16") }}
                  className="blue-button"
                  style={{ width: 100, padding: 10 }}>
                  NÃO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }, [showescala]);

  // ESCALA DE GIJÓN (showescala = 9).
  let situacaofamiliar = -1;
  let situacaoeconomica = -1;
  let relacoessociais = -1;
  let contatofamilia = -1;
  let apoioredesocial = -1;
  let habitacao = -1;

  const insertGijon = () => {
    var score = situacaofamiliar + situacaoeconomica + relacoessociais + contatofamilia + apoioredesocial + habitacao;
    var significado = '';
    if (score < 10) {
      significado = 'BOA SITUAÇÃO SOCIAL';
    } else if (score > 9 && score < 15) {
      significado = 'RISCO SOCIAL';
    } else {
      significado = 'PROBLEMA SOCIAL';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 9,
      ds_escala: 'GIJÓN',
      valor_resultado: score,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const Gijon = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 9 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE GIJÓN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([situacaofamiliar, situacaoeconomica, relacoessociais, contatofamilia, apoioredesocial], insertGijon)}
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
          <div
            className="corpo">
            <div>
              <div className="scroll"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 5, height: '60vh', width: '80vw' }}>
                <div className="title2center">SITUAÇÃO FAMILIAR</div>
                <div id="SITUACAO_FAMILIAR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="sf1"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 0; setActive("SITUACAO_FAMILIAR", "sf1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM A FAMÍLIA SEM DEPENDÊNCIA FÍSICA OU PSÍQUICA
                  </button>
                  <button id="sf2"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 1; setActive("SITUACAO_FAMILIAR", "sf2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM CONJUJE/ COMPANHEIRO DE SIMILARIDADE
                  </button>
                  <button id="sf3"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 2; setActive("SITUACAO_FAMILIAR", "sf3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM A FAMÍLIA E/OU CONJUGUE/COMPANHEIRO COM ALGUM GRAU DE DEPENDÊNCIA
                  </button>
                  <button id="sf4"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 3; setActive("SITUACAO_FAMILIAR", "sf4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM PESSOAS QUE NÃO SÃO FAMILIARES POR LAÇOS SANGUÍNEOS
                  </button>
                  <button id="sf5"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 4; setActive("SITUACAO_FAMILIAR", "sf5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE SOZINHO, MAS TEM FAMILIARES PRÓXIMOS
                  </button>
                  <button id="sf6"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 5; setActive("SITUACAO_FAMILIAR", "sf6") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE SOZINHO, SEM FILHOS OU FAMILIARES PRÓXIMOS
                  </button>
                  <button id="sf7"
                    className="blue-button"
                    onClick={() => { situacaofamiliar = 6; setActive("SITUACAO_FAMILIAR", "sf7") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    {"ESTÁ INSTITUCIONALIZADO (LONGA PERMANÊNCIA)"}
                  </button>
                </div>
                <div className="title2center">SITUAÇÃO ECONÔMICA</div>
                <div id="SITUACAO_ECONOMICA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="se1"
                    className="blue-button"
                    onClick={() => { situacaoeconomica = 0; setActive("SITUACAO_ECONOMICA", "se1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    MAIS DE 3 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se2"
                    className="blue-button"
                    onClick={() => { situacaoeconomica = 1; setActive("SITUACAO_ECONOMICA", "se2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    DE 2 A 3 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se3"
                    className="blue-button"
                    onClick={() => { situacaoeconomica = 2; setActive("SITUACAO_ECONOMICA", "se3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    DE 1 A 2 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se4"
                    className="blue-button"
                    onClick={() => { situacaoeconomica = 3; setActive("SITUACAO_ECONOMICA", "se4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    ABAIXO DE 1 SALÁRIO MÍNIMO
                  </button>
                  <button id="se5"
                    className="blue-button"
                    onClick={() => { situacaoeconomica = 4; setActive("SITUACAO_ECONOMICA", "se5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SEM RENDIMENTO
                  </button>
                </div>
                <div className="title2center">RELAÇÕES SOCIAIS</div>
                <div id="RELACOES_SOCIAIS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="rl1"
                    className="blue-button"
                    onClick={() => { relacoessociais = 0; setActive("RELACOES_SOCIAIS", "rl1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    RELAÇÕES SOCIAIS, VIDA SOCIAL ATIVA
                  </button>
                  <button id="rl2"
                    className="blue-button"
                    onClick={() => { relacoessociais = 1; setActive("RELACOES_SOCIAIS", "rl2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    RELAÇÕES SOCIAIS SÓ COM FAMÍLIA E VIZINHOS, SAI DE CASA
                  </button>
                  <button id="rl3"
                    className="blue-button"
                    onClick={() => { relacoessociais = 2; setActive("RELACOES_SOCIAIS", "rl3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    APENAS SE RELACIONA COM A FAMÍLIA OU VIZINHOS, SAI DE CASA
                  </button>
                  <button id="rl4"
                    className="blue-button"
                    onClick={() => { relacoessociais = 3; setActive("RELACOES_SOCIAIS", "rl4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO SAI DE CASA, RECEBE FAMÍLIA OU VISITAS
                  </button>
                  <button id="rl5"
                    className="blue-button"
                    onClick={() => { relacoessociais = 4; setActive("RELACOES_SOCIAIS", "rl5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO SAI DE CASA NEM RECEBE VISITAS
                  </button>
                </div>
                <div className="title2center">CONTATO COM A FAMÍLIA</div>
                <div id="CONTATO_FAMILIA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="cf1"
                    className="blue-button"
                    onClick={() => { contatofamilia = 0; setActive("CONTATO_FAMILIA", "cf1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    QUINZENAL / SEMANAL / DIÁRIO
                  </button>
                  <button id="cf2"
                    className="blue-button"
                    onClick={() => { contatofamilia = 1; setActive("CONTATO_FAMILIA", "cf2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    MENSAL
                  </button>
                  <button id="cf3"
                    className="blue-button"
                    onClick={() => { contatofamilia = 2; setActive("CONTATO_FAMILIA", "cf3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    4 A 11 VEZES AO ANO
                  </button>
                  <button id="cf4"
                    className="blue-button"
                    onClick={() => { contatofamilia = 3; setActive("CONTATO_FAMILIA", "cf4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    1 A 3 VEZES AO ANO
                  </button>
                  <button id="cf5"
                    className="blue-button"
                    onClick={() => { contatofamilia = 4; setActive("CONTATO_FAMILIA", "cf5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SEM CONTATO
                  </button>
                </div>
                <div className="title2center">APOIO DE REDE SOCIAL</div>
                <div id="REDE_SOCIAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="rs1"
                    className="blue-button"
                    onClick={() => { apoioredesocial = 0; setActive("REDE_SOCIAL", "rs1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    COM APOIO DE FAMILIAR OU DE VIZINHOS
                  </button>
                  <button id="rs2"
                    className="blue-button"
                    onClick={() => { apoioredesocial = 1; setActive("REDE_SOCIAL", "rs2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VOLUNTARIADO SOCIAL, AJUDA DOMICILIÁRIA
                  </button>
                  <button id="rs3"
                    className="blue-button"
                    onClick={() => { apoioredesocial = 2; setActive("REDE_SOCIAL", "rs3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO TEM APOIO
                  </button>
                  <button id="rs4"
                    className="blue-button"
                    onClick={() => { apoioredesocial = 3; setActive("REDE_SOCIAL", "rs4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    COM CRITÉRIOS PARA INGRESSO EM INSTITUIÇÃO GERIÁTRICA
                  </button>
                  <button id="rs5"
                    className="blue-button"
                    onClick={() => { apoioredesocial = 4; setActive("REDE_SOCIAL", "rs5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    TEM CUIDADOS PERMANENTES
                  </button>
                </div>
                <div className="title2center">HABITAÇÃO</div>
                <div id="HABITAÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="hab1"
                    className="blue-button"
                    onClick={() => { habitacao = 0; setActive("HABITAÇÃO", "hab1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    ADEQUADA ÀS NECESSIDADES
                  </button>
                  <button id="hab2"
                    className="blue-button"
                    onClick={() => { habitacao = 1; setActive("HABITAÇÃO", "hab2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    BARREIRAS ARQUITETÔNICAS NA CASA/ENTRADA
                  </button>
                  <button id="hab3"
                    className="blue-button"
                    onClick={() => { habitacao = 2; setActive("HABITAÇÃO", "hab3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    UMIDADE, FRACAS CONDIÇÕES DE HIGIENE, AUSÊNCIA DE ÁGUA OU INFRAESTRUTURA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA DE RISCO FARMACÊUTICO (showescala = 11).
  let polifarmacia = -1;
  let idade = moment().diff(moment(dn, 'DD/MM/YYYY'), 'years');
  let endovenoso = -1;
  let perigoso = -1;
  let suportenutricao = -1;
  let comorbidades = -1;
  let traqueostomizado = -1;
  let drogadito = -1;

  const insertRiscoFarmaceutico = () => {
    var pontosidade = idade < 41 ? 0 : idade > 40 && idade < 65 ? 1 : 2;
    var score = polifarmacia + pontosidade + endovenoso + perigoso + suportenutricao + comorbidades + traqueostomizado + drogadito;
    var significado = '';
    if (score > 8) {
      significado = 'RISCO ALTO: ACOMPANHAMENTO SEMANAL';
    } else if (score == 7 || score == 8) {
      significado = 'RISCO MODERADO: ACOMPANHAMENTO QUINZENAL';
    } else {
      significado = 'RISCO BAIXO: APENAS MONITORADOS';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 11,
      ds_escala: 'RISCO FARMACÊUTICO',
      valor_resultado: score,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const RiscoFarmaceutico = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 11 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'RISCO FARMACÊUTICO'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([polifarmacia, idade, endovenoso, perigoso, suportenutricao, comorbidades, traqueostomizado, drogadito], insertRiscoFarmaceutico)}
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
          <div
            className="corpo">
            <div>
              <div className="scroll"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 5, height: '60vh', width: '80vw' }}>
                <div className="title2center">TOTAL DE MEDICAÇÕES EM USO</div>
                <div id="POLIFARMACIA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="polifarmacia1"
                    className="blue-button"
                    onClick={() => { polifarmacia = 0; setActive("POLIFARMACIA", "polifarmacia1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    0 - 5 MEDICAMENTOS
                  </button>
                  <button id="polifarmacia2"
                    className="blue-button"
                    onClick={() => { polifarmacia = 1; setActive("POLIFARMACIA", "polifarmacia2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    6 - 10 MEDICAMENTOS
                  </button>
                  <button id="polifarmacia3"
                    className="blue-button"
                    onClick={() => { polifarmacia = 2; setActive("POLIFARMACIA", "polifarmacia3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    11 OU MAIS MEDICAMENTOS
                  </button>
                </div>
                <div className="title2center">IDADE</div>
                <div id="IDADE" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="idade"
                    className="blue-button"
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    {idade}
                  </button>
                </div>
                <div className="title2center">MEDICAMENTOS DE USO ENDOVENOSO</div>
                <div id="ENDOVENOSO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="endo1"
                    className="blue-button"
                    onClick={() => { endovenoso = 0; setActive("ENDOVENOSO", "endo1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NENHUM
                  </button>
                  <button id="endo2"
                    className="blue-button"
                    onClick={() => { endovenoso = 1; setActive("ENDOVENOSO", "endo2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    UM OU MAIS
                  </button>
                </div>
                <div className="title2center">MEDICAMENTOS POTENCIALMENTE PERIGOSOS</div>
                <div id="PERIGOSO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="perigoso1"
                    className="blue-button"
                    onClick={() => { perigoso = 0; setActive("PERIGOSO", "perigoso1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NENHUM
                  </button>
                  <button id="perigoso2"
                    className="blue-button"
                    onClick={() => { perigoso = 1; setActive("PERIGOSO", "perigoso2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    UM OU MAIS
                  </button>
                </div>
                <div className="title2center">PACIENTE EM SUPORTE NUTRICIONAL</div>
                <div id="SUPORTE_NUTRICAO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="suportenutricao1"
                    className="blue-button"
                    onClick={() => { suportenutricao = 0; setActive("SUPORTE_NUTRICAO", "suportenutricao1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO ESTÁ COM SONDA
                  </button>
                  <button id="suportenutricao2"
                    className="blue-button"
                    onClick={() => { suportenutricao = 1; setActive("SUPORTE_NUTRICAO", "suportenutricao2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    {'SIM (SNE, GGT OU NPT)'}
                  </button>
                </div>
                <div className="title2center">COMORBIDADES</div>
                <div id="COMORBIDADES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="comorb1"
                    className="blue-button"
                    onClick={() => { comorbidades = 0; setActive("COMORBIDADES", "comorb1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO
                  </button>
                  <button id="comorb2"
                    className="blue-button"
                    onClick={() => { comorbidades = 1; setActive("COMORBIDADES", "comorb2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SIM
                  </button>
                </div>
                <div className="title2center">PACIENTE TRAQUEOSTOMIZADO</div>
                <div id="TQT" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="tqt1"
                    className="blue-button"
                    onClick={() => { traqueostomizado = 0; setActive("TQT", "tqt1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO
                  </button>
                  <button id="tqt2"
                    className="blue-button"
                    onClick={() => { traqueostomizado = 1; setActive("TQT", "tqt2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SIM
                  </button>
                </div>
                <div className="title2center">PACIENTE TABAGISTA OU ALCOOLISTA OU USUÁRIO DE DROGAS</div>
                <div id="DROGADITO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="drogadito1"
                    className="blue-button"
                    onClick={() => { drogadito = 0; setActive("DROGADITO", "drogadito1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO
                  </button>
                  <button id="drogadito2"
                    className="blue-button"
                    onClick={() => { drogadito = 1; setActive("DROGADITO", "drogadito2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SIM, 1 OU 2
                  </button>
                  <button id="drogadito3"
                    className="blue-button"
                    onClick={() => { drogadito = 2; setActive("DROGADITO", "drogadito3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SIM, 3 OU MAIS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA DE PERFORMANCE ECOG (showescala = 12).
  let ecog = -1;

  const insertEcog = () => {
    var score = ecog;
    var significado = '';
    if (ecog == 0) {
      significado = 'COMPLETAMENTE ATIVO; CAPAZ DE REALIZAR TODAS AS SUAS ATIVIDADES SEM RESTRIÇÃO (KARNOFSKY 90-100%).';
    } else if (ecog == 1) {
      significado = 'RESTRIÇÃO A ATIVIDADES FÍSICAS RIGOROSAS; É CAPAZ DE TRABALHOS LEVES E DE NATUREZA SEDENTÁRIA (KARNOFSKY 70-80%).';
    } else if (ecog == 2) {
      significado = 'CAPAZ DE REALIZAR TODOS OS AUTO-CUIDADOS, MAS INCAPAZ DE REALIZAR QUALQUER ATIVIDADE DE TRABALHO; EM PÉ APROXIMADAMENTE 50% DAS HORAS EM QUE O PACIENTE ESTÁ ACORDADO (KARNOFSKY 50-60%).';
    } else if (ecog == 3) {
      significado = 'CAPAZ DE REALIZAR SOMENTE AUTO-CUIDADOS LIMITADOS, CONFINADO AO LEITO OU CADEIRA MAIS DE 50% DAS HORAS EM QUE O PACIENTE ESTÁ ACORDADO (KARNOFSKY 30-40%).'
    } else if (ecog == 4) {
      significado = 'COMPLETAMENTE INCAPAZ DE REALIZAR AUTO-CUIDADOS BÁSICOS; TOTALMENTE CONFINADO AO LEITO OU À CADEIRA (KARNOFSKY < 30%).'
    } else {
      significado = '';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 12,
      ds_escala: 'ECOG',
      valor_resultado: score,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const Ecog = useCallback(() => {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 12 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ECOG'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([ecog], insertEcog)}
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
          <div
            className="corpo">
            <div>
              <div id="ECOG" className="scroll"
                style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 5, height: '60vh', width: 'calc(50vw + 40px)' }}>
                <button id="ecog0"
                  className="blue-button"
                  onClick={() => { ecog = 0; setActive("ECOG", "ecog0") }}
                  style={{ padding: 10, width: '50vw', minWidth: '50vw' }}>
                  {'COMPLETAMENTE ATIVO; CAPAZ DE REALIZAR TODAS AS SUAS ATIVIDADES SEM RESTRIÇÃO (KARNOFSKY 90-100%)'}
                </button>
                <button id="ecog1"
                  className="blue-button"
                  onClick={() => { ecog = 1; setActive("ECOG", "ecog1") }}
                  style={{ padding: 10, width: '50vw', minWidth: '50vw' }}>
                  {'RESTRIÇÃO A ATIVIDADES FÍSICAS RIGOROSAS; É CAPAZ DE TRABALHOS LEVES E DE NATUREZA SEDENTÁRIA (KARNOFSKY 70-80%).'}
                </button>
                <button id="ecog2"
                  className="blue-button"
                  onClick={() => { ecog = 2; setActive("ECOG", "ecog2") }}
                  style={{ padding: 10, width: '50vw', minWidth: '50vw' }}>
                  {'CAPAZ DE REALIZAR TODOS OS AUTO-CUIDADOS, MAS INCAPAZ DE REALIZAR QUALQUER ATIVIDADE DE TRABALHO; EM PÉ APROXIMADAMENTE 50% DAS HORAS EM QUE O PACIENTE ESTÁ ACORDADO (KARNOFSKY 50-60%).'}
                </button>
                <button id="ecog3"
                  className="blue-button"
                  onClick={() => { ecog = 3; setActive("ECOG", "ecog3") }}
                  style={{ padding: 10, width: '50vw', minWidth: '50vw' }}>
                  {'CAPAZ DE REALIZAR SOMENTE AUTO-CUIDADOS LIMITADOS, CONFINADO AO LEITO OU CADEIRA MAIS DE 50% DAS HORAS EM QUE O PACIENTE ESTÁ ACORDADO (KARNOFSKY 30-40%).'}
                </button>
                <button id="ecog4"
                  className="blue-button"
                  onClick={() => { ecog = 2; setActive("ECOG", "ecog4") }}
                  style={{ padding: 10, width: '50vw', minWidth: '50vw' }}>
                  {'COMPLETAMENTE INCAPAZ DE REALIZAR AUTO-CUIDADOS BÁSICOS; TOTALMENTE CONFINADO AO LEITO OU À CADEIRA (KARNOFSKY < 30%).'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // função para construção dos toasts.
  const [valortoast, setvalortoast] = useState(0);
  const [cor, setcor] = useState('transparent');
  const [mensagem, setmensagem] = useState('');
  const [tempo, settempo] = useState(2000);
  const toast = (value, color, message, time) => {
    setvalortoast(value);
    setcor(color);
    setmensagem(message);
    settempo(time);
    setTimeout(() => {
      setvalortoast(0);
    }, time);
  }

  // ESCALA ASIA (showescala = 10).
  const [asia, setasia] = useState(0);
  const insertAsia = () => {
    var significado = '';
    if (asia == 'A') {
      significado = 'Lesão Completa: Sem preservação das funções motora e sensitiva no segmento sacral S4-S5.';
    } else if (asia == 'B') {
      significado = 'Lesão Incompleta: Perda da função motora, porém função sensitiva preservada abaixo do nível neurológico e inclui sensibilidade do segmento sacral S4-S5.';
    } else if (asia == 'C') {
      significado = ' Lesão Incompleta: Função motora preservada abaixo do nível neurológico, e mais da metade dos músculos-chave abaixo do nível neurológico possuem grau de força inferior a 3 (apesar de haver contração muscular, não são capazes de vencer a gravidade).';
    } else if (asia == 'D') {
      significado = 'Lesão Incompleta: Função motora preservada abaixo do nível neurológico, e mais da metade dos músculos-chave abaixo do nível neurológico possuem grau de força igual ou superior a 3 (vencem a gravidade).'
    } else {
      significado = ' Lesão Incompleta: Funções Motora e sensitiva são normais.'
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 10,
      ds_escala: 'ASIA',
      valor_resultado: asia,
      ds_resultado: significado.toUpperCase(),
      idprofissional: 0,
      status: 1,
    }
    // console.log(JSON.stringify(obj));
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  function Asia() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 10 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA ASIA'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertAsia()}
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
            <div className="scroll"
              style={{
                display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start',
                marginBottom: 5, height: '60vh', width: '30vw',
              }}>
              <button
                onClick={() => { setasia('A') }}
                className={asia == 'A' ? "red-button" : "blue-button"}
                style={{ padding: 10, minWidth: 200 }}>
                ASIA A - SEM FUNÇÕES SENSITIVA E MOTORA NO SEGMENTO S4-S5
              </button>
              <button
                onClick={() => { setasia('B') }}
                className={asia == 'B' ? "red-button" : "blue-button"}
                style={{ padding: 10, minWidth: 200 }}>
                ASIA B - SEM FUNÇÃO MOTORA, PORÉM SENSIBILIDADE PRESERVADA ABAIXO DO NÍVEL NEUROLÓGICO, INLCUINDO S4-S5
              </button>
              <button
                onClick={() => { setasia('C') }}
                className={asia == 'C' ? "red-button" : "blue-button"}
                style={{ padding: 10, minWidth: 200 }}>
                ASIA C - MAIS DA METADE DOS MÚSCULOS ABAIXO DO NÍVEL NEUROLÓGICO POSSUEM FORÇA MENOR A 3
              </button>
              <button
                onClick={() => { setasia('D') }}
                className={asia == 'D' ? "red-button" : "blue-button"}
                style={{ padding: 10, minWidth: 200 }}>
                ASIA D - MAIS DA METADE DOS MÚSCULOS ABAIXO DO NÍVEL NEUROLÓGICO POSSUEM FORÇA IGUAL OU MAIOR QUE 3
              </button>
              <button
                onClick={() => { setasia('C') }}
                className={asia == 'E' ? "red-button" : "blue-button"}
                style={{ padding: 10, minWidth: 200 }}>
                ASIA E - FUNÇÕES MOTORAS E SENSITIVAS SÃO NORMAIS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA MEEM (showescala = 13).
  // orientação.
  let diasemana = 0
  let diames = 0
  let mes = 0
  let ano = 0
  let hora = 0
  let local = 0
  let instituicao = 0
  let bairro = 0
  let cidade = 0
  let estado = 0
  // memória imediata.
  let palavra1 = 0
  let palavra2 = 0
  let palavra3 = 0
  // atenção e cálculo.
  let calculo1 = 0
  let calculo2 = 0
  let calculo3 = 0
  let calculo4 = 0
  let calculo5 = 0
  // evocação.
  let palavra4 = 0
  let palavra5 = 0
  let palavra6 = 0
  // linguagem.
  let nomearrelogio = 0
  let nomearcaneta = 0
  let nemaqui = 0
  let peguepapel = 0
  let fecheolhos = 0
  let escrevafrase = 0
  let copiedesenho = 0

  const insertMeem = () => {
    var score =
      diasemana + diames + mes + ano + hora + local + instituicao + bairro + cidade + estado +
      palavra1 + palavra2 + palavra3 + palavra4 + palavra5 + palavra6 +
      calculo1 + calculo2 + calculo3 + calculo4 + calculo5 +
      nomearrelogio + nomearcaneta + nemaqui + peguepapel + fecheolhos + escrevafrase + copiedesenho;

    var significado = '';
    if (score < 10) {
      significado = 'PERDA COGNITIVA GRAVE';
    } else if (score > 9 && score < 21) {
      significado = 'PERDA COGNITIVA MODERADA';
    } else if (score > 20 && score < 25) {
      significado = 'PERDA COGNITIVA LEVE';
    } else {
      significado = 'NORMAL';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 13,
      ds_escala: 'MEEM',
      valor_resultado: score,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const MEEM = useCallback(() => {
    return (
      <div className="menucover"
        style={{
          zIndex: 9, display: showescala == 13 ? 'flex' : 'none', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer" style={{ width: '90vw', height: '80vh' }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'MEEM'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscala([diasemana, diames, mes, ano, hora, local, instituicao, bairro, cidade, estado, palavra1, palavra2, palavra3, palavra4, palavra5, palavra6, calculo1, calculo2, calculo3, calculo4, calculo5, nomearrelogio, nomearcaneta, nemaqui, peguepapel, fecheolhos, escrevafrase, copiedesenho], insertMeem)}
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
          <div
            className="corpo">
            <div className="scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 5 }}>
              <div className="title2center">ORIENTAÇÃO</div>
              <div id="ORIENTACAO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id='orient1'
                  onClick={() => {
                    setMultiplo("orient1")
                    if (diasemana == -1 || diasemana == 0) {
                      diasemana = 1;
                    } else {
                      diasemana = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  DIA DA SEMANA
                </button>
                <button
                  id='orient2'
                  onClick={() => {
                    setMultiplo("orient2")
                    if (diames == -1 || diames == 0) {
                      diames = 1;
                    } else {
                      diames = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  DIA DO MÊS
                </button>
                <button
                  id='orient3'
                  onClick={() => {
                    setMultiplo("orient3")
                    if (mes == -1 || mes == 0) {
                      mes = 1;
                    } else {
                      mes = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  MÊS
                </button>
                <button
                  id='orient4'
                  onClick={() => {
                    setMultiplo("orient4")
                    if (ano == -1 || ano == 0) {
                      ano = 1;
                    } else {
                      ano = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  ANO
                </button>
                <button
                  id='orient5'
                  onClick={() => {
                    setMultiplo("orient5")
                    if (hora == -1 || hora == 0) {
                      hora = 1;
                    } else {
                      hora = 0;
                    }
                  }}
                  className="blue-button" style={{ padding: 10, width: 200, minWidth: 200 }}>
                  HORA
                </button>
                <button
                  id='orient6'
                  onClick={() => {
                    setMultiplo("orient6")
                    if (local == -1 || local == 0) {
                      local = 1;
                    } else {
                      local = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  LOCAL
                </button>
                <button
                  id='orient7'
                  onClick={() => {
                    setMultiplo("orient7")
                    if (instituicao == -1 || instituicao == 0) {
                      instituicao = 1;
                    } else {
                      instituicao = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  INSTITUIÇÃO
                </button>
                <button
                  id='orient8'
                  onClick={() => {
                    setMultiplo("orient8")
                    if (bairro == -1 || bairro == 0) {
                      bairro = 1;
                    } else {
                      bairro = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  BAIRRO
                </button>
                <button
                  id='orient9'
                  onClick={() => {
                    setMultiplo("orient9")
                    if (cidade == -1 || cidade == 0) {
                      cidade = 1;
                    } else {
                      cidade = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  CIDADE
                </button>
                <button
                  id='orient10'
                  onClick={() => {
                    setMultiplo("orient10")
                    if (estado == -1 || estado == 0) {
                      estado = 1;
                    } else {
                      estado = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  ESTADO
                </button>
              </div>
              <div className="title2center">MEMÓRIA IMEDIATA</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id='palavra1'
                  onClick={() => {
                    setMultiplo("palavra1")
                    if (palavra1 == -1 || palavra1 == 0) {
                      palavra1 = 1;
                    } else {
                      palavra1 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 1
                </button>
                <button
                  id='palavra2'
                  onClick={() => {
                    setMultiplo("palavra2")
                    if (palavra2 == -1 || palavra2 == 0) {
                      palavra2 = 1;
                    } else {
                      palavra2 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 2
                </button>
                <button
                  id='palavra3'
                  onClick={() => {
                    setMultiplo("palavra3")
                    if (palavra3 == -1 || palavra3 == 0) {
                      palavra3 = 1;
                    } else {
                      palavra3 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 3
                </button>
              </div>
              <div className="title2center">ATENÇÃO E CÁLCULO</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id='calc1'
                  onClick={() => {
                    setMultiplo("calc1")
                    if (calculo1 == -1 || calculo1 == 0) {
                      calculo1 = 1;
                    } else {
                      calculo1 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  100 - 7 = 93
                </button>
                <button
                  id='calc2'
                  onClick={() => {
                    setMultiplo("calc2")
                    if (calculo2 == -1 || calculo2 == 0) {
                      calculo2 = 1;
                    } else {
                      calculo2 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  93 - 7 = 86
                </button>
                <button
                  id='calc3'
                  onClick={() => {
                    setMultiplo("calc3")
                    if (calculo3 == -1 || calculo3 == 0) {
                      calculo3 = 1;
                    } else {
                      calculo3 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  86 - 7 = 79
                </button>
                <button
                  id='calc4'
                  onClick={() => {
                    setMultiplo("calc4")
                    if (calculo4 == -1 || calculo4 == 0) {
                      calculo4 = 1;
                    } else {
                      calculo4 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  79 - 7 = 72
                </button>
                <button
                  id='calc5'
                  onClick={() => {
                    setMultiplo("calc5")
                    if (calculo5 == -1 || calculo5 == 0) {
                      calculo5 = 1;
                    } else {
                      calculo5 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  72 - 7 = 65
                </button>
              </div>
              <div className="title2center">EVOCAÇÃO</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id='palavra4'
                  onClick={() => {
                    setMultiplo("palavra4")
                    if (palavra4 == -1 || palavra4 == 0) {
                      palavra4 = 1;
                    } else {
                      palavra4 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 1
                </button>
                <button
                  id='palavra5'
                  onClick={() => {
                    setMultiplo("palavra5")
                    if (palavra5 == -1 || palavra5 == 0) {
                      palavra5 = 1;
                    } else {
                      palavra5 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 2
                </button>
                <button
                  id='palavra6'
                  onClick={() => {
                    setMultiplo("palavra6")
                    if (palavra6 == -1 || palavra6 == 0) {
                      palavra6 = 1;
                    } else {
                      palavra6 = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PALAVRA 3
                </button>
              </div>
              <div className="title2center">LINGUAGEM</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id='relogio'
                  onClick={() => {
                    setMultiplo("relogio")
                    if (nomearrelogio == -1 || nomearrelogio == 0) {
                      nomearrelogio = 1;
                    } else {
                      nomearrelogio = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  RELÓGIO
                </button>
                <button
                  id='caneta'
                  onClick={() => {
                    setMultiplo("caneta")
                    if (nomearcaneta == -1 || nomearcaneta == 0) {
                      nomearcaneta = 1;
                    } else {
                      nomearcaneta = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  CANETA
                </button>
                <button
                  id='nemaqui'
                  onClick={() => {
                    setMultiplo("nemaqui")
                    if (nemaqui == -1 || nemaqui == 0) {
                      nemaqui = 1;
                    } else {
                      nemaqui = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  NEM AQUI, NEM ALI, NEM LÁ
                </button>
                <button
                  id='papel'
                  onClick={() => {
                    setMultiplo("papel")
                    if (peguepapel == -1 || peguepapel == 0) {
                      peguepapel = 1;
                    } else {
                      peguepapel = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  PEGAR E DOBRAR PAPEL
                </button>
                <button
                  id='olhos'
                  onClick={() => {
                    setMultiplo("olhos")
                    if (fecheolhos == -1 || fecheolhos == 0) {
                      fecheolhos = 1;
                    } else {
                      fecheolhos = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  LER E FECHAR OLHOS
                </button>
                <button
                  id='frase'
                  onClick={() => {
                    setMultiplo("frase")
                    if (escrevafrase == -1 || escrevafrase == 0) {
                      escrevafrase = 1;
                    } else {
                      escrevafrase = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  ESCREVA FRASE
                </button>
                <button
                  id='desenho'
                  onClick={() => {
                    setMultiplo("desenho")
                    if (copiedesenho == -1 || copiedesenho == 0) {
                      copiedesenho = 1;
                    } else {
                      copiedesenho = 0;
                    }
                  }}
                  className="blue-button"
                  style={{ padding: 10, width: 200, minWidth: 200 }}>
                  COPIE DESENHO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA GLIM (showescala = 14).
  // etiológico.
  let ingestao = 0
  let gravidade = 0
  // fenotípico.
  let perdaponderal = 0
  let baixoimc = 0
  let massamuscular = 0

  let desnutrido = 0

  const insertGlim = () => {
    var score =
      ingestao + gravidade + perdaponderal + baixoimc + massamuscular;

    var significado = '';
    if (ingestao == 1 || gravidade == 1 || perdaponderal == 1 || baixoimc == 1 || massamuscular == 1) {
      significado = 'DESNUTRIDO';
    } else {
      significado = 'NÃO DESNUTRIDO';
    }

    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 14,
      ds_escala: 'GLIM',
      valor_resultado: score,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })
  }
  const Glim = useCallback(() => {
    return (
      <div className="menucover"
        style={{
          zIndex: 9, display: showescala == 14 ? 'flex' : 'none', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'GLIM'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => checkEscalaMultipla([ingestao, gravidade, perdaponderal, baixoimc, massamuscular], insertGlim)}
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
          <div
            className="corpo">
            <div className="title2center">ETIOLÓGICO</div>
            <div id="ETIOLOGICO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id='etio1'
                onClick={() => {
                  setMultiplo("etio1")
                  if (ingestao == -1 || ingestao == 0) {
                    ingestao = 1;
                  } else {
                    ingestao = 0;
                  }
                }}
                className="blue-button"
                title="< 50% DAS NECESSIDADES POR MAIS DE UMA SEMANA OU QUALQUER REDUÇÃO ALIMENTAR POR MAIS DE DUAS SEMANAS OU CONDIÇÃO GASTRINTESTINAL QUE ALTERA A ABSORÇÃO DOS NUTRIENTES."
                style={{ padding: 10, width: 200, minWidth: 200 }}>
                INGESTÃO OU ABSORÇÃO ALIMENTAR
              </button>
              <button
                id='etio2'
                onClick={() => {
                  setMultiplo("etio2")
                  if (gravidade == -1 || gravidade == 0) {
                    gravidade = 1;
                  } else {
                    gravidade = 0;
                  }
                }}
                className="blue-button"
                title="SEGUIR CRITÉRIOS ESTABELECIDOS NAS FERRAMENTAS DE TRIAGEM NUTRICIONAL. INDICADORES DE INFLAMAÇÃO: FEBRE, BALANÇO NITROGENADO NEGATIVO, GASTO ENERGÉTICO DE REPOUSO ELEVADO, ALTERAÇÃO EM PCR, ALBUMINA E PRÉ-ALBUMINA. AVALIAR DOENÇA CRÔNICA OU AGUDA."
                style={{ padding: 10, width: 200, minWidth: 200 }}>
                GRAVIDADE DA DOENÇA/INFLAMAÇÃO
              </button>
            </div>
            <div className="title2center">FENOTÍPICO</div>
            <div id="FENOTÍPICO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id='feno1'
                onClick={() => {
                  setMultiplo("feno1")
                  if (perdaponderal == -1 || perdaponderal == 0) {
                    perdaponderal = 1;
                  } else {
                    perdaponderal = 0;
                  }
                }}
                className="blue-button"
                title="> 5% NOS ÚLTIMOS 6 MESES, > 10% ALÉM DOS 6 MESES."
                style={{ padding: 10, width: 200, minWidth: 200 }}>
                PERDA DE PESO NÃO INTENCIONAL
              </button>
              <button
                id='feno2'
                onClick={() => {
                  setMultiplo("feno2")
                  if (baixoimc == -1 || baixoimc == 0) {
                    baixoimc = 1;
                  } else {
                    baixoimc = 0;
                  }
                }}
                className="blue-button"
                title="< 20kg/m2 SE < 70 ANOS, < 22kg/m2 SE > 70 ANOS, ASIA: < 18.5kg/m2 SE < 70 ANOS, < 20kg/m2 SE > 70 ANOS"
                style={{ padding: 10, width: 200, minWidth: 200 }}>
                INGESTÃO OU ABSORÇÃO ALIMENTAR
              </button>
              <button
                id='feno3'
                onClick={() => {
                  setMultiplo("feno3")
                  if (massamuscular == -1 || massamuscular == 0) {
                    massamuscular = 1;
                  } else {
                    massamuscular = 0;
                  }
                }}
                className="blue-button"
                title="REDUÇÃO VALIDADA POR MÉTODOS DE COMPOSIÇÃO CORPORAL"
                style={{ padding: 10, width: 200, minWidth: 200 }}>
                REDUÇÃO DA MASSA MUSCULAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showescala]);

  // ESCALA MEDIDAS (showescala = 15).
  const [medidas, setmedidas] = useState(0);
  const [braco, setbraco] = useState(-1);
  const [panturrilha, setpanturrilha] = useState(-1);
  const [dinamometria, setdinamometria] = useState(-1);

  const insertMedidas = () => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 15,
      ds_escala: 'MEDIDAS',
      valor_resultado: '[' + braco + ', ' + panturrilha + ', ' + dinamometria + ']',
      ds_resultado: null,
      idprofissional: 0,
      status: 1,
    }
    console.log(JSON.stringify(obj));

    axios.post(htmlghapinsertescala, obj).then(() => {
      loadEscalas();
    })

  }
  function Medidas() {
    var timeout = null;
    return (
      <div className="menucover"
        style={{
          zIndex: 9, display: showescala == 15 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'MEDIDAS'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => {
                  checkEscala([braco, panturrilha, dinamometria], insertMedidas)
                }}
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
          <div
            className="corpo"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="title2">{'CIRCUNFERÊNCIA DO BRAÇO'}</div>
            <input id="inputBraco"
              className="input"
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="CIRCUNFERÊNCIA DO BRAÇO."
              style={{
                display: 'flex',
                width: 100,
                margin: 2.5,
                flexDirection: 'column',
                textAlign: 'center',
                alignContent: 'center',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              type="number"
              defaultValue={braco}
              onKeyUp={() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  var number = parseInt(document.getElementById("inputBraco").value);
                  if (number < 0) {
                    setbraco(0);
                  } else {
                    setbraco(document.getElementById("inputBraco").value);
                  }
                }, 500);
              }}
              maxLength={3}>
            </input>
            <div className="title2">{'CIRCUNFERÊNCIA DA PANTURRILHA'}</div>
            <input id="inputPanturrilha"
              className="input"
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="CIRCUNFERÊNCIA DA PANTURRILHA."
              style={{
                display: 'flex',
                width: 100,
                margin: 2.5,
                flexDirection: 'column',
                textAlign: 'center',
                alignContent: 'center',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              type="number"
              defaultValue={panturrilha}
              onKeyUp={() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  var number = parseInt(document.getElementById("inputPanturrilha").value);
                  if (number < 0) {
                    setpanturrilha(0);
                  } else {
                    setpanturrilha(document.getElementById("inputPanturrilha").value);
                  }
                }, 500);
              }}
              maxLength={3}>
            </input>
            <div className="title2">{'DINAMOMETRIA'}</div>
            <input id="inputDinamometria"
              className="input"
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="DINAMOMETRIA."
              style={{
                display: 'flex',
                width: 100,
                margin: 2.5,
                flexDirection: 'column',
                textAlign: 'center',
                alignContent: 'center',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              type="number"
              defaultValue={dinamometria}
              onKeyUp={() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  var number = parseInt(document.getElementById("inputDinamometria").value);
                  if (number < 0) {
                    setdinamometria(0);
                  } else {
                    setdinamometria(document.getElementById("inputDinamometria").value);
                  }
                }, 500);
              }}
              maxLength={3}>
            </input>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA PARD (showescala = 16).
  const [pardscore, setpardscore] = useState(0);

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
  const [sato2, setsao2] = useState(0);
  const [cianose, setcianose] = useState(0);
  const [broncoespasmo, setbroncoespasmo] = useState(0);
  const [fc, setfc] = useState(0);
  const [fr, setfr] = useState(0);

  const insertPard = () => {
    pardscore =
      escapeoralanterior + tempotransitooraladequado + refluxonasal +
      numerodegluticoes + residuooral + elevacaolaringea + tosse +
      engasgo + auscultacervicallimpa + qualidadevocaladequada + sato2 +
      cianose + broncoespasmo + fc + fr;
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
      loadEscalas();
    })
  }

  function Pard() {
    return (
      <div className="menucontainer"
        style={{
          zIndex: 9, display: showescala == 16 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
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

              <div className="title2center">ESCAPE ORAL ANTERIOR</div>
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', height: 75 }}>
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
    );
  }

  return (
    <div>
      <Braden></Braden>
      <Morse></Morse>
      <Oxford></Oxford>
      <Fois></Fois>
      <Fugulin></Fugulin>
      <Barthel></Barthel>
      <Eva></Eva>
      <RiscoAspirativo></RiscoAspirativo>
      <Gijon></Gijon>
      <Asia></Asia>
      <RiscoFarmaceutico></RiscoFarmaceutico>
      <Ecog></Ecog>
      <MEEM></MEEM>
      <Glim></Glim>
      <Medidas></Medidas>
      <Pard></Pard>
      <div
        className="menucover"
        style={{
          display: valortoast == 1 ? 'flex' : 'none',
          zIndex: 90,
          // position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
        }}>
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      </div>
    </div>
  )
}

export default EscalasAssistenciais;