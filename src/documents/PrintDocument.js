import React, { useContext, useEffect } from 'react';
import Context from '../Context';
import moment from "moment-timezone"
import axios from "axios";
import logo from '../images/paulodetarso_logo.png'

import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoTexto from '../components/EvolucaoTexto';

export const PrintDocument = () => {

  const {
    idatendimento,
    nomeunidade, box,
    datadocumento,
    nomepaciente, nomemae, dn,
    nomeusuario, conselho,
    tipodocumento,
  } = useContext(Context);

  // componentes para impressão do conteúdo (body) dos documentos estruturados.
  function CorpoEvolucaoFisio() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFITO' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>EVOLUÇÃO FISIOTERÁPICA</div>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO INICIAL</div>
          <EvolucaoSelecaoSimples idcampo={4} campo={'DOR'} obrigatorio={1} width={110}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={5} campo={'VIGÍLIA'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={6} campo={'COMPREENSÃO'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={7} campo={'ADESÃO AO ATENDIMENTO'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={8} campo={'ACOMPANHADO'} obrigatorio={2}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={9} campo={'NOME DO ACOMPANHANTE'} obrigatorio={2} tipo={"input"} length={300} width={430}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={10} campo={'POSIÇÃO NO LEITO'} obrigatorio={2}></EvolucaoSelecaoSimples>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO RESPIRATÓRIA</div>
          <EvolucaoSelecaoSimples idcampo={11} campo={'VIA DE ENTRADA DE AR'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={12} campo={'EXPANSIBILIDADE'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={13} campo={'SIMETRIA TORÁCICA'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={14} campo={'ESFORÇO RESPIRATÓRIO'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={15} campo={'RITMO RESPIRATÓRIO'} obrigatorio={1} width={''}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={16} campo={'AUSCULTA RESPIRATÓRIA'} obrigatorio={1} width={560}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={17} campo={'TOSSE'} obrigatorio={1} width={310}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={18} campo={'SECREÇÃO'} obrigatorio={1} width={600}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={19} campo={'OXIGENOTERAPIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={20} campo={'FLUXO'} obrigatorio={2} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={21} campo={'VENTILAÇÃO MECÂNICA'} obrigatorio={1} width={260}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={27} campo={'MODO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={28} campo={'PRESSÃO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={29} campo={'VOLUME'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={30} campo={'PEEP'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={31} campo={'FI'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO MOTORA</div>
          <EvolucaoSelecaoMultipla idcampo={22} campo={'ALTERAÇÕES NEUROMUSCULARES'} obrigatorio={1} width={902}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={23} campo={'ALTERAÇÕES ORTOPÉDICAS'} obrigatorio={1} width={''}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={24} campo={'LOCAL DA ARTRODESE'} obrigatorio={1} tipo={"input"} length={300} width={350}></EvolucaoTexto>
          <EvolucaoTexto idcampo={26} campo={'LOCAL DA OSTEOSSÍNTESE'} obrigatorio={1} tipo={"input"} length={300} width={350}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={32} campo={'MOBILIDADE NO LEITO'} obrigatorio={1} width={400}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={33} campo={'CONTROLE CERVICAL'} obrigatorio={1} width={220}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={34} campo={'CONTROLE DE TRONCO'} obrigatorio={1} width={220}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={35} campo={'TRANSFERÊNCIA'} obrigatorio={1} width={280}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={36} campo={'MARCHA'} obrigatorio={1} width={280}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={37} campo={'DISPOSITIVO'} obrigatorio={1} width={280}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={38} campo={'EQUILÍBRIO'} obrigatorio={1} width={130}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={39} campo={'FORÇA MUSCULAR'} obrigatorio={1} tipo={"input"} length={300} width={360}></EvolucaoTexto>
          <EvolucaoTexto idcampo={40} campo={'AMPLITUDE DE MOVIMENTO'} obrigatorio={1} tipo={"input"} length={300} width={360}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={41} campo={'CONTROLE ESFINCTERIANO URINÁRIO'} obrigatorio={1} width={435}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={42} campo={'CONTROLE ESFINCTERIANO FECAL'} obrigatorio={1} width={435}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={43} campo={'CONDUTA - FISIOTERAPIA MOTORA'} obrigatorio={1} width={900}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={44} campo={'OUTRAS CONDUTAS - MOTORA'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={45} campo={'CONDUTA - FISIOTERAPIA RESPIRATÓRIA'} obrigatorio={1} width={900}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={46} campo={'OUTRAS CONDUTAS - RESPIRATÓRIA'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
          <EvolucaoTexto idcampo={47} campo={'TRANSIÇÃO DE CUIDADOS'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
          <EvolucaoTexto idcampo={48} campo={'DISCUSSÃO INTERDISCIPLINAR'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
          <EvolucaoTexto idcampo={49} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
          <div style={{ marginTop: 10, fontSize: 14, textAlign: 'center', padding: 20, fontWeight: 'bold', alignSelf: 'center', width: '100%' }}>UTILIZAÇÃO DE DISPOSITIVOS RESPIRATÓRIOS</div>
          <EvolucaoSelecaoSimples idcampo={50} campo={'DISPOSITIVO RESPIRATÓRIO'} obrigatorio={1} width={900}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={51} campo={'INDICAÇÃO DE DESMAME O2'} obrigatorio={1} width={235}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={54} campo={'CRITÉRIOS DE EXCLUSÃO O2'} obrigatorio={1} width={635}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={57} campo={'DESMAME O2 EFETIVADO'} obrigatorio={1} width={435}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={58} campo={'DATA DE DESMAME O2'} obrigatorio={1} tipo={"date"} length={10} width={435}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={52} campo={'INDICAÇÃO DE DESMAME TQT'} obrigatorio={1} width={135}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={55} campo={'CRITÉRIOS DE EXCLUSÃO TQT'} obrigatorio={1} width={735}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={59} campo={'DESMAME TQT EFETIVADO'} obrigatorio={1} width={435}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={60} campo={'DATA DE DESMAME TQT'} obrigatorio={1} tipo={"date"} length={10} width={435}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={53} campo={'INDICAÇÃO DE DESMAME VM'} obrigatorio={1} width={135}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={56} campo={'CRITÉRIOS DE EXCLUSÃO VM'} obrigatorio={1} width={735}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={61} campo={'DESMAME VM EFETIVADO'} obrigatorio={1} width={435}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={62} campo={'DATA DE DESMAME VM'} obrigatorio={1} tipo={"date"} length={10} width={435}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={2000} width={900}></EvolucaoTexto>
        </div>
      </div>
    )
  }
  function CorpoEvolucaoFono() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CREFONO' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <div id="CORPO DO DOCUMENTO - EVOLUÇÃO ESTRUTURADA - CREFONO"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>EVOLUÇÃO FONOAUDIOLÓGICA</div>
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO CLÍNICA</div>
            <EvolucaoSelecaoSimples idcampo={79} campo={'ESTADO DE ALERTA'} obrigatorio={1} width={630}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={80} campo={'ORIENTADO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={109} campo={'RESPIRAÇÃO ESPONTÂNEA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={81} campo={'DISPOSITIVOS'} obrigatorio={1} width={330}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={82} campo={'TIPO DE CÂNULA TQT'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={83} campo={'NÚMERO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={2} width={150}></EvolucaoTexto>
            <EvolucaoTexto idcampo={84} campo={'MODELO DA CÂNULA DE TQT'} obrigatorio={1} tipo={'input'} lenght={100} width={150}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={85} campo={'CUFF'} obrigatorio={1} width={330}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={110} campo={'INDICAÇÃO PARA DESMAME DE VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} width={550}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={111} campo={'CRITÉRIOS DE EXCLUSÃO PARA DESMAME DE VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>COMUNICAÇÃO</div>
            <EvolucaoSelecaoSimples idcampo={90} campo={'COMPREENSÃO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={91} campo={'EXPRESSÃO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
            <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ALIMENTAÇÃO</div>
            <EvolucaoSelecaoSimples idcampo={86} campo={'VIA DE ALIMENTAÇÃO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={87} campo={'DIETA POR VIA ORAL'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={88} campo={'HIDRATAÇÃO'} obrigatorio={1} width={480}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={89} campo={'ESPESSANTE'} obrigatorio={1} ></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={112} campo={'APETITE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={113} campo={'CRITÉRIO PARA BLUE DYE'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={114} campo={'RESULTADO DO TESTE BLUE DYE'} obrigatorio={1} tipo={'textarea'} lenght={300} width={905}></EvolucaoTexto>
            <EvolucaoTexto idcampo={115} campo={'EVOLUÇÃO FONOAUDIOLÓGICA'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={105} campo={'DIETA'} obrigatorio={1} width={350}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={106} campo={'CONSISTÊNCIA DO ALIMENTO'} obrigatorio={1} width={250}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={107} campo={'CONSISTÊNCIA DO LÍQUIDO'} obrigatorio={1} width={250}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoMultipla idcampo={116} campo={'MODO DE OFERTA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
            <EvolucaoSelecaoMultipla idcampo={117} campo={'CONDUTA FONOAUDIOLÓGICA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
            <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
              <div className="title2center" style={{ marginTop: 10, fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ESCALA DE FOIS APÓS ABORDAGEM</div>
              <EvolucaoTexto idcampo={203} campo={'ESCALA FOIS'} obrigatorio={1} tipo={'card'} lenght={10} width={150} valor_escala={null}></EvolucaoTexto>
            </div>
            <EvolucaoSelecaoSimples idcampo={118} campo={'DESMAME DE VIA ALIMENTAR ALTERNATIVA EFETIVADO DURANTE ESTA INTERNAÇÃO'} obrigatorio={1} width={350}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={119} campo={'DATA DE EFETIVAÇÃO DO DESMAME DA VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} tipo={'date'} lenght={10} width={905}></EvolucaoTexto>
            <EvolucaoTexto idcampo={120} campo={'JUSTIFICATIVA PARA A NÃO EFETIVAÇÃO DO DESMAME DA VIA ALIMENTAR ALTERNATIVA'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={121} campo={'VÍNCULO COM O SETOR'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={122} campo={'PROGNÓSTICO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={47} campo={'TRANSIÇÃO DE CUIDADOS'} obrigatorio={1} tipo={"textarea"} length={2000} width={905}></EvolucaoTexto>
            <EvolucaoTexto idcampo={48} campo={'DISCUSSÃO INTERDISCIPLINAR'} obrigatorio={1} tipo={"textarea"} length={2000} width={905}></EvolucaoTexto>
            <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
          </div>
        </div>
      </div>
    )
  }
  function CorpoEvolucaoPsico() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRP' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <EvolucaoSelecaoMultipla idcampo={199} campo={'JUSTIFICATIVA DO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={200} campo={'SÚMULA DO ACOLHIMENTO, EXAME PSÍQUICO E ESTADO AFETIVO GERAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={201} campo={'FINALIZAÇÃO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={202} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
        </div>
      </div>
    )
  }
  function CorpoEvolucaoSocial() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - CRESS' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <EvolucaoSelecaoSimples idcampo={146} campo={'FREQUÊNCIA DE ATENDIMENTO'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={147} campo={'TIPO DE ATENDIMENTO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={148} campo={'EVOLUÇÃO DA ASSISTÊNCIA SOCIAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
        </div>
      </div>
    )
  }
  function CorpoEvolucaoTo() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'EVOLUÇÃO ESTRUTURADA - TO' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>EVOLUÇÃO DA TERAPIA OCUPACIONAL</div>
          <EvolucaoSelecaoSimples idcampo={149} campo={'LOCAL DO ATENDIMENTO'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={150} campo={'ACOMPANHANTE PRESENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={151} campo={'NOME DO ACOMPANHANTE'} obrigatorio={1} tipo={'input'} lenght={200} width={520}></EvolucaoTexto>
          <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA DOENÇA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={22} campo={'ALTERAÇÕES MOTORAS'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoSimples idcampo={152} campo={'APRESENTAÇÃO'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>CONDUTA</div>
          <EvolucaoSelecaoMultipla idcampo={153} campo={'INTERVENÇÕES RESTAURADORAS DAS FUNÇÕES DO CORPO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={154} campo={'OUTRAS INTERVENÇÕES RESTAURADORAS DAS FUNÇÕES DO CORPO'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={155} campo={'ATIVIDADE E PARTICIPAÇÃO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={156} campo={'OUTRAS ATIVIDADES E PARTICIPAÇÕES'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={157} campo={'FATORES AMBIENTAIS'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={158} campo={'OUTROS FATORES AMBIENTAIS'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={159} campo={'OBSERVAÇÕES - TERAPIA OCUPACIONAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={48} campo={'DISCUSSÃO INTERDISCIPLINAR'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={160} campo={'TRANSIÇÃO DE CUIDADOS - TERAPIA OCUPACIONAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
        </div>
      </div>
    )
  }
  function CorpoAnamneseTo() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'ANAMNESE - TO' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DA TERAPIA OCUPACIONAL</div>
          <EvolucaoSelecaoSimples idcampo={150} campo={'ACOMPANHANTE PRESENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={151} campo={'NOME DO ACOMPANHANTE'} obrigatorio={1} tipo={'input'} lenght={200} width={550}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={161} campo={'GÊNERO'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={129} campo={'ESTADO CIVIL'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={128} campo={'ESCOLARIDADE'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={162} campo={'DOMINÂNCIA'} obrigatorio={1} width={340}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={163} campo={'OCUPAÇÃO'} obrigatorio={1} width={540}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={164} campo={'PROFISSÃO'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={165} campo={'NATURALIDADE'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={166} campo={'CIDADE'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={167} campo={'BAIRRO'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={137} campo={'MORA COM QUEM?'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={136} campo={'PRINCIPAL CUIDADOR'} obrigatorio={1} tipo={'input'} lenght={200} width={440}></EvolucaoTexto>
          <EvolucaoTexto idcampo={168} campo={'MOTIVO DA INTERNAÇÃO'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={169} campo={'MOBILIDADE PRÉVIA'} obrigatorio={1}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoSimples idcampo={170} campo={'ATIVIDADES BÁSICAS DE VIDA DIÁRIA'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={171} campo={'ATIVIDADES INSTRUMENTAIS DE VIDA DIÁRIA'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={152} campo={'APRESENTAÇÃO'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={22} campo={'ALTERAÇÕES MOTORAS'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={92} campo={'ALTERAÇÕES DA FALA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={40} campo={'AMPLITUDE DE MOVIMENTO'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={172} campo={'PELE'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={173} campo={'CONDUTA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={174} campo={'FUNCIONALIDADE ATUAL'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={175} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
        </div>
      </div>
    )
  }

  function CorpoAnamneseFisio() {
    return (
      <div style={{ fontFamily: 'Helvetica', width: '100%' }}>
        <div
          style={{
            display: tipodocumento == 'ANAMNESE - CREFITO' ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
          <div className="title2center" style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center', width: '100%' }}>ANAMNESE FISIOTERÁPICA</div>
          <EvolucaoTexto idcampo={63} campo={'QUEIXA PRINCIPAL'} obrigatorio={1} tipo={'textarea'} lenght={500} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={4} campo={'DOR'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={64} campo={'EVA'} obrigatorio={1} tipo={'input'} lenght={2} width={125}></EvolucaoTexto>
          <EvolucaoTexto idcampo={65} campo={'LOCAL DA DOR'} obrigatorio={1} tipo={'input'} lenght={2} width={450}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={66} campo={'PREVIAMENTE INDEPENDENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={67} campo={'HISTÓRIA DA DOENÇA ATUAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={905}></EvolucaoTexto>
          <EvolucaoSelecaoMultipla idcampo={68} campo={'DOENÇAS ASSOCIADAS'} obrigatorio={1} width={420}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={69} campo={'GLASGOW'} obrigatorio={1} tipo={'input'} lenght={2} width={260}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={6} campo={'COMPREENSÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>DADOS VITAIS</div>
          <EvolucaoTexto idcampo={70} campo={'FR'} obrigatorio={1} tipo={'input'} lenght={3} width={210}></EvolucaoTexto>
          <EvolucaoTexto idcampo={71} campo={'FC'} obrigatorio={1} tipo={'input'} lenght={3} width={210}></EvolucaoTexto>
          <EvolucaoTexto idcampo={72} campo={'SPO2'} obrigatorio={1} tipo={'input'} lenght={2} width={210}></EvolucaoTexto>
          <EvolucaoTexto idcampo={73} campo={'PA'} obrigatorio={1} tipo={'input'} lenght={7} width={210}></EvolucaoTexto>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO RESPIRATÓRIA</div>
          <EvolucaoSelecaoSimples idcampo={11} campo={'VIA DE ENTRADA DE AR'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={12} campo={'EXPANSIBILIDADE'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={13} campo={'SIMETRIA TORÁCICA'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={14} campo={'ESFORÇO RESPIRATÓRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={15} campo={'RITMO RESPIRATÓRIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={16} campo={'AUSCULTA RESPIRATÓRIA'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={17} campo={'TOSSE'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={18} campo={'SECREÇÃO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={19} campo={'OXIGENOTERAPIA'} obrigatorio={1} width={440}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={20} campo={'FLUXO'} obrigatorio={2} tipo={"input"} length={3} width={440}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={21} campo={'VENTILAÇÃO MECÂNICA'} obrigatorio={1} width={240}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={27} campo={'MODO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={28} campo={'PRESSÃO'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={29} campo={'VOLUME'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={30} campo={'PEEP'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <EvolucaoTexto idcampo={31} campo={'FI'} obrigatorio={1} tipo={"input"} length={3} width={100}></EvolucaoTexto>
          <div className="title2center" style={{ marginTop: 10, width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>AVALIAÇÃO MOTORA</div>
          <EvolucaoSelecaoMultipla idcampo={22} campo={'ALTERAÇÕES NEUROMUSCULARES'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoMultipla idcampo={23} campo={'ALTERAÇÕES ORTOPÉDICAS'} obrigatorio={1} width={280}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={24} campo={'LOCAL DA ARTRODESE'} obrigatorio={1} tipo={"input"} length={300} width={280}></EvolucaoTexto>
          <EvolucaoTexto idcampo={26} campo={'LOCAL DA OSTEOSSÍNTESE'} obrigatorio={1} tipo={"input"} length={300} width={280}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={32} campo={'MOBILIDADE NO LEITO'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={33} campo={'CONTROLE CERVICAL'} obrigatorio={1} width={240}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={34} campo={'CONTROLE DE TRONCO'} obrigatorio={1}  width={240}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={35} campo={'TRANSFERÊNCIA'} obrigatorio={1} width={360}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={36} campo={'MARCHA'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={37} campo={'DISPOSITIVO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={38} campo={'EQUILÍBRIO'} obrigatorio={1} width={240}></EvolucaoSelecaoMultipla>
          <EvolucaoTexto idcampo={39} campo={'FORÇA MUSCULAR'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
          <EvolucaoTexto idcampo={40} campo={'AMPLITUDE DE MOVIMENTO'} obrigatorio={1} tipo={"input"} length={300} width={300}></EvolucaoTexto>
          <EvolucaoSelecaoSimples idcampo={41} campo={'CONTROLE ESFINCTERIANO URINÁRIO'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoSimples idcampo={42} campo={'CONTROLE ESFINCTERIANO FECAL'} obrigatorio={1} width={440}></EvolucaoSelecaoSimples>
          <EvolucaoSelecaoMultipla idcampo={74} campo={'PROGNÓSTICO'} obrigatorio={1} width={905}></EvolucaoSelecaoMultipla>
          <EvolucaoSelecaoSimples idcampo={75} campo={'LOCAL DO ATENDIMENTO'} obrigatorio={1} width={905}></EvolucaoSelecaoSimples>
          <EvolucaoTexto idcampo={76} campo={'OBSERVAÇÕES'} obrigatorio={1} tipo={"textarea"} length={2000} width={905}></EvolucaoTexto>
          <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={905}></EvolucaoTexto>
        </div>
      </div>
    )
  }

  return (
    <table className="report-container">
      <thead className="report-header">
        <tr>
          <th className="report-header-cell">
            <div className="header-info">
              <div fixed={true} id="CABEÇALHO"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 10,
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 5,
                  fontFamily: 'Helvetica',
                  margin: 5,
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
                        width: 150, height: 60,
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
                <div id="nome do paciente + id do paciente"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ fontSize: 14, margin: 5, fontWeight: 'bold', alignSelf: 'flex-start' }}>{'PACIENTE: ' + nomepaciente}</div>
                  <div style={{ fontSize: 12, margin: 5, marginTop: 0, marginBottom: 0, alignSelf: 'flex-start' }}>{'MÃE: ' + nomemae}</div>
                  <div style={{ flexDirection: 'row', margin: 5, marginTop: 2.5, alignSelf: 'flex-start' }}>
                    <div style={{ fontSize: 12, margin: 0 }}>{'DN: ' + dn + ' (' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</div>
                  </div>
                </div>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tfoot className="report-footer">
        <tr>
          <td className="report-footer-cell">
            <div className="footer-info">
              <div id="assinatura"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 5,
                  fontFamily: 'Helvetica',
                  margin: 5,
                  height: 100,
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 10, margin: 5 }}>{'DOCUMENTO ASSINADO DIGITALMENTE POR:'}</div>
                  <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{nomeusuario}</div>
                  <div style={{ fontSize: 14, margin: 2.5, fontWeight: 'bold' }}>{conselho}</div>
                </div>
                <div style={{ width: 100, height: 100, backgroundColor: 'grey', borderRadius: 5, alignSelf: 'center' }}>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td>
            <div>
              <CorpoEvolucaoFisio></CorpoEvolucaoFisio>
              <CorpoEvolucaoFono></CorpoEvolucaoFono>
              <CorpoEvolucaoPsico></CorpoEvolucaoPsico>
              <CorpoEvolucaoSocial></CorpoEvolucaoSocial>
              <CorpoEvolucaoTo></CorpoEvolucaoTo>
              <CorpoAnamneseFisio></CorpoAnamneseFisio>

              <CorpoAnamneseTo></CorpoAnamneseTo>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}