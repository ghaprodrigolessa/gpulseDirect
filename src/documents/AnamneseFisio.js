/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from '../Context';
import axios from 'axios'
import moment from 'moment';
import logo from '../images/paulodetarso_logo.png'
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import imprimir from '../images/imprimir.svg';

import EvolucaoTexto from '../components/EvolucaoTexto';

// viewdocumento 111(form), 112(pdf), 113(busy).
function AnamneseFisio() {

  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
    printdocumento, setprintdocumento,
    idatendimento,
    nomeunidade, box,
    datadocumento,
    nomepaciente, nomemae, dn,
    nomeusuario, conselho,
    tipodocumento,
    camposopcoes, setcamposopcoes,
    camposvalores, setcamposvalores,
    registros_atuais, setregistros_atuais,
    registros_antigos, setregistros_antigos,
    idcampo, setidcampo,
    iddocumento,
    idselecteddocumento,
    setstatusdocumento,
    idpaciente,
    selectedcategoria,
  } = useContext(Context);

  let camposusados = [63, 4, 64, 65, 66, 67, 68, 69, 6, 70, 71, 72, 73, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 27, 28, 29, 30, 31, 22, 23, 24, 26, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 74, 75, 76]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CREFITO' && conselho == 'CREFITO') {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        setregistros_antigos(x.filter(item => item.evolucao == 'ANAMNESE - CREFITO' && item.idevolucao < iddocumento));
        setcamposvalores(x.rows);
        if (statusdocumento == -2) {
          console.log('COPIA VALOR DA EVOLUÇÃO SELECIONADA');
          camposusados.map(item => x.filter(valor => valor.idcampo == item && valor.idevolucao == idselecteddocumento).map(item => copiaValor(item)));
          setTimeout(() => {
            axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
              var x = [0, 1];
              x = response.data.rows;
              setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
              setstatusdocumento(0);
            });
          }, 1000);
        } else if (statusdocumento == -1 && iddocumento != 0) {
          console.log('CRIA VALOR NOVO');
          if (registros_antigos.length > 0) {
            var lastid = null;
            var htmlghapevolucoes = process.env.REACT_APP_API_CLONE_EVOLUCOES;
            axios.get(htmlghapevolucoes + idpaciente).then((response) => {
              var x = [0, 1];
              var y = [0, 1];
              x = response.data;
              y = x.rows;
              var lastevolution = y.sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento).slice(-1);
              lastid = lastevolution.map(item => item.id).pop();
              console.log(lastid);
              console.log('ANTIGOS!')
              camposusados.map(item => registros_antigos.filter(valor => valor.idcampo == item && valor.idevolucao == lastid - 1).map(item => insertValor(item, item.idcampo, item.idopcao, item.valor)));
            });
          } else {
            camposusados.map(item => camposopcoes.filter(valor => valor.idcampo == item).map(item => insertValor(item, item.idcampo, item.id, null)));
          }
          setTimeout(() => {
            axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
              var x = [0, 1];
              x = response.data.rows;
              setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
              setstatusdocumento(0);
            });
          }, 1000);
        } else if (statusdocumento > -1) {
          setregistros_atuais([]);
          console.log('RECUPERANDO VALOR DO DOCUMENTO');
          axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
            var x = [0, 1];
            x = response.data.rows;
            setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
          });
        }
      });
    }
  }, [statusdocumento, tipodocumento, selectedcategoria]);

  const insertValor = (item, idcampo, idopcao, valor) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: idcampo,
      idopcao: idopcao,
      opcao: item.opcao,
      valor: valor,
      idevolucao: iddocumento
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
    });
  }

  const copiaValor = (item) => {
    // inserindo registro.  
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      idcampo: item.idcampo,
      idopcao: item.idopcao,
      opcao: item.opcao,
      valor: item.valor,
      idevolucao: iddocumento // id do documento recém-criado.
    }
    console.log(obj);
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj).then(() => {
      // loadCamposValores();
    });
  }

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - ANAMNESE FISIO"
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
          <div fixed={true} id="CABEÇALHO" style={{
            display: printdocumento == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 2.5,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            fontFamily: 'Helvetica',
            margin: 2.5,
            marginTop: 5,
            height: 130,
          }}>
            <div id='logo + nome do hospital + id do documento'
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <img id="logo"
                  alt=""
                  src={logo}
                  style={{
                    margin: 0,
                    width: 80, height: 60,
                    alignSelf: 'center',
                  }}
                ></img>
                <div id="nome do hospital"
                  style={{ fontSize: 18, textAlign: 'center', padding: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                  {'CLÍNICA DE TRANSIÇÃO PAULO DE TARSO'}
                </div>
              </div>
              <div id="id do documento"
                style={{
                  display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', padding: 5, backgroundColor: '#f2f2f2', borderRadius: 5, margin: 5, alignSelf: 'center'
                }}>
                <div style={{ fontSize: 10, margin: 2.5, marginTop: 0, textAlign: 'right' }}>{'ATENDIMENTO: ' + idatendimento}</div>
                <div style={{ fontSize: 10, margin: 2.5, textAlign: 'right' }}>{nomeunidade + ' - ' + box}</div>
                <div style={{ fontSize: 10, margin: 2.5, marginBottom: 0, textAlign: 'right' }}>{'EMITIDO EM: ' + moment(datadocumento).format('DD/MM/YYYY - HH:mm')}</div>
              </div>
            </div>
            <div id="nome do paciente + id do paciente">
              <div style={{ fontSize: 14, margin: 5, fontWeight: 'bold' }}>{'PACIENTE: ' + nomepaciente}</div>
              <div style={{ fontSize: 10, margin: 5, marginTop: 0, marginBottom: 0 }}>{'MÃE: ' + nomemae}</div>
              <div style={{ flexDirection: 'row', margin: 5, marginTop: 2.5 }}>
                <div style={{ fontSize: 10, margin: 0 }}>{'DN: ' + dn + ' (' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO INICIAL</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <EvolucaoTexto idcampo={63} campo={'QUEIXA PRINCIPAL'} obrigatorio={1} tipo={'textarea'} lenght={500} width={500}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={4} campo={'DOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={64} campo={'EVA'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={65} campo={'LOCAL DA DOR'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={66} campo={'PREVIAMENTE INDEPENDENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA DOENÇA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={500}></EvolucaoTexto>
            <EvolucaoSelecaoMultipla idcampo={68} campo={'DOENÇAS ASSOCIADAS'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={69} campo={'GLASGOW'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={6} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <div style={{ fontSize: 14, textAlign: 'center', padding: 10, fontWeight: 'bold', alignSelf: 'center' }}>DADOS VITAIS</div>
            <EvolucaoTexto idcampo={70} campo={'FR'} obrigatorio={1} tipo={'input'} lenght={3} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={71} campo={'FC'} obrigatorio={1} tipo={'input'} lenght={3} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={72} campo={'SPO2'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={73} campo={'PA'} obrigatorio={1} tipo={'input'} lenght={7} width={125}></EvolucaoTexto>

            <EvolucaoSelecaoSimples idcampo={11} campo={'VIA DE ENTRADA DE AR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={12} campo={'EXPANSIBILIDADE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={13} campo={'SIMETRIA TORÁCICA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={14} campo={'ESFORÇO RESPIRATÓRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={15} campo={'RITMO RESPIRATÓRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={16} campo={'AUSCULTA RESPIRATÓRIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={17} campo={'TOSSE'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={18} campo={'SECREÇÃO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={19} campo={'OXIGENOTERAPIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={20} campo={'FLUXO'} obrigatorio={2} tipo={"input"} length={3} width={100}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={21} campo={'VENTILAÇÃO MECÂNICA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={27} campo={'MODO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
            <EvolucaoTexto idcampo={28} campo={'PRESSÃO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
            <EvolucaoTexto idcampo={29} campo={'VOLUME'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
            <EvolucaoTexto idcampo={30} campo={'PEEP'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
            <EvolucaoTexto idcampo={31} campo={'FI'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>

            <EvolucaoSelecaoMultipla idcampo={22} campo={'ALTERAÇÕES NEUROMUSCULARES'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={23} campo={'ALTERAÇÕES ORTOPÉDICAS'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={24} campo={'LOCAL DA ARTRODESE'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
            <EvolucaoTexto idcampo={26} campo={'LOCAL DA OSTEOSSÍNTESE'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={32} campo={'MOBILIDADE NO LEITO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={33} campo={'CONTROLE CERVICAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={34} campo={'CONTROLE DE TRONCO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={35} campo={'TRANSFERÊNCIA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={36} campo={'MARCHA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={37} campo={'DISPOSITIVO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={38} campo={'EQUILÍBRIO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={39} campo={'FORÇA MUSCULAR'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
            <EvolucaoTexto idcampo={40} campo={'AMPLITUDE DE MOVIMENTO'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={41} campo={'CONTROLE ESFINCTERIANO URINÁRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={42} campo={'CONTROLE ESFINCTERIANO FECAL'} obrigatorio={1}></EvolucaoSelecaoSimples>

            <EvolucaoSelecaoMultipla idcampo={74} campo={'PROGNÓSTICO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoSimples idcampo={75} campo={'LOCAL DO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={76} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={"input"} length={2000} width={300}></EvolucaoTexto>

          </div>

          <div id="assinatura"
            style={{
              display: printdocumento == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center', alignSelf: 'center', width: '100%',
              alignContent: 'center', textAlign: 'center',
              marginTop: 20,
            }}>
            <div style={{ fontSize: 10, margin: 5 }}>{'DOCUMENTO ASSINADO DIGITALMENTE POR:'}</div>
            <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{nomeusuario}</div>
            <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{conselho}</div>
          </div>

        </div>
      </div >
    )
  };

  function printDiv() {
    setprintdocumento(1);
    setTimeout(() => {
      var divContents = document.getElementById("FORMULÁRIO - ANAMNESE FISIO").innerHTML;
      var a = window.open();
      a.document.write('<html>');
      a.document.write(divContents);
      a.document.write('</body></html>');
      a.print();
      a.close();
      setprintdocumento(0);
    }, 1000);
  }

  // renderização dos componentes.
  return (
    <div style={{ display: tipodocumento == 'ANAMNESE - CREFITO' && conselho == 'CREFITO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
    </div>
  )
}

export default AnamneseFisio;