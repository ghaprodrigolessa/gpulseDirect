/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import EvolucaoTexto from '../components/EvolucaoTexto';
import { PrintDocument } from './PrintDocument';
import { gravaRegistrosDocumentos } from '../components/gravaRegistrosDocumentos';

// viewdocumento 111(form), 112(pdf), 113(busy).
function EvolucaoFisio() {

  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
    idatendimento,
    conselho,
    tipodocumento,
    camposopcoes,
    setcamposvalores,
    setregistros_atuais,
    registros_antigos, setregistros_antigos,
    iddocumento,
    idselecteddocumento,
    setstatusdocumento,
    idpaciente,
    objetivos,
    metas,
    selectedcategoria,
    printdocumento,
    setprintdocumento,
  } = useContext(Context);

  let camposusados = [
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62]

  useEffect(() => {
    if (tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFITO' && conselho == 'CREFITO') {
      {
        gravaRegistrosDocumentos(
          camposusados,
          statusdocumento,
          idatendimento,
          camposopcoes,
          setregistros_atuais,
          setregistros_antigos,
          iddocumento,
          idselecteddocumento,
          setstatusdocumento,
          idpaciente,
          objetivos,
          metas,
        )
      };
    }
  }, [statusdocumento, tipodocumento, selectedcategoria]);

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - EVOLUÇÃO FISIO"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '70vw',
          height: '55vh',
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
          <div id="CORPO DO DOCUMENTO - EVOLUÇÃO ESTRUTURADA - CREFITO">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>EVOLUÇÃO FISIOTERÁPICA</div>
              <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO INICIAL</div>
              <EvolucaoSelecaoSimples idcampo={4} campo={'DOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
              <EvolucaoSelecaoSimples idcampo={5} campo={'VIGÍLIA'} obrigatorio={1}></EvolucaoSelecaoSimples>
              <EvolucaoSelecaoSimples idcampo={6} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
              <EvolucaoSelecaoSimples idcampo={7} campo={'ADESÃO AO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
              <EvolucaoSelecaoSimples idcampo={8} campo={'ACOMPANHADO'} obrigatorio={2}></EvolucaoSelecaoSimples>
              <EvolucaoTexto idcampo={9} campo={'NOME DO ACOMPANHANTE'} obrigatorio={2} tipo={"input"} length={300} width={300}></EvolucaoTexto>
              <EvolucaoSelecaoSimples idcampo={10} campo={'POSIÇÃO NO LEITO'} obrigatorio={2}></EvolucaoSelecaoSimples>
            </div>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO RESPIRATÓRIA</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
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
            </div>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO MOTORA</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
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

              <EvolucaoSelecaoMultipla idcampo={43} campo={'CONDUTA - FISIOTERAPIA MOTORA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
              <EvolucaoTexto idcampo={44} campo={'OUTRAS CONDUTAS - MOTORA'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
              <EvolucaoSelecaoMultipla idcampo={45} campo={'CONDUTA - FISIOTERAPIA RESPIRATÓRIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
              <EvolucaoTexto idcampo={46} campo={'OUTRAS CONDUTAS - RESPIRATÓRIA'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
              <EvolucaoTexto idcampo={47} campo={'TRANSIÇÃO DE CUIDADOS'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
              <EvolucaoTexto idcampo={48} campo={'DISCUSSÃO INTERDISCIPLINAR'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
              <EvolucaoTexto idcampo={49} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
            </div>
            <div style={{ fontSize: 14, textAlign: 'center', padding: 20, fontWeight: 'bold', alignSelf: 'center' }}>UTILIZAÇÃO DE DISPOSITIVOS RESPIRATÓRIOS</div>
            <EvolucaoSelecaoSimples idcampo={50} campo={'DISPOSITIVO RESPIRATÓRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={51} campo={'INDICAÇÃO DE DESMAME O2'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoSelecaoSimples idcampo={54} campo={'CRITÉRIOS DE EXCLUSÃO O2'} obrigatorio={1}></EvolucaoSelecaoSimples>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={57} campo={'DESMAME O2 EFETIVADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoTexto idcampo={58} campo={'DATA DE DESMAME O2'} obrigatorio={1} tipo={"date"} length={10} width={250}></EvolucaoTexto>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={52} campo={'INDICAÇÃO DE DESMAME TQT'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoSelecaoSimples idcampo={55} campo={'CRITÉRIOS DE EXCLUSÃO TQT'} obrigatorio={1}></EvolucaoSelecaoSimples>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={59} campo={'DESMAME TQT EFETIVADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoTexto idcampo={60} campo={'DATA DE DESMAME TQT'} obrigatorio={1} tipo={"date"} length={10} width={250}></EvolucaoTexto>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={53} campo={'INDICAÇÃO DE DESMAME VM'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoSelecaoSimples idcampo={56} campo={'CRITÉRIOS DE EXCLUSÃO VM'} obrigatorio={1}></EvolucaoSelecaoSimples>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <EvolucaoSelecaoSimples idcampo={61} campo={'DESMAME VM EFETIVADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
                <EvolucaoTexto idcampo={62} campo={'DATA DE DESMAME VM'} obrigatorio={1} tipo={"date"} length={10} width={250}></EvolucaoTexto>
              </div>
              <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={'60vw'}></EvolucaoTexto>
            </div>
          </div>
        </div>
      </div >
    )
  };

  function printDiv() {
    console.log('PREPARANDO REGISTROS ATUAIS PARA IMPRESSÃO');
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
      console.log(x.filter(item => item.idevolucao == iddocumento).length);
      setprintdocumento(1);
      setTimeout(() => {
        let printdocument = document.getElementById("PRINTDOCUMENT - EVOLUÇÃO ESTRUTURADA - CREFITO").innerHTML;
        var a = window.open('  ', '  ', 'width=' + '1024px' + ', height=' + '800px');;
        a.document.write('<html>');
        a.document.write(printdocument);
        a.document.write('</html>');
        a.print();
        a.close();
        setprintdocumento(0);
      }, 1000);
    });
  }

  // renderização dos componentes.
  return (
    <div style={{ display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFITO' && conselho == 'CREFITO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - EVOLUÇÃO ESTRUTURADA - CREFITO' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default EvolucaoFisio;