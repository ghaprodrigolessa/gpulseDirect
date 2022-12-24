import './App.css'
import './design.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Context from './Context'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom'

// importando componentes.
import Toast from './components/Toast'
import DatePicker from './components/DatePicker'

// importando páginas.
import TodosPacientes from './pages/TodosPacientes'
//import Bloco from './pages/Bloco'
import Login from './pages/Login'
import Prontuario from './pages/Prontuario'

var htmlleitos = process.env.REACT_APP_API_LEITOS;

// função que encapsula todos os componentes de páginas e coordena o iddle-timeout.
function IddleTimeOut() {
  /* eslint eqeqeq: 0 */
  var timer = 0
  var interval = null
  let history = useHistory()
  const loadTimeOut = () => {
    interval = setInterval(() => {
      timer = timer + 1
      // console.log(timer)
      if (timer > 900) {
        timer = 0
        setTimeout(() => {
          toast(1, '#ec7063', 'USUÁRIO DESLOGADO POR INATIVIDADE.', 3000)
          history.push('/')
        }, 3000)
      }
    }, 1000)
  }
  const resetTimeOut = () => {
    clearInterval(interval)
    timer = 0
    loadTimeOut()
  }

  // função para construção dos toasts.
  const [valor, setvalor] = useState(0)
  const [cor, setcor] = useState('transparent')
  const [mensagem, setmensagem] = useState('')
  const [tempo, settempo] = useState(2000)
  const toast = (value, color, message, time) => {
    setvalor(value)
    setcor(color)
    setmensagem(message)
    settempo(time)
    setTimeout(() => {
      setvalor(0)
    }, time)
  }

  // desabilitando zoom ao pressionar duas vezes a tela (mobile devices).
  const disablePinchZoom = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }

  // desabilitando o reload da página.
  document.addEventListener('keydown', (e) => {
    e = window.event;
    if (e.key == 116) {
      toast(1, 'red', 'CARAMBA...', 3000);
      e.preventDefault();
    }
  });

  useEffect(() => {
    loadTimeOut()
    window.onmousemove = function () {
      resetTimeOut()
    }
    // desabilitando zoom nos dispositivos iOs.
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('gesturechange', function (e) {
      e.preventDefault();
    });
    document.addEventListener('gestureend', function (e) {
      e.preventDefault();
    });
    document.body.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });

    // alterando o comportamento ao clicar no botão refresh.
    window.addEventListener("load", () => {
      history.push('/');
    });

  }, [])

  return (
    <div
      className={"main"}
      translate="no"
      onTouchEnd={(e) => disablePinchZoom(e)}
    >
      <DatePicker></DatePicker>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
      <Switch>
        <div id="páginas">
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route path="/todospacientes">
            <TodosPacientes></TodosPacientes>
          </Route>
          <Route path="/prontuario">
            <Prontuario></Prontuario>
          </Route>
        </div>
      </Switch>
    </div>
  )
}

function App() {
  /* eslint eqeqeq: 0 */

  /*
  // retornando à tela login ao clicar no botão atualizar do navegador.
  if (window.performance.getEntriesByType("navigation")[0].entryType == "reload") {
    window.location.replace('/');
  } else {
    return null;
  }
  */



  // estados globais (serão usados no Context.API).
  // lista de todos os usuários cadastrados no Pulse.
  const [personas, setpersonas] = useState([])
  // identificação do usuário logado.
  const [iduser, setiduser] = useState(0)
  const [idusuario, setidusuario] = useState(0)
  const [nomeusuario, setnomeusuario] = useState('')
  const [tipousuario, settipousuario] = useState(0)
  const [categoriausuario, setcategoriausuario] = useState('') // enfermeiro, médico, etc...
  const [especialidadeusuario, setespecialidadeusuario] = useState('') // especialidade do profissional (anestesista, etc).
  const [conselhousuario, setconselhousuario] = useState('')
  const [boss_settings_usuario, setboss_settings_usuario] = useState(0)
  const [boss_planoterapeutico_usuario, setboss_planoterapeutico_usuario] = useState(0)
  // identificação do atendimento (hospital, unidade de atendimento).
  const [idhospital, setidhospital] = useState(0)
  const [nomehospital, setnomehospital] = useState('')
  const [idunidade, setidunidade] = useState(0)
  const [tipounidade, settipounidade] = useState(0)
  const [nomeunidade, setnomeunidade] = useState('')
  const [box, setbox] = useState('')
  const [antecedentes, setantecedentes] = useState('')
  const [idatendimentoghap, setidatendimentoghap] = useState(0);
  const [medprev, setmedprev] = useState('')
  const [exprev, setexprev] = useState('')
  const [hda, sethda] = useState('')
  const [hd, sethd] = useState('');
  const [conduta, setconduta] = useState('')
  const [alergias, setalergias] = useState([])
  // identificação do paciente.
  const [idpaciente, setidpaciente] = useState(0)
  const [dadospaciente, setdadospaciente] = useState([])
  const [idatendimento, setidatendimento] = useState(0)
  const [datainternacao, setdatainternacao] = useState('')
  const [convenio, setconvenio] = useState(0)
  const [nomepaciente, setnomepaciente] = useState('')
  const [nomemae, setnomemae] = useState('')
  const [dn, setdn] = useState('')
  const [peso, setpeso] = useState(0)
  // datepicker (data).
  const [viewdatepicker, setviewdatepicker] = useState(0);
  const [pickdate1, setpickdate1] = useState('')
  const [pickdate2, setpickdate2] = useState('')
  // estado para alternância das listas que compõem a tela prontuário (principal, evoluções, diagnósticos, etc).
  const [stateprontuario, setstateprontuario] = useState(1)
  // estado para exibição de componentes sobrepostos à tela principal (inserir ou editar registros, etc.).
  const [hemoderivados, sethemoderivados] = useState(0);
  const [printhemoderivados, setprinthemoderivados] = useState(0);
  const [printtermohemoderivados, setprinttermohemoderivados] = useState(0);
  // listas principais.
  const [todosleitos, settodosleitos] = useState([]);
  const [todospacientes, settodospacientes] = useState([]);
  const [todosatendimentos, settodosatendimentos] = useState([0, 1]);
  const [historicoatendimentos, sethistoricoatendimentos] = useState([0, 1]);
  const [todosconvenios, settodosconvenios] = useState([]);
  // listas da tela prontuário.
  const [listevolucoes, setlistevolucoes] = useState([]);
  const [arrayevolucao, setarrayevolucao] = useState([]);

  const [listghapevolucoes, setlistghapevolucoes] = useState([]);
  const [arraylistghapevolucoes, setarraylistghapevolucoes] = useState([]);

  const [listdiagnosticos, setlistdiagnosticos] = useState([]);
  const [arraydiagnosticos, setarraydiagnosticos] = useState([]);

  const [listproblemas, setlistproblemas] = useState([]);
  const [arrayproblemas, setarrayproblemas] = useState([]);

  const [listpropostas, setlistpropostas] = useState([]);
  const [arraypropostas, setarraypropostas] = useState([]);

  const [listinterconsultas, setlistinterconsultas] = useState([]);
  const [arrayinterconsultas, setarrayinterconsultas] = useState([]);

  const [listlaboratorio, setlistlaboratorio] = useState([]);
  const [arraylaboratorio, setarraylaboratorio] = useState([]);

  const [listimagem, setlistimagem] = useState([]);
  const [arrayimagem, setarrayimagem] = useState([]);

  const [listbalancos, setlistbalancos] = useState([]);

  const [listformularios, setlistformularios] = useState([]);
  const [arrayformularios, setarrayformularios] = useState([]);

  // INATIVO NO MOMENTO - estado das scrolls (evita o reposicionamento das scrolls para o topo, quando um componente é re-renderizado).
  const [scrollmenu, setscrollmenu] = useState(0) // scroll do menu principal (tela prontuário).
  const [scrolllist, setscrolllist] = useState(0) // listas da tela principal (evolução, diagnósticos, etc.).
  const [scrollprescricao, setscrollprescricao] = useState(0) // scroll da prescrição médica.
  const [scrollitem, setscrollitem] = useState(0) // scroll da lista de componentes de cada item da prescrição.
  const [scrollitemcomponent, setscrollitemcomponent] = useState(0) // scroll da lista de componentes de cada item da prescrição.

  // estados relacionados ao painel de controle (settings), responsável por gerenciar a visualização de componentes do menu e de cards na tela principal.
  // menu.
  const [viewsettings, setviewsettings] = useState(0);
  const [settings, setsettings] = useState([0, 1]);
  const [menuevolucoes, setmenuevolucoes] = useState(1);
  const [menudiagnosticos, setmenudiagnosticos] = useState(1);
  const [menuproblemas, setmenuproblemas] = useState(1);
  const [menupropostas, setmenupropostas] = useState(1);
  const [menuinterconsultas, setmenuinterconsultas] = useState(1);
  const [menulaboratorio, setmenulaboratorio] = useState(1);
  const [menuimagem, setmenuimagem] = useState(1);
  const [menuprescricao, setmenuprescricao] = useState(1);
  const [menuformularios, setmenuformularios] = useState(1);
  // cards.
  const [cardstatus, setcardstatus] = useState(0);
  const [cardalertas, setcardalertas] = useState(0);
  const [cardprecaucao, setcardprecaucao] = useState(0);
  const [cardriscosassistenciais, setcardriscosassistenciais] = useState(0);
  const [carddiasinternacao, setcarddiasinternacao] = useState(0);
  const [cardultimaevolucao, setcardultimaevolucao] = useState(0);
  const [cardinvasoes, setcardinvasoes] = useState(0);
  const [carddiagnosticos, setcarddiagnosticos] = useState(0);
  const [cardlesoes, setcardlesoes] = useState(0);
  const [cardhistoricoatb, setcardhistoricoatb] = useState(0);
  const [cardhistoricoatendimentos, setcardhistoricoatendimentos] = useState(0);
  const [cardanamnese, setcardanamnese] = useState(0);
  // color scheme.
  const [schemecolor, setschemecolor] = useState("purplescheme");

  // APT (IVCF/curva de moraes).
  const [ivcf, setivcf] = useState(0);

  // APT plano terapêutico.
  const [planoterapeutico, setplanoterapeutico] = useState([]);
  const [opcoeslinhasdecuidado, setopcoeslinhasdecuidado] = useState([]);
  const [linhadecuidado, setlinhadecuidado] = useState(''); // muda quando selecionamos planos terapêuticos no histórico de planos terapêuticos (aparece no componente de plano terapêutico).
  const [linhadecuidadoatual, setlinhadecuidadoatual] = useState(''); // linha de cuidado referente ao plano terapêutico atual (aparece no cabeçalho do prontuário).
  const [idlinhadecuidado, setidlinhadecuidado] = useState(0);
  const [refreshatendimentos, setrefreshatendimentos] = useState(0);
  const [datainicioplanoterapeutico, setdatainicioplanoterapeutico] = useState();
  const [dataterminoplanoterapeutico, setdataterminoplanoterapeutico] = useState();
  const [statusplanoterapeutico, setstatusplanoterapeutico] = useState(0);

  const [objetivos, setobjetivos] = useState([]);
  const [idplanoterapeutico, setidplanoterapeutico] = useState(0);
  const [metas, setmetas] = useState([]);
  const [linhasdecuidado, setlinhasdecuidado] = useState([]);
  const [opcoesobjetivos, setopcoesobjetivos] = useState([]);
  const [hide, sethide] = useState(0);
  const [lastplanoterapeutico, setlastplanoterapeutico] = useState([]);
  const [arraycategoriaprofissional, setarraycategoriaprofissional] = useState([]);
  const [selectedobjetivosecundario, setselectedobjetivosecundario] = useState([]);
  const [selectedobjetivo, setselectedobjetivo] = useState(0);
  const [selectedcategoria, setselectedcategoria] = useState(0);
  const [opcoesmetas, setopcoesmetas] = useState(0);
  const [viewjustificaobjetivoprimario, setviewjustificaobjetivoprimario] = useState(0);

  // APT escalas.
  const [showescala, setshowescala] = useState(0);
  const [listescalas, setlistescalas] = useState([]);
  const [arraylistescalas, setarraylistescalas] = useState([]);

  // prescrição.
  const [listitensprescricao, setlistitensprescricao] = useState([]);

  // documentos e formulários.
  const [viewdocumento, setviewdocumento] = useState(0);
  const [viewpdf, setviewpdf] = useState(0);
  const [viewdatadocumento, setviewdatadocumento] = useState(0);
  const [conselho, setconselho] = useState('');
  const [tipodocumento, settipodocumento] = useState('');
  const [iddocumento, setiddocumento] = useState('');
  const [usuariodocumento, setusuariodocumento] = useState(0);
  const [statusdocumento, setstatusdocumento] = useState(0);
  const [viewconteudo, setviewconteudo] = useState("");
  const [datadocumento, setdatadocumento] = useState("");
  const [backup, setbackup] = useState(''); // salvando o texto para que o usuário possa trafergar entre as evoluções e retornar à evolução livre ainda não salva.

  // assinatura digital de documentos / certificado digital.
  const [signature, setsignature] = useState(0);

  // cid10.
  const [listcid, setlistcid] = useState([]);
  const [arraylistcid, setarraylistcid] = useState([]);

  // cid10.
  var htmlghapcid = process.env.REACT_APP_API_CLONE_CID;
  const getCid = () => {
    axios.get(htmlghapcid).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistcid(x.rows);
      setarraylistcid(x.rows);
    });
  }

  var html = 'https://pulsarapp-server.herokuapp.com';
  const loadSettings = () => {
    axios.get(html + "/settings").then((response) => {
      var x = [0, 1];
      x = response.data;
      setsettings(response.data);
      // definindo as cores da aplicação.
      var paleta = x.filter(valor => valor.componente == "COLORSCHEME").map(valor => valor.view);
      setschemecolor(paleta == 1 ? 'purplescheme' : 'bluescheme');
    });
  }

  const loadLeitos = () => {
    axios.get(htmlleitos).then((response) => {
      var x = [0, 1]
      x = response.data
      settodosleitos([0, 1]);
      settodosleitos(x.filter(item => item.tp_situacao == "A"));
      // alert('LEITOS: ' + x.filter(item => item.unidade.setor.empresa_id == 1 && item.tp_situacao == "A").length);
      // alert('LEITOS: ' + x.length);
    })
  }

  useEffect(() => {
    //loadHospitais();
    //loadUnidades();
    //loadSettings();
    loadLeitos();
    // getCid();
  }, [])

  return (
    <Context.Provider
      value={{
        // usuários do pulse.
        personas, setpersonas,
        // identificação do usuário logado.
        iduser, setiduser, // ID NUMÉRICO DO USUÁRIO (1)
        idusuario, setidusuario, // USUÁRIO NOME (MASTER.GHAP)
        nomeusuario, setnomeusuario,
        tipousuario, settipousuario,
        categoriausuario, setcategoriausuario,
        especialidadeusuario, setespecialidadeusuario,
        conselhousuario, setconselhousuario, // REGISTRO PROFISSIONAL.
        boss_settings_usuario, setboss_settings_usuario,
        boss_planoterapeutico_usuario, setboss_planoterapeutico_usuario,
        // identificação do atendimento (hospital, unidade de atendimento).
        idatendimento, setidatendimento,
        datainternacao, setdatainternacao,
        convenio, setconvenio,
        idhospital, setidhospital,
        nomehospital, setnomehospital,
        idunidade, setidunidade,
        tipounidade, settipounidade,
        nomeunidade, setnomeunidade,
        box, setbox,
        // dados do atendimento.
        idatendimentoghap, setidatendimentoghap,
        antecedentes, setantecedentes,
        medprev, setmedprev,
        exprev, setexprev,
        hda, sethda,
        hd, sethd,
        conduta, setconduta,
        alergias, setalergias,
        // identificação do paciente.
        idpaciente, setidpaciente,
        dadospaciente, setdadospaciente,
        nomepaciente, setnomepaciente,
        nomemae, setnomemae,
        dn, setdn,
        peso, setpeso,
        // datepicker (data).
        viewdatepicker, setviewdatepicker,
        pickdate1, setpickdate1,
        pickdate2, setpickdate2,
        // componente ativo do prontuário.
        stateprontuario, setstateprontuario,
        // estados para exibição de telas sobrepostas.
        hemoderivados, sethemoderivados,
        printhemoderivados, setprinthemoderivados,
        printtermohemoderivados, setprinttermohemoderivados,
        // listas principais.
        todosleitos, settodosleitos,
        todosatendimentos, settodosatendimentos,
        historicoatendimentos, sethistoricoatendimentos,
        todosconvenios, settodosconvenios,
        todospacientes, settodospacientes,
        // listas do prontuário.
        listevolucoes, setlistevolucoes,
        listghapevolucoes, setlistghapevolucoes,
        arrayevolucao, setarrayevolucao,
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
        listitensprescricao, setlistitensprescricao,
        listbalancos, setlistbalancos,
        listformularios, setlistformularios,
        arrayformularios, setarrayformularios,
        // estados das scrolls (INATIVO).
        scrollmenu, setscrollmenu,
        scrolllist, setscrolllist,
        scrollprescricao, setscrollprescricao,
        scrollitem, setscrollitem,
        scrollitemcomponent, setscrollitemcomponent,
        // settings (visualização de botões do menu principal e de cards da tela principal).
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
        // cards da tela principal.
        cardstatus, setcardstatus,
        cardalertas, setcardalertas,
        cardprecaucao, setcardprecaucao,
        cardriscosassistenciais, setcardriscosassistenciais,
        carddiasinternacao, setcarddiasinternacao,
        cardultimaevolucao, setcardultimaevolucao,
        cardinvasoes, setcardinvasoes,
        carddiagnosticos, setcarddiagnosticos,
        cardlesoes, setcardlesoes,
        cardhistoricoatb, setcardhistoricoatb,
        cardhistoricoatendimentos, setcardhistoricoatendimentos,
        cardanamnese, setcardanamnese,
        // color scheme.
        schemecolor, setschemecolor,
        // APT ivcf / curva de moraes.
        ivcf, setivcf,
        // APT plano terapêutico.
        planoterapeutico, setplanoterapeutico,
        opcoeslinhasdecuidado, setopcoeslinhasdecuidado,
        linhadecuidado, setlinhadecuidado,
        linhadecuidadoatual, setlinhadecuidadoatual,
        idlinhadecuidado, setidlinhadecuidado,

        refreshatendimentos, setrefreshatendimentos,

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

        // APT escalas.
        showescala, setshowescala,
        listescalas, setlistescalas,
        arraylistescalas, setarraylistescalas,

        // documentos e formulários.
        viewdocumento, setviewdocumento,
        viewpdf, setviewpdf,
        viewdatadocumento, setviewdatadocumento,
        conselho, setconselho,
        tipodocumento, settipodocumento,
        statusdocumento, setstatusdocumento,
        usuariodocumento, setusuariodocumento,
        iddocumento, setiddocumento,
        viewconteudo, setviewconteudo,
        datadocumento, setdatadocumento,
        backup, setbackup,

        // assinatura digital.
        signature, setsignature,

        // cid 10
        listcid, setlistcid,
        arraylistcid, setarraylistcid,
      }}
    >
      <div className={schemecolor}>
        <Router>
          <IddleTimeOut translate="no"></IddleTimeOut>
        </Router>
      </div>
    </Context.Provider>
  )
}

export default App
