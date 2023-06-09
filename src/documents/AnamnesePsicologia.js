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

function AnamnesePsicologia() {

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

  let camposusados = [176, 177, 129, 130, 178, 126, 135, 134, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CRP' && conselho == 'CRP') {
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
        id={"FORMULÁRIO - ANAMNESE PSICOLOGIA"}
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
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DA PSICOLOGIA</div>
            <EvolucaoTexto idcampo={176} campo={'DOENÇA DE BASE'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoTexto idcampo={177} campo={'SÚMULA DE AVALIAÇÃO, EXAME PSÍQUICO E ESTADO AFETIVO GERAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={129} campo={'ESTADO CIVIL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={130} campo={'POSSUI FILHOS'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={178} campo={'PARTICIPAÇÃO DA FAMÍLIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoSimples idcampo={126} campo={'RELIGIÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={135} campo={'ETILISTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={134} campo={'TABAGISTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={179} campo={'DROGAS ILÍCITAS'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={180} campo={'INFORMAÇÕES ADICIONAIS'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoMultipla idcampo={181} campo={'HISTÓRIA DE SUPORTE'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={182} campo={'HISTÓRIA DE SUPORTE - OUTRAS INFORMAÇÕES'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={183} campo={'ESTADO DE ALERTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={184} campo={'COMUNICAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={185} campo={'ATENÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={186} campo={'MEMÓRIA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={187} campo={'PENSAMENTO/DISCURSO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={188} campo={'ORIENTAÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={189} campo={'SENSO/PERCEPÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={190} campo={'ESTADO EMOCIONAL GERAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={191} campo={'DECLÍNIO COGNITIVO APARENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={192} campo={'DEMANDA DE ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={193} campo={'JUSTIFICATIVA DO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoSimples idcampo={194} campo={'FREQUÊNCIA DO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={195} campo={'JUST. PARA ATENDIMENTO SEMANAL'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={196} campo={'JUST. PARA MONITORAMENTO QUINZENAL'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={197} campo={'JUST. PARA MONITORAMENTO MENSAL'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={198} campo={'PROPOSTAS'} obrigatorio={1}></EvolucaoSelecaoMultipla>
            <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={'60vw'}></EvolucaoTexto>
          </div>
        </div>
      </div >
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
        let printdocument = document.getElementById("PRINTDOCUMENT - ANAMNESE - CRP").innerHTML;
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
    <div style={{ display: tipodocumento == 'ANAMNESE - CRP' && conselho == 'CRP' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - ANAMNESE - CRP' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default AnamnesePsicologia;