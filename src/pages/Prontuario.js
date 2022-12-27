/* eslint eqeqeq: "off" */
// importando bibliotecas.
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { Link } from 'react-router-dom';
// importando css.
import '../design.css';
// importando imagens.
import LogoInverted from '../components/LogoInverted';
import logoff from '../images/power.svg';
import back from '../images/back.svg';
import foto from '../images/3x4.jpg';
import info from '../images/info.svg';
import lupabranca from '../images/lupabranca.svg';
// importando componentes de sobreposição.
import EscalasAssistenciais from '../pages/EscalasAssistenciais';
import Toast from '../components/Toast';
import DatePicker from '../components/DatePicker';

// componentes do Paulo de Tarso (APT).
import AptPlanoTerapeutico from '../components/AptPlanoTerapeutico';
import AptResumoPlanoTerapeutico from '../components/AptResumoPlanoTerapeutico';

function Prontuario() {
  moment.locale('pt-br');

  // recuperando estados globais (Context.API).
  const {
    idunidade,
    // idusuario, // id string na tabela MV. Ex.: MASTER.GHAP
    iduser, // id numérica na tabela personas, do GPulse (postgres). Ex.: 1
    personas,
    nomeusuario,
    nomeunidade,
    tipounidade,
    setlistescalas,
    setarraylistescalas,
    // todos os leitos e atendimentos.
    todospacientes,
    todosatendimentos,
    sethistoricoatendimentos,
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
    setidatendimentoghap,

    stateprontuario,
    setstateprontuario,
    // APT IVCF / curva de Moraes.
    setlinhadecuidado,
    linhadecuidadoatual, setlinhadecuidadoatual,
    setidlinhadecuidado,

    // documentos especiais (estruturados).
    setconselho,

    // plano terapêutico.
    setplanoterapeutico,
    setdatainicioplanoterapeutico,
    setstatusplanoterapeutico,
    setobjetivos,
    setidplanoterapeutico,
    setmetas,
    setlinhasdecuidado,
    setlastplanoterapeutico,
  } = useContext(Context)

  useEffect(() => {
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
    // eslint-disable-next-line
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
  const [contato, setcontato] = useState('');
  const [endereço, setendereço] = useState('');

  const loadPaciente = (valor) => {
    var paciente = [0, 1]
    paciente = todospacientes.filter(value => value.codigo_paciente == valor)
    setnomepaciente(todospacientes.filter(value => value.codigo_paciente == valor).map(item => item.nome_paciente))
    setnomemae(paciente.map(item => item.nome_mae_paciente))
    // eslint-disable-next-line
    setcontato("(" + paciente.map(item => item.nr_ddd_celular) + ") " + paciente.map(item => item.nr_celular) + ") / " + "(" + paciente.map(item => item.nr_ddd_fone) + ") " + paciente.map(item => item.nr_fone));
    setendereço(paciente.map(item => item.ds_endereco) + ', Nº ' + paciente.map(item => item.nr_endereco) + ', ' + paciente.map(item => item.ds_complemento) + ', BAIRRO ' + paciente.map(item => item.nm_bairro) + ', CIDADE: ' + paciente.map(item => item.nm_cidade) + ' - CEP: ' + paciente.map(item => item.nr_cep));
    setdn(moment(paciente.map(item => item.data_nascimento_paciente), 'YYYY-MM-DD').format('DD/MM/YYYY'));
    setidade(moment().diff(moment(dn), 'DD/MM/YYYY'), 'years');
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
  const loadAtendimento = (valor) => {
    var atendimento = [0, 1]
    atendimento = todosatendimentos.filter(value => value.cd_paciente == valor)
    setbox(atendimento.map(item => item.Leito.descricao));

    // após recuperar os dados de atendimento do MV, criar um atendimento no banco Ghap, se não existente.
    setTimeout(() => {
      createAtendimentoGhap();
    }, 2000);
  }

  // calculando idade em anos e dias de internação.
  const [idade, setidade] = useState(0);

  // eslint-disable-next-line
  const [users, setusers] = useState([0, 1]);
  // eslint-disable-next-line
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
            }}
          >
            {item.nome}
          </div>
        ))}
      </div>
    )
    // eslint-disable-next-line
  }, [stateprontuario, arraycategoriaprofissional]);

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

  // LISTA DE ESCALAS.
  const loadEscalas = () => {
    axios.get(htmlghapescalas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setarraylistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setloadprincipal(0);
    });
  }

  // API RODRIGO (BANCO DE DADOS POSTGRE GHAP).
  var htmlghapatendimentos = process.env.REACT_APP_API_CLONE_ATENDIMENTOS;
  var htmlghapinsertatendimento = process.env.REACT_APP_API_CLONE_INSERTATENDIMENTO;
  var htmlghapescalas = process.env.REACT_APP_API_CLONE_ESCALAS;

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


  // LINHAS DE CUIDADO.
  var htmllinhasdecuidado = process.env.REACT_APP_API_CLONE_LINHASDECUIDADO;

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
    loadLinhasDeCuidado();
    loadEscalas();
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0);
    // fechando as visualizações das telas secundárias (melhor aproximação até o momento).
    // carregando a tela principal.
    setstateprontuario(21);
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

  // IDENTIFICAÇÃO DO PACIENTE.
  const [showdetalhes, setshowdetalhes] = useState(0);
  function Paciente() {
    return (
      <div
        id="identificação"
        className="paciente"
        style={{
          height: window.innerWidth < 426 ? 150 : '',
          minHeight: window.innerWidth < 426 ? 150 : ''
        }}
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
                    {window.innerWidth < 426 ? nomepaciente + ', ' + idade + ' ANOS' : nomepaciente}
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
                    <DetalhesPaciente></DetalhesPaciente>
                  </div>
                </div>
                <div id="idade, tempo de internação e linha de cuidado."
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 5, width: '100%' }}>
                  <div
                    className="rowitem"
                    style={{
                      display: window.innerWidth < 426 ? 'none' : 'flex',
                      flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                      justifyContent: window.innerWidth < 426 ? 'center' : 'flex-start',
                      alignContent: 'center',
                      margin: 2.5,
                      padding: 0,
                      color: '#ffffff',
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
                <div id="botões de ação do cabeçalho (mobile)."
                  style={{
                    display: window.innerWidth > 425 ? 'none' : 'flex',
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
        <div id="identificação do usuário e botões de ação do cabeçalho (desktop)."
          style={{
            display: window.innerWidth > 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            margin: 10,
          }}
        >
          <div id="identificação do usuário logado."
            className="title2"
            title={'ID DO USUÁRIO: ' + iduser}
            style={{ color: '#ffffff', textAlign: 'right', width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}
          >
            {'OLÁ, ' + JSON.stringify(nomeusuario).substring(1, JSON.stringify(nomeusuario).length - 2).split(" ").slice(0, 1)}
          </div>
          <div id="botões de ação do cabeçalho."
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <div
              className={stateprontuario == 21 ? 'grey-button' : 'red-button'}
              title='RESUMO DO PLANO TERAPÊUTICO.'
              onClick={stateprontuario == 31 ? () => setstateprontuario(21) : () => setstateprontuario(31)}
              style={{
                display: 'flex',
                bottom: 20, left: 20,
              }}>
              <img
                alt=""
                src={lupabranca}
                style={{
                  display: 'flex',
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
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