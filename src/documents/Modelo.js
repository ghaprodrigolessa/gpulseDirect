/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import Context from '../Context';
import { Page, Text, View, Document, Image, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import LogoInverted from '../components/LogoInverted';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import EvolucaoTexto from '../components/EvolucaoTexto';

// viewdocumento 111(form), 112(pdf), 113(busy).
function Modelo() {

  // recuperando estados globais (Context.API).
  const {
    statusdocumento,
  } = useContext(Context);

  // registro de fontes para o react-pdf (a lib não aceita ajustar fontWeight).
  Font.register({
    family: 'Roboto',
    src: fontbold,
  });

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO"
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
          pointerEvents: statusdocumento == 1 || statusdocumento == 2 ? 'none' : 'auto',
        }}
      >
        <EvolucaoSelecaoMultipla idcampo={1} campo={'TESTE SELEÇÃO MÚLTIPLA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
        <EvolucaoSelecaoSimples idcampo={2} campo={'TESTE SELEÇÃO ÚNICA'} obrigatorio={1}></EvolucaoSelecaoSimples>
        <EvolucaoTexto idcampo={3} campo={'TESTE TEXTO'} obrigatorio={1} tipo={"input"} tamanho={200}></EvolucaoTexto>
      </div>
    )
  };

  // renderização dos componentes.
  return (
    <div style={{display: 'flex'}}>
      <Form></Form>
    </div>
  )
}

export default Modelo;