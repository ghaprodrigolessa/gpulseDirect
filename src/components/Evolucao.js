/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import assinar from '../images/assinar.svg';
import copiar from '../images/copiar.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';

import Signature from './Signature';

import AnamneseFisio from '../documents/AnamneseFisio';
import AnamneseFono from '../documents/AnamneseFono';
import AnamnesePsicologia from '../documents/AnamnesePsicologia';
import AnamneseServicoSocial from '../documents/AnamneseServicoSocial';
import AnamneseTerapiaOcupacional from '../documents/AnamneseTerapiaOcupacional';
import EvolucaoFisio from '../documents/EvolucaoFisio';
import EvolucaoFono from '../documents/EvolucaoFono';
import EvolucaoPsicologia from '../documents/EvolucaoPsicologia';
import EvolucaoServicoSocial from '../documents/EvolucaoServicoSocial';
import EvolucaoTerapiaOcupacional from '../documents/EvolucaoTerapiaOcupacional';

function Evolucao(
  {
    // deus do céu.
  }) {

  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';

  var timeout = null;

  // recuperando estados globais (Context.API).
  const {
    idusuario,
    conselhousuario,
    idpaciente, idatendimento,
    stateprontuario,

    iddocumento, setiddocumento,
    viewevolucao,
    viewdocumento, setviewdocumento,
    tipodocumento, settipodocumento,

    listevolucoes,
    listghapevolucoes, setlistghapevolucoes,
    arraylistghapevolucoes, setarraylistghapevolucoes,
    arrayevolucao, setarrayevolucao,

    selectedcategoria, setselectedcategoria,
    conselho, setconselho,

    personas,

    iduser, setiduser,
    statusdocumento, setstatusdocumento,
    usuariodocumento, setusuariodocumento,
    datadocumento, setdatadocumento,
    setidselecteddocumento, idselecteddocumento,
    viewpdf, setviewpdf,

    setarraycategoriaprofissional, arraycategoriaprofissional,

    signature, setsignature,
    camposopcoes, setcamposopcoes,
    camposvalores, setcamposvalores,
    setprintdocumento,
    registros_atuais, setregistros_atuais,

  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewevolucao);

  // variáveis associadas à evolução:
  useEffect(() => {
    setarraycategoriaprofissional(listcategoriaprofissional);
    if (stateprontuario == 35) {
      setselectedcategoria(0);
      settipodocumento(0);
      setiddocumento(0);
      loadCamposOpcoes();
      setstatusdocumento(null);
      setprintdocumento(0);
    }
  }, [stateprontuario]);

  // carregando todas as opções de seleção de campos registradas no banco de dados.
  var htmlcamposopcoes = process.env.REACT_CAMPOS_OPCOES
  const loadCamposOpcoes = () => {
    axios.get('http://192.168.100.6:3333/pool_campos_opcoes/').then((response) => {
      console.log('CARREGANDO OPÇÕES DE CAMPOS');
      var x = [0, 1];
      x = response.data;
      setcamposopcoes(x.rows);
    });
  }

  // carregando todos os valores de seleção de campos registrados no banco de dados.
  var htmlcamposvalores = process.env.REACT_EVOLUCAO_VALORES
  const loadCamposValores = () => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      console.log('CARREGANDO VALORES DE CAMPOS');
      var x = [0, 1];
      x = response.data;
      setcamposvalores(x.rows);
      setregistros_atuais(x.rows.filter(item => item.idevolucao == iddocumento));
      setTimeout(() => {
        setstatusdocumento(0);
      }, 2000);
    });
  }

  // filtro para registros interdisciplinares.
  const [filterregistrointerdisciplinar, setfilterregistrointerdisciplinar] = useState('');
  var searchregistro = '';
  var timeout = null;
  const filterRegistroInterdisciplinar = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterRegistroInterdisciplinar").focus();
    searchregistro = document.getElementById("inputFilterRegistroInterdisciplinar").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchregistro == '') {
        setviewdocumento(0);
        setfilterregistrointerdisciplinar('');
        setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == conselho));
        setarraylistghapevolucoes(listghapevolucoes.filter(item => item.conselho == conselho && item.evolucao.split('*', 1) == tipodocumento));
        document.getElementById("inputFilterRegistroInterdisciplinar").value = '';
        document.getElementById("inputFilterRegistroInterdisciplinar").focus();
      } else {
        setviewdocumento(0);
        setfilterregistrointerdisciplinar(document.getElementById("inputFilterRegistroInterdisciplinar").value.toUpperCase());
        setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == conselho && item.ds_evolucao.toString().toUpperCase().includes(searchregistro) == true));
        setarraylistghapevolucoes(listghapevolucoes.filter(item => item.conselho == conselho && item.evolucao.split('*', 1) == tipodocumento && item.evolucao.includes(searchregistro) == true));
        document.getElementById("inputFilterRegistroInterdisciplinar").value = searchregistro;
        document.getElementById("inputFilterRegistroInterdisciplinar").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterRegistroInterdisciplinar").focus();
      }
    }, 500);
  }

  // renderização da lista de evoluções.
  const ShowRegistrosInterdisciplinares = useCallback(() => {
    if (stateprontuario == 35) {
      return (
        <div id="evoluções"
          style={{
            width: '100%', height: '60vh',
            borderColor: '#f2f2f2',
            backgroundColor: '#f2f2f2',
            borderRadius: 5,
            borderTopLeftRadius: 0, borderTopRightRadius: 0,
            justifyContent: 'center',

          }}
        // onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterEvolucao").value = ""; setarrayevolucao(listevolucoes) }}
        >
          <OpcoesRegistrosInterdisciplinares></OpcoesRegistrosInterdisciplinares>
          <div id="FILTRO E VIEW DO DOCUMENTO ESTRUTURADO"
            style={{
              display: tipodocumento != '' ? 'flex' : 'none',
              justifyContent: 'center',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 2.5,
              borderRadius: 5,
              backgroundColor: '#f2f2f2'
            }}>
            <ShowFilterRegistroInterdisciplinar></ShowFilterRegistroInterdisciplinar>
            <div id="VIEW DO DOCUMENTO ESTRUTURADO" style={{ height: '55vh' }}>
              <div style={{ display: tipodocumento == '' ? 'flex' : 'none', width: '70vw', height: '58vh', flexDirection: 'column', justifyContent: 'center', marginRight: 10 }}>
                <div className="title2center">{'SELECIONE UM DOCUMENTO PARA VISUALIZAÇÃO'}</div>
              </div>
              <div style={{ display: tipodocumento != '' && iddocumento != 0 ? 'flex' : 'none', width: '70vw', height: '58vh', flexDirection: 'column', justifyContent: 'center', marginRight: 10 }}>
                <div>
                  <AnamneseFisio></AnamneseFisio>
                  <AnamneseFono></AnamneseFono>
                  <AnamnesePsicologia></AnamnesePsicologia>
                  <AnamneseServicoSocial></AnamneseServicoSocial>
                  <AnamneseTerapiaOcupacional></AnamneseTerapiaOcupacional>
                  <EvolucaoFisio></EvolucaoFisio>
                  <EvolucaoFono></EvolucaoFono>
                  <EvolucaoPsicologia></EvolucaoPsicologia>
                  <EvolucaoServicoSocial></EvolucaoServicoSocial>
                  <EvolucaoTerapiaOcupacional></EvolucaoTerapiaOcupacional>
                </div>
              </div>
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, listevolucoes, arrayevolucao, selectedcategoria, tipodocumento, iddocumento, statusdocumento, arraycategoriaprofissional, viewdocumento]);

  // opções de registros interdisciplinares por categoria profissional.
  function OpcoesRegistrosInterdisciplinares() {
    return (
      <div style={{
        display: selectedcategoria == 0 ? 'none' : 'flex',
        flexDirection: 'column', justifyContent: 'center', width: '100%',
      }}>
        <div // DOCUMENTOS ENFERMEIRO. 
          className="scroll"
          style={{
            display: selectedcategoria == 4 ? 'flex' : 'none',
            flexDirection: 'row', justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            // pendente!
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE ENFERMAGEM
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'COREN'));
            settipodocumento("EVOLUÇÃO LIVRE - COREN");
            setconselho('COREN');
            loadEvolucoesGpulse('CREFITO', "EVOLUÇÃO ESTRUTURADA - COREN", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE DE ENFERMAGEM
          </div>
        </div>
        <div // DOCUMENTOS MÉDICO. 
          className="scroll" style={{ display: selectedcategoria == 8 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', height: '60vh', flexWrap: 'wrap' }}>
          <div onClick={() => {
            // pendente.
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE MÉDICA
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRM'));
            settipodocumento("EVOLUÇÃO LIVRE - CRM");
            setconselho('CRM');
            loadEvolucoesGpulse('CREFITO', "EVOLUÇÃO LIVRE - CRM", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE MÉDICA
          </div>
        </div>
        <div // DOCUMENTOS FISIOTERAPIA. 
          className="scroll"
          style={{
            display: selectedcategoria == 5 ? 'flex' : 'none', flexDirection: 'row',
            justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            settipodocumento("ANAMNESE - CREFITO");
            setconselho('CREFITO');
            loadEvolucoesGpulse('CREFITO', "ANAMNESE - CREFITO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE DA FISIOTERAPIA
          </div>
          <div onClick={() => {
            settipodocumento("EVOLUÇÃO ESTRUTURADA - CREFITO");
            setconselho('CREFITO');
            loadEvolucoesGpulse('CREFITO', "EVOLUÇÃO ESTRUTURADA - CREFITO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA FISIOTERAPIA
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CREFITO'));
            settipodocumento("EVOLUÇÃO LIVRE - CREFITO");
            setconselho('CREFITO');
            loadEvolucoesGpulse('CREFITO', "EVOLUÇÃO LIVRE - CREFITO", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE DE FISIOTERAPIA
          </div>
        </div>
        <div // DOCUMENTOS TERAPIA OCUPACIONAL. 
          className="scroll"
          style={{
            display: selectedcategoria == 11 ? 'flex' : 'none', flexDirection: 'row',
            justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            settipodocumento("ANAMNESE - TO");
            setconselho('TO');
            loadEvolucoesGpulse('TO', "ANAMNESE - TO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE TERAPIA OCUPACIONAL
          </div>
          <div onClick={() => {
            settipodocumento("EVOLUÇÃO ESTRUTURADA - TO");
            setconselho('TO');
            loadEvolucoesGpulse('TO', "EVOLUÇÃO ESTRUTURADA - TO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA TERAPIA OCUPACIONAL
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'TO'));
            settipodocumento("EVOLUÇÃO LIVRE - TO");
            setconselho('TO');
            loadEvolucoesGpulse('TO', "EVOLUÇÃO LIVRE - TO", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE DE TERAPIA OCUPACIONAL
          </div>
        </div>
        <div // DOCUMENTOS FONOAUDIOLOGIA. 
          className="scroll" style={{
            display: selectedcategoria == 6 ? 'flex' : 'none',
            flexDirection: 'row', justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            settipodocumento("ANAMNESE - CREFONO");
            setconselho('CREFONO');
            loadEvolucoesGpulse('CREFONO', "ANAMNESE - CREFONO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE DA FONOAUDIOLOGIA
          </div>
          <div onClick={() => {
            settipodocumento("EVOLUÇÃO ESTRUTURADA - CREFONO");
            setconselho('CREFONO');
            loadEvolucoesGpulse('CREFONO', "EVOLUÇÃO ESTRUTURADA - CREFONO", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA FONOAUDIOLOGIA
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CREFONO'));
            settipodocumento("EVOLUÇÃO LIVRE - CREFONO");
            setconselho('CREFONO');
            loadEvolucoesGpulse('CREFONO', "EVOLUÇÃO LIVRE - CREFONO", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE FONOAUDIOLOGIA
          </div>
        </div>
        <div // DOCUMENTOS PSICOLOGIA. 
          className="scroll"
          style={{
            display: selectedcategoria == 10 ? 'flex' : 'none', flexDirection: 'row',
            justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            settipodocumento("ANAMNESE - CRP");
            setconselho('CRP');
            loadEvolucoesGpulse('CRP', "ANAMNESE - CRP", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE PSICOLOGIA
          </div>
          <div onClick={() => {
            settipodocumento("EVOLUÇÃO ESTRUTURADA - CRP");
            setconselho('CRP');
            loadEvolucoesGpulse('CRP', "EVOLUÇÃO ESTRUTURADA - CRP", null);
          }} className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA PSICOLOGIA
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRP'));
            settipodocumento("EVOLUÇÃO LIVRE - CRP");
            setconselho('CRP');
            loadEvolucoesGpulse('CRP', "EVOLUÇÃO LIVRE - CRP", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE PSICOLOGIA
          </div>
        </div>
        <div // DOCUMENTOS NUTRIÇÃO.
          className="scroll"
          style={{
            display: selectedcategoria == 9 ? 'flex' : 'none', flexDirection: 'row',
            justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
          }}>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRN'));
            settipodocumento("EVOLUÇÃO LIVRE - CRN");
            setconselho('CRN');
            loadEvolucoesGpulse('CRN', "EVOLUÇÃO LIVRE - CRN", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE DA NUTRIÇÃO
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRN'));
            settipodocumento("EVOLUÇÃO ESTRUTURADA - CRN");
            setconselho('CRN');
            loadEvolucoesGpulse('CRN', "EVOLUÇÃO ESTRUTURADA - CRN", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA DA NUTRIÇÃO
          </div>
        </div>
        <div // DOCUMENTOS ASSISTÊNCIA SOCIAL.
          className="scroll"
          style={{
            display: selectedcategoria == 1 ? 'flex' : 'none', flexDirection: 'row',
            justifyContent: 'flex-start', height: '60vh', flexWrap: 'wrap',
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
            borderColor: '#f2f2f2',
            borderStyle: 'solid',
          }}>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRESS'));
            settipodocumento("ANAMNESE - CRESS");
            setconselho('CRESS');
            loadEvolucoesGpulse('CRESS', "ANAMNESE - CRESS", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            ANAMNESE DA ASSISTÊNCIA SOCIAL
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRESS'));
            settipodocumento("EVOLUÇÃO LIVRE - CRESS");
            setconselho('CRESS');
            loadEvolucoesGpulse('CRESS', "EVOLUÇÃO LIVRE - CRESS", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO LIVRE DA ASSISTÊNCIA SOCIAL
          </div>
          <div onClick={() => {
            setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == 'CRN'));
            settipodocumento("EVOLUÇÃO ESTRUTURADA - CRESS");
            setconselho('CRESS');
            loadEvolucoesGpulse('CRESS', "EVOLUÇÃO ESTRUTURADA - CRESS", null);
          }}
            className="blue-button" style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, padding: 10 }}>
            EVOLUÇÃO ESTRUTURADA DA ASSISTÊNCIA SOCIAL
          </div>
        </div>
      </div>
    )
  };

  // filtro para as evoluções.
  function ShowFilterRegistroInterdisciplinar() {
    if (stateprontuario == 35) {
      return (
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR NOS DOCUMENTOS..."
          onFocus={(e) => { (e.target.placeholder = '') }}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR NOS DOCUMENTOS...')}
          onChange={() => filterRegistroInterdisciplinar()}
          onClick={window.innerWidth < 400 ? (e) => {
            document.getElementById("identificação").style.display = "none";
            document.getElementById("inputFilterRegistroInterdisciplinar").focus();
            e.stopPropagation();
          }
            : null
          }
          style={{
            display: 'none',
            width: '60vw',
            margin: 0,
            marginTop: 0, marginBottom: 10,
          }}
          type="text"
          id="inputFilterRegistroInterdisciplinar"
          defaultValue={filterregistrointerdisciplinar}
          maxLength={100}
        ></input>
      )
    } else {
      return null;
    }
  }

  var htmlghapevolucoes = process.env.REACT_APP_API_CLONE_EVOLUCOES;
  const loadEvolucoesGpulse = (conselho, tipodocumento, item) => {
    setselectedcategoria(0);
    axios.get(htmlghapevolucoes + idpaciente).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      // retornando os registros de documento gravados conforme o tipo de documento (categoria progissional).
      var z = y.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento);
      setlistghapevolucoes(z);
      setarraylistghapevolucoes(z);
      if (item != null) {
        // atualizando status (assinado ou cancelado).
        var newstatus = -1
        if (item.status == 0) {
          newstatus = 1
        } else if (item.status == 1) {
          newstatus = 2
        }
        setiddocumento(item.id);
        setusuariodocumento(item.idprofissional);
        setstatusdocumento(newstatus);
        setdatadocumento(item.data);
        document.getElementById("tag do profissional" + item.id).className = "red-button";
      } else {
        if (z.length > 0) {
          z = y.sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento);
          // selecionando o documento na lista de documentos.         
          console.log('###' + z.map(item => item.id).slice(-1).pop());
          setiddocumento(z.map(item => item.id).slice(-1).pop());
          setdatadocumento(z.map(item => item.data).slice(-1).pop());
          setstatusdocumento(z.map(item => item.status).slice(-1).pop());
          setTimeout(() => {
            document.getElementById("tag do profissional" + z.slice(-1).map(item => item.id)).className = "red-button";
          }, 500);
        } else {

        }
      }
    });
  }
  const loadEvolucoesGpulseAfterDelete = (conselho, tipodocumento, item) => {
    setselectedcategoria(0);
    axios.get(htmlghapevolucoes + idpaciente).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      var z = y.sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento);
      setlistghapevolucoes(z);
      setarraylistghapevolucoes(z);
    });
  }

  // excluindo o registro de evolução ainda não assinado.
  var htmldeleteevolucao = process.env.REACT_APP_API_CLONE_DELETEEVOLUCAO;
  const deleteEvolucao = (item) => {
    axios.get(htmldeleteevolucao + item.id).then(() => {
      setiddocumento(0);
      setviewdocumento(0);
      setTimeout(() => {
        loadEvolucoesGpulseAfterDelete(conselho, tipodocumento, null);
      }, 500);
    });
  }
  // assinando ou suspendendo uma evolução (conforme parâmetro).
  var htmlupdateevolucao = process.env.REACT_APP_API_CLONE_UPDATEEVOLUCAO;
  const updateEvolucao = (item, value) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: item.idatendimento,
      data: item.data,
      evolucao: item.evolucao,
      idprofissional: iduser,
      status: value,
      conselho: item.conselho,
    };
    axios.post(htmlupdateevolucao + item.id, obj).then(() => {
      loadEvolucoesGpulse(conselho, tipodocumento, item);
    });
  }
  // copiando uma evolução.
  var htmlinsertevolucao = process.env.REACT_APP_API_CLONE_INSERTEVOLUCAO;
  const copiarEvolucao = (item) => {
    setstatusdocumento(0);
    setidselecteddocumento(item.id);
    var botoes = document.getElementById('LISTA DE EVOLUÇÕES').getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      evolucao: tipodocumento,
      idprofissional: iduser,
      status: 0,
      conselho: conselhousuario.toString(),
    };
    axios.post(htmlinsertdocumento, obj).then(() => {
      setTimeout(() => {
        setstatusdocumento(-2);
      }, 1000);
      loadEvolucoesGpulse(conselho, tipodocumento, null);
      if (conselho == 'CREFITO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFITO') {
        setviewdocumento(51);
      } else if (conselho == 'CREFITO' && tipodocumento == 'MODELO DE DOCUMENTO') {
        setviewdocumento(61);
      } else if (conselho == 'CREFONO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFONO') {
        setviewdocumento(71);
      } else if (conselho == 'CRP' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRP') {
        setviewdocumento(81);
      } else if (conselho == 'TO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - TO') {
        setviewdocumento(91);
      } else if (conselho == 'CRN' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRN') {
        setviewdocumento(101);
      } else if (conselho == 'CRESS' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRESS') {
        setviewdocumento(111);
      } else if (conselho == 'CREFITO' && tipodocumento == 'ANAMNESE - CREFITO') {
        setviewdocumento(121);
      } else if (conselho == 'CREFONO' && tipodocumento == 'ANAMNESE - CREFONO') {
        setviewdocumento(131);
      } else if (conselho == 'CRP' && tipodocumento == 'ANAMNESE - CRP') {
        setviewdocumento(141);
      } else if (conselho == 'TO' && tipodocumento == 'ANAMNESE - TO') {
        setviewdocumento(151);
      } else if (conselho == 'CRESS' && tipodocumento == 'ANAMNESE - CRESS') {
        setviewdocumento(161);
      } else {
        // pendência !!! incluir documentos pendentes aqui...
      }
    });
  }

  var deletekey = 0;
  const deletetoast = (funcao, item) => {
    document.getElementById("deletekey 1 " + item.id).style.display = "flex"
    document.getElementById("deletekey 0 " + item.id).style.display = "none"
    if (deletekey == 0) {
      deletekey = 1;
      document.getElementById("deletekey 1 " + item.id).style.display = "flex"
      document.getElementById("deletekey 0 " + item.id).style.display = "none"
    } else {
      deletekey = 0;
      document.getElementById("deletekey 0 " + item.id).style.display = "flex"
      document.getElementById("deletekey 1 " + item.id).style.display = "none"
    }
    clearTimeout(timeout);
    console.log('VIEW: ' + deletekey)
    timeout = setTimeout(() => {
      if (deletekey == 1) {
        funcao(item);
        console.log('REGISTRO EXCLUÍDO.');
      } else {
        console.log('REGISTRO MANTIDO.');
      }
      if (document.getElementById("deletekey 1 " + item.id) != null) {
        document.getElementById("deletekey 0 " + item.id).style.display = "flex"
        document.getElementById("deletekey 1 " + item.id).style.display = "none"
      }
    }, 3000);
  }

  var listcategoriaprofissional = [
    { id: 8, nome: 'MEDICO(A)', cor: '#AED6F1', conselho: 'CRM' },
    { id: 4, nome: 'ENFERMEIRO(A)', cor: '#76D7C4', conselho: 'COREN' },
    { id: 32, nome: 'FARMACEUTICO(A)', cor: '#AED6F1', conselho: 'CRF' },
    { id: 5, nome: 'FISIOTERAPEUTA', cor: '#BB8FCE', conselho: 'CREFITO' },
    { id: 6, nome: 'FONOAUDIOLOGO(A)', cor: '#F1948A', conselho: 'CREFONO' },
    { id: 10, nome: 'PSICOLOGO(A)', cor: '#EDBB99', conselho: 'CRP' },
    { id: 1, nome: 'ASSISTENTE SOCIAL', cor: '#F7DC6F', conselho: 'CRESS' },
    { id: 11, nome: 'TERAPEUTA OCUPACIONAL', cor: '#AEB6BF', conselho: 'TO' },
    { id: 9, nome: 'NUTRICIONISTA', cor: 'grey', conselho: 'CRN' },
  ]

  const CategoriaSelector = useCallback(() => {
    return (
      <div id="scroll das categorias profissionais."
        className="scroll"
        style={{
          display: stateprontuario == 35 ? 'flex' : 'none',
          alignSelf: 'center',
          scrollBehavior: 'smooth', flexDirection: 'row', justifyContent: 'flex-start',
          overflowY: 'hidden', overflowX: 'scroll',
          width: '100%',
          margin: 0, marginTop: 10, marginBottom: 0, padding: 0, height: 90, minHeight: 90, maxHeight: 90,
          backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
          borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        }}>
        {arraycategoriaprofissional.map(item => (
          <div
            id={"categoriaprofissional" + item.id}
            className="blue-button"
            style={{
              width: 180, minWidth: 180, marginBottom: 7.5, padding: 10,
            }}
            onClick={() => {
              var botoes = document.getElementById("scroll das categorias profissionais.").getElementsByClassName("red-button");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button";
              }
              document.getElementById("categoriaprofissional" + item.id).className = "red-button"
              setselectedcategoria(item.id);
              setconselho(item.conselho);
              settipodocumento('');
              setviewdocumento(0);
              setstatusdocumento(null);
            }}
          >
            {item.nome}
          </div>
        ))}
      </div>
    )
  }, [stateprontuario, arraycategoriaprofissional]);

  //filtro da lista de documentos/registros interdisciplinares.
  const [filterlistaregistrointerdisciplinar, setfilterlistaregistrointerdisciplinar] = useState('');
  var searchlistaregistro = '';
  var timeout = null;

  const filterListaRegistroInterdisciplinar = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterListaRegistroInterdisciplinar").focus();
    searchlistaregistro = document.getElementById("inputFilterListaRegistroInterdisciplinar").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlistaregistro == '') {
        setviewdocumento(0);
        setfilterlistaregistrointerdisciplinar('');
        setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == conselho));
        setarraylistghapevolucoes(listghapevolucoes.filter(item => item.conselho == conselho && item.evolucao.split('*', 1) == tipodocumento));
        document.getElementById("inputFilterListaRegistroInterdisciplinar").value = '';
        document.getElementById("inputFilterListaRegistroInterdisciplinar").focus();
      } else {
        setviewdocumento(0);
        setfilterlistaregistrointerdisciplinar(document.getElementById("inputFilterListaRegistroInterdisciplinar").value.toUpperCase());
        setarrayevolucao(listevolucoes.filter(item => item.ds_conselho == conselho && item.ds_evolucao.toString().toUpperCase().includes(searchlistaregistro) == true));
        setarraylistghapevolucoes(listghapevolucoes.filter(item => item.conselho == conselho && moment(item.data).format('DD/MM/YY').includes(searchlistaregistro) == true));
        document.getElementById("inputFilterListaRegistroInterdisciplinar").value = searchlistaregistro;
        document.getElementById("inputFilterListaRegistroInterdisciplinar").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterListaRegistroInterdisciplinar").focus();
      }
    }, 500);
  }

  const ListaDeDocumentos = useCallback(() => {
    return (
      <div id="LISTA DE EVOLUÇÕES"
        className="scroll"
        style={{
          scrollBehavior: 'smooth',
          width: '25vw', minWidth: '25vw',
          height: '60vh', minHeight: '60vh',
          marginTop: 10,
          backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
        }}
      >
        {arraylistghapevolucoes.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).map((item) => (
          <div className="menuitemanimation"
            style={{
              display: tipodocumento == '' ? 'none' : 'flex',
            }}>
            <div id={"tag do profissional" + item.id}
              className={"blue-button"}
              onClick={(e) => {
                setiddocumento(item.id);
                setstatusdocumento(item.status);
                setdatadocumento(item.data);
                // loadEvolucoesGpulse(conselho, tipodocumento, item);
                setTimeout(() => {
                  var botoes = document.getElementById("LISTA DE EVOLUÇÕES").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("tag do profissional" + item.id).className = "red-button"
                }, 200);
                e.stopPropagation();
              }}
              style={{
                flexDirection: 'column',
                width: '100%',
                minWidth: '100%',
                minHeight: 180,
                margin: 5, marginTop: 0, marginBottom: 0,
                padding: 10,
                opacity: item.status == 2 ? 0.3 : 1,
              }}
            >
              <div id="botões"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
              >
                <button id="edit-button"
                  className="animated-yellow-button"
                  onClick={(e) => {
                    // editarEvolucao(item); 
                    e.stopPropagation()
                  }}
                  title="EDITAR EVOLUÇÃO."
                  style={{
                    display: 'none',
                    marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0,
                  }}>
                  <img
                    alt=""
                    src={editar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </button>
                <button id="copy-button"
                  className="animated-green-button"
                  onClick={(e) => { setidselecteddocumento(item.id); copiarEvolucao(item); e.stopPropagation() }}

                  title="COPIAR EVOLUÇÃO."
                  style={{
                    display: item.conselho == conselhousuario ? 'flex' : 'none',
                    marginTop: 0,
                    marginBottom: window.innerWidth < 800 ? 5 : 0,
                    marginLeft: 5
                  }}
                >
                  <img
                    alt=""
                    src={copiar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </button>
                <button id="print-button"
                  className="animated-green-button"
                  onClick={(e) => {
                    console.log(item.evolucao);
                    setstatusdocumento(100);
                    setTimeout(() => {
                      if (item.evolucao.split('*').slice(0, 1).toString().substring(0, 14) == 'EVOLUÇÃO LIVRE') {
                        setviewpdf(11);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - CREFITO') {
                        setviewpdf(52);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - CREFONO') {
                        setviewpdf(72);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - CRP') {
                        setviewpdf(82);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'ANAMNESE - CRESS') {
                        setviewpdf(162);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'ANAMNESE - CREFITO') {
                        setviewpdf(122);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'ANAMNESE - CREFONO') {
                        setviewpdf(132);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'ANAMNESE - CRP') {
                        setviewpdf(142);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'ANAMNESE - TO') {
                        setviewpdf(152);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - CRESS') {
                        settipodocumento("EVOLUÇÃO ESTRUTURADA - CRESS");
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - TO') {
                        setviewpdf(92);
                      } else if (item.evolucao.split('*').slice(0, 1) == 'EVOLUÇÃO ESTRUTURADA - CRN') {
                        setviewpdf(102);
                      } else {
                        // pendência (incluir demais viewdocumentos para pdf)!!!
                      }
                    }, 1000);
                    e.stopPropagation();
                  }}
                  title="IMPRIMIR EVOLUÇÃO."
                  style={{
                    display: item.status == 1 ? 'flex' : 'none',
                    marginTop: 0,
                    marginRight: 2.5,
                    marginLeft: 2.5,
                    marginBottom: window.innerWidth > 800 && item.idprofissional == idusuario ? 0 : 5,
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
                <button id="sign-button"
                  className="animated-green-button"
                  onClick={() => {
                    setiddocumento(item.id);
                    setdatadocumento(item.data);
                    setsignature(1);
                    console.log(item.data);
                  }
                  }
                  title="ASSINAR EVOLUÇÃO."
                  style={{
                    display: item.status == 0 && item.idprofissional == iduser && conselhousuario == conselho ? 'flex' : 'none',
                    marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0
                  }}
                >
                  <img
                    alt=""
                    src={assinar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </button>
                <button
                  id={"deletekey 0 " + item.id}
                  className="animated-red-button"
                  onClick={(e) => { deletetoast(deleteEvolucao, item); e.stopPropagation() }}
                  title="EXCLUIR EVOLUÇÃO."
                  style={{
                    display: item.status == 0 && item.idprofissional == iduser && conselhousuario == conselho ? 'flex' : 'none',
                    marginRight: 0,
                    marginLeft: 2.5,
                    marginBottom: 0,
                    marginTop: 0
                  }}
                >
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
                <button
                  id={"deletekey 1 " + item.id}
                  style={{
                    display: 'none', width: 100,
                    marginRight: 0,
                    marginLeft: 2.5,
                    marginBottom: 0,
                    marginTop: 0
                  }}
                  className="animated-red-button"
                  onClick={(e) => { deletetoast(deleteEvolucao, item); e.stopPropagation() }}
                >
                  <div>DESFAZER</div>
                  <div className="deletetoast"
                    style={{
                      height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                      marginLeft: 5, marginRight: 5, maxWidth: 90,
                    }}>
                  </div>
                </button>
                <button id="suspend-button"
                  className="animated-red-button"
                  title="SUSPENDER EVOLUÇÃO."
                  onClick={() => updateEvolucao(item, 2)}
                  style={{
                    display: item.status == 1 && item.idprofissional == iduser && conselhousuario == conselho ? 'flex' : 'none',
                    marginRight: window.innerWidth > 800 ? 0 : 2.5,
                    marginTop: 0,
                    marginBottom: window.innerWidth < 800 ? 0 : 0,
                  }}
                >
                  <img
                    alt=""
                    src={suspender}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 10, marginBottom: 0 }}>
                <div style={{ margin: 5, marginBottom: 0, marginTop: 0 }}>{moment(item.data).format('DD/MM/YY')}</div>
                <div style={{ margin: 0 }}>{moment(item.data).format('HH:mm')}</div>
                <div>{personas.filter(value => value.id == item.idprofissional).map(value => value.nomeusuario)}</div>
                <div>{personas.filter(value => value.id == item.idprofissional).map(value => value.categoriausuario)}</div>
              </div>
            </div>
          </div>
        ))}

        {arrayevolucao.sort((a, b) => moment(a.dt_hr_pre_med) < moment(b.dt_hr_pre_med) ? 1 : -1).map((item) => (
          <div className="menuitemanimation" style={{ display: tipodocumento.includes('EVOLUÇÃO LIVRE') == true ? 'flex' : 'none' }}>
            <div id={"tag do profissional" + item.id + arrayevolucao.length}
              className="blue-button"
              onClick={() => {
                // alert(item.ds_evolucao);
                setiddocumento(item.id + arrayevolucao.length);
                setviewdocumento(991);
                setTimeout(() => {
                  var botoes = document.getElementById("LISTA DE EVOLUÇÕES").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("tag do profissional" + item.id + arrayevolucao.length).className = "red-button"
                }, 100);
              }}
              style={{
                position: 'relative',
                minWidth: '100%',
                width: '100%',
                minHeight: 150,
                margin: 5,
                padding: 10,
                // backgroundColor: arraycategoriaprofissional.filter(valor => valor.conselho == item.ds_conselho).map(item => item.cor),
              }}
            >
              <div style={{ position: 'sticky' }}>
                <div style={{ margin: 5, marginBottom: 0, marginTop: 0 }}>{moment(item.dt_hr_pre_med).format('DD/MM/YY')}</div>
                <div style={{ margin: 0 }}>{moment(item.dt_hr_pre_med).format('HH:MM')}</div>
                <div style={{ margin: 5, marginTop: 0 }}>{JSON.stringify(item.nm_prestador).substring(1, 30).replace('"', '').split(" ").slice(0, 1)}</div>
                <div>{item.ds_conselho}</div>
                <div>{item.ds_codigo_conselho}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }, [arraylistghapevolucoes, arrayevolucao, conselho, tipodocumento])

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

  // copiando valores de campos ao criar nova evolução.
  const copiaValores = () => {
    // recuperando valores.
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      y.filter(valor => valor.idevolucao == iddocumento).map(valor => {
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: valor.idcampo,
          idopcao: valor.idopcao,
          opcao: valor.opcao,
          valor: valor.valor,
          idevolucao: iddocumento + 1
        }
        axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
          loadCamposValores();
        });
      });
    });
  }

  // inserir registro de resumo de plano terapêutico quando criamos ou copiamos um documento.
  /*
  const insertValorResumoPlanoTerapeutico = () => {
    let valor =
      'OBJETIVOS SECUNDÁRIOS ATIVOS:'
      +
      objetivos.filter(item => item.statusobjetivo == 1 && item.tipoobjetivo == 2).map(item => '\n' + item.objetivo) +
      '\n\n'
      +
      'METAS ATIVAS:'
      +
      metas.filter(item => item.status == 0).map(item => '\n' + item.meta);

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
  */

  // renderização do componente.
  var htmlinsertdocumento = process.env.REACT_APP_API_CLONE_INSERTEVOLUCAO;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', height: '100%',
      width: '100%', opacity: 1,
    }}>
      <div className="conteudo" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70vw', marginRight: 10 }}>
          <CategoriaSelector></CategoriaSelector>
          <ShowRegistrosInterdisciplinares></ShowRegistrosInterdisciplinares>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', justifyContent: 'center', height: '60vh'
          }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input
              className="input"
              autoComplete="off"
              placeholder="DATA..."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'DATA...')}
              onChange={() => filterListaRegistroInterdisciplinar()}
              style={{
                width: '100%',
                margin: 0,
              }}
              type="text"
              id="inputFilterListaRegistroInterdisciplinar"
              defaultValue={filterlistaregistrointerdisciplinar}
              maxLength={10}
            ></input>
            <div className="green-button"
              title="NOVO DOCUMENTO."
              style={{ display: conselhousuario == conselho && tipodocumento != '' ? 'flex' : 'none', margin: 0, marginLeft: 5 }}
              onClick={() => {
                setstatusdocumento(0);
                var botoes = document.getElementById('LISTA DE EVOLUÇÕES').getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                var obj = {
                  idpct: idpaciente,
                  idatendimento: idatendimento,
                  data: moment(),
                  evolucao: tipodocumento,
                  idprofissional: iduser,
                  status: 0,
                  conselho: conselhousuario.toString(),
                };
                axios.post(htmlinsertdocumento, obj).then(() => {
                  loadEvolucoesGpulse(conselho, tipodocumento, null);
                  setTimeout(() => {
                    setstatusdocumento(-1);
                    
                    setTimeout(() => {
                      // setstatusdocumento(0);
                    }, 2000);

                  }, 2000);
                  if (conselho == 'CREFITO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFITO') {
                    setviewdocumento(51);
                  } else if (conselho == 'CREFITO' && tipodocumento == 'MODELO DE DOCUMENTO') {
                    setviewdocumento(61);
                  } else if (conselho == 'CREFONO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFONO') {
                    setviewdocumento(71);
                  } else if (conselho == 'CRP' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRP') {
                    setviewdocumento(81);
                  } else if (conselho == 'TO' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - TO') {
                    setviewdocumento(91);
                  } else if (conselho == 'CRN' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRN') {
                    setviewdocumento(101);
                  } else if (conselho == 'CRESS' && tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRESS') {
                    setviewdocumento(111);
                  } else if (conselho == 'CREFITO' && tipodocumento == 'ANAMNESE - CREFITO') {
                    setviewdocumento(121);
                  } else if (conselho == 'CREFONO' && tipodocumento == 'ANAMNESE - CREFONO') {
                    setviewdocumento(131);
                  } else if (conselho == 'CRP' && tipodocumento == 'ANAMNESE - CRP') {
                    setviewdocumento(141);
                  } else if (conselho == 'TO' && tipodocumento == 'ANAMNESE - TO') {
                    setviewdocumento(151);
                  } else if (conselho == 'CRESS' && tipodocumento == 'ANAMNESE - CRESS') {
                    setviewdocumento(161);
                  } else {
                    // pendência !!! incluir documentos pendentes aqui...
                  }
                });
              }}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className="green-button"
              style={{ display: conselhousuario != conselho || tipodocumento == '' ? 'flex' : 'none', margin: 0, marginLeft: 5, opacity: 0.3, backgroundColor: 'grey' }}
              onClick={() =>
                toast(1, '#ec7063', 'NÃO É PERMITIDO CRIAR DOCUMENTO EM OUTRA CATEGORIA PROFISSIONAL.')
              }
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
          </div>
          <ListaDeDocumentos></ListaDeDocumentos>
          <Signature></Signature>
        </div>
      </div>
    </div >
  )
}
export default Evolucao;