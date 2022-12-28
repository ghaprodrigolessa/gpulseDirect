/* eslint eqeqeq: "off" */
/* eslint array-callback-return: "off" */
/* eslint no-redeclare: "off" */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { Doughnut, Line } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import salvar from '../images/salvar.svg';
import settingsimg from '../images/settings.svg'
import flag from '../images/flag.svg';
import bell from '../images/bell.svg';
import plano_ativo from '../images/plano_ativo.svg';
import plano_cancelado from '../images/plano_cancelado.svg';
import plano_fracassado from '../images/plano_fracassado.svg';
import plano_validar from '../images/plano_validar.svg';
import plano_fail from '../images/plano_fail.svg';
import refresh from '../images/refresh.svg';
import restart from '../images/restart.svg';
import trash from '../images/trash.svg';

import emojihappy from '../images/emojihappy.svg';
import emojineutral from '../images/emojineutral.svg';
import emojisad from '../images/emojisad.svg';

import novo from '../images/novo.svg';
import Toast from '../components/Toast';
import LogoInverted from '../components/LogoInverted';

// import setaesquerda from '../images/arrowleft.svg';
// import setadireita from '../images/arrowright.svg';

function AptPlanoTerapeutico() {
  // recuperando estados globais (Context.API).
  const {
    tipousuario,
    boss_planoterapeutico_usuario,
    idpaciente,
    idatendimento, ivcf,
    listevolucoes,
    planoterapeutico, setplanoterapeutico,
    linhadecuidado, setlinhadecuidado,
    setlinhadecuidadoatual, linhadecuidadoatual,
    opcoeslinhasdecuidado,
    setshowescala,
    listescalas, setlistescalas,

    datainicioplanoterapeutico, setdatainicioplanoterapeutico,
    dataterminoplanoterapeutico, setdataterminoplanoterapeutico,
    statusplanoterapeutico, setstatusplanoterapeutico,

    objetivos, setobjetivos,
    idplanoterapeutico, setidplanoterapeutico,
    metas, setmetas,
    linhasdecuidado, setlinhasdecuidado,
    opcoesobjetivos, setopcoesobjetivos,
    hide, sethide,
    lastplanoterapeutico, setlastplanoterapeutico,
    arraycategoriaprofissional, setarraycategoriaprofissional,
    selectedobjetivosecundario, setselectedobjetivosecundario,
    selectedobjetivo, setselectedobjetivo,
    selectedcategoria, setselectedcategoria,
    opcoesmetas, setopcoesmetas,
    viewjustificaobjetivoprimario, setviewjustificaobjetivoprimario,

  } = useContext(Context)

  var html = 'https://pulsarapp-server.herokuapp.com';

  var htmlopcoeslinhasdecuidado = process.env.REACT_APP_API_CLONE_OPCOES_LINHAS_DE_CUIDADO;
  var htmllinhasdecuidado = process.env.REACT_APP_API_CLONE_LINHASDECUIDADO;
  var htmlinsertlinhadecuidado = process.env.REACT_APP_API_CLONE_INSERTLINHADECUIDADO;
  var htmlupdatelinhadecuidado = process.env.REACT_APP_API_CLONE_UPDATELINHADECUIDADO;

  var htmlplanosterapeuticos = process.env.REACT_APP_API_CLONE_PLANOSTERAPEUTICOS;
  var htmlinsertplanoterapeutico = process.env.REACT_APP_API_CLONE_INSERTPLANOTERAPEUTICO;
  var htmlupdateplanoterapeutico = process.env.REACT_APP_API_CLONE_UPDATEPLANOTERAPEUTICO;

  var htmlopcoesobjetivos = process.env.REACT_APP_API_CLONE_OPCOES_OBJETIVOS;
  var htmlobjetivos = process.env.REACT_APP_API_CLONE_OBJETIVOS;
  var htmlinsertobjetivo = process.env.REACT_APP_API_CLONE_INSERTOBJETIVO;
  var htmlupdateobjetivo = process.env.REACT_APP_API_CLONE_UPDATEOBJETIVO;
  var htmldeleteobjetivo = process.env.REACT_APP_API_CLONE_DELETEOBJETIVO;

  var htmlopcoesmetas = process.env.REACT_APP_API_CLONE_OPCOES_METAS;
  var htmlmetas = process.env.REACT_APP_API_CLONE_METAS;
  var htmlinsertmeta = process.env.REACT_APP_API_CLONE_INSERTMETA;
  var htmlupdatemeta = process.env.REACT_APP_API_CLONE_UPDATEMETA;
  var htmldeletemeta = process.env.REACT_APP_API_CLONE_DELETEMETA;


  // endpoints para a gestão do plano terapêutico (edição de opções).
  var htmlinsertopcaolinhadecuidado = process.env.REACT_APP_API_CLONE_INSERTOPCAOLINHADECUIDADO;
  var htmldeleteopcaolinhadecuidado = process.env.REACT_APP_API_CLONE_DELETEOPCAOLINHADECUIDADO;

  var htmlinsertopcaoobjetivo = process.env.REACT_APP_API_CLONE_INSERTOPCAOOBJETIVO;
  var htmldeleteopcaoobjetivo = process.env.REACT_APP_API_CLONE_DELETEOPCAOOBJETIVO;

  var htmlinsertopcaometa = process.env.REACT_APP_API_CLONE_INSERTOPCAOMETA;
  var htmldeleteopcaometa = process.env.REACT_APP_API_CLONE_DELETEOPCAOMETA;

  var htmllistopcaometodo = process.env.REACT_APP_API_CLONE_LISTOPCAOMETODO;
  var htmlinsertopcaometodo = process.env.REACT_APP_API_CLONE_INSERTOPCAOMETODO;
  var htmldeleteopcaometodo = process.env.REACT_APP_API_CLONE_DELETEOPCAOMETODO;


  var htmlpropostasterapeuticas = process.env.REACT_APP_API_CLONE_PROPOSTASTERAPEUTICAS;

  var htmlghapescalas = process.env.REACT_APP_API_CLONE_ESCALAS;
  var htmlghapopcoesescalas = process.env.REACT_APP_API_CLONE_OPCOES_ESCALAS;

  // carregando planos terapêuticos, objetivos, metas e propostas terapêuticas (intervenções) para o atendimento.
  const loadPlanosTerapeuticos = () => {
    axios.get(htmlplanosterapeuticos + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      setplanoterapeutico(x.rows.sort((a, b) => moment(a.datainicio) > moment(b.datainicio) ? 1 : -1));
      // carregando último plano terapêutico (ativo).
      setlastplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1)); // recuperando último registro de plano terapêutico.
      setidplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => item.id).pop()); // recuperando a id do último plano terapêutico.
      // alert('LAST ID: ' + idplanoterapeutico);
      setdatainicioplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => moment(item.datainicio).format('DD/MM/YY'))); // recuperando a data de início do último plano terapêutico.
      setstatusplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => item.status));
    });
  }

  const loadObjetivos = () => {
    axios.get(htmlobjetivos + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setobjetivos(x.rows);
    });
  }
  const [arraymetas, setarraymetas] = useState([]);
  const loadMetas = () => {
    axios.get(htmlmetas + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setmetas(x.rows);
      setarraymetas(x.rows);
      setbusy(0);
    });
  }

  // carregando opções de objetivos, metas e intervenções (propostas terapêuticas).
  const [arrayopcoesobjetivos, setarrayopcoesobjetivos] = useState([]);
  const loadOpcoesObjetivos = () => {
    axios.get(htmlopcoesobjetivos).then((response) => {
      var x = [0, 1];
      x = response.data;
      setopcoesobjetivos(x.rows);
      setarrayopcoesobjetivos(x.rows);
    });
  }
  const [arrayopcoesmetas, setarrayopcoesmetas] = useState([]);
  const loadOpcoesMetas = () => {
    axios.get(htmlopcoesmetas).then((response) => {
      var x = [0, 1];
      x = response.data;
      setopcoesmetas(x.rows);
      setarrayopcoesmetas(x.rows);
    });
  }

  // tela ocupado.
  const [busy, setbusy] = useState(0);
  function Busy() {
    return (
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: '#ffffff',
        display: busy == 1 ? 'flex' : 'none',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
      }}>
        <div className="pulsarlogo"
          style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            display: 'flex',
            flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
          }}>
          <LogoInverted height={100} width={100}></LogoInverted>
        </div>
      </div>
    )
  }

  // crud para planos terapêuticos, objetivos e metas.
  // PLANO TERAPÊUTICO.
  // inserir plano terapêutico.
  const [moraes] = useState(0);
  const [decliniofuncional] = useState(0);
  const [riscofuncional] = useState(0);
  const insertPlanoTerapeutico = () => {
    if (planoterapeutico.filter(item => item.datatermino == null).length > 0) {
      toast(1, '#ec7063', 'EXISTE UM PLANO TERAPÊUTICO ATIVO. FINALIZE-O PARA CRIAR UM NOVO PLANO TERAPÊUTICO.', 5000);
    } else if (id_linhadecuidado == 0) {
      toast(1, '#ec7063', 'SELECIONE UMA LINHA DE CUIDADO PRIMEIRO.', 3000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: moment(),
        datatermino: null,
        idprofissional: 0,
        moraes: moraes,
        decliniofuncional: decliniofuncional,
        riscofuncional: riscofuncional,
        linhadecuidados: id_linhadecuidado,
        status: 1 // 1 = ativo, 2 = cancelado, 3 = concluído.
      }
      // alert(JSON.stringify(obj));
      axios.post(htmlinsertplanoterapeutico, obj).then(() => {
        // toast(1, '#52be80', 'PREPARANDO PLANO TERAPÊUTICO.', 9000);
        setbusy(1);
        axios.get(htmlplanosterapeuticos + idatendimento).then((response) => {
          var x = [0, 1];
          var y = [0, 1];
          x = response.data;
          y = x.rows;
          // carregando id do plano terapêutico recém-criado (ativo).
          var lastid = y.filter(item => item.datatermino == null).slice(-1).map(item => item.id).pop();
          // inserindo objetivos primários e secundários aplicáveis ao plano terapêutico.
          setTimeout(() => {
            insertObjetivosAndMetas(id_linhadecuidado, lastid);
            setTimeout(() => {
              loadPlanosTerapeuticos();
              loadObjetivos();
              loadMetas();
            }, 3000);
          }, 2000);
        });
      });
    }
  }

  // inserindo objetivos primários e secundários aplicáveis à linha de cuidado selecionada.
  const insertObjetivosAndMetas = (linhadecuidado, idplanoterapeutico) => {
    /* 
    item.id_linhadecuidado == linhadecuidado >> objetivos primários (específicos para cada linha de cuidado).
    item.id_linhadecuidado == null >> objetivos secundários (comuns a todas as linhas de cuidado).
    */
    opcoesobjetivos.filter(item => item.id_linhadecuidado == linhadecuidado || item.id_linhadecuidado == null).map(item => {
      /*
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idplanoterapeutico: idplanoterapeutico,
        idobjetivo: parseInt(item.id),
        objetivo: item.objetivo,
        datainicio: moment(),
        datatermino: null,
        idprofissional: 0,
        tipoobjetivo: parseInt(item.tipo), // 1 = primário. 2 = secundário.
        statusobjetivo: 1, // 0 = a validar, 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado.
        escala: parseInt(item.escala), // acompanhado ou não de método de avaliação (escala).
        dimensao: parseInt(item.dimensao),
      }
      // inserção automática das metas (são muitas - HPT deseja inserir manualmente);
      axios.post(htmlinsertobjetivo, obj).then(() => {
        opcoesmetas.filter(valor => valor.id_objetivo == item.id).map(item => {
          var obj = {
            idpct: idpaciente,
            idatendimento: idatendimento,
            idplanoterapeutico: idplanoterapeutico,
            idobjetivo: parseInt(item.id_objetivo),
            meta: item.meta,
            datainicio: moment().startOf('day'),
            dataestimada: moment().startOf('day').add(15, 'days'),
            datatermino: null,
            idprofissional: 0,
            status: 0, // 0 = a validar, 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
            nota: 10,
            idespecialidade: parseInt(item.idespecialidade),
            justificativa: null,
            datachecagem: moment().startOf('day').add(item.checagem, 'days'),
            checagem: 7,
            idmeta: item.idmeta
          }
          // alert(JSON.stringify(obj));
          axios.post(htmlinsertmeta, obj);
        })
      });
      */
    })
  }

  // modal para confirmação de atualização ou finalização do plano terapêutico.
  const [viewmodalplanoterapeutico, setviewmodalplanoterapeutico] = useState(0);
  function ModalPlanoTerapeutico() {
    return (
      <div
        className="menucover fade-in"
        style={{
          zIndex: 9, display: viewmodalplanoterapeutico != 0 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer" style={{ padding: 20 }}>
          <div className="title2center">
            {viewmodalplanoterapeutico == 1 ? 'CONFIRMAR FINALIZAÇÃO DO PLANO TERAPÊUTICO ?' : 'CONFIRMAR CANCELAMENTO DO PLANO TERAPÊUTICO?'}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              className="red-button"
              onClick={() => setviewmodalplanoterapeutico(0)}
              style={{
                margin: 5,
                width: 100, minWidth: 100
              }}
            >
              CANCELAR
            </button>
            <button
              className="green-button"
              onClick={
                viewmodalplanoterapeutico == 1 ?
                  () => { setviewmodalplanoterapeutico(0); updatePlanoTerapeutico(idplanoterapeutico, 2) }
                  :
                  () => { setviewmodalplanoterapeutico(0); updatePlanoTerapeutico(idplanoterapeutico, 3) }}
              style={{
                margin: 5,
                width: 100, minWidth: 100
              }}
            >
              CONFIRMAR
            </button>
          </div>
        </div>
      </div >
    );
  }

  // atualizar plano terapêutico.
  const updatePlanoTerapeutico = (id, status) => {
    // finalizando um plano terapêutico.
    if (status == 2) {
      // impedindo a finalização do plano terapêutico se existem objetivos ou metas ativas.
      if (objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 1).length > 0 || metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).length > 0) {
        toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM PLANO TERAPÊUTICO COM OBJETIVOS OU METAS ATIVAS.', 4000);
        // permitindo a finalização do plano terapêutico.
      } else {
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          datainicio: planoterapeutico.filter(item => item.id == idplanoterapeutico).map(item => item.datainicio).pop(),
          datatermino: moment(),
          idprofissional: 0,
          moraes: moraes,
          decliniofuncional: decliniofuncional,
          riscofuncional: riscofuncional,
          linhadecuidados: id_linhadecuidado,
          status: status
        }
        axios.post(htmlupdateplanoterapeutico + id, obj).then(() => {
          loadPlanosTerapeuticos();
        });
      }
      // cancelando um plano terapêutico.
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: planoterapeutico.filter(item => item.id == idplanoterapeutico).map(item => item.datainicio).pop(),
        datatermino: moment(),
        idprofissional: 0,
        moraes: moraes,
        decliniofuncional: decliniofuncional,
        riscofuncional: riscofuncional,
        linhadecuidados: 0,
        status: 3
      }
      // alert(JSON.stringify(obj));
      axios.post(htmlupdateplanoterapeutico + id, obj).then(() => {
        // desabilitar objetivos e metas quando o plano terapêutico é cancelado.
        objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico).map(item => {
          updateObjetivo(item, 3);
        })
        metas.filter(item => item.idplanoterapeutico == idplanoterapeutico).map(item => {
          updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 4, item.idprofissional, 'PLANO TERAPÊUTICO CANCELADO.', item.checagem);
        })
        setTimeout(() => {
          loadPlanosTerapeuticos();
        }, 3000);
      });
    }
  }

  // OBJETIVOS.
  // inserir objetivo.
  const [idobjetivo] = useState(0);
  const insertObjetivo = (idobjetivo, objetivo, tipo, escala, dimensao) => {
    // alert(idobjetivo + ' - ' + objetivo + ' - ' + tipo + ' - ' + escala);
    if (objetivos.filter(item => item.datatermino == null && item.idobjetivo == idobjetivo).length > 0) {
      toast(1, '#ec7063', 'OBJETIVO JÁ CADASTRADO.', 5000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idplanoterapeutico: idplanoterapeutico,
        idobjetivo: parseInt(idobjetivo),
        objetivo: objetivo,
        datainicio: moment(),
        datatermino: null,
        idprofissional: 0,
        tipoobjetivo: parseInt(tipo), // 1 = primário. 2 = secundário.
        statusobjetivo: 1, // 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado.
        escala: parseInt(escala),
        dimensao: parseInt(dimensao),
      }
      // alert(JSON.stringify(obj));
      axios.post(htmlinsertobjetivo, obj).then(() => {
        /*
        opcoesmetas.filter(valor => valor.id_objetivo == idobjetivo).map(item => {
          var obj = {
            idpct: idpaciente,
            idatendimento: idatendimento,
            idplanoterapeutico: idplanoterapeutico,
            idobjetivo: parseInt(item.id_objetivo),
            meta: item.meta,
            datainicio: moment(),
            dataestimada: moment().add(1, 'month'),
            datatermino: null,
            idprofissional: 0,
            status: 0, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
            nota: 10, // nota dada após a conclusão da meta.
            idespecialidade: parseInt(item.idespecialidade),
            justificativa: null,
            datachecagem: moment().add(item.checagem, 'days'),
            checagem: 7,
            idmeta: item.meta,
          }
          // alert(JSON.stringify(obj));
          axios.post(htmlinsertmeta, obj);
        });
        */
        setTimeout(() => {
          loadObjetivos();
          // loadMetas();
        }, 500);
      });
    }
  }

  // atualizar objetivo (no sentido de concluído, encerrado, cancelado).
  const updateObjetivo = (item, status) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idplanoterapeutico: idplanoterapeutico,
      idobjetivo: item.idobjetivo,
      objetivo: item.objetivo,
      datainicio: item.datainicio,
      datatermino: moment(),
      idprofissional: item.idprofissional,
      tipoobjetivo: item.tipoobjetivo,
      statusobjetivo: status,
      escala: parseInt(item.escala),
      dimensao: parseInt(item.dimensao),
    }
    axios.post(htmlupdateobjetivo + item.id, obj).then(() => {
      // atualizando metas conforme a atualização do objetivo pai.
      if (status == 4) { // cancelando objetivo e metas.
        metas.filter(valor => valor.idobjetivo == item.idobjetivo && valor.idplanoterapeutico == item.idplanoterapeutico).map(item => {
          updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 4, item.idprofissional, 'OBJETIVO CANCELADO.', item.checagem);
        })
      }
      setTimeout(() => {
        loadObjetivos();
      }, 3000);
    });
  }
  // deletar objetivo.
  const deleteObjetivo = (item) => {
    axios.get(htmldeleteobjetivo + item.id).then(() => {
      // deletando metas associadas ao objetivo.
      metas.filter(valor => valor.idobjetivo == item.idobjetivo && valor.idplanoterapeutico == item.idplanoterapeutico && item.status < 2).map(item => {
        deleteMeta(item);
      })
      setTimeout(() => {
        loadObjetivos();
      }, 3000);
    });
  }
  // filtrar objetivos.
  var searchobjetivo = '';
  var timeout = null;
  const [filterobjetivo, setfilterobjetivo] = useState([]);
  const filterObjetivo = (input) => {
    clearTimeout(timeout);
    document.getElementById(input).focus();
    searchobjetivo = document.getElementById(input).value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchobjetivo === '') {
        setarrayopcoesobjetivos(opcoesobjetivos);
        document.getElementById(input).value = '';
        document.getElementById(input).focus();
      } else {
        setfilterobjetivo(document.getElementById(input).value.toUpperCase());
        setarrayopcoesobjetivos(opcoesobjetivos.filter(item => item.objetivo.toUpperCase().includes(searchobjetivo) === true));
        document.getElementById(input).value = searchobjetivo;
        document.getElementById(input).focus();
      }
    }, 500);
  }

  // METAS.
  // inserir meta.
  const [idmeta, setidmeta] = useState(0);
  const insertMeta = (item) => {
    if (metas.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.datatermino != null && valor.id == item.idmeta).length > 0) {
      toast(1, '#ec7063', 'META JÁ CADASTRADA.', 5000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idplanoterapeutico: idplanoterapeutico,
        idobjetivo: item.id_objetivo,
        meta: item.meta,
        datainicio: moment().startOf('day'),
        dataestimada: moment().startOf('day').add(15, 'days'),
        datatermino: null,
        idprofissional: 0,
        status: 0, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
        nota: 10,
        idespecialidade: item.idespecialidade,
        justificativa: null,
        datachecagem: moment().startOf('day').add(7, 'days'),
        checagem: 7,
        idmeta: item.id,
      }
      axios.post(htmlinsertmeta, obj).then(() => {
        loadMetas();
      });
    }
  }

  const restartMeta = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idplanoterapeutico: idplanoterapeutico,
      idobjetivo: parseInt(item.idobjetivo),
      meta: item.meta,
      datainicio: item.datainicio,
      dataestimada: item.dataestimada,
      datatermino: null,
      idprofissional: 0,
      status: 4, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
      nota: 10,
      idespecialidade: parseInt(item.idespecialidade),
      justificativa: document.getElementById("inputJustificativaRestart" + item.id).value.toUpperCase(),
      datachecagem: moment(item.datachecagem).startOf('day').add(parseInt(item.checagem), 'days'),
      checagem: item.checagem,
      idmeta: item.idmeta,
    }
    axios.post(htmlupdatemeta + item.id, obj).then(() => {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idplanoterapeutico: idplanoterapeutico,
        idobjetivo: item.idobjetivo,
        meta: item.meta,
        datainicio: moment().startOf('day'),
        dataestimada: moment().startOf('day').add(15, 'days'),
        datatermino: null,
        idprofissional: 0,
        status: 0, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
        nota: 10,
        idespecialidade: parseInt(item.idespecialidade),
        justificativa: null,
        datachecagem: moment().startOf('day').add(parseInt(item.checagem), 'days'),
        checagem: item.checagem,
        idmeta: item.idmeta,
      }
      axios.post(htmlinsertmeta, obj).then(() => {
        loadMetas();
        document.getElementById("divJustificativaRestart" + item.id).style.display = 'none';
      });
    });
  }

  const checkedMeta = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idplanoterapeutico: idplanoterapeutico,
      idobjetivo: item.idobjetivo,
      meta: item.meta,
      datainicio: item.datainicio,
      dataestimada: item.dataestimada,
      datatermino: null,
      idprofissional: 0,
      status: 1, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
      nota: 10,
      idespecialidade: parseInt(item.idespecialidade),
      justificativa: null,
      datachecagem: moment(item.datachecagem).startOf('day').add(parseInt(item.checagem), 'days'),
      checagem: item.checagem,
    }
    axios.post(htmlupdatemeta + item.id, obj).then(() => {
      loadMetas();
    });
  }

  // atualizar metas (redefinindo prazo ou alterando status para concluída, cancelada, etc.).
  const updateMeta = (item, prazo, nota, status, idprofissional, justificativa, checagem) => {
    // alert('NOTA: ' + nota + ' PRAZO: ' + prazo);
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idplanoterapeutico: idplanoterapeutico,
      idobjetivo: parseInt(item.idobjetivo),
      meta: item.meta,
      datainicio: item.datainicio,
      dataestimada: status != 1 && status != 0 ? item.dataestimada : moment(item.datainicio).startOf('day').add(parseInt(prazo), 'days'),
      datatermino: status < 2 ? null : status == 4 ? null : moment().startOf('day'),
      idprofissional: parseInt(idprofissional),
      status: status, // 0 = a validar. 1 = ativa. 2 = concluída. 3 = não alcançada. 4 = cancelada.
      nota: parseInt(nota),
      idespecialidade: parseInt(item.idespecialidade),
      justificativa: justificativa,
      datachecagem: null,
      checagem: checagem,
      idmeta: item.idmeta,
    }
    axios.post(htmlupdatemeta + item.id, obj).then(() => {
      loadMetas();
    });
  }
  // deletar meta.
  const deleteMeta = (item) => {
    axios.get(htmldeletemeta + item.id).then(() => {
      loadMetas();
    });
  }
  // filtrar metas.
  var searchmeta = '';
  var timeout = null;
  const [filtermeta, setfiltermeta] = useState([]);
  const filterMeta = () => {
    clearTimeout(timeout);
    document.getElementById("inputMeta").focus();
    searchmeta = document.getElementById("inputMeta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchmeta === '') {
        setarrayopcoesmetas(opcoesmetas);
        document.getElementById("inputMeta").value = '';
        document.getElementById("inputMeta").focus();
      } else {
        setfiltermeta(document.getElementById("inputMeta").value.toUpperCase());
        setarrayopcoesmetas(opcoesmetas.filter(item => item.meta.toUpperCase().includes(searchmeta) === true));
        document.getElementById("inputMeta").value = searchmeta;
        document.getElementById("inputMeta").focus();
      }
    }, 500);
  }

  // componente para selação de profissional responsável pelo cumprimento de uma meta.
  // filtrar objetivos.
  var searchprofissional = '';
  var timeout = null;
  const [filterprofissional, setfilterprofissional] = useState([]);
  const filterProfissional = () => {
    clearTimeout(timeout);
    document.getElementById("inputProfissional").focus();
    searchprofissional = document.getElementById("inputProfissional").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchprofissional === '') {
        // setarrayprofissionais(arrayprofissionais);
        document.getElementById("inputProfissional").value = '';
        document.getElementById("inputProfissional").focus();
      } else {
        setfilterprofissional(document.getElementById("inputProfissional").value.toUpperCase());
        // setarrayprofissionais(arrayprofissionais.filter(item => item.nome.toUpperCase().includes(searchprofissional) === true));
        document.getElementById("inputProfissional").value = searchprofissional;
        document.getElementById("inputProfissional").focus();
      }
    }, 500);
  }

  const [viewprofissionalselector, setviewprofissionalselector] = useState(0);
  function ViewProfissionalSelector() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewprofissionalselector(0); e.stopPropagation() }}
        style={{
          display: viewprofissionalselector == 0 ? 'none' : 'flex',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{'SELECIONAR PROFISSIONAL PARA A META'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setviewprofissionalselector(0)}>
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
            </div>
          </div>
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: window.innerWidth > 400 ? '55vw' : '90vw', alignSelf: 'center' }}>
                <label className="title2">
                  {'BUSCAR PROFISSIONAL'}
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="BUSCAR PROFISSIONAL..."
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
                  // onChange={() => filterProfissional()}
                  title={"BUSCAR PROFISSIONAL"}
                  type="text"
                  maxLength={200}
                  id="inputProfissional"
                ></input>
                <div
                  className="scroll"
                  id="LISTA DE PROFISSIONAIS"
                  style={{ height: '30vh', marginTop: 20 }}
                >
                  {arrayprofissionais.filter(item => item.tipoprofissional == selected_intervencao.idespecialidade).map((item) => (
                    <div
                      key={item.id}
                      id="item da lista"
                      className="blue-button"
                    // onClick={() => updateIntervencao(selected_intervencao, selected_intervencao.frequencia, selected_intervencao.local, 0)}
                    >
                      <div style={{ padding: 5 }}>{item.nome}</div>
                    </div>
                  ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // componentes (telas) para inserir ou atualizar objetivos, metas e propostas terapêuticas.
  // objetivos.
  const [viewobjetivo, setviewobjetivo] = useState(0); // 1 = objetivo primário; 2 = objetivo secundário.
  function ViewObjetivo() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewobjetivo(0); e.stopPropagation() }}
        style={{
          display: viewobjetivo == 0 ? 'none' : 'flex',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{viewobjetivo == 1 ? 'INSERIR OBJETIVO PRIMÁRIO' : 'INSERIR OBJETIVO SECUNDÁRIO'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setviewobjetivo(0)}>
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
            </div>
          </div>
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              <div id="divObjetivoPrimario" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: window.innerWidth > 400 ? '55vw' : '90vw', alignSelf: 'center' }}>
                <label className="title2">
                  {viewobjetivo == 1 ? 'BUSCAR OBJETIVO PRIMÁRIO:' : 'BUSCAR OBJETIVO SECUNDÁRIO'}
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="BUSCAR..."
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
                  onChange={() => filterObjetivo("inputObjetivo")}
                  title={viewobjetivo == 1 ? "BUSCAR OBJETIVO PRIMÁRIO." : "BUSCAR OBJETIVO SECUNDÁRIO."}
                  type="text"
                  maxLength={200}
                  id="inputObjetivo"
                ></input>
                <div
                  className="scroll"
                  id="LISTA DE OBJETIVOS"
                  style={{
                    height: window.innerWidth < 426 ? '55vh' : '30vh',
                    marginTop: 20,
                  }}
                >
                  {viewobjetivo == 1 ?
                    arrayopcoesobjetivos.filter(item => item.tipo == 1 && item.id_linhadecuidado == id_linhadecuidado).map((item) => (
                      <div
                        key={item.id}
                        id="item da lista"
                        className="blue-button"
                        style={{ padding: 5, width: '95%' }}
                        onClick={() => {
                          if (objetivos.filter(valor => valor.idplanoterapeutico == idplanoterapeutico && valor.objetivo == item.objetivo && valor.statusobjetivo < 2).length > 0) {
                            toast(1, '#ec7063', 'OBJETIVO JÁ CADASTRADO.', 2000);
                          } else {
                            insertObjetivo(item.id, item.objetivo, item.tipo, item.escala, item.dimensao);
                            setviewobjetivo(0);
                          }
                        }}
                      >
                        <div style={{ padding: 5 }}>{item.objetivo}</div>
                      </div>
                    ))
                    :
                    arrayopcoesobjetivos.filter(item => item.tipo == 2).map((item) => (
                      <div
                        key={item.id}
                        id="item da lista"
                        className="blue-button"
                        style={{ padding: 5, width: '95%' }}
                        onClick={() => {
                          if (objetivos.filter(valor => valor.objetivo == item.objetivo && valor.statusobjetivo < 2).length > 0) {
                            toast(1, '#ec7063', 'OBJETIVO JÁ CADASTRADO.', 2000);
                          } else {
                            insertObjetivo(item.id, item.objetivo, item.tipo, item.escala, item.dimensao);
                            setviewobjetivo(0);
                          }
                        }}
                      >
                        <div style={{ padding: 5 }}>{item.objetivo}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
  // metas.
  const [viewmeta, setviewmeta] = useState(0);
  function ViewMeta() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewmeta(0); e.stopPropagation() }}
        style={{
          display: viewmeta == 0 ? 'none' : 'flex',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{'INSERIR META'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setviewmeta(0)}>
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
            </div>
          </div>
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              <div id="divObjetivoPrimario" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: window.innerWidth > 400 ? '55vw' : '90vw', alignSelf: 'center' }}>
                <label className="title2">
                  {'BUSCAR META'}
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="BUSCAR..."
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
                  onChange={() => filterMeta()}
                  title={"BUSCAR META."}
                  type="text"
                  maxLength={200}
                  id="inputMeta"
                ></input>
                <div
                  className="scroll"
                  id="LISTA DE METAS"
                  style={{ height: '30vh', marginTop: 20 }}
                >
                  {arrayopcoesmetas.filter(item => item.id_objetivo == selectedobjetivo && item.idespecialidade == selectedcategoria).map((item) => (
                    <p
                      key={item.id}
                      id="item da lista"
                      className="row"
                      onClick={() => {
                        if (metas.filter(valor => valor.idplanoterapeutico == idplanoterapeutico && valor.meta == item.meta && valor.status < 2).length > 0) {
                          toast(1, '#ec7063', 'META JÁ CADASTRADA.', 2000);
                        } else {
                          insertMeta(item);
                          setviewmeta(0);
                        }
                      }}
                    >
                      <button
                        className="blue-button"
                        style={{
                          width: '100%',
                          margin: 2.5,
                          flexDirection: 'column',
                        }}
                      >
                        <div>{item.meta}</div>
                      </button>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ESCALA EDITÁVEL IVCF (ESCALA DE MORAES).
  const [data, setdata] = useState(moment().format('DD/MM/YYYY'))
  const [valor, setvalor] = useState();
  const [adf, setadf] = useState();
  const [adfestabelecido, setadfestabelecido] = useState();
  const [adfbasica, setadfbasica] = useState();
  const [adfinstrumental, setadfinstrumental] = useState();
  const [crf, setcrf] = useState();
  const [crfpctefragil, setcrfpctefragil] = useState();
  const [ddfecognicao, setddfecognicao] = useState();
  const [ddfehumor, setddfehumor] = useState();
  const [ddfemobilidade, setddfemobilidade] = useState();
  const [ddfecomunicacao, setddfecomunicacao] = useState();
  const [linhasdecuidados, setlinhasdecuidados] = useState();
  const [metasterapeuticas, setmetasterapeuticas] = useState(); // será uma array, um código para abertura de conjunto de metas?

  // selecionando um registro de escala IVCF (utilizado ao clicarmos no histórico de registros de IVCF).
  const selectIVCF = (item) => {
    setdata(item.data);
    setvalor(item.valor);
    setadf(item.adf);
    setadfestabelecido(item.adfestabelecido);
    setcrf(item.crf);
    setcrfpctefragil(item.crfpctefragil);
    setddfecognicao(item.ddfecognicao);
    setddfehumor(item.ddfehumor);
    setddfemobilidade(item.ddfemobilidade);
    setddfecomunicacao(item.ddfecomunicacao);
    //setlinhasdecuidados(item.linhasdecuidados);
    //setmetasterapeuticas(item.metasterapeuticas);
  }
  // salvando um registro de escala IVCF (escala de Moraes).
  const createIVCF = () => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      valor: valor,
      adf: adf,
      adfestabelecido: adfestabelecido,
      crf: crf,
      crfpctefragil: crfpctefragil,
      ddfecognicao: ddfecognicao,
      ddfehumor: ddfehumor,
      ddfemobilidade: ddfemobilidade,
      ddfecomunicacao: ddfecomunicacao,
      linhasdecuidados: linhasdecuidados,
      metasterapeuticas: metasterapeuticas,
    }
    axios.post(html + '/createivcf', obj).then(() => {
    });
  }
  // atualizando um registro de escala IVCF (provavelmente não será aplicável).
  const updateIVCF = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      valor: valor,
      adf: adf,
      adfestabelecido: adfestabelecido,
      crf: crf,
      crfpctefragil: crfpctefragil,
      ddfecognicao: ddfecognicao,
      ddfehumor: ddfehumor,
      ddfemobilidade: ddfemobilidade,
      ddfecomunicacao: ddfecomunicacao,
      linhasdecuidados: linhasdecuidados,
      metasterapeuticas: metasterapeuticas,
    }
    axios.post(html + '/updateivcf/' + item.id, obj).then(() => {
    });
  }
  // exclusão de um registro de escala IVCF.
  const deleteIVCF = (item) => {
    axios.get(html + "/deleteivcf/'" + item.id + "'").then(() => {
    });
  }
  // componentes da escala editável de IVCF (escala de Moraes).
  function Regua() {
    return (
      <div id="ESCALA" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div id="setas fragilidade x vitalidade"
          style={{
            padding: 5, margin: 5, backgroundImage: 'linear-gradient(to right, #ec7063, #f5b041, #52be80)',
            marginTop: window.innerWidth > 400 ? 5 : 20,
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 5,
            height: window.innerWidth > 400 ? 75 : 30,
            width: window.innerWidth > 400 ? '70vw' : '90vw',
            alignSelf: 'center',
            position: 'relative',
          }}
        >
          <div id="fragilidade"
            style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: window.innerWidth > 400 ? 'flex-start' : 'center',
              height: window.innerWidth > 400 ? 75 : 30,
              marginTop: window.innerWidth > 400 ? 0 : -5,
            }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'FRAGILIDADE'}</div>
          </div>
          <div id="vitalidade"
            style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: window.innerWidth > 400 ? 'flex-start' : 'center',
              height: window.innerWidth > 400 ? 75 : 30,
              marginTop: window.innerWidth > 400 ? 0 : -5,
            }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'VITALIDADE'}</div>
          </div>
          <div
            style={{
              position: 'absolute', top: -15, bottom: 0, left: 0, right: 0, borderRadius: 50,
              display: window.innerWidth < 400 ? 'flex' : 'none',
              flexDirection: 'row', justifyContent: 'center',
              width: '100%',
              alignSelf: 'center', borderRadius: 50,
            }}>
            <div className="red-button" style={{ width: 50, height: 50 }}>
              {ivcf}
            </div>
          </div>
        </div>
        <div id="regua"
          style={{
            width: '100%', padding: 5, margin: 0, marginTop: -40, position: 'relative',
            display: window.innerWidth < 400 ? 'none' : 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
          }}
        >
          <button className="blue-button">
            1
          </button>
          <button className="blue-button">
            2
          </button>
          <button className="blue-button">
            3
          </button>
          <button className="blue-button">
            4
          </button>
          <button className="blue-button">
            5
          </button>
          <button className="blue-button">
            6
          </button>
          <button className="blue-button">
            7
          </button>
          <button className="blue-button">
            8
          </button>
          <button className="blue-button">
            9
          </button>
          <button className="blue-button">
            10
          </button>
        </div>
      </div>
    )
  }
  function AvaliacaoDeDeclinioFuncional() {
    return (
      <div id="AVALIAÇÃO DE DECLÍNIO FUNCIONAL - ADF" style={{ marginTop: window.innerWidth < 400 ? 20 : 0 }}>
        <div className="title2" style={{ margin: 0 }}>AVALIAÇÃO DE DECLÍNIO FUNCIONAL</div>
        <div id="ADF - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', padding: 5, marginTop: 0, alignSelf: 'center', alignItems: 'center',
          }}>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: adf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setadf(1)}>
            AUSENTE
          </button>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: adf == 2 ? 1 : 0.3 }} className="yellow-button" onClick={() => setadf(2)}>
            IMINENTE
          </button>
          <button
            style={{
              width:
                adf != 3 && window.innerWidth > 400 ? '12vw' : adf == 3 && window.innerWidth > 400 ? '26vw' : '90vw',
              height: window.innerWidth > 400 ? 90 : window.innerWidth < 400 && adf == 3 ? 90 : '',
              opacity: adf == 3 ? 1 : 0.3
            }}
            className="red-button" onClick={() => setadf(3)}>
            <div>ESTABELECIDO</div>
            <div id="ADF - opções - estabelecido" style={{ display: adf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfbasica == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                  fontSize: 12, padding: 5, opacity: adfbasica == 1 ? 1 : 0.5
                }}
                onClick={adfbasica == 1 ? () => setadfbasica(0) : () => setadfbasica(1)}>
                AVD BÁSICA
              </button>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfinstrumental == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                  fontSize: 12, padding: 5, opacity: adfinstrumental == 1 ? 1 : 0.5,
                }}
                onClick={adfinstrumental == 1 ? () => setadfinstrumental(0) : () => setadfinstrumental(1)}>
                AVD INSTRUMENTAL
              </button>
            </div>
          </button>
        </div>
      </div>
    )
  }
  function ClassificacaoDeRiscoFuncional() {
    return (
      <div id="CLASSIFICAÇÃO DE RISCO FUNCIONAL - CRF">
        <div className="title2" style={{ margin: 0 }}>CLASSIFICAÇÃO DE RISCO FUNCIONAL</div>
        <div id="CRF - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', padding: 5, marginTop: 0, alignSelf: 'center', alignItems: 'center',
          }}>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: crf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setcrf(1)}>
            PACIENTE ROBUSTO
          </button>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: crf == 2 ? 1 : 0.3, maxHeight: 200 }} className="yellow-button" onClick={() => setcrf(2)}>
            RISCO DE FRAGILIZAÇÃO
          </button>
          <button
            style={{
              width:
                crf != 3 && window.innerWidth > 400 ? '12vw' : crf == 3 && window.innerWidth > 400 ? '26vw' : '90vw',
              height: window.innerWidth > 400 ? 90 : window.innerWidth < 400 && crf == 3 ? 90 : '',
            }} className="red-button" onClick={() => setcrf(3)}>
            PACIENTE FRÁGIL
            <div id="CRF - opções - paciente frágil" style={{ display: crf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button
                style={{
                  fontSize: 12, padding: 5, opacity: crfpctefragil == 1 ? 1 : 0.5,
                  borderColor: crfpctefragil == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                }}
                className="softred-button" onClick={() => setcrfpctefragil(1)}>
                BAIXA COMPLEXIDADE
              </button>
              <button
                style={{
                  fontSize: 12, padding: 5, opacity: crfpctefragil == 2 ? 1 : 0.5,
                  borderColor: crfpctefragil == 2 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                }}
                className="softred-button" onClick={() => setcrfpctefragil(2)}>
                ALTA COMPLEXIDADE
              </button>
            </div>
          </button>
        </div>
      </div>
    )
  }
  function DeterminantesDoDeclinioFuncionalEstabelecido() {
    return (
      <div id="DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO - DDFE"
        style={{
          display: adf == 3 ? 'flex' : 'none', flexDirection: 'column',
          justifyContent: 'center', alignSelf: 'center', width: '100%'
        }}>
        <div className="title2center" style={{ margin: 0, marginBottom: 10 }}>DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO</div>
        <div id="DDFE - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'space-evenly', padding: 5, margin: -10, width: '100%', alignSelf: 'center',
          }}>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COGNIÇÃO</div>
            <div id="DFE - opções - cognição" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecognicao == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(1)}>
                L
              </button>
              <button className={ddfecognicao == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(2)}>
                M
              </button>
              <button className={ddfecognicao == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>HUMOR E COMPORTAMENTO</div>
            <div id="DFE - opções - humor e comportamento" style={{
              display: 'flex', flexDirection: 'row',
              justifyContent: 'space-evenly', width: '100%', alignSelf: 'center', marginBottom: 10
            }}>
              <button className={ddfehumor == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(1)}>
                L
              </button>
              <button className={ddfehumor == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(2)}>
                M
              </button>
              <button className={ddfehumor == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>MOBILIDADE</div>
            <div id="DFE - opções - mobilidade" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfemobilidade == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(1)}>
                L
              </button>
              <button className={ddfemobilidade == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(2)}>
                M
              </button>
              <button className={ddfemobilidade == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COMUNICAÇÃO</div>
            <div id="DFE - opções - comunicação" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecomunicacao == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(1)}>
                L
              </button>
              <button className={ddfecomunicacao == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(2)}>
                M
              </button>
              <button className={ddfecomunicacao == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(3)}>
                G
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function LinhaDeCuidados() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title4" style={{ margin: 15 }}>LINHAS DE CUIDADO</div>
        <div id="LINHAS DE CUIDADO"
          className="scroll"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignSelf: 'center',
            width: window.innerWidth < 426 ? 'calc(100vw - 20px)' : '100%',
            overflowX: 'scroll', overflowY: 'hidden'
          }}>
          {opcoeslinhasdecuidado.map(item => (
            <div
              className={item.linhadecuidado == linhadecuidado ? 'red-button' : 'blue-button'}
              style={{ width: 200, minWidth: 200 }}
              onClick={() => {
                if (planoterapeutico.filter(valor => valor.idatendimento == idatendimento && valor.status == 1).length > 0) {
                  toast(1, '#e74c3c', 'NÃO É POSSÍVEL ALTERAR A LINHA DE CUIDADO COM PLANO TERAPÊUTICO ABERTO.', 3000);
                } else {
                  setlinhadecuidado(item.linhadecuidado);
                  updateLinhaDeCuidado(item);
                }
              }}
            >
              {item.linhadecuidado}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const [tiposescalas, settiposescalas] = useState([]);
  const [escalas, setescalas] = useState([]);
  useEffect(() => {
    // linhas de cuidado.
    loadOpcoesLinhasDeCuidado();
    loadLinhasDeCuidado();
    // planos terapêuticos.
    loadPlanosTerapeuticos();
    // objetivos e metas.
    loadObjetivos();
    loadMetas();
    loadOpcoesObjetivos();
    loadOpcoesMetas();
    loadOpcoesMetodos();
    loadOpcoesMetodosPt();
    // escalas.
    loadOpcoesEscalas();
    loadEscalas();
    // alert(idlinhadecuidado);
  }, []);

  // recuperar posição da scroll, após renderização.
  const [scrollobjetivosposition, setscrollobjetivosposition] = useState(0);
  const [scrollmetasposition, setscrollmetaposition] = useState(0);

  const getScrollObjetivoPosition = () => {
    setscrollobjetivosposition(document.getElementById("scrollobjetivosecundario").scrollTop());
  }
  const getScrollObjetivoMeta = () => {
    setscrollmetaposition(document.getElementById("scrollmeta").scrollTop());
  }


  // GERENCIADOR (ALERTAS) PARA O PLANO TERAPÊUTICO.
  const selecaoAlerta = (item) => {
    console.log(item.idespecialidade);
    // identificando o objetivo secundário da meta selecionada no alerta.
    var objetivo = objetivos.filter(valor => valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1);
    setselectedobjetivosecundario(objetivo.map(item => item.id));
    setselectedobjetivo(item.idobjetivo);

    // identificando a categoria profissional da meta selecionada no alerta.
    filtraScrollProfissionais(item.idobjetivo);
    setTimeout(() => {
      setselectedcategoria(item.idespecialidade);
      document.getElementById('nova_meta').style.display = 'flex';
      setTimeout(() => {
        var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
        for (var i = 0; i < botoes.length; i++) {
          botoes.item(i).className = "blue-button-objetivos animationobjetivos";
        }
        document.getElementById("objetivo" + objetivo.map(item => item.id)).className = "red-button-objetivos animationobjetivos";
        var botoes = document.getElementById("scroll das categorias profissionais.").getElementsByClassName("red-button");
        for (var i = 0; i < botoes.length; i++) {
          botoes.item(i).className = "blue-button";
        }
        document.getElementById("categoriaprofissional" + item.idespecialidade).className = "red-button";
      }, 700);
    }, 1000);
  }

  function AlertasPlanoTerapeutico() {

    const checametas = (item) => {
      if (
        metas.filter(valor => valor.idplanoterapeutico == idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length > 0 &&
        metas.filter(valor => valor.idplanoterapeutico == idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length == 0) {
        return (
          <div id="botão objetivo finalizável"
            className='green-button'
            style={{
              alignSelf: 'center',
              padding: 5,
              margin: 5,
              width: window.innerWidth < 426 ? '60vw' : '',
              flexDirection: window.innerWidth < 426 ? 'column' : 'row',
            }}>
            <div style={{ display: 'flex', padding: 10 }}>{item.objetivo}</div>
            <div id="botões de carinhas"
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button id='objetivo não atingido'
                title='OBJETIVO SECUNDÁRIO NÃO ATINGIDO.'
                className="red-button"
                onClick={(e) => {
                  setselectedobjetivosecundario(item);
                  setstatusobjetivo(3);
                  setviewjustificaobjetivosecundario(1);
                  e.stopPropagation();
                }}
              >
                <img
                  alt=""
                  src={emojisad}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id='objetivo parcialmente atingido'
                title='OBJETIVO SECUNDÁRIO PARCIALMENTE ATINGIDO.'
                className="yellow-button"
                onClick={(e) => {
                  setselectedobjetivosecundario(item);
                  setstatusobjetivo(5); // status 5 = parcialmente atingido.
                  setviewjustificaobjetivosecundario(1);
                  e.stopPropagation();
                }}
              >
                <img
                  alt=""
                  src={emojineutral}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id='objetivo atingido'
                title='OBJETIVO SECUNDÁRIO PLENAMENTE ATINGIDO.'
                className="green-button"
                onClick={(e) => {
                  updateObjetivo(item, 2); e.stopPropagation();
                }}
              >
                <img
                  alt=""
                  src={emojihappy}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        )
      } else {
        return null;
      }
    }


    if (
      linhasdecuidado.filter(item => item.datatermino == null).length < 1 ||
      lastplanoterapeutico.length < 1 ||
      objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 1).length < 1 ||
      objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 2).length < 1 ||
      metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.status == 1 || item.status == 2)).length < 1 ||
      metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ||
      metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0) {

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 10,
            alignContent: 'center',
            alignSelf: 'center',
            position: 'absolute', top: 10,
            right: window.innerWidth < 426 && hide == 1 ? '' : 10,
            zIndex: 20,
          }}
        >
          <div // ALERTAS VERMELHOS...
            id="alertbutton1"
            className='red-button'
            style={{
              alignSelf: 'flex-end',
              borderRadius: 50,
              width: 50, minWidth: 50, height: 50, minHeight: 50,
              zIndex: 20,
            }}
            onClick={hide == 1 ? () => sethide(0) : () => sethide(1)}
          >
            <img
              alt=""
              src={bell}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div
            id="alertcontent1"
            className="red-button scroll"
            style={{
              display: hide == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignSelf: 'flex-end',
              borderStyle: 'solid',
              borderWidth: 5,
              backgroundColor: '#ec7063', borderColor: '#ec7063',
              margin: 0, marginTop: -25,
              padding: 10, paddingTop: 30,
              minWidth: window.innerWidth < 426 && hide == 1 ? '80vw' : '10vw',
              minHeight: '10vh',
              maxHeight: window.innerWidth < 426 ? '60vh' : '65vh'
            }}>
            <div style={{ margin: 5, display: linhasdecuidado.filter(item => item.datatermino == null).length < 1 ? 'flex' : 'none' }}>
              {'DEFINIR LINHA DE CUIDADO.'}
            </div>
            <div style={{ margin: 5, display: lastplanoterapeutico.length < 1 ? 'flex' : 'none' }}>
              {'INICIAR PLANO TERAPÊUTICO.'}
            </div>
            <div style={{ margin: 5, display: objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 1).length < 1 ? 'flex' : 'none' }}>
              {'DEFINIR OBJETIVOS PRIMÁRIOS.'}
            </div>
            <div style={{ margin: 5, display: objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 2).length < 1 ? 'flex' : 'none' }}>
              {'DEFINIR OBJETIVOS SECUNDÁRIOS.'}
            </div>
            <div style={{ margin: 5, display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.status == 1 || item.status == 2)).length < 1 ? 'flex' : 'none' }}>
              {'DEFINIR METAS.'}
            </div>

            <div id="## METAS INATIVAS ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ? 'flex' : 'none'
              }}>
                {'METAS INATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length}
              </div>
              <div
                style={{
                  display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).map(item => (
                  <div
                    onClick={() => selecaoAlerta(item)}
                    style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                  >
                    {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                  </div>
                ))}
              </div>
            </div>
            <div id="## METAS ATIVAS ##" style={{ display: 'none', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length > 0 ? 'flex' : 'none'
              }}>
                {'METAS ATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length}
              </div>
              <div
                style={{
                  display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).map(item => (
                  <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                    onClick={() => selecaoAlerta(item)}
                  >
                    {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                  </div>
                ))}
              </div>
            </div>
            <div id="## METAS A VENCER ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length > 0 ? 'flex' : 'none' }}>
                {'METAS A VENCER: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length}
              </div>
              <div
                style={{
                  display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).map(item => (
                  <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                    onClick={() => selecaoAlerta(item)}
                  >
                    {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                  </div>
                ))}
              </div>
            </div>
            <div id="## METAS VENCIDAS ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0 ? 'flex' : 'none' }}>
                {'METAS VENCIDAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length}
              </div>
              <div
                style={{
                  display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).map(item => (
                  <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                    onClick={() => selecaoAlerta(item)}
                  >
                    {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div // ALERTAS VERDES.
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 10,
            alignContent: 'center',
            alignSelf: 'flex-end',
            position: 'absolute', top: 10,
            right: window.innerWidth < 426 ? '' : 10,
            zIndex: 20,
          }}
        >
          <div
            id="alertbutton2"
            className='green-button'  // ALERTAS VERDES, TUDO NA PAZ...
            style={{
              alignSelf: 'flex-end',
              borderRadius: 50,
              width: 50, minWidth: 50, height: 50, minHeight: 50,
              zIndex: 20,
            }}
            onClick={hide == 1 ? () => sethide(0) : () => sethide(1)}
          >
            <img
              alt=""
              src={bell}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div
            id="alertcontent2"
            className="green-button scroll"
            style={{
              display: hide == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignSelf: 'flex-end',
              borderStyle: 'solid',
              borderWidth: 5,
              backgroundColor: '#52be80', borderColor: '#52be80',
              margin: 0, marginTop: -25,
              padding: 10, paddingTop: 30,
              minHeight: '10vh',
              maxHeight: window.innerWidth < 426 ? '60vh' : '65vh',
              minWidth: window.innerWidth < 426 && hide == 1 ? '80vw' : '10vw',
            }}>
            {'SEM ALERTAS.'}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                margin: 5,
              }}>
                {'OBJETIVOS SECUNDÁRIOS FINALIZÁVEIS:'}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  minHeight: '20vh',
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.tipoobjetivo == 2 && item.statusobjetivo == 1).map(item => checametas(item))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                margin: 5,
              }}>
                {'METAS ATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).length}
              </div>
              <div
                style={{
                  display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).length > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                  width: window.innerWidth < 426 ? '75vw' : '30vw',
                  borderRadius: 5,
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  alignSelf: 'center',
                }}>
                {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).map(item => (
                  <div className="green-button"
                    style={{
                      borderRadius: 5, padding: 5, margin: 2.5,
                      width: window.innerWidth < 426 ? '65vw' : '',
                      alignSelf: 'center',
                    }}
                    onClick={() => selecaoAlerta(item)}
                  >
                    {listcategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - '
                      + opcoesobjetivos.filter(valor => valor.id == item.idobjetivo).map(valor => valor.objetivo) + ' - '
                      + item.meta}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // LINHAS DE CUIDADO.
  // opções de linhas de cuidado.
  const [arraylinhasdecuidado, setarraylinhasdecuidado] = useState([]);
  const loadOpcoesLinhasDeCuidado = () => {
    axios.get(htmlopcoeslinhasdecuidado).then((response) => {
      var x = [0, 1];
      x = response.data;
      setarraylinhasdecuidado(x.rows);
    });
  }

  const [idlinhadecuidado, setidlinhadecuidado] = useState(0); // id absoluto do registro (chave primária).
  const [id_linhadecuidado, setid_linhadecuidado] = useState(0); // designa o tipo de linha de cuidado.
  const [var_linhadecuidado, setvar_linhadecuidado] = useState('');
  const [datainicio_linhadecuidado, setdatainicio_linhadecuidado] = useState(0);
  const loadLinhasDeCuidado = () => {
    // alert('DISPAROU CARREGAMENTO LINHA DE CUIDADO')
    axios.get(htmllinhasdecuidado + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      var z = [0, 1];
      x = response.data;
      y = x.rows;
      if (y.length > 0) {
        z = y.filter(item => item.datatermino == null);
        // resgatando último resgistro de linha de cuidado ativo para o atendimento.
        setlinhasdecuidado(z);
        setidlinhadecuidado(z.map(item => item.id).pop());
        setid_linhadecuidado(parseInt(z.map(item => item.id_linhadecuidado).pop()));
        setvar_linhadecuidado(z.map(item => item.var_linhadecuidado).pop());
        setlinhadecuidado(z.map(item => item.var_linhadecuidado).pop());
        setlinhadecuidadoatual(z.map(item => item.var_linhadecuidado).pop());
        setdatainicio_linhadecuidado(z.map(item => item.datainicio).pop());
        // alert(id_linhadecuidado);
      } else {
        setlinhadecuidadoatual('DEFINIR LINHA DE CUIDADO')
      }
    });
  }

  // inserir linha de cuidado.
  const insertLinhaDeCuidado = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      id_linhadecuidado: item.id,
      var_linhadecuidado: item.linhadecuidado,
      datainicio: moment(),
      datatermino: null,
      idprofissional: 0,
    }
    axios.post(htmlinsertlinhadecuidado, obj).then(() => {
      toast(1, '#52be80', 'DEFINIDA LINHA DE CUIDADO: ' + item.linhadecuidado.toString().toUpperCase(), 5000);
      loadLinhasDeCuidado();
    });
  }
  // atualizar linha de cuidado (finaliza a linha de cuidado atual e cria nova linha de cuidado conforme a seleção do usuário.).
  const updateLinhaDeCuidado = (item) => {
    if (id_linhadecuidado != 0) {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        id_linhadecuidado: id_linhadecuidado,
        var_linhadecuidado: var_linhadecuidado,
        datainicio: datainicio_linhadecuidado,
        datatermino: moment(),
        idprofissional: 0,
      }
      // alert(JSON.stringify(obj));
      axios.post(htmlupdatelinhadecuidado + idlinhadecuidado, obj).then(() => {
        insertLinhaDeCuidado(item);
        // setid_linhadecuidado(item.id);
        // setlinhadecuidado(item.linhadecuidado);
        setTimeout(() => {
          loadLinhasDeCuidado();
        }, 1000);
      });
    } else {
      insertLinhaDeCuidado(item);
    }
  }

  // PLANOS TERAPÊUTICOS.
  // selecionando um plano terapêutico da lista de planos terapêuticos.
  const selectPlanoTerapeutico = (item) => {
    console.log('PLANO TERAPÊUTICO: ' + JSON.stringify(item));
    setidplanoterapeutico(item.id);
    // alert(idplanoterapeutico);
    setlinhadecuidado(opcoeslinhasdecuidado.filter(valor => valor.id == item.linhadecuidados).map(item => item.linhadecuidado));
    setdatainicioplanoterapeutico(moment(item.datainicio).format('DD/MM/YY'));
    setdataterminoplanoterapeutico(moment(item.datatermino).format('DD/MM/YY'));
    setstatusplanoterapeutico(item.status);
    loadObjetivos();
    loadMetas();
  }

  // lista de planos terapêuticos relativos ao paciente em atendimento (histórico).
  function ListaDePlanosTerapeuticos() {
    return (
      <div className="scroll"
        style={{
          display: 'flex',
          alignSelf: 'center',
          flexDirection: 'row',
          width: '100%',
          // width: window.innerWidth > 1024 ? '60vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          // minWidth: window.innerWidth > 1024 ? '45vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          margin: 0,
          padding: 0,
          scrollBehavior: 'smooth',
          alignItems: 'center',
          overflowX: 'scroll',
          overflowY: 'hidden',
          borderRadius: 5,
          backgroundColor: 'transparent', borderColor: 'transparent',
        }}
      >
        {planoterapeutico.sort((a, b) => moment(a.datainicio) < moment(b.datainicio) ? 1 : -1).map(item => (
          <div
            className={item.id == idplanoterapeutico ? "red-button" : item.id != idplanoterapeutico && item.datatermino == null ? "green-button" : "purple-button"}
            style={{
              opacity: item.datatermino == null ? 1 : 1,
              color: '#ffffff',
              fontWeight: 'bold',
              width: 100, height: 75, minWidth: 100, maxWidth: 100, maxHeight: 75, marginBottom: 10,
            }}
            onClick={() => { selectPlanoTerapeutico(item); setselectedobjetivo(0) }}>
            {moment(item.datainicio).format('DD/MM/YY')}
          </div>
        ))
        }
      </div>
    )
  }
  // componentes para exibição do plano terapêutico atual e histórico de planos terapêuticos.
  function PlanoTerapeutico() {
    return (
      <div id="PLANO TERAPÊUTICO"
        className="card"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          marginTop: 20, opacity: 1,
          padding: 0, paddingBottom: 10,
          width: '100%',
        }}>
        <div
          className="row"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'space-between',
            margin: 0, padding: 5, alignSelf: 'center', width: '100%',
            backgroundColor: 'grey',
            borderTopLeftRadius: 5, borderTopRightRadius: 5,
            borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            opacity: 1,
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth > 400 ? 'row' : 'column', justifyContent: 'center', width: '100%' }}>
              <div className="title5" style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start' }}>
                {'PLANO TERAPÊUTICO'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button
                  title="CRIAR PLANO TERAPÊUTICO"
                  className="green-button"
                  style={{ display: planoterapeutico.filter(item => item.datatermino == null).length > 0 || linhadecuidadoatual == 'DEFINIR LINHA DE CUIDADO' ? 'none' : 'flex' }}
                  onClick={() => { insertPlanoTerapeutico(); setselectedobjetivo(0); setselectedobjetivo(0) }}
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
                </button>
                <button
                  title="INÍCIO"
                  className="blue-button"
                  style={{ display: dataterminoplanoterapeutico == null && lastplanoterapeutico.length > 0 ? 'flex' : 'none', width: window.innerWidth > 400 ? '10vw' : 100 }}>
                  {datainicioplanoterapeutico}
                </button>
                <button
                  title="STATUS"
                  className="green-button"
                  style={{
                    display: planoterapeutico.length > 0 && idplanoterapeutico > 0 ? 'flex' : 'none',
                    width: window.innerWidth > 400 ? '10vw' : 100,
                    backgroundColor: statusplanoterapeutico == 1 ? '#f39c12' : statusplanoterapeutico == 2 ? '#52be80' : '#ec7063'
                  }}>
                  {statusplanoterapeutico == 1 ? 'ATIVO' :
                    statusplanoterapeutico == 3 ? 'CANCELADO' :
                      'CONCLUÍDO'
                  }
                </button>
                <button
                  onClick={() => {
                    setselectedobjetivo(0);
                    if (metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status < 2).length > 0) {
                      toast(1, '#e74c3c', 'NÃO É POSSÍVEL FINALIZAR UM PLANO TERAPÊUTICO COM METAS ATIVAS.', 3000);
                    } else if (objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo < 2).length > 0) {
                      toast(1, '#e74c3c', 'NÃO É POSSÍVEL FINALIZAR UM PLANO TERAPÊUTICO COM OBJETIVOS ATIVOS.', 3000);
                    } else {
                      setviewmodalplanoterapeutico(1)
                    }
                  }
                  }
                  title="CONCLUIR PLANO TERAPÊUTICO"
                  style={{
                    display:
                      statusplanoterapeutico != 1
                        ||
                        objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico).length == 0
                        ||
                        objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo < 2).length > 0
                        ? 'none' : 'flex'
                  }}
                  className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}>
                  ✔
                </button>
                <button
                  // PENDÊNCIA
                  onClick={() => { setselectedobjetivo(0); setviewmodalplanoterapeutico(2); setselectedobjetivo(0); }}
                  title="CANCELAR PLANO TERAPÊUTICO"
                  style={{ display: statusplanoterapeutico == 1 ? 'flex' : 'none' }}
                  className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}>
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
                  onClick={() => { setselectedobjetivo(0); loadOpcoesMetas(); setviewgerirplano(1) }}
                  title="GERENCIAR OPÇÕES DE METAS E MÉTODOS DE AVALIAÇÃO."
                  className="blue-button"
                  style={{ display: boss_planoterapeutico_usuario == 1 && window.innerWidth > 425 ? 'flex' : 'none' }}
                >
                  <img
                    alt=""
                    src={settingsimg}
                    style={{
                      display: 'flex',
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </button>
              </div>
            </div>
            <div className="title2" style={{ width: '100%', justifyContent: 'flex-start', color: '#ffffff', display: planoterapeutico.filter(item => item.datatermino == null).length < 1 ? 'flex' : 'none' }}>
              {'SEM REGISTROS DE PLANO TERAPÊUTICO ATIVO PARA ESTE ATENDIMENTO.'}
            </div>
            <ListaDePlanosTerapeuticos></ListaDePlanosTerapeuticos>
          </div>
        </div>
        <div className="title4" style={{ margin: 0, marginTop: 5 }}>OBJETIVOS PRIMÁRIOS</div>
        <div style={{ display: 'flex', width: '100%', padding: 10, paddingBottom: 0 }}>
          <ObjetivosPrimarios></ObjetivosPrimarios>
        </div>
      </div>
    )
  };

  // SUBCOMPONENTES DO PLANO TERAPÊUTICO:
  // scroll para rápida visualização dos componentes do plano terapêutico.
  function SpecialScroll() {
    return (
      <div
        id="specialscroll"
        className="specialscroll"
        //onMouseOver={() => document.getElementById("specialscroll").style.opacity = 1}
        //onMouseOut={() => document.getElementById("specialscroll").style.opacity = 0.2}
        style={{
          width: '3w', height: 300,
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center', alignItems: 'center',
        }}>
        <div
          className="corprincipal"
          style={{
            width: 10, height: '50%', margin: 0, padding: 0,
            borderRadius: 50, position: 'relative', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between'
          }}>
          <buttom className="corprincipal" title="METAS"
            onClick={() => {
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 0);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="INTERVENÇÕES"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="MÉTRICAS"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 2 * position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="EVOLUÇÕES"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 3 * position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
        </div>
      </div>
    )
  }

  // MENU DE CATEGORIAS PROFISSIONAIS.
  // 8 = médico, 4 = enfermeiro, 5 = fisioterapeuta, 6 = fono, 11 = to, 10 = psicólogo, 1 = assistente social,
  const [categoria, setcategoria] = useState(1);
  // menu que exibe os tipos de profissionais participantes do plano terapêutico.
  const MenuCategoria = useCallback(() => {
    return (
      <div id="lista de profissionais" className="scroll"
        style={{
          display: 'flex',
          alignSelf: 'center',
          // backgroundColor: 'transparent', borderColor: 'transparent',
          flexDirection: window.innerWidth > 1024 ? 'column' : 'row',
          height: window.innerWidth > 1024 ? '65vh' : 80,
          minHeight: 80,
          width: window.innerWidth > 1024 ? '15vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          minWidth: window.innerWidth > 1024 ? '15vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          margin: 0,
          scrollBehavior: 'smooth',
          marginTop: window.innerWidth > 1024 ? 0 : 10,
          marginBottom: window.innerWidth > 1024 ? 0 : 10,
          marginRight: window.innerWidth > 1024 ? 0 : 0,
          paddingRight: window.innerWidth > 1024 ? 10 : 5,
          alignItems: 'center',
          overflowX: window.innerWidth > 1024 ? 'hidden' : 'scroll',
          overflowY: window.innerWidth > 1024 ? 'scroll' : 'hidden',
          borderRadius: 5,
        }}>

        <button className={categoria == 2 ? "red-button" : "blue-button"}
          id="btnenfermeiro"
          onClick={() => {
            setcategoria(2);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnenfermeiro").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          ENFERMEIRO
        </button>

        <button className={categoria == 3 ? "red-button" : "blue-button"}
          id="btnfisioterapia"
          onClick={() => {
            setcategoria(3);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnfisioterapia").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(2 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          FISIOTERAPIA
        </button>

        <button className={categoria == 4 ? "red-button" : "blue-button"}
          id="btnfonoaudiologo"
          onClick={() => {
            setcategoria(4);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnfonoaudiologo").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(3 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          FONOAUDIÓLOGO
        </button>

        <button className={categoria == 5 ? "red-button" : "blue-button"}
          id="btnterapeutaocupacional"
          onClick={() => {
            setcategoria(5);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnterapeutaocupacional").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(4 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          TERAPEUTA OCUPACIONAL
        </button>

        <button className={categoria == 6 ? "red-button" : "blue-button"}
          id="btnpsicologo"
          onClick={() => {
            setcategoria(6);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnpsicologo").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(5 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          PSICÓLOGO
        </button>

        <button className={categoria == 7 ? "red-button" : "blue-button"}
          id="btnassistentesocial"
          onClick={() => {
            setcategoria(7);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnassistentesocial").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(6 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          ASSISTENTE SOCIAL
        </button>

      </div>
    )
  }, [categoria]);

  // componente para inputar justificativas para cancelamento ou não efetivação do objetivo.
  const [statusobjetivo, setstatusobjetivo] = useState(0);
  function JustificaObjetivoPrimario() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewjustificaobjetivoprimario(0); e.stopPropagation() }}
        style={{
          display: viewjustificaobjetivoprimario == 0 ? 'none' : 'flex',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div
          className="menucontainer" style={{ width: '60vw', padding: 20 }}
          onClick={(e) => { e.stopPropagation() }}
        >
          <div className="title2">{'JUSTIFICATIVA'}</div>
          <textarea id={"inputJustificativaObjetivo"}
            className="textarea"
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO.')}
            title="JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO."
            style={{
              width: '100%',
              height: 100,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <button
            className="green-button"
            onClick={(e) => {
              if (document.getElementById("inputJustificativaObjetivo").value != '') {
                var obj = {
                  idpct: idpaciente,
                  idatendimento: idatendimento,
                  idplanoterapeutico: idplanoterapeutico,
                  idobjetivo: selectedobjetivoprimario.idobjetivo,
                  objetivo: selectedobjetivoprimario.objetivo,
                  datainicio: selectedobjetivoprimario.datainicio,
                  datatermino: moment(),
                  idprofissional: selectedobjetivoprimario.idprofissional,
                  tipoobjetivo: selectedobjetivoprimario.tipoobjetivo,
                  statusobjetivo: statusobjetivo,
                  escala: 0,
                  dimensao: 0,
                  justificativa: document.getElementById("inputJustificativaObjetivo").value.toUpperCase(),
                }
                axios.post(htmlupdateobjetivo + selectedobjetivoprimario.id, obj).then(() => {
                  setviewjustificaobjetivoprimario(0);
                  loadObjetivos();
                });

              }
              e.stopPropagation()
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
    )
  }
  const [viewjustificaobjetivosecundario, setviewjustificaobjetivosecundario] = useState(0);
  function JustificaObjetivoSecundario() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewjustificaobjetivosecundario(0); e.stopPropagation() }}
        style={{
          display: viewjustificaobjetivosecundario == 0 ? 'none' : 'flex',
          zIndex: 90, flexDirection: 'column', // buceta
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div
          className="menucontainer" style={{ width: '60vw', padding: 20 }}
          onClick={(e) => { e.stopPropagation() }}
        >
          <div className="title2">{'JUSTIFICATIVA'}</div>
          <textarea id={"inputJustificativaObjetivoSecundario"}
            className="textarea"
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO.')}
            title="JUSTIFICAR AQUI POR QUE OBJETIVO FOI CANCELADO OU NÃO FOI ATINGIDO."
            style={{
              width: '100%',
              height: 100,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <button
            className="green-button"
            onClick={(e) => {
              if (document.getElementById("inputJustificativaObjetivoSecundario").value != '') {
                var obj = {
                  idpct: idpaciente,
                  idatendimento: idatendimento,
                  idplanoterapeutico: idplanoterapeutico,
                  idobjetivo: selectedobjetivosecundario.idobjetivo,
                  objetivo: selectedobjetivosecundario.objetivo,
                  datainicio: selectedobjetivosecundario.datainicio,
                  datatermino: moment(),
                  idprofissional: selectedobjetivosecundario.idprofissional,
                  tipoobjetivo: selectedobjetivosecundario.tipoobjetivo,
                  statusobjetivo: statusobjetivo,
                  escala: 0,
                  dimensao: 0,
                  justificativa: document.getElementById("inputJustificativaObjetivoSecundario").value.toUpperCase(),
                }
                axios.post(htmlupdateobjetivo + selectedobjetivosecundario.id, obj).then(() => {
                  setviewjustificaobjetivosecundario(0);
                  loadObjetivos();
                  /*
                  if (statusobjetivo == 3) {
                    // modificando as metas associadas ao objetivo cancelado.
                    metas.filter(valor => valor.idobjetivo == selectedobjetivosecundario.idobjetivo).map(valor => updateMeta(valor, valor.prazo, 0, 4, valor.idprofissional, 'OBJETIVO CANCELADO OU NÃO ATINGIDO.', valor.checagem));
                  }
                  */
                });

              }
              e.stopPropagation()
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
    )
  }

  // exibição de objetivos primários e secundários.
  const [selectedobjetivoprimario, setselectedobjetivoprimario] = useState([]);
  function ObjetivosPrimarios() {
    return (
      <div className="scroll" id="OBJETIVOS PRIMÁRIOS"
        style={{
          width: '100%',
          height: 300,
          backgroundColor: "#f2f2f2", borderColor: "#f2f2f2",
          minHeight: 50,
          paddingRight: 5,
          paddingLeft: window.innerWidth < 426 ? 5 : 10,
        }}
      >
        {objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico).map(item => (
          <div id="ITEM DE OBJETIVO PRIMÁRIO" className="row"
            disabled={statusplanoterapeutico == 1 ? false : true}
            style={{
              display: item.statusobjetivo != 4 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
              width: window.innerWidth < 400 ? '80vw' : window.innerWidth > 400 && window.innerWidth < 1025 ? '70vw' : '100%',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 425 ? 'row' : 'column',
                width: '100%',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 10, marginRight: 10, padding: 5, marginBottom: 5 }}>
                  {item.objetivo}
                  <div style={{ display: item.justificativa != null ? 'flex' : 'none', color: '#e74c3c' }}>{'JUSTIFICATIVA: ' + item.justificativa}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  className={item.statusobjetivo == 0 ? "grey-button" : item.statusobjetivo == 1 ? "blue-button" : item.statusobjetivo == 2 ? "green-button" : item.statusobjetivo == 3 ? "red-button" : "yellow-button"}
                  style={{ width: 150 }}>
                  {item.statusobjetivo == 0 ? 'INATIVO' : item.statusobjetivo == 1 ? 'ATIVO' : item.statusobjetivo == 2 ? 'SUCESSO' : item.statusobjetivo == 3 ? 'NÃO ATINGIDO' : 'CANCELADO'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <button id="exlcuir objetivo primário"
                    title="EXCLUIR OBJETIVO PRIMÁRIO."
                    style={{ display: item.statusobjetivo == 0 && boss_planoterapeutico_usuario == 1 ? 'flex' : 'none' }}
                    className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                    onClick={(e) => { deleteObjetivo(item); e.stopPropagation(); setselectedobjetivo(0) }}
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
                  <button id="cancelar objetivo primário"
                    title="CANCELAR OBJETIVO PRIMÁRIO."
                    style={{ display: boss_planoterapeutico_usuario == 1 && item.statusobjetivo == 1 ? 'flex' : 'none' }}
                    className={window.innerWidth < 426 ? 'yellow-button' : "animated-yellow-button"}
                    onClick={(e) => {
                      setselectedobjetivo(0);
                      setselectedobjetivoprimario(item);
                      setTimeout(() => {
                        setstatusobjetivo(4); setviewjustificaobjetivoprimario(1); e.stopPropagation();
                      }, 500);
                    }}
                  >
                    <img
                      alt=""
                      src={trash}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                  <button id="objetivo primário não alcançado"
                    title="DEFINIR OBJETIVO PRIMÁRIO COMO NÃO ALCANÇADO."
                    style={{ display: boss_planoterapeutico_usuario == 1 && item.statusobjetivo == 1 ? 'flex' : 'none' }}
                    className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                    onClick={(e) => {
                      setselectedobjetivo(0);
                      setselectedobjetivoprimario(item);
                      setTimeout(() => {
                        setstatusobjetivo(3); setviewjustificaobjetivoprimario(1); e.stopPropagation();
                      }, 500);
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
                  <button
                    title="VALIDAR OBJETIVO PRIMÁRIO."
                    style={{ display: item.statusobjetivo == 0 ? 'flex' : 'none' }}
                    className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
                    onClick={(e) => { updateObjetivo(item, 1); setselectedobjetivo(0); e.stopPropagation() }}
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
                  <button
                    title="FINALIZAR OBJETIVO PRIMÁRIO."
                    style={{
                      display:
                        boss_planoterapeutico_usuario == 1 && item.statusobjetivo == 1 &&
                          objetivos.filter(valor => valor.tipoobjetivo == 2 && valor.idplanoterapeutico == idplanoterapeutico && valor.statusobjetivo == 1).length == 0 &&
                          objetivos.filter(valor => valor.tipoobjetivo == 2 && valor.idplanoterapeutico == idplanoterapeutico && valor.statusobjetivo == 2 && moment(valor.datainicio).diff(moment(item.datainicio), 'milliseconds') > 0).length > 0
                          ? 'flex' : 'none'
                    }}
                    className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
                    onClick={(e) => {
                      setselectedobjetivo(0);
                      loadMetas();
                      setTimeout(() => {
                        if (
                          objetivos.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.tipoobjetivo == 2 && valor.statusobjetivo < 2).length < 1 &&
                          metas.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.status < 2).length < 1
                        ) {
                          updateObjetivo(item, 2); e.stopPropagation();
                        } else if (metas.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.status < 2).length > 0) {
                          toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO PRINCIPAL SEM METAS CONCLUÍDAS.', 3000);
                        } else {
                          toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO PRINCIPAL COM OBJETIVOS SECUNDÁRIOS ABERTOS.', 3000);
                        }
                      }, 1000);
                    }}
                  >
                    ✔
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          className="green-button"
          onClick={() => { setviewobjetivo(1); setselectedobjetivo(0) }}
          style={{ display: statusplanoterapeutico == 1 ? 'flex' : 'none', maxWidth: 50, alignSelf: 'flex-end' }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 20,
              width: 20,
            }}
          ></img>
        </button>
      </div>
    )
  }

  // objetivos secundários.
  const ScrollObjetivos = useCallback(() => {
    return (
      <div id="scrollobjetivos" className="scroll"
        style={{
          height: '100%', width: '100%', minWidth: '100%', maxWidth: '100%',
          margin: 0, marginBottom: 5, padding: 0, paddingLeft: 0, paddingRight: 15,
          backgroundColor: '#ffffff', borderColor: '#ffffff'
        }}>
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 0).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={item.statusobjetivo == 1 ? "green-button" : "blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'column', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
            onClick={() => {
              document.getElementById('nova_meta').style.display = 'none';
              setselectedobjetivo(item.idobjetivo);
              setselectedobjetivosecundario(item);
              // FILTRA PROFISSÕES.
              filtraScrollProfissionais(item.idobjetivo);
              var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button-objetivos animationobjetivos";
              }
              document.getElementById("objetivo" + item.id).className = "red-button-objetivos animationobjetivos";
            }}
          >
            <div id="botoes" // 0 = a validar, 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado. 5 = parcialmente atingido.
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button id="btn excluir (oculto)"
                title="EXCLUIR OBJETIVO SECUNDÁRIO."
                style={{ display: item.statusobjetivo == 0 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animatedobj-red-button"}
                onClick={(e) => { deleteObjetivo(item); e.stopPropagation() }}
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
              <button id="btn cancelar"
                title="CANCELAR OBJETIVO SECUNDÁRIO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animatedobj-yellow-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivosecundario(item);
                      setTimeout(() => {
                        setselectedobjetivo(0);
                        setstatusobjetivo(4);
                        setviewjustificaobjetivosecundario(1);
                      }, 500);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={trash}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn não alcançado"
                title="OBJETIVO SECUNDÁRIO NÃO ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animatedobj-red-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivo(0);
                      setstatusobjetivo(3);
                      setviewjustificaobjetivosecundario(1);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojisad}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn a validar (oculto)"
                title="VALIDAR OBJETIVO SECUNDÁRIO."
                style={{ display: item.statusobjetivo == 0 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'green-button' : "animatedobj-green-button"}
                onClick={(e) => { updateObjetivo(item, 1); e.stopPropagation() }}
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
              <button id="btn finalizar parcial"
                title="OBJETIVO SECUNDÁRIO PARCIALMENTE ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animatedobj-yellow-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivosecundario(item);
                      setTimeout(() => {
                        setselectedobjetivo(0);
                        setstatusobjetivo(5);
                        setviewjustificaobjetivosecundario(1);
                      }, 500);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojineutral}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn finalizar pleno"
                title="OBJETIVO SECUNDÁRIO PLENAMENTE ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'green-button' : "animatedobj-green-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      updateObjetivo(item, 2); e.stopPropagation();
                      setselectedobjetivo(0);
                      setselectedobjetivosecundario(0);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojihappy}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
            <div style={{ display: item.statusobjetivo > 0 ? 'flex' : 'none' }}>
              <img
                alt=""
                src={item.statusobjetivo == 5 ? emojineutral : item.statusobjetivo == 3 ? emojisad : emojihappy}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 1).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={"blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'column', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
            onClick={() => {
              setTimeout(() => {
                document.getElementById('nova_meta').style.display = 'none';
              }, 1000);
              setselectedobjetivo(item.idobjetivo);
              setselectedobjetivosecundario(item);
              filtraScrollProfissionais(item.idobjetivo);
              var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button-objetivos animationobjetivos";
              }
              document.getElementById("objetivo" + item.id).className = "red-button-objetivos animationobjetivos";
            }}
          >
            <div id="botoes" // 0 = a validar, 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado. 5 = parcialmente atingido.
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button id="btn excluir"
                title="EXCLUIR OBJETIVO SECUNDÁRIO."
                style={{ display: item.statusobjetivo == 0 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animatedobj-red-button"}
                onClick={(e) => { deleteObjetivo(item); e.stopPropagation() }}
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
              <button id="btn cancelar"
                title="CANCELAR OBJETIVO SECUNDÁRIO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animatedobj-yellow-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivosecundario(item);
                      setTimeout(() => {
                        setselectedobjetivo(0);
                        setstatusobjetivo(4);
                        setviewjustificaobjetivosecundario(1);
                      }, 500);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={trash}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn não alcançado"
                title="OBJETIVO SECUNDÁRIO NÃO ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animatedobj-red-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivo(0);
                      setstatusobjetivo(3);
                      setviewjustificaobjetivosecundario(1);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojisad}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn finalizar parcial"
                title="OBJETIVO SECUNDÁRIO PARCIALMENTE ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animatedobj-yellow-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      setselectedobjetivosecundario(item);
                      setTimeout(() => {
                        setselectedobjetivo(0);
                        setstatusobjetivo(5);
                        setviewjustificaobjetivosecundario(1);
                      }, 500);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojineutral}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn finalizar pleno" // 0 = a validar, 1 = ativo. 2 = concluído. 3 = não alcançado. 4 = cancelado. 5 = parcialmente atingido.
                title="OBJETIVO SECUNDÁRIO PLENAMENTE ATINGIDO."
                style={{ display: item.statusobjetivo == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'green-button' : "animatedobj-green-button"}
                onClick={(e) => {
                  axios.get(htmlmetas + idatendimento).then((response) => {
                    var x = [0, 1];
                    x = response.data.rows;
                    var check1 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo).length;
                    var check2 = x.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length;
                    if (check1 == 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO SEM METAS.', 3000);
                    } else if (check2 > 0) {
                      toast(1, '#ec7063', 'NÃO É POSSÍVEL FINALIZAR UM OBJETIVO COM METAS ATIVAS.', 3000);
                    } else {
                      updateObjetivo(item, 2); e.stopPropagation();
                      setselectedobjetivo(0);
                      setselectedobjetivosecundario(0);
                    }
                  });
                }}
              >
                <img
                  alt=""
                  src={emojihappy}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              <img
                alt=""
                src={emojisad}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className='yellow-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              <img
                alt=""
                src={trash}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              <img
                alt=""
                src={emojihappy}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 2).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={"blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'column', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
            onClick={() => {
              setTimeout(() => {
                document.getElementById('nova_meta').style.display = 'none';
              }, 1000);
              setselectedobjetivo(item.idobjetivo);
              setselectedobjetivosecundario(item);
              filtraScrollProfissionais(item.idobjetivo);
              var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button-objetivos animationobjetivos";
              }
              document.getElementById("objetivo" + item.id).className = "red-button-objetivos animationobjetivos";
            }}
          >
            <div className='green-button'>
              <img
                alt=""
                src={emojihappy}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 5).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={"blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'column', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
            onClick={() => {
              setTimeout(() => {
                document.getElementById('nova_meta').style.display = 'none';
              }, 1000); setselectedobjetivo(item.idobjetivo);
              setselectedobjetivosecundario(item);
              filtraScrollProfissionais(item.idobjetivo);
              var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button-objetivos animationobjetivos";
              }
              document.getElementById("objetivo" + item.id).className = "red-button-objetivos animationobjetivos";
            }}
          >
            <div className="yellow-button">
              <img
                alt=""
                src={emojineutral}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 3).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={"blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'column', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
            onClick={() => {
              setTimeout(() => {
                document.getElementById('nova_meta').style.display = 'none';
              }, 1000);
              setselectedobjetivo(item.idobjetivo);
              setselectedobjetivosecundario(item);
              filtraScrollProfissionais(item.idobjetivo);
              var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button-objetivos animationobjetivos";
              }
              document.getElementById("objetivo" + item.id).className = "red-button-objetivos animationobjetivos";
            }}
          >
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO NÃO ATINGIDO: " + item.justificativa}
            >
              <img
                alt=""
                src={emojisad}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className='red-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO CANCELADO: " + item.justificativa}
            >
              <img
                alt=""
                src={emojisad}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              <img
                alt=""
                src={emojihappy}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
        <button
          className="green-button"
          onClick={() => setviewobjetivo(2)}
          style={{
            display: statusplanoterapeutico == 1 &&
              objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 1).length > 0 ? 'flex' : 'none',
            maxWidth: 50, alignSelf: 'flex-end'
          }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 20,
              width: 20,
            }}
          ></img>
        </button>
      </div>
    )
  }, [objetivos, idplanoterapeutico, opcoesmetas])

  var listcategoriaprofissional = [
    { id: 4, nome: 'ENFERMAGEM', cor: '#76D7C4' },
    { id: 32, nome: 'FARMÁCIA', cor: '#AED6F1' },
    { id: 5, nome: 'FISIOTERAPIA', cor: '#BB8FCE' },
    { id: 6, nome: 'FONOAUDIOLOGIA', cor: '#F1948A' },
    { id: 10, nome: 'PSICOLOGIA', cor: '#EDBB99' },
    { id: 1, nome: 'SERVIÇO SOCIAL', cor: '#F7DC6F' },
    { id: 11, nome: 'TERAPIA OCUPACIONAL', cor: '#AEB6BF' },
    { id: 9, nome: 'NUTRIÇÃO CLÍNICA', cor: 'grey' },
  ]

  var lista = [];
  const filtraScrollProfissionais = (idobjetivo) => {
    setselectedcategoria(0);
    lista = [];
    setTimeout(() => {
      opcoesmetas.filter(valor => valor.id_objetivo == idobjetivo).map(item => {
        lista.push(listcategoriaprofissional.filter(x => x.id == item.idespecialidade).pop());
      });
      var uniqueprofissionais = lista.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
      );
      setarraycategoriaprofissional(uniqueprofissionais);
    }, 500);
  }

  const CategoriaSelector = useCallback(() => {
    return (
      <div id="scroll das categorias profissionais."
        className="scroll"
        style={{
          alignSelf: 'center',
          scrollBehavior: 'smooth', flexDirection: 'row', justifyContent: 'flex-start',
          overflowY: 'hidden', overflowX: 'scroll',
          width: window.innerWidth < 426 ? 'calc(100vw - 30px)' : '65vw',
          margin: 0, padding: 0, height: 90, minHeight: 90, maxHeight: 90,
          backgroundColor: '#ffffff', borderColor: '#ffffff',
        }}>
        {arraycategoriaprofissional.map(item => (
          <div
            id={"categoriaprofissional" + item.id}
            className="blue-button"
            style={{
              display: selectedobjetivo != 0 ? 'flex' : 'none',
              height: 50, minHeight: 50, width: 150, minWidth: 150,
              // backgroundColor: item.cor,
            }}
            onClick={() => {
              setselectedcategoria(item.id);
              // alert(item.id + ' - ' + selectedcategoria + ' - ' + tipousuario);
              var botoes = document.getElementById("scroll das categorias profissionais.").getElementsByClassName("red-button");
              for (var i = 0; i < botoes.length; i++) {
                botoes.item(i).className = "blue-button";
              }
              document.getElementById("categoriaprofissional" + item.id).className = "red-button";
            }}
          >
            {item.nome}
          </div>
        ))}
        <div className="title2center"
          style={{ display: selectedobjetivo == 0 ? 'flex' : 'none' }}>
          SELECIONE UM OBJETIVO SECUNDÁRIO
        </div>
      </div>
    )
  }, [arraycategoriaprofissional, selectedobjetivosecundario, selectedobjetivo, idobjetivo]);

  const [listopcoesmetodos, setlistopcoesmetodos] = useState([]);
  const [listopcoesmetodospt, setlistopcoesmetodospt] = useState([]);
  const [opcoesescalas, setopcoesescalas] = useState([]);
  const [viewsuspendermeta, setviewsuspendermeta] = useState(0);
  const MetodosAndMetas = useCallback(() => {
    return (
      <div style={{ width: '65vw', minWidth: '65vw', height: '100%', margin: 5, marginBottom: 0 }}>
        <div id="métodos e metas"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: window.innerWidth < 426 ? 'flex-start' : 'center',
            alignSelf: 'center',
            height: '53vh', width: '65vw',
            padding: 0, margin: 0,
          }}>
          <div id="scroll das metas."
            className="scroll"
            style={{
              marginTop: 5,
              display: 'flex',
              height: window.innerWidth < 426 ? '45vh' : '53vh',
              width: window.innerWidth < 426 ? 'calc(100vw - 30px)' : '100%',
              backgroundColor: '#ffffff', borderColor: '#ffffff',
              margin: 0, padding: 0,
            }}>
            {arraymetas.filter(valor => valor.idobjetivo == selectedobjetivo && valor.idplanoterapeutico == idplanoterapeutico && valor.idespecialidade == selectedcategoria).map(item => getMetas(item))}
            <button
              className="green-button"
              id="nova_meta"
              onClick={() => setviewmeta(1)}
              style={{
                // PENDÊNCIA PERMITIR INSERIR META POR CATEGORIA PROFISSIONAL LOGADA.
                display: objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico).length > 0 && statusplanoterapeutico == 1 && selectedobjetivosecundario.statusobjetivo == 1 && (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) ? 'flex' : 'none',
                maxWidth: 50, alignSelf: 'flex-end', marginRight: 10,
              }}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div id="scroll sem metas."
            className="title4"
            style={{
              display: 'none',
              flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%',
              padding: 0, margin: 0,
              backgroundColor: '#ffffff', borderColor: '#ffffff', borderRadius: 5,
            }}>
            {'SELECIONE UM OBJETIVO SECUNDÁRIO PARA VISUALIZAR AS METAS.'}
          </div>
        </div>
      </div>
    )
  }, [objetivos, selectedobjetivo, selectedobjetivosecundario, selectedcategoria, arraymetas, listopcoesmetodos, listopcoesmetodospt, listescalas, opcoesescalas, viewsuspendermeta]);

  // simulação de profissionais envolvidos no plano terapêutico.
  var arrayprofissionais = [
    {
      id: 1,
      idprofissional: 1,
      tipoprofissional: 1,
      nome: 'RODRIGO',
    },
    {
      id: 2,
      idprofissional: 2,
      tipoprofissional: 2,
      nome: 'TAÍS',
    },
    {
      id: 2,
      idprofissional: 3,
      tipoprofissional: 3,
      nome: 'DILA',
    },
  ]

  // gráfico que exibe o tempo decorrido entre o início da meta e seu prazo.
  const [selected_meta, setselected_meta] = useState([]);
  const [selected_intervencao, setselected_intervencao] = useState([]);
  var dataChartMetas = [];
  const getMetas = useCallback((item) => {
    var prazo = moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days');
    var feito = moment().startOf('day').diff(moment(item.datainicio).startOf('day'), 'days');
    if (feito > prazo) {
      feito = prazo;
    }
    var remain = prazo - feito;
    dataChartMetas = {
      datasets: [
        {
          data: [feito, remain],
          backgroundColor: ['#ec7063', '#52be80'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    return (
      <div id="ITEM DE META" className="row"
        onClick={() => setidmeta(item.idmeta)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          width: window.innerWidth < 426 ? '90%' : '98%',
          opacity: 1, padding: 10,
          paddingLeft: 7.5,
          marginRight: 10
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            width: '100%', height: '100%',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
          <div style={{
            display: 'flex',
            height: '100%',
            flexDirection: window.innerWidth > 425 ? 'row' : 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <div id="identificador do profissional" // 1 = médico, 2 = enfermeiro, 3 = fisioterapeuta, 4 = fonoaudiólogo, 5 = terapeuta ocupacional, 6 = psicólogo, 7 = assistente social.
              className="blue-button"
              style={{
                display: item.idprofissional != 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center',
                height: window.innerWidth < 426 ? 50 : '100%',
                minHeight: window.innerWidth < 426 ? 50 : '100%',
                maxHeight: window.innerWidth < 426 ? 50 : '100%',
                width: 150,
                minWidth: 150,
                padding: 10,
                backgroundColor:
                  arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 1 ? '#AED6F1' :
                    arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 2 ? '#76D7C4' :
                      arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 3 ? '#F1948A' :
                        arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 4 ? '#C39BD3' :
                          arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 5 ? '#F8C471' :
                            arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 6 ? '#F7DC6F' :
                              '#CCD1D1'
              }}
            >
              <div>
                {
                  arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 1 ? 'MEDICO' :
                    arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 2 ? 'ENFERMEIRO' :
                      arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 3 ? 'FISIOTERAPEUTA' :
                        arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 4 ? 'FONOAUDIOLOGO' :
                          arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 5 ? 'TERAPEUTA OCUPACIONAL' :
                            arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 6 ? 'PSICOLOGO' : 'ASSISTENTE SOCIAL'
                }
              </div>
              <div>{arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.nome)}</div>
            </div>
            <div id="identificador da especialidade" // 1 = médico, 2 = enfermeiro, 3 = fisioterapeuta, 4 = fonoaudiólogo, 5 = terapeuta ocupacional, 6 = psicólogo, 7 = assistente social.
              className="blue-button"
              onClick={() => {
                setselected_meta(item);
              }}
              style={{
                position: 'relative',
                padding: 10,
                display: item.idprofissional == 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center',
                height: window.innerWidth < 426 ? 50 : '100%',
                minHeight: window.innerWidth < 426 ? 50 : '100%',
                maxHeight: window.innerWidth < 426 ? 50 : '100%',
                width: window.innerWidth < 426 ? '90%' : 150,
                minWidth: window.innerWidth < 426 ? '90%' : 150,
                backgroundColor: arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.cor),
              }}
            >
              <div>
                {
                  arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome)
                }
              </div>
            </div>
            <div
              title={moment().startOf('day').diff(moment(item.datainicio).startOf('day'), 'days') + '/' + moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days')}>
              <Doughnut
                data={dataChartMetas}
                width={window.innerWidth > 400 ? 75 : 50}
                height={window.innerWidth > 400 ? 75 : 50}
                plugins={ChartDataLabels}
                options={{
                  cutoutPercentage: 40,
                  plugins: {
                    legend: {
                      display: false
                    },
                    datalabels: {
                      display: false
                    }
                  },
                  tooltips: {
                    enabled: false,
                  },
                  hover: { mode: null },
                  elements: {
                    arc: {
                      hoverBorderColor: '#E1E5F2',
                      borderColor: '#E1E5F2',
                      borderWidth: 5,
                      width: 50
                    },
                  },
                  animation: {
                    duration: 500,
                  },
                  title: {
                    display: false,
                    text: 'PRAZO',
                  },
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  maintainAspectRatio: true,
                  responsive: false,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start',
                marginLeft: 5
              }}>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: 0,
                  padding: 0, marginBottom: 5,
                }}>
                {item.meta}
              </div>

              <textarea id={"inputJustificativa" + item.id}
                className="textarea"
                defaultValue={item.justificativa}
                autoComplete="off"
                placeholder="JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA.')}
                title="JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA."
                style={{
                  display: moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 && item.status == 1 ? 'flex' : 'none', // exibido apenas para metas não alcançadas no prazo definido.
                  width: '100%',
                  height: 100,
                  margin: 2.5,
                  flexDirection: 'column',
                  boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                }}
                onChange={(e) => {
                  clearTimeout(timeout)
                  timeout = setTimeout(() => {
                    // updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 4, item.idprofissional, document.getElementById("inputJustificativa" + item.id).value.toUpperCase(), item.checagem)
                  }, 2000);
                }}
                type="text"
                maxLength={200}>
              </textarea>
              <div className="red-button"
                onClick={() => updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 4, item.idprofissional, document.getElementById("inputJustificativa" + item.id).value.toUpperCase(), item.checagem)}
                style={{
                  width: 50, maxWidth: 50,
                  display: moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 && item.status == 1 ? 'flex' : 'none', // exibido apenas para metas não alcançadas no prazo definido.
                }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 0,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </div>
              <div id="definição"
                style={{
                  display: 'flex', flexDirection: 'row',
                  justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start'
                }}>
                <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                  title={'RESTAM: ' + moment(item.dataestimada).startOf('day').diff(moment().startOf('day'), 'days')}
                  style={{
                    fontSize: 12, margin: 5, marginLeft: 0, padding: 0,
                    alignSelf: window.innerWidth < 426 ? 'center' : 'flex-start',
                  }}>
                  {'DEFINIÇÃO: ' + moment(item.datainicio).format('DD/MM/YY')}
                </div>
                <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                  style={{
                    display: item.status == 0 ? 'none' : 'flex',
                    fontSize: 12, margin: 5, padding: 0,
                    alignSelf: window.innerWidth > 425 ? 'flex-start' : 'center'
                  }}>
                  {'PRAZO: ' + moment(item.dataestimada).format('DD/MM/YY')}
                </div>
                <div className={window.innerWidth > 425 ? "title2" : "title2center"}
                  style={{
                    display: item.status == 2 ? 'flex' : 'none',
                    fontSize: 12, margin: 5, padding: 0,
                    alignSelf: window.innerWidth > 425 ? 'flex-start' : 'center'
                  }}>
                  {'CONCLUSÃO: ' + moment(item.datatermino).format('DD/MM/YY')}
                </div>
              </div>
              <div id="métodos de avaliação"
                onClick={() => { document.getElementById("metodos + intervencao" + item.id).classList.toggle("show") }}
                style={{
                  display: 'flex', flexDirection: 'column',
                  justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start',
                  alignSelf: window.innerWidth < 426 ? 'center' : 'flex-start',
                  fontSize: 12, textDecoration: 'underline',
                  color: '#52be80', marginBottom: 20,
                  textAlign: window.innerWidth < 426 ? 'center' : 'left'
                }}>
                MÉTODOS DE AVALIAÇÃO
              </div>
              <div style={{ display: item.status == 3 || item.status == 4 ? 'flex' : 'none', color: '#ec7063', fontWeight: 'bold' }}>{'JUSTIFICATIVA: ' + item.justificativa}</div>
            </div>
          </div>

          <div id="botões, inputs prazo, checagem e nota (meta cumprida)"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
            <div
              style={{ display: 'flex', flexDirection: 'row' }}>
              <input id={"inputPrazo" + item.id}
                className="input"
                defaultValue={moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days')}
                autoComplete="off"
                placeholder="QTDE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                title="DIAS PARA CONCLUSÃO DA META."
                style={{
                  display: item.status == 0 ? 'flex' : 'none', // exibido apenas para metas ainda não confirmadas.
                  width: 50,
                  margin: 2.5,
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignContent: 'center',
                  boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',

                }}
                type="number"
                maxLength={3}>
              </input>
              <div id="imagens de ação"
                title={
                  item.status == 0 ? 'INATIVA' :
                    item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 0 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 ? 'ATIVA' :
                      // item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 && moment().startOf('day').diff(moment(item.datachecagem), 'days') > 0 ? 'PAUSADA PARA CHECAGEM' :
                      item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 ? 'VENCIDA' :
                        item.status == 3 ? 'CANCELADA' : item.status == 4 ? 'META NÃO CUMPRIDA.' : ''}>
                <img
                  className={item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1 ? "pulsarplanoterapeutico" : ''}
                  src={
                    item.status == 0 ? plano_validar : item.status == 2 ? emojihappy : item.status == 3 ? plano_cancelado : item.status == 4 ? emojisad : item.status == 5 ? emojineutral :
                      item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 0 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 ? plano_ativo :
                        item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 ? plano_fracassado :
                          ''}
                  style={{
                    display: 'flex',
                    margin: 2.5,
                    marginRight: item.status == 4 ? 7.5 : 2.5,
                    height: 50,
                    width: 50,
                    alignSelf: 'center', verticalAlign: 'center',
                    backgroundColor: item.status == 2 ? '#52be80' : item.status == 4 ? '#ec7063' : item.status == 5 ? '#f5b041' : '',
                    borderRadius: 5,
                  }}
                ></img>
              </div>
            </div>
            <div id="botões"
              style={{
                display: 'flex', flexDirection: 'row',
              }}>
              <button id="btn excluir meta (erro de registro)"
                title="EXCLUIR META."
                style={{ display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && item.status == 0 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={(e) => { deleteMeta(item); e.stopPropagation() }}
              >
                <img
                  alt=""
                  src={trash}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn validar meta"
                title="VALIDAR META."
                style={{ display: item.status == 0 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
                onClick={(e) => {
                  if (objetivos.filter(valor => valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 0 && valor.idplanoterapeutico == idplanoterapeutico).length > 0) {
                    toast(1, '#ec7063', 'VALIDE PRIMEIRO O OBJETIVO ANTES DE VALIDAR A META CORRESPONDENTE.', 3000);
                  } else {
                    updateMeta(item, document.getElementById("inputPrazo" + item.id).value, item.nota, 1, item.idprofissional, item.justificativa, item.checagem); e.stopPropagation();
                  }
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
              <button id="btn retomar meta"
                title="RETOMAR META."
                style={{
                  // display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && (item.status == 3 || item.status == 4) && statusplanoterapeutico == 1 && objetivos.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1).length > 0 && metas.filter(valor => valor.idmeta == item.idmeta && (valor.status == 0 || valor.status == 1)).length == 0 ? 'flex' : 'none'
                  display: item.status > 0 &&
                    (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) &&
                    statusplanoterapeutico == 1 &&
                    objetivos.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1).length > 0 ? 'flex' : 'none'
                }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animated-yellow-button"}
                onClick={(e) => {
                  setselected_meta(item);
                  document.getElementById("divJustificativaRestart" + item.id).style.display = 'flex'
                  // restartMeta(item);
                  e.stopPropagation()
                }} // atualiza a meta como cancelada.
              >
                <img
                  alt=""
                  src={refresh}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn cancelar meta"
                title="CANCELAR META."
                style={{ display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && item.status == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animated-yellow-button"}
                onClick={() => document.getElementById("divJustificativaSuspender" + item.id).style.display = 'flex'}
              >
                <img
                  alt=""
                  src={trash}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>

              <button id="btn meta não atingida"
                title="CLASSIFICAR META COMO NÃO ATINGIDA."
                style={{ display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && item.status == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={() => document.getElementById("divJustificativaMetaNaoAtingida" + item.id).style.display = 'flex'}
              >
                <img
                  alt=""
                  src={emojisad}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn meta parcialmente atingida"
                title="CLASSIFICAR META COMO PARCIALMENTE ATINGIDA."
                style={{ display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && item.status == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'yellow-button' : "animated-yellow-button"}
                onClick={() => document.getElementById("divJustificativaMetaParcialAtingida" + item.id).style.display = 'flex'}
              >
                <img
                  alt=""
                  src={emojineutral}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button id="btn meta plenamente atingida"
                title="CLASSIFICAR META COMO PLENAMENTE ATINGIDA." // status da meta = 2.
                style={{ display: (selectedcategoria == tipousuario || boss_planoterapeutico_usuario == 1) && item.status == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
                onClick={(e) => { updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 2, item.idprofissional, item.justificativa, item.checagem); e.stopPropagation() }} // atualiza a meta como alcançada.
              >
                <img
                  alt=""
                  src={emojihappy}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>

            </div>
          </div>
        </div>

        <div id={"divJustificativaSuspender" + item.id} style={{ display: 'none', marginTop: 10 }}>
          <textarea
            id={"inputJustificativaSuspender" + item.id}
            className="textarea"
            defaultValue={item.justificativa}
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE A META FOI CANCELADA."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE A META FOI CANCELADA.')}
            title="JUSTIFICAR AQUI POR QUE A META FOI CANCELADA."
            style={{
              display: 'flex',
              width: '100%',
              height: 120,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
            <button
              title="SALVAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
              onClick={(e) => {
                // alert(document.getElementById("inputJustificativaSuspender" + item.id).value);
                updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 3, item.idprofissional, document.getElementById("inputJustificativaSuspender" + item.id).value.toUpperCase(), item.checagem);
                document.getElementById("divJustificativaSuspender" + item.id).style.display = 'none';
                e.stopPropagation()
              }} // atualiza a meta como cancelada, com a justificativa.
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
            <button
              title="CANCELAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
              onClick={(e) => {
                document.getElementById("divJustificativaSuspender" + item.id).style.display = 'none';
                e.stopPropagation()
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
        </div>
        <div id={"divJustificativaRestart" + item.id} style={{ display: 'none', marginTop: 10 }}>
          <textarea
            id={"inputJustificativaRestart" + item.id}
            className="textarea"
            defaultValue={item.justificativa}
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE A META FOI REINICIADA."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE A META FOI REINICIADA.')}
            title="JUSTIFICAR AQUI POR QUE A META FOI REINICIADA."
            style={{
              display: 'flex',
              width: '100%',
              height: 120,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
            <button
              title="SALVAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
              onClick={(e) => {
                setselected_meta(item);
                restartMeta(item);
                e.stopPropagation();
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
            <button
              title="CANCELAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
              onClick={(e) => {
                document.getElementById("divJustificativaRestart" + item.id).style.display = 'none';
                e.stopPropagation()
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
        </div>
        <div id={"divJustificativaMetaNaoAtingida" + item.id} style={{ display: 'none', marginTop: 10 }}>
          <textarea
            id={"inputJustificativaMetaNaoAtingida" + item.id}
            className="textarea"
            defaultValue={item.justificativa}
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA.')}
            title="JUSTIFICAR AQUI POR QUE A META NÃO FOI ATINGIDA."
            style={{
              display: 'flex',
              width: '100%',
              height: 120,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
            <button
              title="SALVAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
              onClick={(e) => {
                updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 4, item.idprofissional, document.getElementById("inputJustificativaMetaNaoAtingida" + item.id).value.toUpperCase(), item.checagem); // status 4 = meta não atingida.
                document.getElementById("divJustificativaMetaNaoAtingida" + item.id).style.display = 'none';
                e.stopPropagation()
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
            <button
              title="CANCELAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
              onClick={(e) => {
                document.getElementById("divJustificativaMetaNaoAtingida" + item.id).style.display = 'none';
                e.stopPropagation()
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
        </div>
        <div id={"divJustificativaMetaParcialAtingida" + item.id} style={{ display: 'none', marginTop: 10 }}>
          <textarea
            id={"inputJustificativaMetaParcialAtingida" + item.id}
            className="textarea"
            defaultValue={item.justificativa}
            autoComplete="off"
            placeholder="JUSTIFICAR AQUI POR QUE A META FOI PARCIALMENTE ATINGIDA."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'JUSTIFICAR AQUI POR QUE A META FOI PARCIALMENTE ATINGIDA.')}
            title="JUSTIFICAR AQUI POR QUE A META FOI PARCIALMENTE ATINGIDA."
            style={{
              display: 'flex',
              width: '100%',
              height: 120,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
            <button
              title="SALVAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'green-button' : "animated-green-button"}
              onClick={(e) => {
                updateMeta(item, moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days'), item.nota, 5, item.idprofissional, document.getElementById("inputJustificativaMetaParcialAtingida" + item.id).value.toUpperCase(), item.checagem); // status 5 = meta parcialmente atingida.
                document.getElementById("divJustificativaMetaParcialAtingida" + item.id).style.display = 'none';
                e.stopPropagation()
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
            <button
              title="CANCELAR JUSTIFICATIVA."
              className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
              onClick={(e) => {
                document.getElementById("divJustificativaMetaAprcialAtingida" + item.id).style.display = 'none';
                e.stopPropagation()
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
        </div>

        <div className="hide" id={"metodos + intervencao" + item.id}
          style={{ justifyContent: 'center', alignSelf: 'center', width: '100%', padding: 5 }}>
          <div id="view dos métodos de mensuração e das intervenções terapêuticas">
            <div id="título métodos de avaliação"
              className="title4"
              style={{ marginTop: window.innerWidth < 426 ? 40 : 10 }}>
              {'MÉTODOS DE AVALIAÇÃO'}
            </div>
            <div id={"scroll dos métodos de avaliação" + item.id}
              className="scroll"
              style={{
                scrollBehavior: 'smooth', flexDirection: 'row', justifyContent: 'flex-center',
                overflowY: 'hidden', overflowX: 'scroll',
                width: '100%', height: 165, minHeight: 165,
                margin: 0,
                backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
              }}>
              {listopcoesmetodos.filter(valor => valor.id_meta == item.idmeta).sort((a, b) => a.idespecialidade < b.idespecialidade ? 1 : -1).map(item => (
                //... cards com histórico da escala.
                <div>
                  <div id="escala cadastrada para o atendimento."
                    style={{ display: listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento && valor.status == 1).slice(-1).length > 0 ? 'flex' : 'none' }}>
                    {listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento && valor.status == 1).slice(-5).map(value => (
                      <div className="blue-button"
                        onClick={() => setshowescala(value.cd_escala)}
                        style={{
                          flexDirection: 'column', width: 120, minWidth: 120, height: 120, minHeight: 120,
                          margin: 5, marginBottom: 10,
                          backgroundColor:
                            item.idespecialidade == 1 ? '#AED6F1' :
                              item.idespecialidade == 2 ? '#76D7C4' :
                                item.idespecialidade == 3 ? '#F1948A' :
                                  item.idespecialidade == 4 ? '#C39BD3' :
                                    item.idespecialidade == 5 ? '#F8C471' :
                                      item.idespecialidade == 6 ? '#F7DC6F' : '#CCD1D1',
                        }}>
                        <div>{
                          item.idespecialidade == 8 ? 'MÉDICO' : item.idespecialidade == 4 ? 'ENF / ESTOMA' :
                            item.idespecialidade == 32 ? 'FARMÁCIA' : item.idespecialidade == 5 ? 'FISIO' :
                              item.idespecialidade == 6 ? 'FONO' : item.idespecialidade == 10 ? 'PSICO' :
                                item.idespecialidade == 1 ? 'S. SOCIAL' : item.idespecialidade == 11 ? 'TO' :
                                  item.idespecialidade == 9 ? 'NUTRI' : ''
                        }
                        </div>
                        <div>{value.ds_escala}</div>
                        <div>{value.valor_resultado}</div>
                        <div>{moment(value.data).format('DD/MM/YYYY')}</div>
                      </div>
                    ))}
                  </div>
                  <div id="sem escala cadastrada para o atendimento."
                    style={{ display: listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento && valor.status == 1).slice(-1).length < 1 ? 'flex' : 'none' }}
                  >
                    <div
                      className="grey-button"
                      onClick={() => setshowescala(opcoesescalas.filter(valor => valor.ds_escala == item.metodo).map(item => item.cd_escala))}
                      style={{
                        flexDirection: 'column', width: 120, minWidth: 120, height: 120, minHeight: 120,
                        margin: 5, marginBottom: 10,
                      }}
                    >
                      <div>{item.metodo}</div>
                      <div>{'!'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div id="título das intervenções"
              className="title4" style={{ display: 'none', marginTop: 10 }}>{'INTERVENÇÕES TERAPÊUTICAS'}
            </div>

          </div>
        </div>
      </div>
    )
  }, [listescalas, opcoesescalas, arraycategoriaprofissional, ChartDataLabels, tipousuario, selectedcategoria]);

  // MÉTRICAS.
  /*
  Todas os registros de escala são guardados em uma única tabela. 
  O tipo de tabela é indicado pelo campo tipo.
  A escala IVCF, por sua vez, é armazenada em tabela específica, que armazena também os valores
  usados para preenchimento da mesma (estes são declarados e visualizados no componente específico).
  1 = MIF.
  2 = PPS.
  3 = Braden.
  4 = Morse.
   
  Distribuição das escalas por categoria profissional.
  1. MÉDICO: MIF
  2. ENFERMEIRO: ESCALA DE DOR
  3. FISIOTERAPEUTA: ?
  4. FONOAUDIÓLOGO: ?
  5. TERAPEUTA OCUPACIONAL: ?
  6. PSICÓLOGO: ?
  7. ASSISTENTE SOCIAL: ?
   
  Na maioria das situações, a mensuração não poderá ser feita por escalas,
  mas apenas por um conjunto de perguntas e respostas.
  */

  // carregando todos os tipos de tabelas cadastrados.
  // carregar todos os tipos de escala.
  const loadTiposEscalas = () => {
    axios.get(html + "/tiposescalas").then((response) => {
      var x = [0, 1];
      x = response.data;
      settiposescalas(x);
    })
  };

  // carregando as opções de escalas.
  const loadOpcoesEscalas = () => {
    axios.get(htmlghapopcoesescalas).then((response) => {
      var x = [];
      x = response.data;
      setopcoesescalas(x.rows);
    })
  }

  // recuperando escalas para exibição nas métricas.
  const [arraylistescalas, setarraylistescalas] = useState([]);
  const loadEscalas = () => {
    axios.get(htmlghapescalas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setarraylistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
    });
  }

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

  const [viewgerirplano, setviewgerirplano] = useState(0);

  // EDITOR DAS OPÇÕES DO PLANO TERAPÊUTICO (SETTINGS).
  // seleção dos editores (objetivo, meta ou método de avaliação).
  const [vieweditor, setvieweditor] = useState(0);
  // componente para seleção das tarefas.
  function SeletorDeTarefas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div className={vieweditor == 1 ? "red-button" : "blue-button"}
          onClick={() => {
            setvieweditor(1);
            setviewopcoeslinhasdecuidado(1);
            setviewopcoesobjetivosprimarios(0);
            setviewopcoesobjetivossecundarios(0);
            setviewcategoriaprofissional(0);
            setviewopcoesmetas(0);
            setviewopcoesmetodos(0);
          }}
          style={{ width: 170, minWidth: 170, padding: 10 }}>
          EDITAR LINHAS DE CUIDADO
        </div>
        <div className={vieweditor == 2 ? "red-button" : "blue-button"}
          onClick={() => {
            setvieweditor(2);
            setviewopcoeslinhasdecuidado(1);
            setviewopcoesobjetivosprimarios(1);
            setviewopcoesobjetivossecundarios(0);
            setviewcategoriaprofissional(0);
            setviewopcoesmetas(0);
            setviewopcoesmetodos(0);
          }}
          style={{ width: 170, minWidth: 170, padding: 10 }}>
          EDITAR OBJETIVOS PRIMÁRIOS
        </div>
        <div className={vieweditor == 3 ? "red-button" : "blue-button"}
          onClick={() => {
            setvieweditor(3);
            setviewopcoeslinhasdecuidado(0);
            setviewopcoesobjetivosprimarios(0);
            setviewopcoesobjetivossecundarios(1);
            setviewcategoriaprofissional(0);
            setviewopcoesmetas(0);
            setviewopcoesmetodos(0);
          }}
          style={{ width: 170, minWidth: 170, padding: 10 }}>
          EDITAR OBJETIVOS SECUNDÁRIOS
        </div>
        <div className={vieweditor == 4 ? "red-button" : "blue-button"}
          onClick={() => {
            setvieweditor(4);
            setviewopcoeslinhasdecuidado(0);
            setviewopcoesobjetivosprimarios(0);
            setviewopcoesobjetivossecundarios(1);
            setviewcategoriaprofissional(1);
            setviewopcoesmetas(1);
            setviewopcoesmetodos(0);
          }}
          style={{ width: 170, minWidth: 170, padding: 10 }}>
          EDITAR METAS
        </div>
        <div className={vieweditor == 5 ? "red-button" : "blue-button"}
          onClick={() => {
            setvieweditor(5);
            setviewopcoeslinhasdecuidado(0);
            setviewopcoesobjetivosprimarios(0);
            setviewopcoesobjetivossecundarios(0);
            setviewcategoriaprofissional(1);
            setviewopcoesmetas(1);
            setviewopcoesmetodos(1);
          }}
          style={{ width: 170, minWidth: 170, padding: 10 }}>
          EDITAR MÉTODOS
        </div>
      </div>
    )
  }

  // EDITAR OPÇÕES DE LINHAS DE CUIDADO.
  // componente para manejo das linhas de cuidado.
  const [viewopcoeslinhasdecuidado, setviewopcoeslinhasdecuidado] = useState(0);
  var picklinhadecuidado = 0;
  function OpcoesLinhasDeCuidado() {
    return (
      <div style={{ display: viewopcoeslinhasdecuidado == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2center">{vieweditor != 1 ? 'SELECIONE UMA LINHA DE CUIDADO' : 'LINHAS DE CUIDADO'}</div>
        <div id="LISTA DE OPÇÕES DE LINHAS DE CUIDADO."
          className="scroll"
          style={{
            display: 'flex', minHeight: 200, height: 200, width: '100%',
            margin: 5,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {arraylinhasdecuidado.sort((a, b) => a.linhadecuidado > b.linhadecuidado ? 1 : -1).map((item) => (
            <div className="row"
              key={item.id}
            >
              <div
                id={"item linha de cuidado" + item.id}
                style={{ width: '100%', padding: 5 }}
                className="blue-button"
                onClick={() => {
                  var botoes = document.getElementById("LISTA DE OPÇÕES DE LINHAS DE CUIDADO.").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("item linha de cuidado" + item.id).className = "red-button";
                  picklinhadecuidado = item.id;
                }}
              >
                {item.linhadecuidado}
              </div>
              <button
                style={{ display: vieweditor == 1 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={(e) => { deleteOpcaoLinhaDeCuidado(item); e.stopPropagation() }}
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
            </div>
          ))}
        </div>
        <div id="INPUT PARA INSERIR LINHA DE CUIDADO."
          style={{ display: vieweditor == 1 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
        >
          <input
            autoComplete="off"
            className="input"
            placeholder="INSERIR LINHA DE CUIDADO..."
            onFocus={(e) => {
              (e.target.placeholder = '');
            }}
            onBlur={(e) => (e.target.placeholder = 'INSERIR LINHA DE CUIDADO...')}
            title={"INSIRA AQUI A NOVA LINHA DE CUIDADO."}
            type="text"
            maxLength={200}
            id="inputLinhaDeCuidado"
            style={{ width: '100%', paddingLeft: 5 }}
          ></input>
          <button className="green-button"
            onClick={() => {
              if (document.getElementById("inputLinhaDeCuidado").value == '') {
                toast(1, '#e74c3c', 'CAMPO OBRIGATÓRIO EM BRANCO.', 3000);
              } else {
                insertOpcaoLinhaDeCuidado()
              }
            }}
            style={{ margin: 5, marginRight: 0 }}
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
          </button>
        </div>
      </div>
    )
  };
  // funções para inserção e exclusão de linhas de cuidado.
  const insertOpcaoLinhaDeCuidado = () => {
    var linha = document.getElementById("inputLinhaDeCuidado").value.toUpperCase();
    var obj = {
      linhadecuidado: linha
    }
    axios.post(htmlinsertopcaolinhadecuidado, obj).then(() => {
      toast(1, '#52be80', 'LINHA DE CUIDADO CADASTRADA COM SUCESSO.', 3000);
      loadOpcoesLinhasDeCuidado();
    })
  }
  const deleteOpcaoLinhaDeCuidado = (item) => {
    axios.get(htmldeleteopcaolinhadecuidado + item.id).then(() => {
      toast(1, '#52be80', 'LINHA DE CUIDADO EXCLUÍDA COM SUCESSO.', 3000);
      loadOpcoesLinhasDeCuidado();
    });
  }

  // EDITAR OPÇÕES DE OBJETIVOS.
  // componente para manejo dos objetivos primários.
  const [viewopcoesobjetivosprimarios, setviewopcoesobjetivosprimarios] = useState(0);
  var pickobjetivoprimario = 0;
  function OpcoesObjetivosPrimarios() {
    return (
      <div style={{ display: viewopcoesobjetivosprimarios == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2center">OBJETIVOS PRIMÁRIOS</div>
        <div id="LISTA DE OPÇÕES DE OBJETIVOS PRIMÁRIOS."
          className="scroll"
          style={{
            display: 'flex', minHeight: 200, height: 200, width: '100%',
            margin: 5,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {opcoesobjetivos.sort((a, b) => a.objetivo > b.objetivo ? 1 : -1).filter(item => item.tipo == 1).map((item) => (
            <div className="row"
              key={item.id}
              id="item da lista"
            >
              <div
                ID={"item objetivoprimario" + item.id}
                style={{ width: '100%', padding: 5 }}
                className="blue-button"
                onClick={() => {
                  var botoes = document.getElementById("LISTA DE OPÇÕES DE OBJETIVOS PRIMÁRIOS.").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("item objetivoprimario" + item.id).className = "red-button";
                  pickobjetivoprimario = item.id
                }}
              >
                {item.objetivo}
              </div>
              <button
                style={{ display: vieweditor == 2 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={(e) => { deleteOpcaoObjetivo(item); e.stopPropagation() }}
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
            </div>
          ))}
        </div>
        <div id="INPUT PARA INSERIR OBJETIVO PRIMÁRIO."
          style={{ display: vieweditor == 2 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
        >
          <input
            autoComplete="off"
            className="input"
            placeholder="INSERIR OBJETIVO PRIMÁRIO..."
            onFocus={(e) => {
              (e.target.placeholder = '');
            }}
            onBlur={(e) => (e.target.placeholder = 'INSERIR OBJETIVO PRIMÁRIO...')}
            title={"INSIRA AQUI O NOVO OBJETIVO PRIMÁRIO"}
            type="text"
            maxLength={200}
            id="inputNovoObjetivoPrimario"
            style={{ width: '100%', paddingLeft: 5 }}
          ></input>
          <button className="green-button"
            onClick={() => {
              if (document.getElementById("inputNovoObjetivoPrimario").value == '') {
                toast(1, '#e74c3c', 'CAMPO OBRIGATÓRIO EM BRANCO.', 3000);
              } else if (picklinhadecuidado == 0) {
                toast(1, '#e74c3c', 'SELECIONE A LINHA DE CUIDADO PARA VINCULÇÃO DO OBJETIVO PRIMÁRIO.', 3000);
              } else {
                insertOpcaoObjetivo(1);
              }
            }}
            style={{ margin: 5, marginRight: 0 }}
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
          </button>
        </div>
      </div>
    )
  };
  // componente para manejo dos objetivos secundários.
  const [viewopcoesobjetivossecundarios, setviewopcoesobjetivossecundarios] = useState(0);

  var pickobjetivosecundario = 0;
  function OpcoesObjetivosSecundarios() {
    return (
      <div style={{ display: viewopcoesobjetivossecundarios == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <div className="title2center">{vieweditor == 3 ? 'OBJETIVOS SECUNDÁRIOS' : 'SELECIONE UM OBJETIVO SECUNDÁRIO'}</div>
        <input
          autoComplete="off"
          className="input"
          placeholder="BUSCAR..."
          style={{ alignSelf: 'center', width: '80%' }}
          onFocus={(e) => {
            (e.target.placeholder = '');
          }}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
          onChange={() => filterObjetivo('inputOpcoesObjetivo')}
          title={"BUSCAR OBJETIVO SECUNDÁRIO."}
          type="text"
          maxLength={200}
          id="inputOpcoesObjetivo"
        ></input>
        <div id="LISTA DE OPÇÕES DE OBJETIVOS SECUNDÁRIOS."
          className="scroll"
          style={{
            display: 'flex', minHeight: 200, height: 200, width: '100%',
            margin: 5,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {arrayopcoesobjetivos.sort((a, b) => a.objetivo > b.objetivo ? 1 : -1).filter(item => item.tipo == 2).map((item) => (
            <div className="row"
              key={item.id}
              id="item da lista"
            >
              <div
                id={"item objetivosecundario" + item.id}
                style={{ width: '100%', padding: 5 }}
                className={idobjetivo == item.id ? "red-button" : "blue-button"}
                onClick={() => {
                  var botoes = document.getElementById("LISTA DE OPÇÕES DE OBJETIVOS SECUNDÁRIOS.").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("item objetivosecundario" + item.id).className = "red-button";
                  pickobjetivosecundario = item.id;
                }}
              >
                {item.objetivo}
              </div>
              <button
                style={{ display: vieweditor == 3 ? 'flex' : 'none' }}
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={(e) => { deleteOpcaoObjetivo(item); e.stopPropagation() }}
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
            </div>
          ))}
        </div>
        <div id="INPUT PARA INSERIR OBJETIVO SECUNDÁRIO."
          style={{ display: vieweditor == 3 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
        >
          <input
            autoComplete="off"
            className="input"
            placeholder="INSERIR OBJETIVO SECUNDÁRIO..."
            onFocus={(e) => {
              (e.target.placeholder = '');
            }}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
            title={"INSIRA AQUI O NOVO OBJETIVO SECUNDÁRIO"}
            type="text"
            maxLength={200}
            id="inputNovoObjetivoSecundario"
            style={{ width: '100%', marginleft: 5 }}
          ></input>
          <button className="green-button"
            onClick={() => {
              if (document.getElementById("inputNovoObjetivoSecundario").value == '') {
                toast(1, '#e74c3c', 'CAMPO OBRIGATÓRIO EM BRANCO.', 3000);
              } else {
                insertOpcaoObjetivo(2)
              }
            }}
            style={{ margin: 5, marginRight: 0 }}
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
          </button>
        </div>
      </div>
    )
  };
  // funções para inserção e exclusão de opções de objetivos.
  const insertOpcaoObjetivo = (tipo) => {
    var objetivoprimario = document.getElementById("inputNovoObjetivoPrimario").value.toUpperCase();
    var objetivosecundario = document.getElementById("inputNovoObjetivoSecundario").value.toUpperCase();
    var obj = {
      objetivo: tipo == 1 ? objetivoprimario : objetivosecundario,
      tipo: tipo,
      id_linhadecuidado: tipo == 1 ? picklinhadecuidado : null, // id da opção de linha de cuidado selecionada.
      escala: 0,
      dimensao: 0, // futura implementação...
      justificativa: null
    }
    axios.post(htmlinsertopcaoobjetivo, obj).then(() => {
      toast(1, '#52be80', 'OPÇÃO DE OBJETIVO CADASTRADA COM SUCESSO.', 3000);
      loadOpcoesObjetivos();
    })
  }

  const deleteOpcaoObjetivo = (item) => {
    axios.get(htmldeleteopcaoobjetivo + item.id).then(() => {
      toast(1, '#52be80', 'OBJETIVO EXCLUÍDO COM SUCESSO.', 3000);
      loadOpcoesObjetivos();
    });
  }

  // SELETOR DE CATEGORIA PROFISSIONAL (usados para inserir metas e métodos de avaliação).
  const [viewopcoesmetas, setviewopcoesmetas] = useState(0);
  const [viewcategoriaprofissional, setviewcategoriaprofissional] = useState(0);
  const [pickcategoriaprofissional, setpickcategoriaprofissional] = useState(0);
  function OpcoesCategoriaProfissional() {
    const [localpickcategoriaprofissional, setlocalpickcategoriaprofissional] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: viewcategoriaprofissional == 1 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center',
          marginTop: vieweditor == 5 ? 10 : '',
        }}>
          <div id="opções de categoria profissional"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
            {listcategoriaprofissional.map(item => (
              <button
                id={"profissional" + item.id}
                className={localpickcategoriaprofissional == item.id ? 'red-button' : 'blue-button'}
                style={{ padding: 5, width: 200 }}
                onClick={() => {
                  setpickcategoriaprofissional(item.id);
                  setlocalpickcategoriaprofissional(item.id);
                  /*
                  setTimeout(() => {
                    var botoes = document.getElementById("opções de categoria profissional").getElementsByClassName("red-button");
                    for (var i = 0; i < botoes.length; i++) {
                      botoes.item(i).className = "blue-button";
                    }
                    document.getElementById("profissional" + item.id).className = "red-button";
                  }, 500);
                  */
                }}
              >
                {item.nome}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: viewopcoesmetas == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="title2center">{vieweditor == 4 ? 'METAS' : 'SELECIONE UMA META'}</div>
          <div id="LISTA DE METAS CADASTRADAS."
            className="scroll"
            style={{
              display: 'flex',
              minHeight: 200, height: 200,
              width: '100%',
              margin: 5,
              backgroundColor: "#f2f2f2", borderColor: '#f2f2f2',
            }}>
            {arrayopcoesmetas.filter(valor => valor.idespecialidade == localpickcategoriaprofissional).sort((a, b) => a.meta > b.meta ? 1 : -1).map((item) => (
              <div className="row"
                onClick={() => {
                  var botoes = document.getElementById("LISTA DE METAS CADASTRADAS.").getElementsByClassName("red-button");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "blue-button";
                  }
                  document.getElementById("item meta" + item.id).className = "red-button";
                  pickmeta = item.id;
                }}
              >
                <div id={"item meta" + item.id}
                  className="blue-button"
                  style={{ width: '100%' }}>{item.meta}</div>
                <div className="blue-button"
                  style={{
                    width: 200,
                    backgroundColor: arraycategoriaprofissional.filter(value => value.id == item.idespecialidade).map(item => item.cor)
                  }}>
                  {
                    item.idespecialidade == 8 ? 'MÉDICO' :
                      item.idespecialidade == 4 ? 'ENFERMEIRO' :
                        item.idespecialidade == 32 ? 'FARMÁCIA' :
                          item.idespecialidade == 5 ? 'FISIOTERAPIA' :
                            item.idespecialidade == 6 ? 'FONOAUDIOLOGIA' :
                              item.idespecialidade == 10 ? 'PSICOLOGIA' :
                                item.idespecialidade == 1 ? 'SERVIÇO SOCIAL' :
                                  item.idespecialidade == 11 ? 'TERAPIA OCUPACIONAL' :
                                    item.idespecialidade == 9 ? 'NUTRIÇÃO CLÍNICA' : ''
                  }</div>
                <button
                  style={{ display: vieweditor == 4 ? 'flex' : 'none' }}
                  className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                  onClick={(e) => { deleteOpcaoMeta(item); e.stopPropagation() }}
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
              </div>
            ))}
          </div>
          <div id="INPUT PARA INSERIR META."
            style={{ display: vieweditor == 4 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
          >
            <input
              autoComplete="off"
              className="input"
              placeholder="INSERIR META..."
              onFocus={(e) => {
                (e.target.placeholder = '');
              }}
              onBlur={(e) => (e.target.placeholder = 'INSERIR META...')}
              title={"INSIRA AQUI A NOVA META"}
              type="text"
              maxLength={200}
              id="inputNovaMeta"
              style={{ width: '100%', margin: 5, marginRight: 0 }}
            ></input>
            <button className="green-button"
              style={{ margin: 5 }}
              onMouseEnter={() => setpickcategoriaprofissional(localpickcategoriaprofissional)}
              onClick={() => {
                if (document.getElementById("inputNovaMeta").value == '') {
                  toast(1, '#e74c3c', 'CAMPO OBRIGATÓRIO EM BRANCO.', 3000);
                } else if (pickobjetivosecundario == 0) {
                  toast(1, '#e74c3c', 'SELECIONE UM OBJETIVO SECUNDÁRIO PARA VINCULAR A META.', 3000);
                } else if (pickcategoriaprofissional == 0) {
                  toast(1, '#e74c3c', 'SELECIONE UMA CATEGORIA PROFISSIONAL PARA VINCULAR A META.', 3000);
                } else {
                  insertOpcaoMeta(localpickcategoriaprofissional);
                }
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
            </button>
          </div>
        </div>
      </div>
    )
  };

  // EDITAR OPÇÕES DE METAS (exige a renderização do componente para objetivos secundários e categoria profissional).
  // componente para metas.
  var pickmeta = 0;

  // funções para inserir ou excluir opção de meta.
  const deleteOpcaoMeta = (item) => {
    axios.get(htmldeleteopcaometa + item.id).then(() => {
      toast(1, '#52be80', 'META EXCLUÍDA COM SUCESSO.', 3000);
      loadOpcoesMetas();
    });
  }
  const insertOpcaoMeta = (categoria) => {
    var meta = document.getElementById("inputNovaMeta").value.toUpperCase();
    var obj = {
      meta: meta,
      idespecialidade: categoria,
      id_objetivo: pickobjetivosecundario,
      prazo: 15,
      status: 1,
      justificativa: '-X-'
    }
    // alert(JSON.stringify(obj));
    axios.post(htmlinsertopcaometa, obj).then(() => {
      toast(1, '#52be80', 'META CADASTRADA PARA O OBJETIVO SECUNDÁRIO.', 3000);
      loadOpcoesMetas();
    })
  }

  // EDITAR OPÇÕES DE MÉTODOS DE AVALIAÇÃO.
  // carregar escalas disponíveis (substrato para as opções de métodos de avaliação, tabela escala).
  const loadOpcoesMetodos = () => {
    axios.get(htmllistopcaometodo).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistopcoesmetodos(x.rows);
    });
  }
  // opções de métodos de avaliação associados a metas (tabela planoterapeutico_mensuracao).
  var htmllistopcaometodopt = process.env.REACT_APP_API_CLONE_LISTOPCAOMETODO;
  const loadOpcoesMetodosPt = () => {
    axios.get(htmllistopcaometodopt).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistopcoesmetodospt(x.rows);
    });
  }
  // funções para inserir ou excluir opção de método de avaliação.
  const deleteOpcaoMetodo = (item) => {
    axios.get(htmldeleteopcaometodo + item.id).then(() => {
      toast(1, '#52be80', 'MÉTODO DE AVALIAÇÃO EXCLUÍDO COM SUCESSO.', 3000);
      loadOpcoesMetodos();
      loadOpcoesMetodosPt();
      loadOpcoesEscalas();
    });
  }
  const insertOpcaoMetodo = (metodo) => {
    var obj = {
      id_meta: pickmeta,
      metodo: metodo,
      idespecialidade: pickcategoriaprofissional,
    }
    axios.post(htmlinsertopcaometodo, obj).then(() => {
      toast(1, '#52be80', 'MÉTODO CADASTRADO PARA A META SELECIONADA.', 3000);
      loadOpcoesMetodos();
      loadOpcoesMetodosPt();
      loadOpcoesEscalas();
    })
  }
  // lista de opções de métodos cadastrados para cada meta.
  const [viewopcoesmetodos, setviewopcoesmetodos] = useState(0);
  function OpcoesMetodosDeAvaliacao() {
    return (
      <div style={{ display: viewopcoesmetodos == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2center">MÉTODOS DE AVALIAÇÃO JÁ VINCULADOS A METAS</div>
        <div id="LISTA DE MÉTODOS DE AVALIAÇÃO CADASTRADOS."
          className="scroll"
          style={{
            display: 'flex',
            minHeight: 200, height: 200,
            width: '100%',
            margin: 5,
            backgroundColor: "#f2f2f2", borderColor: '#f2f2f2',
          }}>
          {listopcoesmetodospt.sort((a, b) => a.metodo > b.metodo ? 1 : -1).map((item) => (
            <div className="row"
              key={item.id}
              id="item da lista"
            >
              <div className="blue-button"
                style={{ width: 250 }}>{item.metodo}
              </div>
              <div className="blue-button"
                style={{ width: '100%' }}>{opcoesmetas.filter(valor => valor.id == item.id_meta).map(item => item.meta)}
              </div>
              <div className="blue-button"
                style={{
                  width: 250,
                  backgroundColor: arraycategoriaprofissional.filter(valor => valor.id == parseInt(item.idespecialidade)).map(valor => valor.cor)
                }}
              >
                {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome)}
              </div>
              <button
                className={window.innerWidth < 426 ? 'red-button' : "animated-red-button"}
                onClick={(e) => { deleteOpcaoMetodo(item); e.stopPropagation() }}
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
            </div>
          ))}
        </div>
      </div>
    )
  }
  // componente para inserir método.
  function SeletorMetodosDeAvaliacao() {
    return (
      <div style={{ display: viewopcoesmetodos == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2center">
          {'MÉTODOS DE AVALIAÇÃO'}
        </div>
        <div
          id="SCROLL COM OPÇÕES DE MÉTODO DE AVALIAÇÃO (ESCALAS)"
          className="scroll"
          style={{
            display: 'flex',
            minHeight: 200, height: 200, width: '100%', margin: 5, flexDirection: 'row', justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {opcoesescalas.map(item => (
            <button className="blue-button"
              style={{ width: 200, maxWidth: 200, padding: 5 }}
              onClick={() => insertOpcaoMetodo(item.ds_escala)}>
              {item.ds_escala}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const GerirOpcoes = useCallback(() => {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewgerirplano(0); e.stopPropagation() }}
        style={{
          display: viewgerirplano == 0 ? 'none' : 'flex',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer" style={{ width: '80vw' }}>
          <div id="cabeçalho" className="cabecalho">
            <div>{'EDITOR DO PLANO TERAPÊUTICO'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setviewgerirplano(0)}>
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
            </div>
          </div>
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <div className="scroll" style={{ backgroundColor: '#ffffff', borderColor: '#ffffff', height: '80vh' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <SeletorDeTarefas></SeletorDeTarefas>
                  <OpcoesLinhasDeCuidado></OpcoesLinhasDeCuidado>
                  <OpcoesObjetivosPrimarios></OpcoesObjetivosPrimarios>
                  <OpcoesObjetivosSecundarios></OpcoesObjetivosSecundarios>
                  <OpcoesCategoriaProfissional></OpcoesCategoriaProfissional>
                  <OpcoesMetodosDeAvaliacao></OpcoesMetodosDeAvaliacao>
                  <SeletorMetodosDeAvaliacao></SeletorMetodosDeAvaliacao>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
    [
      viewgerirplano, vieweditor,
      viewopcoeslinhasdecuidado, arraylinhasdecuidado,
      viewopcoesobjetivosprimarios, viewopcoesobjetivossecundarios, opcoesobjetivos,
      viewopcoesmetas, opcoesmetas,
      viewopcoesmetodos, listopcoesmetodos,
      arrayopcoesobjetivos,
    ]
  );

  return (
    <div style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', height: '100%',
      // width: window.innerWidth < 1024 ? '65vw' : window.innerWidth < 400 ? '100vw' : '82vw',
      width: '100vw', opacity: 1,
    }}>
      <Busy></Busy>
      <ViewObjetivo></ViewObjetivo>
      <ViewMeta></ViewMeta>
      <AlertasPlanoTerapeutico></AlertasPlanoTerapeutico>
      <div
        id="scroll"
        className="scroll"
        style={{
          scrollBehavior: 'smooth',
          width: '100%',
          height: '80vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          alignSelf: 'center', verticalAlign: 'center',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingRight: 10, opacity: 1,
        }}>
        <LinhaDeCuidados></LinhaDeCuidados>
        <PlanoTerapeutico></PlanoTerapeutico>
        <div id="conteúdo plano terapêutico"
          style={{
            display: planoterapeutico.length > 0 ? 'flex' : 'none',
            flexDirection: window.innerWidth < 426 ? 'column' : 'row',
            justifyContent: 'center', alignSelf: 'center',
            height: window.innerWidth < 426 ? '' : '75vh', width: '100%',
          }}>
          <div id="objetivos secundários"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              alignSelf: window.innerWidth < 426 ? 'center' : '',
              height: '75vh', width: window.innerWidth < 426 ? 'calc(100vw - 30px)' : '30vw', margin: 5,
            }}>
            <div className="title4">{'OBJETIVOS SECUNDÁRIOS'}</div>
            <ScrollObjetivos></ScrollObjetivos>
          </div>
          <div id="metas"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center',
              justifyContent: window.innerWidth < 426 ? 'flex-start' : 'center',
              height: window.innerWidth < 426 ? '' : '80vh',
              width: window.innerWidth < 426 ? 'calc(100vw - 30px)' : '65vw',
              marginLeft: 5,
              marginRight: 5
            }}>
            <div id="título das metas."
              className="title4"
              style={{ fontSize: 16, marginTop: 10, width: '100%', alignContent: 'center', alignItems: 'center' }}>
              METAS POR CATEGORIA PROFISSIONAL
            </div>
            <CategoriaSelector></CategoriaSelector>
            <MetodosAndMetas></MetodosAndMetas>
          </div>
        </div>
        <ViewProfissionalSelector></ViewProfissionalSelector>
        <ModalPlanoTerapeutico></ModalPlanoTerapeutico>
        <GerirOpcoes></GerirOpcoes>
        <JustificaObjetivoPrimario></JustificaObjetivoPrimario>
        <JustificaObjetivoSecundario></JustificaObjetivoSecundario>
        <div
          style={{
            display: valortoast == 1 ? 'flex' : 'none', position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0, zIndex: 99
          }}>
          <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        </div>
      </div>
    </div>
  )
}

export default AptPlanoTerapeutico;