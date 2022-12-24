/* eslint eqeqeq: "off" */

// importando bibliotecas.
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
// importando css.
import '../design.css';
// importando imagens.
import body from '../images/body.svg';
import refresh from '../images/refresh.svg';
import alert from '../images/alert.svg';
import alertgreen from '../images/alertgreen.svg';
import calendario from '../images/calendario.svg';
import dorso from '../images/dorso.svg';
import Logo from '../components/Logo';
import LogoInverted from '../components/LogoInverted';
import newlogo from '../images/newlogo.svg';
import historico from '../images/historico.svg'
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import assinar from '../images/assinar.svg';
import copiar from '../images/copiar.svg';
import invasoes from '../images/invasoes.svg';
import curativo from '../images/curativo.svg';
import settingsimg from '../images/settings.svg'
import viewimage from '../images/viewimage.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';
import menu from '../images/menu.svg';
import microfone from '../images/microfone.svg';
import logoff from '../images/power.svg';
import back from '../images/back.svg';
import foto from '../images/3x4.jpg';
import clock from '../images/clock.svg';
import info from '../images/info.svg';
import leito0 from '../images/leito0.svg';
import leito30 from '../images/leito30.svg';
import leito90 from '../images/leito90.svg';
import fowler from '../images/leitofowler.svg';
import lupa from '../images/lupa.svg';
// importando componentes de sobreposição.
import EscalasAssistenciais from '../pages/EscalasAssistenciais';
import Toast from '../components/Toast';
import DatePicker from '../components/DatePicker';
import AlertasPlanoTerapeutico from '../components/AlertasPlanoTerapeutico';

// importando gráficos.
import { Line, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-style';

// componentes do Paulo de Tarso (APT).
import AptPlanoTerapeutico from '../components/AptPlanoTerapeutico';
import AptResumoPlanoTerapeutico from '../components/AptResumoPlanoTerapeutico';

function Prontuario() {
  moment.locale('pt-br');
  // var html = 'https://pulsarapp-server.herokuapp.com';
  var htmldadosvitais = process.env.REACT_APP_API_FILTRADADOSVITAIS;
  var htmlbalancohidrico = process.env.REACT_APP_API_BALANCOHIDRICO;

  // recuperando estados globais (Context.API).
  const {
    idunidade,
    idusuario, // id string na tabela MV. Ex.: MASTER.GHAP
    iduser, // id numérica na tabela personas, do GPulse (postgres). Ex.: 1
    personas,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    boss_settings_usuario,
    boss_planoterapeutico_usuario,
    nomehospital,
    nomeunidade,
    tipounidade,
    listescalas, setlistescalas,
    arraylistescalas, setarraylistescalas,
    // atendimento e paciente.
    setdadospaciente, dadospaciente,
    // todos os leitos e atendimentos.
    todosleitos,
    todospacientes,
    todosatendimentos,
    historicoatendimentos, sethistoricoatendimentos,
    // atendimento.
    setidatendimento,
    idatendimento,
    convenio, setconvenio,
    datainternacao, setdatainternacao,
    setidpaciente,
    idpaciente,
    nomepaciente, setnomepaciente,
    nomemae, setnomemae,
    dn, setdn,
    box, setbox,
    idatendimentoghap, setidatendimentoghap,
    antecedentes, medprev, exprev, hda, alergias,
    setantecedentes, setmedprev, setexprev, sethda, setalergias,

    stateprontuario,
    setstateprontuario,
    scrolllist, setscrolllist,
    scrollmenu, setscrollmenu,
    // listas.
    listevolucoes, setlistevolucoes,
    arrayevolucao, setarrayevolucao,
    listghapevolucoes, setlistghapevolucoes,
    arraylistghapevolucoes, setarraylistghapevolucoes,
    listdiagnosticos, setlistdiagnosticos,
    arraydiagnosticos, setarraydiagnosticos,
    listproblemas, setlistproblemas,
    arrayproblemas, setarrayproblemas,
    listpropostas, setlistpropostas,
    arraypropostas, setarraypropostas,
    listinterconsultas, setlistinterconsultas,
    arrayinterconsultas, setarrayinterconsultas,
    listlaboratorio, setlistlaboratorio,
    arraylaboratorio, setarraylaboratorio,
    listimagem, setlistimagem,
    arrayimagem, setarrayimagem,
    listbalancos, setlistbalancos,
    listformularios, setlistformularios,
    arrayformularios, setarrayformularios,
    // settings:
    viewsettings, setviewsettings,
    settings, setsettings,
    // menu principal.
    menuevolucoes, setmenuevolucoes,
    menudiagnosticos, setmenudiagnosticos,
    menuproblemas, setmenuproblemas,
    menupropostas, setmenupropostas,
    menuinterconsultas, setmenuinterconsultas,
    menulaboratorio, setmenulaboratorio,
    menuimagem, setmenuimagem,
    menuprescricao, setmenuprescricao,
    menuformularios, setmenuformularios,
    // cards.
    cardinvasoes, setcardinvasoes,
    cardlesoes, setcardlesoes,
    cardstatus, setcardstatus,
    cardalertas, setcardalertas,
    cardprecaucao, setcardprecaucao,
    cardriscosassistenciais, setcardriscosassistenciais,
    carddiasinternacao, setcarddiasinternacao,
    cardultimaevolucao, setcardultimaevolucao,
    carddiagnosticos, setcarddiagnosticos,
    cardhistoricoatb, setcardhistoricoatb,
    cardhistoricoatendimentos, setcardhistoricoatendimentos,
    cardanamnese, setcardanamnese,
    // colorcheme.
    schemecolor, setschemecolor,
    // APT IVCF / curva de Moraes.
    ivcf, setivcf,
    setrefreshatendimentos, refreshatendimentos,
    linhadecuidado, setlinhadecuidado,
    linhadecuidadoatual, setlinhadecuidadoatual,
    idlinhadecuidado, setidlinhadecuidado,
    // escalas.
    showescala, setshowescala,

    // documentos especiais (estruturados).
    viewdocumento, setviewdocumento,
    viewpdf, setviewpdf,
    viewdatadocumento, setviewdatadocumento,
    conselho, setconselho,
    tipodocumento, settipodocumento,
    iddocumento, setiddocumento,
    usuariodocumento, setusuariodocumento,
    statusdocumento, setstatusdocumento,
    viewconteudo, setviewconteudo,
    datadocumento, setdatadocumento,

    // assinatura digital / certificado digital.
    signature, setsignature,

    // cid 10.
    listcid, setlistcid,
    arraylistcid, setarraylistcid,

    viewdatepicker, setviewdatepicker,
    pickdate1, setpickdate1,
    pickdate2, setpickdate2,

    // plano terapêutico.
    setplanoterapeutico,
    setdatainicioplanoterapeutico,
    setstatusplanoterapeutico,
    objetivos, setobjetivos,
    idplanoterapeutico, setidplanoterapeutico,
    metas, setmetas,
    opcoeslinhasdecuidado, setopcoeslinhasdecuidado,
    linhasdecuidado, setlinhasdecuidado,
    opcoesobjetivos,
    hide, sethide,
    lastplanoterapeutico, setlastplanoterapeutico,
    setselectedobjetivosecundario,
    setselectedobjetivo,
    opcoesmetas,
    setviewjustificaobjetivoprimario,

  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  var htmlghapcid = process.env.REACT_APP_API_CLONE_CID;
  const getCid = () => {
    console.log('CID10: ' + document.getElementById("inputCid10").value)
    axios.get(htmlghapcid + document.getElementById("inputCid10").value).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistcid(x.rows);
      setarraylistcid(x.rows);
    });
  }

  useEffect(() => {
    /* 
    para exibir o componente de prescrição do pulsos...
    <Prescricao newprescricao={newprescricao}></Prescricao>
    */
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
    setarraycategoriaprofissional(listcategoriaprofissional);
    carga();
    setusers(personas);
    setTimeout(() => {
      loadPlanosTerapeuticos();
      loadObjetivos();
      loadMetas();
      setstateprontuario(21);
    }, 3000);
    // alert(JSON.stringify(personas));
  }, [idpaciente]);

  var htmlplanosterapeuticos = process.env.REACT_APP_API_CLONE_PLANOSTERAPEUTICOS;
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

  var htmlobjetivos = process.env.REACT_APP_API_CLONE_OBJETIVOS;
  const loadObjetivos = () => {
    axios.get(htmlobjetivos + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setobjetivos(x.rows);
    });
  }

  var htmlmetas = process.env.REACT_APP_API_CLONE_METAS;
  const loadMetas = () => {
    axios.get(htmlmetas + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setmetas(x.rows);
    });
  }

  // estados relacionados ao paciente e seu atendimento.
  const [peso, setpeso] = useState('');
  const [altura, setaltura] = useState('');
  const [admissao, setadmissao] = useState('');
  const [diagnosticoprincipal, setdiagnosticoprincipal] = useState('');
  const [status, setstatus] = useState(0);
  const [ativo, setativo] = useState('');
  var statusatendimento = 0;
  const [classificacao, setclassificacao] = useState('');
  const [descritor, setdescritor] = useState('');
  const [precaucao, setprecaucao] = useState(0);
  const [assistente, setassistente] = useState('SEM MÉDICO ASSISTENTE');

  // carregando os dados do paciente.
  const [listpacientes, setlistpacientes] = useState([]);
  const [contato, setcontato] = useState('');
  const [endereço, setendereço] = useState('');

  const loadPaciente = (valor) => {
    var paciente = [0, 1]
    paciente = todospacientes.filter(value => value.codigo_paciente == valor)
    setnomepaciente(todospacientes.filter(value => value.codigo_paciente == valor).map(item => item.nome_paciente))
    setnomemae(paciente.map(item => item.nome_mae_paciente))
    setcontato("(" + paciente.map(item => item.nr_ddd_celular) + ") " + paciente.map(item => item.nr_celular) + ") / " + "(" + paciente.map(item => item.nr_ddd_fone) + ") " + paciente.map(item => item.nr_fone));
    setendereço(paciente.map(item => item.ds_endereco) + ', Nº ' + paciente.map(item => item.nr_endereco) + ', ' + paciente.map(item => item.ds_complemento) + ', BAIRRO ' + paciente.map(item => item.nm_bairro) + ', CIDADE: ' + paciente.map(item => item.nm_cidade) + ' - CEP: ' + paciente.map(item => item.nr_cep));
    setdn(moment(paciente.map(item => item.data_nascimento_paciente), 'YYYY-MM-DD').format('DD/MM/YYYY'));
    setidade(moment().diff(moment(dn), 'DD/MM/YYYY'), 'years');
    // alert(dn);
  }

  // carregando o histórico de atendimentos do paciente.
  var htmlhistoricodeatendimentos = process.env.REACT_APP_API_HISTORICODEATENDIMENTOS;
  // const [historicodeatendimentos, sethistoricodeatendimentos] = useState([0, 1]);
  const loadHistoricoDeAtendimentos = () => {
    axios.get(htmlhistoricodeatendimentos + idpaciente).then((response) => {
      var x = [0, 1]
      x = response.data;
      sethistoricoatendimentos(x);
    });
  }

  // carregando o atendimento do paciente selecionado.
  const [listatendimentos, setlistatendimentos] = useState([]);
  const loadAtendimento = (valor) => {
    var atendimento = [0, 1]
    atendimento = todosatendimentos.filter(value => value.cd_paciente == valor)
    setbox(atendimento.map(item => item.Leito.descricao));
    setdiasinternado(moment().diff(moment(atendimento.map(item => item.dt_hr_atendimento), 'YYYY/MM/DD'), 'days'));
    setadmissao(atendimento.map(item => moment(item.dt_hr_atendimento)));
    setantecedentes(antecedentes);
    var ciddiagnostico = atendimento.map(item => item.cd_cid);
    var descricaodiagnostico = atendimento.map(item => item.ds_cid);
    setdiagnosticoprincipal(ciddiagnostico + ' - ' + descricaodiagnostico + '...');

    // após recuperar os dados de atendimento do MV, criar um atendimento no banco Ghap, se não existente.
    setTimeout(() => {
      createAtendimentoGhap();
    }, 2000);
  }

  // calculando idade em anos e dias de internação.
  const [idade, setidade] = useState(0);
  const [diasinternado, setdiasinternado] = useState(0);

  // estados relacionados à evolução.
  const [dataevolucao, setdataevolucao] = useState('');
  const [evolucao, setevolucao] = useState('');
  const [pas, setpas] = useState('');
  const [pad, setpad] = useState('');
  const [fc, setfc] = useState('');
  const [fr, setfr] = useState('');
  const [sao2, setsao2] = useState('');
  const [tax, settax] = useState('');
  const [diu, setdiu] = useState('');
  const [fezes, setfezes] = useState('');
  const [bh, setbh] = useState('');
  const [acv, setacv] = useState('');
  const [ar, setar] = useState('');
  const [abdome, setabdome] = useState('');
  const [outros, setoutros] = useState('');
  const [glasgow, setglasgow] = useState('');
  const [rass, setrass] = useState('');
  const [ramsay, setramsay] = useState('');
  const [hd, sethd] = useState(0);
  const [uf, setuf] = useState(0);
  const [heparina, setheparina] = useState(0);
  const [braden, setbraden] = useState(0);
  const [morse, setmorse] = useState(0);

  var timeout = null;

  const [users, setusers] = useState([0, 1]);
  const [selectedcategoria, setselectedcategoria] = useState(0);
  const [arraycategoriaprofissional, setarraycategoriaprofissional] = useState([]);

  const CategoriaSelector = useCallback(() => {
    return (
      <div id="scroll das categorias profissionais."
        className="scroll"
        style={{
          display: stateprontuario == 2 ? 'flex' : 'none',
          alignSelf: 'center',
          scrollBehavior: 'smooth', flexDirection: 'row', justifyContent: 'flex-start',
          overflowY: 'hidden', overflowX: 'scroll',
          width: 'calc(80vw)', margin: 0, marginTop: 10, marginBottom: 0, padding: 0, height: 90, minHeight: 90, maxHeight: 90,
          backgroundColor: '#ffffff', borderColor: '#ffffff',
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
            }}
          >
            {item.nome}
          </div>
        ))}
      </div>
    )
  }, [stateprontuario, arraycategoriaprofissional]);

  // filtros para seleção de profissionais (evoluções).
  //filtro das listas de evoluções.
  const [filterregistrointerdisciplinar, setfilterregistrointerdisciplinar] = useState('');
  var searchregistro = '';
  var timeout = null;

  // função que impede a assinatura de registros por outro profissional.
  const denied = () => {
    toast(1, '#ec7063', 'AÇÃO NÃO AUTORIZADA.', 3000);
  }

  // plano terapêutico.
  const ShowPlanoTerapeutico = useCallback(() => {
    if (stateprontuario === 21) {
      return (
        <div id="ivcf"
          className="conteudo" style={{ margin: 0, padding: 0 }}>
          <AptPlanoTerapeutico></AptPlanoTerapeutico>
        </div>
      )
    } else {
      return null;
    }
  }, [stateprontuario]);

  // plano terapêutico.
  const ShowResumoPlanoTerapeutico = useCallback(() => {
    if (stateprontuario === 31) {
      return (
        <div id="ivcf"
          className="conteudo" style={{ margin: 0, padding: 0 }}>
          <AptResumoPlanoTerapeutico></AptResumoPlanoTerapeutico>
        </div>
      )
    } else {
      return null;
    }
  }, [stateprontuario]);

  // ESCALAS.
  var effectColors = {
    highlight: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    glow: 'rgb(255, 255, 0)'
  };

  // LISTA DE ESCALAS.
  // carregando as opções de escalas.
  const [opcoesescalas, setopcoesescalas] = useState([]);
  const loadOpcoesEscalas = () => {
    axios.get(htmlghapopcoesescalas).then((response) => {
      var x = [];
      x = response.data;
      setopcoesescalas(x.rows);
    })
  }

  const loadEscalas = () => {
    axios.get(htmlghapescalas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setarraylistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setloadprincipal(0);
    });
  }

  // atualizando ou suspendendo uma escala.
  const updateEscala = (item, valor) => {
    var obj = {
      idpct: item.idpct,
      idatendimento: item.idatendimento,
      data: item.data,
      cd_escala: item.cd_escala,
      ds_escala: item.ds_escala,
      valor_resultado: item.valor_resultado,
      ds_resultado: item.ds_resultado,
      idprofissional: item.idprofissional,
      status: 2 // escala suspensa.
    };
    axios.post(htmlghapupdateescala + item.id, obj).then(() => {
      toast(1, '#52be80', 'REGISTRO DE ESCALA CANCELADO COM SUCESSO.', 3000);
      loadEscalas();
    });
  }

  const [viewescalapps, setviewescalapps] = useState(0);
  const [viewescalamif, setviewescalamif] = useState(0);
  const [viewescalaivcf, setviewescalaivcf] = useState(0);

  const ShowEscalas = useCallback(() => {
    if (stateprontuario == 20) {
      return (
        <div className="scroll" style={{ height: '80vh', padding: 10, backgroundColor: 'transparent', borderColor: 'transparent' }}>
          {opcoesescalas.map(item => (
            <div className="card"
              style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', padding: 10,
              }}>
              <div style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start', alignItems: 'flex-start', verticalAlign: 'flex-start',
                alignContent: 'flex-start', height: '100%', width: '12vw',
              }}>
                <button
                  className="blue-button"
                  style={{ width: '12vw', minWidth: '12vw', height: '12vw', minHeight: '12vw', alignSelf: 'flex-start' }}
                  onClick={() => setshowescala(item.cd_escala)}
                >
                  {item.ds_escala}
                </button>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                width: window.innerWidth < 1000 ? '50vw' : '60vw',
              }}>
                <div id="GRÁFICO"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: window.innerWidth < 1000 ? '50vw' : '60vw',
                    padding: 10
                  }}>
                  <Line
                    // ref={myChartRef}
                    data={{
                      labels:
                        window.innerWidth > 1000 ?
                          arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                            .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-5)
                            .map(item => moment(item.data).format('DD/MM'))
                          :
                          arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                            .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-2)
                            .map(item => moment(item.data).format('DD/MM')),
                      datasets: [
                        {
                          data:
                            window.innerWidth > 1000 ?
                              arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                                .sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).slice(-5)
                                .map(item => item.valor_resultado)
                              :
                              arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                                .sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).slice(-5)
                                .map(item => item.valor_resultado),
                          // label: arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala).map(item => moment(item.data).format('DD/MM/YY')),
                          borderColor: '#BB8FCE',
                          pointBackgroundColor: '#BB8FCE',
                          fill: 'false'
                        },
                      ],
                    }}
                    plugins={ChartDataLabels}
                    width="400"
                    height="100"
                    options={{
                      layout: {
                        padding: {
                          left: 0,
                          right: 4,
                          top: 0,
                          bottom: 0
                        }
                      },
                      scales: {
                        xAxes: [
                          {
                            display: true,
                            ticks: {
                              fontSize: 10,
                              width: 50,
                              padding: 10,
                              display: true,
                              fontColor: '#61636e',
                              fontWeight: 'bold',
                            },
                            gridLines: {
                              tickMarkLength: false,
                              zeroLineColor: 'transparent',
                              lineWidth: 1,
                              drawOnChartArea: true,
                            },
                          },
                        ],
                        yAxes: [
                          {
                            display: true,
                            ticks: {
                              padding: 10,
                              fontSize: 10,
                              display: true,
                              suggestedMin: 0,
                              suggestedMax:
                                item.cd_escala == 1 ? 23 :
                                  item.cd_escala == 2 ? 125 :
                                    item.cd_escala == 3 ? 5 :
                                      item.cd_escala == 4 ? 7 :
                                        item.cd_escala == 5 ? 10 :
                                          item.cd_escala == 6 ? 100 :
                                            item.cd_escala == 7 ? 10 :
                                              100,
                              fontColor: '#61636e',
                              fontWeight: 'bold',
                            },
                            gridLines: {
                              tickMarkLength: false,
                              zeroLineColor: 'transparent',
                              lineWidth: 1,
                              drawOnChartArea: true,
                            },
                          },
                        ],
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                          color: '#ffffff',
                          font: {
                            weight: 'bold',
                            size: 16,
                          },
                        },
                      },
                      tooltips: {
                        enabled: true,
                        displayColors: false,
                      },
                      hover: { mode: null },
                      elements: {},
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                        text: 'PPS',
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                        align: 'start'
                      },
                      maintainAspectRatio: true,
                      responsive: true,
                    }}
                  />
                </div>
                <div id="CARDS COM VALORES"
                  className="scroll"
                  style={{
                    display: arraylistescalas.filter(value => value.cd_escala == item.cd_escala).length > 0 ? 'flex' : 'none',
                    overflowX: 'scroll', overflowY: 'hidden', flexDirection: 'row', justifyContent: 'flex-start',
                    width: window.innerWidth < 1000 ? '50vw' : '60vw',
                    backgroundColor: "#F2F2F2", borderColor: '#F2F2F2', padding: 10, paddingLeft: 5,
                  }}>
                  {arraylistescalas.filter(value => value.cd_escala == item.cd_escala)
                    .sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1)
                    .map(item => (
                      <div
                        key={item.id}
                        id="item da lista"
                        className="row"
                        title={item.ds_resultado}
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          position: 'relative', opacity: item.status == 2 ? 0.5 : 1,
                          minWidth: 120,
                          width: 120, height: 120,
                          backgroundColor: 'lightgray'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute', bottom: 5, right: 5, display: 'flex',
                            flexDirection: 'row', justifyContent: 'center',
                            display: item.status == 2 ? 'none' : 'flex'
                          }}>
                          <button
                            id={"deletekey 0 " + item.id}
                            className="animated-red-button"
                            style={{ display: item.status == 2 ? 'none' : 'flex' }}
                            onClick={(e) => { deletetoast(updateEscala, item); e.stopPropagation() }}
                          >
                            <img
                              alt=""
                              src={deletar}
                              style={{
                                display: 'flex',
                                margin: 10,
                                height: 30,
                                width: 30,
                              }}
                            ></img>
                          </button>
                          <button
                            id={"deletekey 1 " + item.id}
                            style={{ display: 'none', width: 100 }}
                            className="animated-red-button"
                            onClick={(e) => { deletetoast(updateEscala, item); e.stopPropagation() }}
                          >
                            <div>DESFAZER</div>
                            <div className="deletetoast"
                              style={{
                                height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                                marginLeft: 5, marginRight: 5, maxWidth: 90,
                              }}>
                            </div>
                          </button>
                        </div>
                        <div className="title2center" style={{ fontWeight: 'bold', margin: 2.5, padding: 0 }}>{moment(item.data).format('DD/MM/YY')}</div>
                        <div className="title2center" style={{ fontSize: 22, margin: 2.5, padding: 0 }}>{item.valor_resultado}</div>
                        <div
                          title={item.ds_resultado}
                          className="title2center"
                          style={{ fontSize: 12, margin: 2.5, padding: 0 }}>
                          {JSON.stringify(item.ds_resultado).length > 20 ? item.ds_resultado.toString().substring(0, 15) + '...' : item.ds_resultado}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    } else {
      return null;
    }
  }, [stateprontuario, listescalas, arraylistescalas])

  const [viewupdateatendimento, setviewupdateatendimento] = useState(0);
  const [viewevolucao, setviewevolucao] = useState(0);
  const [viewbalanco, setviewbalanco] = useState(0);
  const [viewprintevolucao, setviewprintevolucao] = useState(0);
  const [viewformulario, setviewformulario] = useState(0);

  const [atendimento, setatendimento] = useState([]);

  // API FELIPE (BANCO MV).
  var html_mv_alergias = process.env.REACT_APP_API_TODASALERGIAS;

  // API RODRIGO (BANCO DE DADOS POSTGRE GHAP).
  var htmlghapatendimentos = process.env.REACT_APP_API_CLONE_ATENDIMENTOS;
  var htmlghapinsertatendimento = process.env.REACT_APP_API_CLONE_INSERTATENDIMENTO;

  var htmlghapprecaucoesoptions = process.env.REACT_APP_API_CLONE_PRECAUCOESOPTIONS;
  var htmlghapprecaucoes = process.env.REACT_APP_API_CLONE_PRECAUCOES;
  var htmlghapinsertprecaucao = process.env.REACT_APP_API_CLONE_INSERTPRECAUCAO;
  var htmlghapupdateprecaucao = process.env.REACT_APP_API_CLONE_UPDATEPRECAUCAO;

  var htmlghapalergias = process.env.REACT_APP_API_CLONE_ALERGIAS;
  var htmlghapinsertalergia = process.env.REACT_APP_API_CLONE_INSERTALERGIA;
  var htmlghapupdatealergia = process.env.REACT_APP_API_CLONE_UPDATEALERGIA;

  var htmlghapcid = process.env.REACT_APP_API_CLONE_CID;
  var htmlghapdiagnosticos = process.env.REACT_APP_API_CLONE_DIAGNOSTICOS;
  var htmlghapinsertdiagnostico = process.env.REACT_APP_API_CLONE_INSERTDIAGNOSTICO;
  var htmlghapupdatediagnostico = process.env.REACT_APP_API_CLONE_UPDATEDIAGNOSTICO;

  var htmlghappropostas = process.env.REACT_APP_API_CLONE_PROPOSTAS;
  var htmlghapinsertproposta = process.env.REACT_APP_API_CLONE_INSERTPROPOSTA;
  var htmlghapupdateproposta = process.env.REACT_APP_API_CLONE_UPDATEPROPOSTA;

  var htmlghapdietas = process.env.REACT_APP_API_CLONE_DIETAS;
  var htmlghapinsertdieta = process.env.REACT_APP_API_CLONE_INSERTPROPOSTA;
  var htmlghapupdatedieta = process.env.REACT_APP_API_CLONE_UPDATEPROPOSTA;

  var htmlghapinvasoes = process.env.REACT_APP_API_CLONE_INVASOES;
  var htmlghapinsertinvasao = process.env.REACT_APP_API_CLONE_INSERTINVASAO;
  var htmlghapupdateinvasao = process.env.REACT_APP_API_CLONE_UPDATEINVASAO;

  var htmlghaplesoes = process.env.REACT_APP_API_CLONE_LESOES;
  var htmlghapinsertlesao = process.env.REACT_APP_API_CLONE_INSERTLESAO;
  var htmlghapupdatelesao = process.env.REACT_APP_API_CLONE_UPDATELESAO;

  var htmlghapinterconsultas = process.env.REACT_APP_API_CLONE_INTERCONSULTAS;
  var htmlghapinsertinterconsulta = process.env.REACT_APP_API_CLONE_INSERTINTERCONSULTA;
  var htmlghapupdateinterconsulta = process.env.REACT_APP_API_CLONE_UPDATEINTERCONSULTA;
  var htmlghapdeleteinterconsulta = process.env.REACT_APP_API_CLONE_DELETEINTERCONSULTA;

  var htmlghapescalas = process.env.REACT_APP_API_CLONE_ESCALAS;
  var htmlghapopcoesescalas = process.env.REACT_APP_API_CLONE_OPCOES_ESCALAS;
  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  var htmlghapupdateescala = process.env.REACT_APP_API_CLONE_UPDATEESCALA;
  var htmlghapdeleteescala = process.env.REACT_APP_API_CLONE_DELETEESCALA;

  // ATENDIMENTO.
  // retornando atendimentos.
  const getAtendimentoGhap = () => {
    axios.get(htmlghapatendimentos).then((response) => {
      console.log('CARREGADO O ATENDIMENTO NO BANCO GHAP...')
      var x = [0, 1];
      x = response.data;
      var y = [0, 1];
      y = x.rows.filter(item => item.idatendimento == idatendimento);
      // alert(JSON.stringify(y));
      setidatendimentoghap(y.map(item => item.id));
      setantecedentes(y.map(item => item.ap));
      setmedprev(y.map(item => item.medprev));
      setexprev(y.map(item => item.exprev));
      sethda(y.map(item => item.hda));
      setloadprincipal(0);
    });
  }

  // criando o atendimento no banco de dados Ghap, em correspondência com o MV, caso ainda não exista.
  const createAtendimentoGhap = () => {
    console.log('INICIANDO VERIFICAÇÃO DE ATENDIMENTO NO BANCO GHAP...')
    axios.get(htmlghapatendimentos).then((response) => {
      console.log('VERIFICANDO ATENDIMENTO NO BANCO GHAP...')
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      if (y.filter(item => item.idatendimento == idatendimento).length > 0) {
        console.log('RECUPERANDO ATENDIMENTO NO BANCO GHAP...')
        // recuperando os dados de atendimento gHap.
        // getAtendimentoGhap();
        y = x.rows.filter(item => item.idatendimento == idatendimento);
        // alert(JSON.stringify(y));
        setidatendimentoghap(y.filter(item => item.idatendimento == idatendimento).map(item => item.id));
        setantecedentes(y.filter(item => item.idatendimento == idatendimento).map(item => item.ap));
        setmedprev(y.filter(item => item.idatendimento == idatendimento).map(item => item.medprev));
        setexprev(y.filter(item => item.idatendimento == idatendimento).map(item => item.exprev));
        sethda(y.filter(item => item.idatendimento == idatendimento).map(item => item.hda));
        setloadprincipal(0);
      } else {
        // clonando um atendimento do MV.
        console.log('CLONANDO ATENDIMENTO NO BANCO GHAP...')
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          datainicio: todosatendimentos.filter(value => value.cd_paciente == idpaciente).map(item => item.dt_hr_atendimento).pop(),
          datatermino: null,
          ap: 'INSERIR ANTECEDENTES PESSOAIS.',
          medprev: 'INSERIR MEDICAÇÕES DE USO PRÉVIO.',
          exprev: 'INSERIR EXAMES PRÉVIOS RELEVANTES.',
          hda: 'INSERIR HISTÓRIA DA DOENÇA ATUAL.'
        }
        // alert(JSON.stringify(obj));
        axios.post(htmlghapinsertatendimento, obj).then(() => {
          console.log('CARREGANDO ATENDIMENTO NO BANCO GHAP...')
          getAtendimentoGhap();
        });
      };
    });
  }


  // PRECAUÇÕES (ATENDIMENTO).
  // carregar precaucoes do paciente.
  const [ghapglobalprecaucoes, setghapglobalprecaucoes] = useState([]);
  const getGlobalPrecaucoesGhap = () => {
    axios.get(htmlghapprecaucoes + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setghapglobalprecaucoes(x.rows);
    });
  }

  var htmllinhasdecuidado = process.env.REACT_APP_API_CLONE_LINHASDECUIDADO;
  var htmlopcoeslinhasdecuidado = process.env.REACT_APP_API_CLONE_OPCOES_LINHAS_DE_CUIDADO
  const loadOpcoesLinhasDeCuidado = () => {
    axios.get(htmlopcoeslinhasdecuidado).then((response) => {
      var x = [0, 1];
      x = response.data;
      setopcoeslinhasdecuidado(x.rows);
      console.log("#################" + JSON.stringify(x.rows));
    });
  }

  const loadLinhasDeCuidado = () => {
    axios.get(htmllinhasdecuidado + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      var z = [0, 1];
      x = response.data;
      y = x.rows;
      z = y.filter(item => item.datatermino == null);
      if (z.length > 0) {
        // alert('JÁ EXISTE: ' + linhadecuidado);
        setlinhasdecuidado(z);
        setlinhadecuidado(z.map(item => item.var_linhadecuidado).pop());
        setidlinhadecuidado(z.map(item => item.id_linhadecuidado).pop());
        setlinhadecuidadoatual(z.map(item => item.var_linhadecuidado).pop());
      } else {
        setlinhadecuidado('DEFINIR LINHA DE CUIDADO');
        setlinhadecuidadoatual('DEFINIR LINHA DE CUIDADO');
      }
      // resgatando último registro de linha de cuidado ativo para o atendimento.

    });
  }

  const carga = () => {
    // carregando dados do paciente e de seu atendimento.
    setloadprincipal(1);
    loadPaciente(idpaciente);
    loadAtendimento(idpaciente);
    loadHistoricoDeAtendimentos();
    // carregando plano.
    loadOpcoesLinhasDeCuidado();
    loadLinhasDeCuidado();
    loadEscalas();
    setrefreshatendimentos(0);
    setivcf(7);
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0);
    // fechando as visualizações das telas secundárias (melhor aproximação até o momento).
    // carregando a tela principal.
    setstateprontuario(21);
    // resetando estado das scrolls.
    setscrollmenu(0);
  }

  const cargaantiga = (idatendimento) => {
    // limpando alertas.
    // carregando dados do paciente e de seu atendimento.
    setloadprincipal(1);
    // loadPaciente(idpaciente);
    loadAtendimentoAntigo(idatendimento);
    loadHistoricoDeAtendimentos();
    loadLinhasDeCuidado();
    loadEscalas();
    // loadMedicacoesEspeciais();
    setrefreshatendimentos(0);
    setivcf(7);
    setstateprontuario(21);

    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0);
    // fechando as visualizações das telas secundárias (melhor aproximação até o momento).
    setviewsettings(0);
    setviewevolucao(0);
    setviewprintevolucao(0);

    // resetando estado das scrolls.
    setscrollmenu(0);
  }

  const loadAtendimentoAntigo = (idatendimento) => {
    var atendimento = historicoatendimentos.filter(item => item.cd_atendimento == idatendimento);
    // alert(JSON.stringify(atendimento));
    setdiasinternado(moment(atendimento.map(item => item.dt_hr_alta)).diff(moment(atendimento.map(item => item.dt_hr_atendimento), 'YYYY/MM/DD'), 'days'));
    setadmissao(atendimento.map(item => moment(item.dt_hr_atendimento)));
    setantecedentes(antecedentes);
    var ciddiagnostico = atendimento.map(item => item.cd_cid);
    var descricaodiagnostico = atendimento.map(item => item.ds_cid);
    setdiagnosticoprincipal(ciddiagnostico + ' - ' + descricaodiagnostico + '...');
  }


  // animação para carregamento da tela principal.
  const [loadprincipal, setloadprincipal] = useState(1);
  const LoadPrincipal = useCallback(() => {
    return (
      <div id="loadprincipal"
        // className="conteudo"
        className="fade-in"
        style={{
          display: loadprincipal == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba( 255, 255, 255, 1)', opacity: 1, borderRadius: 0, zIndex: 999, margin: 0,
          alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
        }}>
        <div className="pulsarlogo" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <LogoInverted height={100} width={100}></LogoInverted>
        </div>
      </div>
    )
  }, [loadprincipal]);

  // HISTÓRICO DE PACIENTES.
  const [datatermino, setdatatermino] = useState(null);
  function HistoricoDeAtendimentos() {
    return (
      <div
        id="historicodeatendimentos"
        className="scrollhorizontal">
        <div className="buttons">
          {historicoatendimentos.map(item => (
            <div
              onClick={() => {
                setidatendimento(item.cd_atendimento);
                setdatainternacao(item.dt_hr_atendimento);
                setdatatermino(item.dt_hr_alta);
                if (item.dt_hr_alta != null) {
                  cargaantiga(item.cd_atendimento);
                  // alert('CARGA ANTIGA');
                } else {
                  carga();
                  // alert('CARGA NOVA');
                }
              }}
              className={idatendimento == item.cd_atendimento ? "red-button" : "blue-button"} style={{ padding: 10 }}>
              {moment(item.dt_hr_atendimento).format('DD/MM/YY')}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // IDENTIFICAÇÃO DO PACIENTE.
  const [showdetalhes, setshowdetalhes] = useState(0);
  function Paciente() {
    return (
      <div
        id="identificação"
        className="paciente"
        style={{ height: window.innerWidth < 426 ? 150 : '', minHeight: 150 }}
      >
        <div id="IDENTIFICAÇÃO" style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100vw',

        }}>
          <img
            alt=""
            src={foto}
            style={{
              height: window.innerWidth < 426 ? 100 : '80%',
              padding: 0,
              margin: 5,
              marginLeft: 10,
              borderRadius: 5,
            }}
          ></img>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'left',
              width: '100%'
            }}>
              <button
                className="grey-button"
                style={{
                  display: tipounidade != 4 ? 'flex' : 'none',
                  textTransform: 'uppercase',
                  width: 80,
                  minWidth: 80,
                  height: 80,
                  minHeight: 80,
                  marginRight: 5, marginLeft: 10,
                  backgroundColor: 'grey'
                }}
                id="inputBox"
                title={"BOX"}
              >
                {box}
              </button>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: window.innerWidth < 426 ? 'center' : 'left',
                  width: '100%'
                }}>
                <div style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                  justifyContent: window.innerWidth < 426 ? 'column' : 'flex-start',
                  verticalAlign: 'center', width: '100%'
                }}>
                  <button
                    className="rowitem"
                    style={{
                      marginLeft: tipounidade != 4 ? 0 : 5,
                      marginRight: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                      color: '#ffffff',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontSize: window.innerWidth > 400 ? 18 : 14,
                    }}
                    id="inputNome"
                  >
                    {nomepaciente}
                  </button>
                  <div style={{ display: 'flex', felxDirection: 'row', justifyContent: 'flex-start', position: 'relative' }}>
                    <img id="info"
                      // onMouseOver={() => document.getElementById("info").style.opacity = 1}
                      onClick={(e) => {
                        setshowdetalhes(1);
                        e.stopPropagation();
                      }}
                      alt=""
                      src={info}
                      title="INFORMAÇÕES DO PACIENTE"
                      style={{
                        position: 'relative',
                        height: 20,
                        padding: 0,
                        margin: 5, marginTop: 6,
                        borderRadius: 5,
                        opacity: 0.8
                      }}
                    >
                    </img>
                    <img id="btnhistoricodeatendimentos"
                      onClick={() => document.getElementById("historicodeatendimentos").classList.toggle("scrollhorizontalhover")}
                      alt=""
                      title="HISTÓRICO DE ATENDIMENTOS"
                      src={historico}
                      style={{
                        display: window.innerWidth < 426 ? 'none' : 'flex',
                        position: 'relative',
                        height: 20,
                        padding: 0,
                        margin: 5, marginTop: 6,
                        borderRadius: 5,
                        opacity: 0.8
                      }}
                    >
                    </img>
                    <DetalhesPaciente></DetalhesPaciente>
                  </div>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 5, width: '100%' }}>
                  <div id="bomba"
                    className="rowitem"
                    style={{
                      display: window.innerWidth < 426 ? 'none' : 'flex',
                      flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                      justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start',
                      alignContent: 'center',
                      margin: 2.5,
                      padding: 0,
                      color: '#ffffff',
                      justifyContent: 'row',
                      alignItems: window.innerWidth < 426 ? 'center' : 'flex-start',
                      alignSelf: window.innerWidth < 426 ? 'center' : 'flex-start',
                    }}
                  >
                    <div id="idade">
                      {moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') < 2 ? + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANO' : moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
                    </div>
                    <div id="separador - bolinha 1"
                      style={{ marginLeft: 15, marginRight: 15 }}>
                      {'•'}
                    </div>
                    <div id="tempo de internação"
                      title="TEMPO DE INTERNAÇÃO (DIAS)"
                      style={{
                        display: window.innerWidth < 426 ? 'none' : 'flex',
                        color:
                          moment().diff(moment(datainternacao), 'days') < 31 ? "#52be80" :
                            moment().diff(moment(datainternacao), 'days') > 30 && moment().diff(moment(datainternacao), 'days') < 60 ? "yellow" :
                              "#ec7063",
                      }}
                    >
                      {moment().diff(moment(datainternacao), 'days') > 1 ? moment().diff(moment(datainternacao), 'days') + ' DIAS DE INTERNAÇÃO.' : moment().diff(moment(datainternacao), 'days') + ' DIA DE INTERNAÇÃO.'}
                    </div>
                    <div id="separador - bolinha 1"
                      style={{ display: window.innerWidth < 426 ? 'none' : 'flex', marginLeft: 15, marginRight: 15 }}>
                      {'•'}
                    </div>
                    <div
                      title="linha de cuidado"
                      style={{
                        color:
                          linhadecuidadoatual == 'PACIENTE CRÔNICO' ? "#52be80" : linhadecuidadoatual == 'REABILITAÇÃO' ? "#5499C7" : linhadecuidadoatual == 'PALIATIVO' ? "#D88900" : "#ec7063",
                      }}
                    >
                      {linhadecuidadoatual}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: window.innerWidth > 400 ? 'none' : 'flex',
                    bottom: 10, right: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end', marginRight: 5,
                  }}
                >
                  <Link
                    to={"/todospacientes"}
                    className="grey-button"
                    title="VOLTAR."
                    style={{
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={back}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                  <Link
                    to="/"
                    className="grey-button"
                    title="FAZER LOGOFF."
                    style={{
                      display: 'flex',
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={logoff}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            // width: '30vw',
            display: window.innerWidth > 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            margin: 10,
          }}
        >
          <div
            className="title2"
            title={'ID DO USUÁRIO: ' + iduser}
            style={{ color: '#ffffff', textAlign: 'right', width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}
          >
            {'OLÁ, ' + JSON.stringify(nomeusuario).substring(1, JSON.stringify(nomeusuario).length - 2).split(" ").slice(0, 1)}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Link
              to={"/todospacientes"}
              className="grey-button"
              title="VOLTAR."
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={back}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
            <Link
              to="/"
              className="grey-button"
              title="FAZER LOGOFF."
              style={{
                display: 'flex',
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={logoff}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  function DetalhesPaciente() {
    return (
      <div className="detalhes fade-in"
        onClick={(e) => { setshowdetalhes(0); e.stopPropagation() }}
        onMouseLeave={() => setshowdetalhes(0)}
        style={{
          display: showdetalhes == 1 ? 'flex' : 'none',
        }}
      >
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'PRONTUÁRIO: ' + idpaciente}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'ATENDIMENTO: ' + idatendimento}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'DATA DA INTERNAÇÃO: ' + moment(datainternacao).format('DD/MM/YY - HH:MM')}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'CONVÊNIO: ' + convenio}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'DN: ' + dn}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'NOME DA MÃE: ' + nomemae}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'CONTATO: ' + contato}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'ENDEREÇO: ' + endereço}</div>
      </div>
    )
  }


  // PAINEL PRINCIPAL.
  function Principal() {
    if (stateprontuario === 1) {
      return (
        <div id="painel principal"
          className="scroll"
          style={{
            scrollBehavior: 'smooth',
            alignItems: 'center', flexDirection: 'row', backgroundColor: 'transparent',
            borderColor: 'transparent',
            flexWrap: 'wrap', justifyContent: 'space-evenly'
          }}
        >
          <AlertasPlanoTerapeutico></AlertasPlanoTerapeutico>
        </div>
      );
    } else {
      return null;
    }
  }


  // limpando filtros...
  const cleanFilters = () => {
    setfilterregistrointerdisciplinar('');
  }

  // modulando as animações css para os menus (trabalhoso, mas faz toda a dierença).
  const setActive = (btn, btnAdd) => {
    var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    var addBotoes = document.getElementById("MENU LATERAL").getElementsByClassName("animated-red-button");
    for (var i = 0; i < addBotoes.length; i++) {
      addBotoes.item(i).className = "animated-blue-button";
    }
    document.getElementById(btn).className = "red-button"
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

  // SIDEBAR
  const showSideBar = (e) => {
    if (e.pageX < 20) {
      document.getElementById("sidebar").className = "pacientes-menu-in";
    }
  }
  // selecionando um paciente da lista e atualizando a tela corrida.
  const [cd_atendimento, setcd_atendimento] = useState();
  const selectPaciente = (item) => {
    setidpaciente(item.cd_paciente);
    setidatendimento(item.cd_atendimento);
    setconvenio(item.nm_convenio);
    setdatainternacao(item.dt_hr_atendimento);
    carga();

  };
  // SIDEBAR ANIMADA COM LISTA DE PACIENTES.
  function SideBar() {
    return (
      <div
        id="sidebar"
        className="pacientes-menu-out"
        onMouseOver={() => document.getElementById("sidebar").className = "pacientes-menu-in"}
        onMouseOut={() => document.getElementById("sidebar").className = "pacientes-menu-out"}
        style={{
          display: idunidade != 0 && window.innerWidth > 800 ? 'flex' : 'none',
          width: window.innerWidth > 1000 ? '35vw' : '50vw',
          minWidth: window.innerWidth > 1000 ? '35vw' : '50vw',
          position: 'absolute',
          padding: 10, paddingLeft: 0,
          zIndex: 50,
        }
        }>
        <div
          className="widget"
          style={{
            flexDirection: 'column', justifyContent: 'center', margin: 0,
            borderRadius: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            width: '100%',
            height: '100%',
            padding: 10, paddingLeft: 0,
            boxShadow: '0px 2px 10px 5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="title2" style={{ color: "#ffffff" }}>{nomeunidade != undefined ? 'LISTA DE PACIENTES:  ' + nomeunidade : 'LISTA DE PACIENTES'}</div>
          <div className="scroll"
            style={{
              backgroundColor: 'white',
              height: '80vh', width: '100%',
              justifyContent: 'flex-start', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 7.5
            }}>
            {todosatendimentos.filter(item => item.Leito.unidade.id == idunidade).sort(((a, b) => a.Leito.descricao > b.Leito.descricao ? 1 : -1)).map(item => (
              <div
                key={item.id}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <button className="grey-button"
                  style={{ backgroundColor: 'grey', minWidth: 80, width: 80, marginRight: 10, display: item.box !== '' ? 'flex' : 'none' }}>
                  {item.Leito.descricao}
                </button>
                <button
                  onClick={() => selectPaciente(item)}
                  className='blue-button'
                  title={
                    'STATUS: ' +
                    item.status +
                    '. CLIQUE PARA EVOLUIR.'
                  }
                  style={{
                    padding: 10,
                    margin: 2.5,
                    width: '100%',
                    height: 50,
                  }}
                >
                  {item.nm_paciente}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }

  // const [viewdeletetoast, setviewdeletetoast] = useState(0);
  var timeout = null;
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

  // RENDERIZAÇÃO DO COMPONENTE PRONTUÁRIO.
  return (
    <div
      className="main fade-in"
      id="PRINCIPAL"
      onMouseMove={(e) => { showSideBar(e) }}
    >
      <LoadPrincipal></LoadPrincipal>
      <div id="POPUPS">
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <DatePicker></DatePicker>
      </div>

      <div id="PRONTUÁRIO"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: window.innerHeight,
          width: window.innerWidth,
        }}>
        <div id="LISTAS"
          className="prontuario"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
            height: window.innerHeight,
            padding: 0,
            margin: 0,
          }}>
          <Paciente></Paciente>
          <HistoricoDeAtendimentos></HistoricoDeAtendimentos>
          <ShowPlanoTerapeutico></ShowPlanoTerapeutico>
          <ShowResumoPlanoTerapeutico></ShowResumoPlanoTerapeutico>
          <CategoriaSelector></CategoriaSelector>
          <EscalasAssistenciais></EscalasAssistenciais>
        </div>
        <SideBar></SideBar>
      </div>
    </div >
  );
}

export default Prontuario;