/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Header from '../components/Header';
import Context from '../Context';
import { useHistory } from "react-router-dom";

function TodosPacientes() {
  var htmlfiltrapacientenome = process.env.REACT_APP_API_FILTRAPACIENTESNOME;
  // recuperando estados globais (Context.API).
  const {
    setidunidade,
    setnomeunidade,
    setdatainternacao,
    setconvenio,
    setidpaciente,
    setidatendimento,
    setdadospaciente,
    todospacientes,
    todosatendimentos,
    setopcoeslinhasdecuidado,
    opcoeslinhasdecuidado,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  var htmlallplanosterapeuticos = process.env.REACT_APP_API_CLONE_ALLPLANOSTERAPEUTICOS;
  const [allplanosterapeuticos, setallplanosterapeuticos] = useState([]);
  const loadAllPlanosTerapeuticos = () => {
    axios.get(htmlallplanosterapeuticos).then((response) => {
      setallplanosterapeuticos(response.data.rows);
    })
  }

  var htmlopcoeslinhasdecuidado = process.env.REACT_APP_API_CLONE_OPCOES_LINHAS_DE_CUIDADO
  const loadOpcoesLinhasDeCuidado = () => {
    axios.get(htmlopcoeslinhasdecuidado).then((response) => {
      var x = [0, 1];
      x = response.data;
      setopcoeslinhasdecuidado(x.rows);
      console.log(JSON.stringify(x.rows));
      loadAllPlanosTerapeuticos();
    });
  }

  useEffect(() => {
    loadOpcoesLinhasDeCuidado();
    // eslint-disable-next-line
  }, []);

  // lista de atendimentos (demais unidades de internação como enfermarias, ctis, etc.).
  const [arrayatendimentos, setarrayatendimentos] = useState(todosatendimentos);

  // cabeçalho da lista de pacientes (unidades de internação).
  const [arrayatendimentosclassified, setarrayatendimentosclassified] = useState(todosatendimentos);
  const [classificaunidade, setclassificaunidade] = useState(1);
  const [classificabox, setclassificabox] = useState(0);
  const [classificanome, setclassificanome] = useState(0);
  const [classificaidade, setclassificaidade] = useState(0);
  const [classificatempointernacao, setclassificatempointernacao] = useState(0);
  const [classificaassistente, setclassificaassistente] = useState(0);

  function CabecalhoInternacao() {
    return (
      <div
        className="scrollheader"
        id="CABEÇALHO DA LISTA DE PACIENTES INTERNADOS"
      >
        <div className="rowheader">
          <button
            onClick={() => {
              // setclassificaunidade(1);
              setclassificabox(0);
              setclassificanome(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificaunidade == 0 || classificaunidade == 2) {
                setclassificaunidade(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.unidade.descricao > b.Leito.unidade.descricao ? 1 : -1)));
              } else if (classificaunidade == 1) {
                setclassificaunidade(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.unidade.descricao < b.Leito.unidade.descricao ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{
              backgroundColor: 'transparent',
              color: classificaunidade == 0 ? '' : 'red',
              minWidth: 100, width: 100,
            }}
            title="UNIDADE"
          >
            {classificaunidade == 0 ? 'UNIDADE' : classificaunidade == 1 ? 'UNIDADE ↓' : 'UNIDADE ↑'}
          </button>
          <button
            onClick={() => {
              setclassificaunidade(0);
              // setclassificabox(0);
              setclassificanome(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificabox == 0 || classificabox == 2) {
                setclassificabox(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.descricao > b.Leito.descricao ? 1 : -1)));
              } else if (classificabox == 1) {
                setclassificabox(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.descricao < b.Leito.descricao ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{
              backgroundColor: 'transparent', color: classificabox == 0 ? '' : 'red',
              minWidth: 100, width: 100,
            }}
            title="BOX"
          >
            {classificabox == 0 ? 'BOX' : classificabox == 1 ? 'BOX ↓' : 'BOX ↑'}
          </button>
          <button
            onClick={() => {
              setclassificaunidade(0);
              setclassificabox(0);
              // setclassificanome(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificanome == 0 || classificanome == 2) {
                setclassificanome(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_paciente > b.nm_paciente ? 1 : -1)));
              } else if (classificanome == 1) {
                setclassificanome(2)
                arrayatendimentos.sort(((a, b) => a.nome < b.nome ? 1 : -1))
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_paciente < b.nm_paciente ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{
              display: window.innerWidth < 426 ? 'none' : 'flex',
              width: '100%',
              color: classificanome == 0 ? '' : 'red'
            }}
          >
            {classificanome == 0 ? 'NOME' : classificanome == 1 ? 'NOME ↓' : 'NOME ↑'}
          </button>
          <div
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '20%',
              color: classificaidade == 0 ? '' : 'red'
            }}
          >
            {classificaidade == 0 ? 'IDADE' : classificaidade == 1 ? 'IDADE ↓' : 'IDADE ↑'}
          </div>
          <div
            onClick={() => {
              setclassificaunidade(0);
              setclassificabox(0);
              setclassificanome(0);
              setclassificaidade(0);
              // setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificatempointernacao == 0 || classificatempointernacao == 2) {
                setclassificatempointernacao(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => moment().diff(moment(a.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') > moment().diff(moment(b.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') ? 1 : -1)));
              } else if (classificatempointernacao == 1) {
                setclassificatempointernacao(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => moment().diff(moment(a.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') < moment().diff(moment(b.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') ? 1 : -1)));
              }
            }}
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
              color: classificatempointernacao == 0 ? '' : 'red'
            }}
          >
            {classificatempointernacao == 0 ? 'TEMPO DE INTERNAÇÃO' : classificabox == 1 ? 'TEMPO DE INTERNAÇÃO ↓' : 'TEMPO DE INTERNAÇÃO ↑'}
          </div>
          <div
            onClick={() => {
              setclassificaunidade(0);
              setclassificabox(0);
              setclassificanome(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificaassistente == 0 || classificaassistente == 2) {
                setclassificaassistente(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_prestador > b.nm_prestador ? 1 : -1)));
              } else if (classificaassistente == 1) {
                setclassificaassistente(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_prestador > b.nm_prestador ? 1 : -1)));
              }
            }}
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
              color: classificaassistente == 0 ? '' : 'red'
            }}
          >
            {classificaassistente == 0 ? 'MÉDICO ASSISTENTE' : classificaassistente == 1 ? 'MÉDICO ASSISTENTE ↓' : 'MÉDICO ASSISTENTE ↑'}
          </div>
        </div>
      </div>
    )
  }

  // renderização da lista de pacientes.
  function ShowPacientes() {
    if (arrayatendimentos.length > 0) {
      return (
        <div
          id="LISTA DE PACIENTES"
          className="scroll"
          style={{ height: '100%', alignContent: 'center' }}
        >
          {arrayatendimentosclassified.map((item) => (
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              width: window.innerWidth > 425 ? '' : '90vw'
            }}>
              <div
                key={item.id}
                className="row"
                style={{
                  width: window.innerWidth > 425 ? '' : '85vw',
                  position: 'relative',
                  justifyContent: 'center',
                  flexWrap: window.innerWidth < 426 ? 'wrap' : 'nowrap',
                }}
              >
                <button
                  className="grey-button"
                  style={{
                    width: window.innerWidth < 426 ? 'calc(40vw - 2.5px)' : 100,
                    minWidth: window.innerWidth < 426 ? 'calc(40vw - 2.5px)' : 100,
                    margin: 2.5, color: '#ffffff', backgroundColor: 'grey'
                  }}
                  title="UNIDADE"
                  disabled="true"
                >
                  {item.Leito.unidade.descricao}
                </button>
                <button
                  className="grey-button"
                  style={{
                    width: window.innerWidth < 426 ? 'calc(40vw - 2.5px)' : 100,
                    minWidth: window.innerWidth < 426 ? 'calc(40vw - 2.5px)' : 100,
                    margin: 2.5, color: '#ffffff', backgroundColor: 'grey'
                  }}
                  title="BOX"
                  disabled="true"
                >
                  {item.Leito.descricao}
                </button>

                <button
                  onClick={() => selectPaciente(item)}
                  className="blue-button"
                  style={{
                    width: '100%',
                    padding: 5, paddingLeft: 10,
                    justifyContent: 'space-between',
                    backgroundColor: item.linhadecuidado == 1 ? "#52be80" : item.linhadecuidado == 2 ? "#5DADE2" : item.linhadecuidado == 3 ? "#F4D03F" : "grey"
                  }}
                >
                  <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'left',
                    width: window.innerWidth < 426 ? '80vw' : '100%',
                    height: 50
                  }}>
                    <div style={{
                      alignContent: 'center', alignSelf: 'center', marginRight: 10,
                    }}>
                      {item.nm_paciente}
                    </div>
                    <div id="tag linha de cuidado."
                      className='blue-button'
                      style={{
                        display: allplanosterapeuticos.filter(valor => valor.idpct == item.cd_paciente).map(valor => opcoeslinhasdecuidado.filter(item => item.id == valor.linhadecuidados)).length > 0 ? 'flex' : 'none',
                        minHeight: 45, height: 45, alignSelf: 'flex-end', paddingLeft: 10, paddingRight: 10,
                        backgroundColor:
                          allplanosterapeuticos.filter(valor => valor.idpct == item.cd_paciente).map(valor => valor.linhadecuidados) == 1 ? '#52be80' :
                            allplanosterapeuticos.filter(valor => valor.idpct == item.cd_paciente).map(valor => valor.linhadecuidados) == 2 ? '#f5b041' :
                              '#52dade'
                      }}>
                      {
                        allplanosterapeuticos.filter(valor => valor.idpct == item.cd_paciente).map(valor => opcoeslinhasdecuidado.filter(item => item.id == valor.linhadecuidados).map(item => item.linhadecuidado))
                      }
                    </div>
                  </div>
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '20%',
                  }}
                >
                  {moment().diff(moment(todospacientes.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') > 1 ?
                    moment().diff(moment(todospacientes.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') + ' ANOS.' :
                    moment().diff(moment(todospacientes.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') + ' ANO.'
                  }
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  {moment().diff(moment(item.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') + ' DIAS.'}
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  <div>
                    {JSON.stringify(item.nm_prestador).substring(1, 25).length > 25 ? JSON.stringify(item.nm_prestador).substring(1, 25) + '...' : JSON.stringify(item.nm_prestador).substring(1, 20)}
                  </div>
                </button>
              </div>
            </div >
          ))
          }
          <div id="atendimentos encerrados"
            style={{
              display: atendimentosencerrados.length > 0 ? 'flex' : 'none',
              flexDirection: 'column',
              backgroundColor: '#f2f2f2', borderColor: '#f2f2f2',
              borderRadius: 5, padding: 5, margin: 5, alignItems: 'center',
              width: '100%', alignContent: 'center', justifyContent: 'center',
            }}>
            <div className='title2'>ATENDIMENTOS ENCERRADOS</div>
            <div id="cabecalho"
              style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'center', alignSelf: 'center',
                width: window.innerWidth > 425 ? '95%' : '70vw'
              }}>
              <div className="header-button" style={{ width: '100%' }}>NOME</div>
              <div className="header-button" style={{ minWidth: 100 }}>DN</div>
              <div className="header-button" style={{ minWidth: 100 }}>INICIO</div>
              <div className="header-button" style={{ minWidth: 100 }}>TERMINO</div>
            </div>
            {atendimentosencerrados.map((item) => (
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: window.innerWidth > 425 ? '98%' : '70vw',
                alignSelf: 'center',
              }}>
                <div
                  key={item.id}
                  className="row"
                  style={{
                    width: window.innerWidth > 425 ? '98%' : '70vw',
                    position: 'relative',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                  }}
                  onClick={() => selectAtendimentoAntigo(item)}
                >
                  <button
                    className="grey-button"
                    style={{ width: '100%', margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                    title="NOME DO PACIENTE"
                    onClick={() => selectAtendimentoAntigo(item)}
                  >
                    {item.nm_paciente}
                  </button>

                  <button
                    className="grey-button"
                    style={{
                      display: window.innerWidth < 400 ? 'none' : 'flex',
                      minWidth: 100,
                    }}
                  >
                    {moment(listapacientespornome.slice(-1).map(item => item.data_nascimento_paciente).pop()).format('DD/MM/YY')}
                  </button>

                  <button
                    className="grey-button"
                    style={{ minWidth: 100, margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                    title="ADMISSÃO"
                    disabled="true"
                  >
                    {moment(item.dt_hr_atendimento).format('DD/MM/YY')}
                  </button>
                  <button
                    className="grey-button"
                    style={{ minWidth: 100, margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                    title="ALTA"
                    disabled="true"
                  >
                    {moment(item.dt_hr_alta).format('DD/MM/YY')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div >
      );
    } else {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            height: '100%'
          }}
        >
          <div className="title2"
            style={{
              fontSize: 16,
              opacity: 0.5,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {'NÃO HÁ PACIENTES INTERNADOS NESTA UNIDADE.'}
          </div>
        </div>
      )
    }
  }

  // selecionando um paciente da lista e abrindo a tela corrida.
  const selectPaciente = (item) => {
    setidunidade(item.Leito.unidade.id);
    setnomeunidade(item.Leito.unidade.descricao);
    setidpaciente(item.cd_paciente)
    setidatendimento(item.cd_atendimento)
    setdatainternacao(item.dt_hr_atendimento);
    setconvenio(item.nm_convenio);
    setdadospaciente(todospacientes.filter(value => value.codigo_paciente == item.cd_paciente));
    history.push('/prontuario');
  };

  const selectAtendimentoAntigo = (item) => {
    console.log('BABAOEY')
    setidunidade(0);
    setnomeunidade('');
    setidpaciente(item.cd_paciente)
    setidatendimento(item.cd_atendimento)
    setdatainternacao(item.dt_hr_atendimento);
    setconvenio(item.nm_convenio);
    // setdadospaciente(arrayPacientesEmAtendimento.filter(value => value.codigo_paciente == item.cd_paciente));
    history.push('/prontuario');
  };

  // filtro de pacientes...
  function FilterPacientes() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
        onChange={() => filterPaciente()}
        style={{
          width: '60vw',
          padding: 20,
          margin: 20,
          alignSelf: 'center',
          textAlign: 'center'
        }}
        type="text"
        id="inputFilterPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
      ></input>
    )
  }

  // eslint-disable-next-line
  const [filterpaciente, setfilterpaciente] = useState('');
  var searchpaciente = '';
  var timeout = null;

  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterPaciente").focus();
    searchpaciente = document.getElementById("inputFilterPaciente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == '') {
        setarrayatendimentos(todosatendimentos);
        setarrayatendimentosclassified(todosatendimentos);
        document.getElementById("inputFilterPaciente").value = '';
        document.getElementById("inputFilterPaciente").focus();
      } else {
        // setarrayatendimentos(document.getElementById("inputFilterPaciente").value.toUpperCase());
        var varatendimentos = [0, 1]
        varatendimentos = todosatendimentos
        var pegapelonome = varatendimentos.filter(item =>
          item.nm_paciente.includes(searchpaciente)).map(item => item.nm_paciente);
        var pegaidpelobox = varatendimentos.filter(item =>
          item.Leito.descricao.includes(searchpaciente)).map(item => item.Leito.descricao);
        var pegaidpeloassistente = varatendimentos.filter(item =>
          item.nm_prestador.includes(searchpaciente)).map(item => item.nm_prestador);

        // filtrando pelo nome do paciente.
        if (pegapelonome != '' && pegaidpelobox == '' && pegaidpeloassistente == '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.nm_paciente.includes(searchpaciente)));
          setarrayatendimentosclassified(todosatendimentos.filter(item => item.nm_paciente.includes(searchpaciente)));
          loadPacientePorNome(searchpaciente);
          // filtrando pelo box/leito do paciente.
        } else if (pegapelonome == '' && pegaidpelobox != '' && pegaidpeloassistente == '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.Leito.descricao.includes(searchpaciente)));
          setarrayatendimentosclassified(todosatendimentos.filter(item => item.Leito.descricao.includes(searchpaciente)));
          // filtrando pelo prestador.
        } else if (pegapelonome == '' && pegaidpelobox == '' && pegaidpeloassistente != '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.nm_prestador.includes(searchpaciente)));
          setarrayatendimentosclassified(todosatendimentos.filter(item => item.nm_prestador.includes(searchpaciente)));
        } else {
          setarrayatendimentos([]);
          setarrayatendimentosclassified([]);
          document.getElementById("inputFilterPaciente").value = searchpaciente;
          document.getElementById("inputFilterPaciente").focus();
        }
        // document.getElementById("inputFilterPaciente").value = searchpaciente;
        // document.getElementById("inputFilterPaciente").focus();
      }
    }, 500);
  }

  var htmlhistoricodeatendimentos = process.env.REACT_APP_API_HISTORICODEATENDIMENTOS;
  // filtrando atendimentos de pacientes fora do atendimento atual.
  const [listapacientespornome, setlistapacientespornome] = useState([]);
  const [atendimentosencerrados, setatendimentosencerrados] = useState([]);
  const loadPacientePorNome = (nome) => {
    console.log('NOME: ' + nome)
    axios.get(htmlfiltrapacientenome + '?nome_paciente=' + nome).then((response) => {
      setlistapacientespornome(response.data);
      var zetta = [];
      zetta = parseInt(response.data.slice(-1).map(item => item.codigo_paciente).pop());
      // console.log(zetta);
      // setcodigopaciente(response.data.pop().codigo_paciente);
      loadHistoricoDeAtendimentos(zetta);
    })
  }
  const loadHistoricoDeAtendimentos = (codigo) => {
    console.log(codigo);
    axios.get(htmlhistoricodeatendimentos + codigo).then((response) => {
      var x = [0, 1]
      x = response.data;
      setatendimentosencerrados(x.filter(item => item.dt_hr_alta == null)); // PENDÊNCIA! trocar aqui para !=
      document.getElementById("inputFilterPaciente").value = searchpaciente;
      document.getElementById("inputFilterPaciente").focus();
    });
  }

  // renderização do componente.
  return (
    <div
      className="main fade-in"
    >
      <Header link={"/"} titulo={'TODOS OS PACIENTES'}></Header>
      <div
        id="PRINCIPAL"
        style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          width: '100%',
          height: '80vh',
          marginTop: 5,
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            padding: 5,
          }}>
          <FilterPacientes></FilterPacientes>
          <CabecalhoInternacao></CabecalhoInternacao>
          <ShowPacientes></ShowPacientes>
        </div>
      </div>
    </div>
  );
}
export default TodosPacientes;
