/* eslint eqeqeq: "off" */
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect, useContext } from 'react'
import Logo from '../components/Logo'
import LogoInverted from '../components/LogoInverted'
import ghap from '../images/ghapmarca.png'
import Toast from '../components/Toast'
import { useHistory } from 'react-router-dom'
import Context from '../Context'


function Login() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  var htmlogin = process.env.REACT_APP_API_LOGIN;

  // recuperando estados globais (Context.API).
  const {
    idhospital, setidhospital,
    nomehospital, setnomehospital,
    setstateprontuario,
    setpersonas, personas,
    setiduser, iduser,
    setidusuario, idusuario,
    setnomeusuario,
    nomeusuario,
    tipousuario,
    settipousuario, // 8 = médico, etc...
    categoriausuario,
    boss_settings_usuario, setboss_settings_usuario,
    boss_planoterapeutico_usuario, setboss_planoterapeutico_usuario,
    setcategoriausuario,
    setespecialidadeusuario, especialidadeusuario,
    setconselhousuario, conselhousuario,
    settodosatendimentos,

    // cid 10.
    listcid, setlistcid,
    arraylistcid, setarraylistcid,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  var usuario = null
  var senha = null

  // executando o logoff do usuário que saiu do Pulse.
  document.addEventListener('beforeunload', (e) => {
    // alert(idusuario);
    // updatePersonaLogout();
    setTimeout(() => {
      e = window.event;
    }, 2000);
  });

  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  const loadAtendimentos = () => {
    // captura registros de atendimentos.
    axios.get(htmlatendimentos).then((response) => {
      var x = [0, 1]
      x = response.data;
      settodosatendimentos(x);
    });
  }

  useEffect(() => {
    // updatePersonaLogout();
    loadUsers();
    loadAtendimentos();
    // eliminando a visão de listas no prontuário (orientando ao painel principal).
    setstateprontuario(1);
    // limpando os campos de login e senha.
    setwelcome(0);
    setidhospital(0);
    setnomehospital('');
    setlistahospitais([]);

    // cid 10.
    // getCid();

    document.getElementById('inputUsuario').value = ''
    document.getElementById('inputSenha').value = ''
  }, [])

  const loadUsers = () => {
    axios.get(htmllistpersonas).then((response) => {
      var h = [0, 1];
      var j = [0, 1];
      h = response.data;
      j = h.rows;
      setpersonas(j);
    });
  }

  /* definindo o valor o tipo de usuário (recepcionista, secretária, gestor,
    plantonista ou especialista), conforme o valor lançado no "inputUsuario". */

  var timeout = null
  const [listahospitais, setlistahospitais] = useState([]);
  const setLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      usuario = document.getElementById('inputUsuario').value
      axios
        .get(htmlogin + "/companies/user?user=" + usuario)
        .then((response) => {
          setshowscrollhospitais(1);
          var x = [0, 1]
          x = response.data
          // alert(JSON.stringify(x.map(item => item.name)));
          setlistahospitais(x);
        });
    }, 1000);
  }

  var htmllistpersonas = process.env.REACT_APP_API_CLONE_LISTPERSONAS;
  var htmlinsertpersona = process.env.REACT_APP_API_CLONE_INSERTPERSONA;
  var htmlupdatepersona = process.env.REACT_APP_API_CLONE_UPDATEPERSONA;

  // const [token, settoken] = useState("");
  var token = '';
  var tokinho = "";

  const [logged, setlogged] = useState(0);
  const getUserData = (token) => {
    usuario = document.getElementById('inputUsuario').value
    axios
      .get(htmlogin + "/user/logged", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then((response) => {
        // alert(JSON.stringify(response.data.user));
        var x = [0, 1];
        var y = [0, 1];
        x = response.data.user;
        setidusuario(x.id); // id do usuário (ex: 'USUARIO.TESTE');
        setnomeusuario(x.name) // nome completo do usuário (ex: 'USUÁRIO TESTE DA SILVA');
        y = response.data.providerType;
        // alert(JSON.stringify(y));
        settipousuario(y.id); // id da categoria profissional (ex: 8);
        setcategoriausuario(y.name); // nome da categoria profissional (ex: "MÉDICO");
        var listcategoriaprofissional = [
          { id: 8, nome: 'MÉDICO', cor: '#AED6F1', conselho: 'CRM' },
          { id: 4, nome: 'ENFERMAGEM', cor: '#76D7C4', conselho: 'COREN' },
          { id: 32, nome: 'FARMÁCIA', cor: '#AED6F1', conselho: 'CRF' },
          { id: 5, nome: 'FISIOTERAPIA', cor: '#BB8FCE', conselho: 'CREFITO' },
          { id: 6, nome: 'FONOAUDIOLOGIA', cor: '#F1948A', conselho: 'CREFONO' },
          { id: 10, nome: 'PSICOLOGIA', cor: '#EDBB99', conselho: 'CRP' },
          { id: 1, nome: 'SERVIÇO SOCIAL', cor: '#F7DC6F', conselho: 'CRESS' },
          { id: 11, nome: 'TERAPIA OCUPACIONAL', cor: '#AEB6BF', conselho: 'CREFITO1' },
          { id: 9, nome: 'NUTRIÇÃO CLÍNICA', cor: 'grey', conselho: 'CRN' },
        ]
        setconselhousuario(listcategoriaprofissional.filter(item => item.id == y.id).map(item => item.conselho).pop());
        // alert(conselhousuario);
        // setespecialidadeusuario(y.???) // especialidade do médico (necessário para as interconsultas).
        // checando se o usuário já é cadastrado no Pulse.
        axios.get(htmllistpersonas).then((response) => {
          var h = [0, 1];
          var j = [0, 1];
          h = response.data;
          j = h.rows;
          setpersonas(j);
          setiduser(j.filter(item => item.idusuario == x.id).map(item => item.id).pop());
          setespecialidadeusuario(j.filter(item => item.idusuario == x.id).map(item => item.especialidadeusuario));
          setboss_settings_usuario(parseInt(j.filter(item => item.idusuario == x.id).map(item => item.boss_settings).pop()));
          setboss_planoterapeutico_usuario(parseInt(j.filter(item => item.idusuario == x.id).map(item => item.boss_planoterapeutico).pop()));
          setlogged(j.filter(item => item.idusuario == x.id).map(item => item.logged));
          setconselhousuario(j.filter(item => item.idusuario == x.id).map(item => item.registro));
          // alert(j.filter(item => item.idusuario == x.id).map(item => item.boss_planoterapeutico));
          if (j.filter(item => item.idusuario == x.id).length < 1) { // usuário MV não é cadastrado no Pulse.
            insertPersona(x, y);
            console.log('CADASTRANDO USUÁRIO MV NO PULSE.')
          } else {
            console.log('USUÁRIO MV JÁ CADASTRADO.');
            // updatePersonaLogin(j.filter(item => item.idusuario == x.id));
          }
          setwelcome(1);
          setTimeout(() => {
            history.push('/todospacientes');
          }, 2000);
          // alert(personas.filter(item => item.idusuario == idusuario).map(item => item.logged));
        })

        // inserindo cadastro de usuário MV no Pulse.
        const insertPersona = (x, y) => {
          var obj = {
            idusuario: x.id,
            nomeusuario: x.name,
            tipousuario: y.id == null ? 4 : y.id,
            categoriausuario: y.name == null ? 'GHAPIANO' : y.name,
            especialidadeusuario: null,
            boss_planoterapeutico: 0,
            boss_settings: 0,
            logged: 1, // já insere e deixa logado.
          }
          // alert(JSON.stringify(obj));
          axios.post(htmlinsertpersona, obj);
        }
        // acessando o Pulse.
        // history.push('/hospitais');
      })
  }

  // atualizando cadastro de usuário MV no Pulse (single sign-on).
  const updatePersonaLogin = (item) => {
    var obj = {
      idusuario: item.map(valor => valor.idusuario).pop(),
      nomeusuario: item.map(valor => valor.nomeusuario).pop(),
      tipousuario: parseInt(item.map(valor => valor.tipousuario).pop()),
      categoriausuario: item.map(valor => valor.categoriausuario).pop(),
      especialidadeusuario: item.map(valor => valor.especialidadeusuario).pop(),
      boss_planoterapeutico: parseInt(item.map(valor => valor.boss_planoterapeutico).pop()),
      boss_settings: parseInt(item.map(valor => valor.boss_settings).pop()),
      logged: 1,
    }
    // alert(JSON.stringify(obj));
    axios.post(htmlupdatepersona + item.map(valor => valor.id).pop(), obj);
  }

  const updatePersonaLogout = () => {
    var obj = {
      idusuario: idusuario,
      nomeusuario: nomeusuario,
      tipousuario: tipousuario,
      categoriausuario: categoriausuario,
      especialidadeusuario: especialidadeusuario,
      boss_planoterapeutico: boss_planoterapeutico_usuario,
      boss_settings: boss_settings_usuario,
      logged: 0,
    }
    var personaid = personas.filter(item => item.idusuario == idusuario).map(item => item.id).pop();
    // alert(JSON.stringify(obj));
    axios.post(htmlupdatepersona + personaid, obj);
  }

  const setSenha = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      usuario = document.getElementById('inputUsuario').value
      senha = document.getElementById('inputSenha').value
      // alert('HOSPITAL: ' + nomehospital + ' ID: ' + idhospital);
      var obj = {
        user: usuario,
        password: senha,
        companyId: idhospital
      }
      axios
        .post(htmlogin + "/sessions", obj)
        .then((response) => {
          token = response.data.token;
          tokinho = response.data.token;
          // alert(tokinho);
          const encodedPayload = tokinho.split(".")[1];
          const decodedPayload = JSON.parse(atob(encodedPayload));
          // alert(JSON.stringify(decodedPayload));

          // modo automático (estilo...);
          // toast(1, "#52be80", 'LOGIN REALIZADO.', 1000);
          getUserData(token);
        })
      /*
      .catch(function (error) {
        if (error.response.status == 401 && document.getElementById("inputSenha").value != "") {
          toast(1, "#ec7063", 'SENHA INCORRETA.', 2000);
        }
      });
      */
    }, 2000);
  }

  // função que retorna o valor de login ao digitarmos no campo login e busca os hospitais.
  const [welcome, setwelcome] = useState(0)
  function Welcome() {
    return (
      <div
        className="fade-in"
        style={{
          display: welcome == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20
        }}
      >
        <div className="title2center" style={{ color: boss_planoterapeutico_usuario == 1 ? '#52be80' : '#8f9bbc' }}>{'OLÁ, ' + nomeusuario + '!'}</div>
        <button
          /*
            onClick={() => {
              if (logged == 0) {
                updatePersonaLogin(personas.filter(item => item.idusuario == idusuario)); history.push('/hospitais');
              } else {
                toast(1, '#ec7063', 'USUÁRIO JÁ LOGADO EM OUTRO DISPOSITIVO!', 3000);
              }
            }}
            */
          onClick={() => history.push('/todospacientes')}
          className="blue-button"
          style={{
            width: 100,
            display: 'none',
            // display: personas.filter(item => item.idusuario == idusuario).map(item => item.logged == 0) ? 'flex' : 'none'
          }}
        >
          OK
        </button>
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

  const [testpersona, settestpersona] = useState(0);
  function TestPersona() {
    return (
      <div className="menucover" style={{ display: testpersona == 1 ? 'flex' : 'none' }}>
        <div className="menucontainer" style={{ padding: 10 }}>
          <div className="title2center" style={{ color: 'red' }}>APENAS PARA TESTES</div>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(5);
              setcategoriausuario('CREFITO');
              setiduser(1);
              setconselhousuario('CREFITO');
              setboss_planoterapeutico_usuario(1);
              setboss_settings_usuario(1);
              history.push('/todospacientes')
            }}
          > FISIOTERAPEUTA
          </button>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(6);
              setcategoriausuario('CREFONO');
              setiduser(1);
              setconselhousuario('CREFONO');
              setboss_planoterapeutico_usuario(0);
              history.push('/todospacientes')
            }}
          > FONOAUDIOLOGO
          </button>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(11);
              setcategoriausuario('TO');
              setiduser(1);
              setconselhousuario('TO');
              setboss_planoterapeutico_usuario(0);
              history.push('/todospacientes')
            }}
          > TERAPEUTA OCUPACIONAL
          </button>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(10);
              setcategoriausuario('CRP');
              setiduser(1);
              setconselhousuario('CRP');
              setboss_planoterapeutico_usuario(0);
              history.push('/todospacientes')
            }}
          > PSICOLOGO
          </button>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(1);
              setcategoriausuario('CRESS');
              setiduser(1);
              setconselhousuario('CRESS');
              setboss_planoterapeutico_usuario(0);
              history.push('/todospacientes')
            }}
          > ASSISTENTE SOCIAL
          </button>
          <button className="blue-button" style={{ padding: 10, width: 250, minWidth: 250 }}
            onClick={() => {
              setnomeusuario('RODRIGO LESSA');
              settipousuario(9);
              setcategoriausuario('CRN');
              setiduser(1);
              setconselhousuario('CRN');
              setboss_planoterapeutico_usuario(0);
              history.push('/todospacientes')
            }}
          > NUTRICIONISTA
          </button>
        </div>
      </div>
    )
  }

  // renderização do componente.
  const [showscrollhospitais, setshowscrollhospitais] = useState(0);
  return (
    <div className="main fade-in" style={{ backgroundColor: '#f2f2f2' }}>
      <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: window.innerWidth > 800 ? '50%' : '100%',
          backgroundColor: '#f2f2f2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          alt=""
          src={ghap}
          style={{
            display: window.innerWidth > 400 ? 'flex' : 'none',
            height: '20%',
            marginTop: window.innerWidth > 800 ? 0 : 0,
            marginBottom: window.innerWidth > 800 ? 0 : 60,
          }}
        ></img>
        <div
          className={window.innerWidth < 400 ? "title5" : "title4"}
          // onClick={() => { setnomeusuario('RODRIGO LESSA'); settipousuario(5); setcategoriausuario('CREFITO'); setiduser(1); setconselhousuario('CREFITO'); setboss_planoterapeutico_usuario(1); history.push('/hospitais') }}
          onClick={() => settestpersona(1)}
          style={{
            position: 'absolute',
            bottom: 0,
            margin: 10,
            fontSize: 12,
            zIndex: 90,
          }}
        >
          Powered By GHAP Tecnologia
        </div>
      </div>
      <div
        className="corprincipal"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: window.innerWidth > 800 ? '50%' : '100%',
          borderRadius: 5,
          margin: window.innerWidth > 800 ? 10 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: window.innerWidth > 800 ? '0px 1px 5px 1px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      >
        <Logo height={window.innerWidth > 400 ? 0.12 * window.innerWidth : '40vw'}></Logo>
        <div
          className="logintitle" style={{ display: window.innerWidth > 400 ? 'none' : 'flex', marginTop: 10 }}
        >
          gPulse
        </div>
        <div
          className="corfundo"
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            // backgroundColor: '#ffffff',
            padding: 20,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div>
            <input
              autoComplete="off"
              placeholder="LOGIN"
              className="input"
              type="text"
              id="inputUsuario"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'LOGIN')}
              onChange={() => setLogin()}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: 200,
                height: 50,
                background: '#ffffff'
              }}
            ></input>
          </div>
          <div>

            <div className="scroll"
              style={{
                display: showscrollhospitais == 1 ? 'flex' : 'none',
                height: 100, width: 200, padding: 5, margin: 5, marginTop: 10, paddingRight: 15, backgroundColor: '#ffffff'
              }}>
              {listahospitais.map((item) => (
                <div
                  className={item.id == idhospital ? "red-button" : "blue-button"}
                  style={{
                    width: '100%', minWidth: '100%', minHeight: 75, padding: 10
                  }}
                  onClick={() => {
                    setnomehospital(item.name);
                    setidhospital(item.id); setshowscrollhospitais(2);
                    setTimeout(() => {
                      document.getElementById("inputSenha").focus();
                    }, 500);
                  }}
                >
                  {JSON.stringify(item.name).slice(7, JSON.stringify(item.name).length - 1)}
                </div>
              ))}
            </div>

            <div className="title2center" style={{ width: 200, color: '#ec7063', display: showscrollhospitais == 2 ? 'flex' : 'none' }}>
              {JSON.stringify(nomehospital).slice(7, JSON.stringify(nomehospital).length - 1)}
            </div>

            <input
              className="input"
              autoComplete="off"
              placeholder="SENHA"
              type="password"
              id="inputSenha"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'SENHA')}
              onKeyUp={() => setSenha()}
              style={{
                display: nomehospital != '' ? 'flex' : 'none',
                marginTop: 15,
                marginBottom: 10,
                width: 200,
                height: 50,
                backgroundColor: '#ffffff'
              }}
            ></input>

          </div>
          <Welcome></Welcome>
          <TestPersona></TestPersona>
        </div>
      </div>
    </div>
  )
}
export default Login

/*
1	ASSISTENTE SOCIAL
2	BIOQUIMICO(A)
3	ODONTOLOGISTA
4	ENFERMEIRO(A)
5	FISIOTERAPEUTA
6	FONOAUDIOLOGO(A)
7	INSTRUMENTADOR(A)
8	MEDICO(A)
9	NUTRICIONISTA
10	PSICOLOGO(A)
11	TERAPEUTA OCUPACIONAL
12	SERVICO DE RADIODIAGNOSTICO
13	SERVICO DE ANALISES CLINICAS
14	TECNICO(A) EM ENFERMAGEM
15	TECNICO(A) EM RADIOLOGIA
16	SERVICO DE ANALISE ANATOMO PAT
17	ADMINISTRATIVOS DE CONTAS
18	ADMINISTRATIVOS SAME
19	TECNICO(A) BIOQUIMICO
20	ANALISTA DE SISTEMAS
21	ENGENHEIRO AGRONOMO
22	TECNICO(A) EM CONTABILIDADE
23	ARQUITETO(A)
24	ENGENHEIRO CIVIL
25	ENGENHEIRO QUIMICO
27	ENGENHEIRO ELETRICO
28	MEDICO(A) VETERINARIO
29	ECONOMISTA
30	ADMINISTRADOR(A)
31	ADMINISTRATIVOS ASSISTENCIAIS
32	FARMACEUTICO(A)
33	CONTADOR(A)
34	QUIMICO(A)
35	ADVOGADO(A)
36	TECNICO(A) EM NUTRICAO
37	ANESTESISTA
38	MEDICO(A) COMISSAO INFECCÃO
39	ENFERM. (A) COMISSAO INFECCAO
54	AUXILIAR DE ENFERMAGEM
55	EMPRESA
56	LITO/TECNICO(A) EM ENFERMAGEM
57	CIRURGIAO DENTISTA
58	BIOMEDICO
59	CONSULTOR EXTERNO
60	ATENDENTE
61	DOULA
*/