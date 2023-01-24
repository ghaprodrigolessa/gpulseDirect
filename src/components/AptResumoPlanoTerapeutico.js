/* eslint eqeqeq: "off" */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { Doughnut } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import flag from '../images/flag.svg';
import plano_ativo from '../images/plano_ativo.svg';
import plano_cancelado from '../images/plano_cancelado.svg';
import plano_fracassado from '../images/plano_fracassado.svg';
import plano_validar from '../images/plano_validar.svg';
import plano_fail from '../images/plano_fail.svg';
import refresh from '../images/refresh.svg';
import restart from '../images/restart.svg';
import Toast from './Toast';

// import setaesquerda from '../images/arrowleft.svg';
// import setadireita from '../images/arrowright.svg';

function ResumoAptPlanoTerapeutico() {
  // recuperando estados globais (Context.API).
  const {
    tipousuario,
    idatendimento,
    planoterapeutico, setplanoterapeutico,
    linhadecuidado, setlinhadecuidado,
    setdatainicioplanoterapeutico,
  } = useContext(Context)

  var htmllinhasdecuidado = process.env.REACT_APP_API_CLONE_LINHASDECUIDADO;
  var htmlplanosterapeuticos = process.env.REACT_APP_API_CLONE_PLANOSTERAPEUTICOS;
  var htmlobjetivos = process.env.REACT_APP_API_CLONE_OBJETIVOS;
  var htmlmetas = process.env.REACT_APP_API_CLONE_METAS;

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
        setlinhadecuidado(z.map(item => item.var_linhadecuidado));
      } else {
        setlinhadecuidado('DEFINIR LINHA DE CUIDADO')
      }
    });
  }

  // carregando planos terapêuticos, objetivos, metas e propostas terapêuticas (intervenções) para o atendimento.
  const [idplanoterapeutico, setidplanoterapeutico] = useState(0);
  const [statusplanoterapeutico, setstatusplanoterapeutico] = useState(0);
  const loadPlanosTerapeuticos = () => {
    axios.get(htmlplanosterapeuticos + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      setplanoterapeutico(x.rows.sort((a, b) => moment(a.datainicio) > moment(b.datainicio) ? 1 : -1));
      // carregando último plano terapêutico (ativo).
      setidplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => item.id).pop()); // recuperando a id do último plano terapêutico.
      // alert('LAST ID: ' + idplanoterapeutico);
      setdatainicioplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => moment(item.datainicio).format('DD/MM/YY'))); // recuperando a data de início do último plano terapêutico.
      setstatusplanoterapeutico(y.filter(item => item.datatermino == null).slice(-1).map(item => item.status));
    });
  }
  const [objetivos, setobjetivos] = useState([]);
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
      setarraymetas(x.rows);
    });
  }

  function LinhaDeCuidados() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title4" style={{ margin: 15 }}>LINHA DE CUIDADO</div>
        <div className="blue-button">{linhadecuidado}</div>
      </div>
    )
  }

  useEffect(() => {
    // linhas de cuidado.
    loadLinhasDeCuidado();
    // planos terapêuticos.
    loadPlanosTerapeuticos();
    // objetivos e metas.
    loadObjetivos();
    loadMetas();
    // eslint-disable-next-line
  }, []);

  // PLANOS TERAPÊUTICOS.

  // lista de planos terapêuticos relativos ao paciente em atendimento (histórico).
  function ListaDePlanosTerapeuticos() {
    return (
      <div className="title3" style={{ color: '#ffffff' }}>{planoterapeutico.filter(item => item.idatendimento == idatendimento && item.datatermino == null).map(item => 'PLANO TERAPÊUTICO ' + item.id + ' - ' + moment(item.datainicio).format('DD/MM/YYYY'))}</div>
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
          padding: 5, paddingBottom: 10,
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
            <ListaDePlanosTerapeuticos></ListaDePlanosTerapeuticos>
            <div className="title2" style={{ width: '100%', justifyContent: 'flex-start', color: '#ffffff', display: planoterapeutico.filter(item => item.datatermino == null).length < 1 ? 'flex' : 'none' }}>
              {'SEM REGISTROS DE PLANO TERAPÊUTICO ATIVO PARA ESTE ATENDIMENTO.'}
            </div>
          </div>
        </div>
        <div className="title4">{'OBJETIVOS PRIMÁRIOS'}</div>
        <ObjetivosPrimarios></ObjetivosPrimarios>
        <div className="title4">{'OBJETIVOS SECUNDÁRIOS'}</div>
        <ScrollObjetivos></ScrollObjetivos>
        <div className="title4">{'METAS E MÉTODOS DE AVALIAÇÃO'}</div>
        <MetodosAndMetas></MetodosAndMetas>
      </div>
    )
  };

  // MENU DE CATEGORIAS PROFISSIONAIS.
  // 8 = médico, 4 = enfermeiro, 5 = fisioterapeuta, 6 = fono, 11 = to, 10 = psicólogo, 1 = assistente social,

  // exibição de objetivos primários e secundários.
  function ObjetivosPrimarios() {
    return (
      <div className="scroll" id="OBJETIVOS PRIMÁRIOS"
        style={{
          width: '100%', minWidth: '100%',
          height: 300,
          minHeight: 50,
          paddingRight: 12.5, paddingLeft: 10,
          backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
        }}
      >
        {objetivos.filter(item => item.tipoobjetivo == 1 && item.idplanoterapeutico == idplanoterapeutico).map(item => (
          <div id="ITEM DE OBJETIVO PRIMÁRIO" className="row"
            disabled={statusplanoterapeutico == 1 ? false : true}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
              width: window.innerWidth < 400 ? '80vw' : '100%',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 400 ? 'row' : 'column',
                width: '100%',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 10, marginRight: 10, padding: 5, marginBottom: 5 }}>
                  {item.objetivo}
                  <div style={{ display: item.justificativa != null ? 'flex' : 'none', color: '#e74c3c' }}>{'JUSTIFICATIVA: ' + item.justificativa}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div
                  className={item.statusobjetivo == 0 ? "grey-button" : item.statusobjetivo == 1 ? "blue-button" : item.statusobjetivo == 2 ? "green-button" : item.statusobjetivo == 3 ? "red-button" : "yellow-button"}
                  style={{ width: 150 }}>
                  {item.statusobjetivo == 0 ? 'INATIVO' : item.statusobjetivo == 1 ? 'ATIVO' : item.statusobjetivo == 2 ? 'SUCESSO' : item.statusobjetivo == 3 ? 'NÃO ATINGIDO' : 'CANCELADO'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // objetivos secundários.
  const ScrollObjetivos = useCallback(() => {
    return (
      <div id="scrollobjetivos" className="scroll"
        style={{
          height: 300, width: '100%', minWidth: '100%', maxWidth: '100%',
          margin: 0, marginBottom: 5, padding: 0, paddingLeft: 0, paddingRight: 15,
          backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
        }}>
        {objetivos.sort((a, b) => a.objetivo > b.objetivo).filter(item => item.tipoobjetivo == 2 && item.idplanoterapeutico == idplanoterapeutico && item.statusobjetivo == 0).sort((a, b) => a.objetivo.toString() > b.objetivo.toString() ? 1 : -1).map(item => (
          <div id={"objetivo" + item.id}
            className={"blue-button-objetivos animationobjetivos"}
            style={{
              flexDirection: 'row', justifyContent: 'center',
              width: '100%', minWidth: '100%', padding: 10,
              paddingBottom: 15,
            }}
          >
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              NÃO ATINGIDO
            </div>
            <div className='orange-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              CANCELADO
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              ATINGIDO
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
          >
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              NÃO ATINGIDO
            </div>
            <div className='orange-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              CANCELADO
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              ATINGIDO
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

          >
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              NÃO ATINGIDO
            </div>
            <div className='orange-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              CANCELADO
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              ATINGIDO
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

          >
            <div className='red-button'
              style={{ display: item.statusobjetivo == 3 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              NÃO ATINGIDO
            </div>
            <div className='orange-button'
              style={{ display: item.statusobjetivo == 4 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={item.justificativa}
            >
              CANCELADO
            </div>
            <div className='green-button'
              style={{ display: item.statusobjetivo == 2 ? 'flex' : 'none', padding: 10, marginTop: 10, marginBottom: 10 }}
              title={"OBJETIVO SECUNDÁRIO ATINGIDO!"}
            >
              ATINGIDO
            </div>
            <div>{item.objetivo}</div>
          </div>
        ))}
      </div>
    )
  }, [objetivos, idplanoterapeutico])

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

  const [arraycategoriaprofissional] = useState(listcategoriaprofissional);
  const [selectedcategoria] = useState(0);
  const [listescalas] = useState([]);
  const [listopcoesmetodos] = useState([]);
  const [listopcoesmetodospt] = useState([]);
  const [opcoesescalas] = useState([]);
  const [viewsuspendermeta] = useState(0);
  const MetodosAndMetas = useCallback(() => {
    return (
      <div
        style={{
          height: 300, width: '100%', minWidth: '100%', maxWidth: '100%',
          margin: 0, marginBottom: 5, padding: 0, paddingLeft: 0,
        }}>
        <div id="scroll das metas."
          className="scroll"
          style={{
            display: 'flex',
            width: '100%',
            margin: 0, paddingLeft: 10, paddingRight: 5,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
          }}>
          {arraymetas.filter(valor => valor.idplanoterapeutico == idplanoterapeutico).map(item => getMetas(item))}
        </div>
        <div id="scroll sem metas."
          className="title4"
          style={{
            display: 'none',
            flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%',
            padding: 0, margin: 0,
            borderRadius: 5,
          }}>
          {'SELECIONE UM OBJETIVO SECUNDÁRIO PARA VISUALIZAR AS METAS.'}
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [objetivos, selectedcategoria, arraymetas, listopcoesmetodos, listopcoesmetodospt, listescalas, opcoesescalas, viewsuspendermeta]);

  const arrayprofissionais = [];

  var timeout = null;
  // gráfico que exibe o tempo decorrido entre o início da meta e seu prazo.
  var dataChartMetas = [];
  const getMetas = (item) => {
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
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          width: '100%',
          opacity: item.status == 3 ? 0.5 : 1, padding: 10, paddingLeft: 7.5, marginRight: 10
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
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <div id="identificador do profissional" // 1 = médico, 2 = enfermeiro, 3 = fisioterapeuta, 4 = fonoaudiólogo, 5 = terapeuta ocupacional, 6 = psicólogo, 7 = assistente social.
              className="blue-button"
              style={{
                display: item.idprofissional != 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center',
                height: '100%', minHeight: '100%', maxHeight: '100%',
                width: 150, minWidth: 150,
                padding: 10,

              }}
            >
              <div>
                {arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.tipoprofissional) == 6 ? 'PSICOLOGO' : 'ASSISTENTE SOCIAL'}
              </div>
              <div>{arrayprofissionais.filter(valor => valor.idprofissional == item.idprofissional).map(valor => valor.nome)}</div>
            </div>
            <div id="identificador da especialidade" // 1 = médico, 2 = enfermeiro, 3 = fisioterapeuta, 4 = fonoaudiólogo, 5 = terapeuta ocupacional, 6 = psicólogo, 7 = assistente social.
              className="blue-button"
              style={{
                position: 'relative',
                padding: 10,
                display: item.idprofissional == 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center',
                height: '100%', minHeight: '100%', maxHeight: '100%',
                width: 150, minWidth: 150,
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 5 }}>
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
                  display: item.idespecialidade == tipousuario && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 && item.status == 1 ? 'flex' : 'none', // exibido apenas para metas não alcançadas no prazo definido.
                  width: '100%',
                  height: 100,
                  margin: 2.5,
                  flexDirection: 'column',
                  boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                }}

                type="text"
                maxLength={200}>
              </textarea>

              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                  title={'RESTAM: ' + moment(item.dataestimada).startOf('day').diff(moment().startOf('day'), 'days')}
                  style={{
                    fontSize: 12, margin: 5, marginLeft: 0, padding: 0,
                    alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                  }}>
                  {'DEFINIÇÃO: ' + moment(item.datainicio).format('DD/MM/YY')}
                </div>
                <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                  style={{
                    display: item.status == 0 ? 'none' : 'flex',
                    fontSize: 12, margin: 5, padding: 0,
                    alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                  }}>
                  {'PRAZO: ' + moment(item.dataestimada).format('DD/MM/YY')}
                </div>
                <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                  style={{
                    display: item.status == 2 ? 'flex' : 'none',
                    fontSize: 12, margin: 5, padding: 0,
                    alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                  }}>
                  {'CONCLUSÃO: ' + moment(item.datatermino).format('DD/MM/YY')}
                </div>
              </div>
              <div
                onClick={() => { document.getElementById("metodos + intervencao" + item.id).classList.toggle("show") }}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', fontSize: 12, textDecoration: 'underline',
                  color: '#52be80', alignSelf: 'flex-start', marginBottom: 20, textAlign: 'left'
                }}>
                MÉTODOS DE AVALIAÇÃO E INTERVENÇÕES
              </div>
              <div style={{ display: item.status == 4 ? 'flex' : 'none', color: '#ec7063', fontWeight: 'bold' }}>{'JUSTIFICATIVA: ' + item.justificativa}</div>
            </div>
          </div>
          <div id="INPUT PRAZO, INPUT CHECAGEM e INPUT NOTA (META CUMPRIDA)"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input id={"inputPrazo" + item.id}
              className="input"
              defaultValue={moment(item.dataestimada).startOf('day').diff(moment(item.datainicio).startOf('day'), 'days')}
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="DIAS PARA CONCLUSÃO DA META."
              style={{
                display: item.idespecialidade == tipousuario && item.status == 0 ? 'flex' : 'none', // exibido apenas para metas ainda não confirmadas.
                width: 50,
                margin: 2.5,
                flexDirection: 'column',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              onChange={(e) => {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  // alert(document.getElementById("inputPrazo" + item.id).value);
                  // updateMeta(item, document.getElementById("inputPrazo" + item.id).value, item.nota, 0, item.idprofissional, item.justificativa, item.checagem)
                }, 2000);
              }}
              type="number"
              maxLength={3}>
            </input>

            <input id={"inputChecagem" + item.id}
              className="input"
              defaultValue={item.checagem}
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="INTERVALO DE DIAS PARA CHECAGEM DA META."
              style={{
                display: 'none',
                width: 50,
                margin: 2.5,
                flexDirection: 'column',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}

              type="number"
              maxLength={3}>
            </input>

            <div id={"input versus flag" + item.id} style={{ margin: 0, marginRight: 5 }}
              onMouseOver={() => {
                if (item.status == 2) {
                  document.getElementById("inputNota" + item.id).style.display = "flex";
                  document.getElementById("flag" + item.id).style.display = "none";
                }
              }}
              onMouseOut={() => {
                if (item.status == 2) {
                  document.getElementById("inputNota" + item.id).style.display = "none";
                  document.getElementById("flag" + item.id).style.display = "flex";
                }
              }}
            >
              <input
                className="input"
                defaultValue={item.nota}
                autoComplete="off"
                placeholder="?"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '?')}
                title="AVALIAÇÃO DA META ALCANÇADA."
                style={{
                  display: 'none',
                  width: 50,
                  margin: 2.5,
                  flexDirection: 'column',
                  boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                }}


                type="number"
                id={"inputNota" + item.id}
                maxLength={2}>
              </input>
              <div id={"flag" + item.id}
                className="input"
                style={{
                  display: item.status == 2 ? 'flex' : 'none',
                  justifyContent: 'center',
                  width: 50,
                  margin: 2.5,
                  padding: 0,
                  position: 'relative',
                  boxShadow: 'none',
                  backgroundColor: 'none',
                }}
              >
                <img
                  alt=""
                  src={flag}
                  style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    margin: 0,
                    height: 50,
                    width: 50,
                  }}
                ></img>
                <div
                  className='title2center'
                  style={{
                    color: '#ffffff',
                    position: 'absolute',
                    top: 10, bottom: 0, left: 3, right: 0,
                    margin: 10,
                    marginTop: 0,
                    height: 30,
                    width: 30,
                  }}
                >
                  {item.nota}
                </div>
              </div>
            </div>

            <div title={
              item.status == 0 ? 'INATIVA' :
                item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 0 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 ? 'ATIVA' :
                  // item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 && moment().startOf('day').diff(moment(item.datachecagem), 'days') > 0 ? 'PAUSADA PARA CHECAGEM' :
                  item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 ? 'VENCIDA' :
                    item.status == 3 ? 'CANCELADA' : item.status == 4 ? 'META NÃO CUMPRIDA.' : ''}>
              <img
                alt=""
                className={item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1 ? "pulsarplanoterapeutico" : ''}
                src={
                  item.status == 0 ? plano_validar :
                    item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 0 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 ? plano_ativo :
                      // item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 && moment().startOf('day').diff(moment(item.datachecagem), 'days') > -1 ? plano_checagem :
                      item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1 ? plano_fracassado :
                        item.status == 3 ? plano_cancelado : item.status == 4 ? plano_fail : ''}
                style={{
                  display: item.status != 2 ? 'flex' : 'none',
                  margin: 2.5,
                  marginRight: item.status == 4 ? 7.5 : 2.5,
                  height: 50,
                  width: 50,
                }}
              ></img>
            </div>



            <button
              title="CONTINUAR META."
              style={{ display: 'none' }}
              // style={{ display: item.status == 1 && statusplanoterapeutico == 1 && moment().startOf('day').diff(moment(item.dataestimada), 'days') < 0 && moment().startOf('day').diff(moment(item.datachecagem), 'days') > -1 ? 'flex' : 'none' }}
              className="animated-yellow-button"

            >
              <img
                alt=""
                src={restart}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>

            <button
              title="RETOMAR META."
              style={{ display: item.status == 4 && statusplanoterapeutico == 1 && objetivos.filter(valor => valor.idplanoterapeutico == item.idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1).length > 0 ? 'flex' : 'none' }}
              className="animated-yellow-button"

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

            <button
              title="CANCELAR META."
              style={{ display: item.idespecialidade == tipousuario && item.status == 1 ? 'flex' : 'none' }}
              className="animated-yellow-button"
              onClick={() => document.getElementById("divJustificativaSuspender" + item.id).style.display = 'flex'}
            // onClick={(e) => { updateMeta(item, moment(item.dataestimada).diff(moment(item.datainicio), 'days'), item.nota, 3, item.idprofissional, item.justificativa, item.checagem); e.stopPropagation() }} // atualiza a meta como cancelada.
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
              title="EXCLUIR META."
              style={{ display: item.idespecialidade == tipousuario && item.status == 0 ? 'flex' : 'none' }}
              className="animated-red-button"
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
              height: 100,
              margin: 2.5,
              flexDirection: 'column',
              boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
            }}
            type="text"
            maxLength={200}>
          </textarea>

        </div>
        <div className="hide" id={"metodos + intervencao" + item.id}
          style={{ justifyContent: 'center', alignSelf: 'center', width: '100%', padding: 5 }}>

          <div id="view dos métodos de mensuração e das intervenções terapêuticas">
            <div id="título métodos de avaliação"
              className="title4" style={{ marginTop: 10 }}>{'MÉTODOS DE AVALIAÇÃO'}
            </div>
            <div id={"scroll dos métodos de avaliação" + item.id}
              className="scroll"
              style={{
                scrollBehavior: 'smooth', flexDirection: 'row', justifyContent: 'flex-center',
                overflowY: 'hidden', overflowX: 'scroll',
                width: '100%', height: 165, minHeight: 165,
                margin: 0,
              }}>
              {listopcoesmetodos.filter(valor => valor.id_meta == item.idmeta).sort((a, b) => a.idespecialidade < b.idespecialidade ? 1 : -1).map(item => (
                //... cards com histórico da escala.
                <div>
                  <div id="escala cadastrada para o atendimento."
                    style={{ display: listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento).slice(-1).length > 0 ? 'flex' : 'none' }}>
                    {listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento).slice(-1).map(value => (
                      <div className="blue-button"
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
                    style={{ display: listescalas.filter(valor => valor.ds_escala == item.metodo && valor.idatendimento == idatendimento).slice(-1).length < 1 ? 'flex' : 'none' }}
                  >
                    <div
                      className="grey-button"
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
              className="title4" style={{ marginTop: 10 }}>{'INTERVENÇÕES TERAPÊUTICAS'}
            </div>
          </div>
        </div>
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

  return (
    <div style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', height: '100%',
      // width: window.innerWidth < 1024 ? '65vw' : window.innerWidth < 400 ? '100vw' : '82vw',
      width: '100%', opacity: 1,
    }}>
      <div
        id="scroll"
        className="scroll"
        style={{
          scrollBehavior: 'smooth',
          width: '100%',
          height: '80vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          alignSelf: 'center', verticalAlign: 'center',
          paddingRight: 10, opacity: 1,
        }}>
        <LinhaDeCuidados></LinhaDeCuidados>
        <PlanoTerapeutico></PlanoTerapeutico>
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

export default ResumoAptPlanoTerapeutico;