/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoTexto from '../components/EvolucaoTexto';
import { PrintDocument } from './PrintDocument';
import { gravaRegistrosDocumentos } from '../components/gravaRegistrosDocumentos';

function EvolucaoLivre() {

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

  let camposusados = [199, 200, 201, 202];

  useEffect(() => {
    if (tipodocumento != 0 && tipodocumento.includes('LIVRE') == true) {
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
        id="FORMULÁRIO - EVOLUÇÃO LIVRE"
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
          <div id="CORPO DO DOCUMENTO - EVOLUÇÃO LIVRE"
            style={{
              display: 'flex', flexDirection: 'row',
              justifyContent: 'space-between', flexWrap: 'wrap'
            }}>
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>EVOLUÇÃO LIVRE</div>
            <EvolucaoTexto idcampo={207} campo={'EVOLUÇÃO LIVRE'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
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
        let printdocument = document.getElementById("PRINTDOCUMENT - EVOLUÇÃO LIVRE").innerHTML;
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
    <div style={{ display: tipodocumento != 0 && tipodocumento.includes('LIVRE') == true && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - EVOLUÇÃO LIVRE' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default EvolucaoLivre;