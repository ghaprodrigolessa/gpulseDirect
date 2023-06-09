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
function AnamneseFisio() {

  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
    idatendimento,
    conselho,
    tipodocumento,
    camposopcoes,
    setregistros_atuais,
    setregistros_antigos,
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

  let camposusados = [63, 4, 64, 65, 66, 67, 68, 69, 6, 70, 71, 72, 73, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 27, 28, 29, 30, 31, 22, 23, 24, 26, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 74, 75, 76]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CREFITO' && conselho == 'CREFITO') {
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
        id="FORMULÁRIO - ANAMNESE CREFITO"
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
          <div className="title2center" style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE FISIOTERÁPICA</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <EvolucaoTexto idcampo={63} campo={'QUEIXA PRINCIPAL'} obrigatorio={1} tipo={'textarea'} lenght={500} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={4} campo={'DOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={64} campo={'EVA'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={65} campo={'LOCAL DA DOR'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={66} campo={'PREVIAMENTE INDEPENDENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA DOENÇA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoMultipla idcampo={68} campo={'DOENÇAS ASSOCIADAS'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={69} campo={'GLASGOW'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={6} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>DADOS VITAIS</div>
            <EvolucaoTexto idcampo={70} campo={'FR'} obrigatorio={1} tipo={'input'} lenght={3} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={71} campo={'FC'} obrigatorio={1} tipo={'input'} lenght={3} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={72} campo={'SPO2'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
            <EvolucaoTexto idcampo={73} campo={'PA'} obrigatorio={1} tipo={'input'} lenght={7} width={125}></EvolucaoTexto>
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO RESPIRATÓRIA</div>
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
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO MOTORA</div>
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
            <EvolucaoTexto idcampo={76} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={"textarea"} length={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={'60vw'}></EvolucaoTexto>
          </div>
        </div>
      </div>
    )
  };

  function printDiv() {
    console.log('PREPARANDO REGISTROS ATUAIS PARA IMPRESSÃO');
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
      console.log(x.filter(item => item.idevolucao == iddocumento).length);
      setprintdocumento(1);
      setTimeout(() => {
        let printdocument = document.getElementById("PRINTDOCUMENT - ANAMNESE - CREFITO").innerHTML;
        var a = window.open('  ', '  ', 'width=' + '1024px' + ', height=' + '800px');
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
    <div style={{ display: tipodocumento == 'ANAMNESE - CREFITO' && conselho == 'CREFITO' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - ANAMNESE - CREFITO' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default AnamneseFisio;