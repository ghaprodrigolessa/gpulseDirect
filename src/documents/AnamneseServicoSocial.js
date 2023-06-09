/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from '../Context';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';
import moment from 'moment';
import EvolucaoSelecaoMultipla from '../components/EvolucaoSelecaoMultipla';
import EvolucaoSelecaoSimples from '../components/EvolucaoSelecaoSimples';
import EvolucaoTexto from '../components/EvolucaoTexto';
import { PrintDocument } from './PrintDocument';
import { gravaRegistrosDocumentos } from '../components/gravaRegistrosDocumentos';

function AnamneseServicoSocial() {

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

  let camposusados = [123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 205]

  useEffect(() => {
    if (tipodocumento == 'ANAMNESE - CRESS' && conselho == 'CRESS') {
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

  // ESCALA DE GIJÓN (showescala = 9).
  function Gijon() {
    const [situacaofamiliar, setsituacaofamiliar] = useState(-1);
    const [situacaoeconomica, setsituacaoeconomica] = useState(0);
    const [relacoessociais, setrelacoessociais] = useState(0);
    const [contatofamilia, setcontatofamilia] = useState(0);
    const [apoioredesocial, setapoioredesocial] = useState(0);
    const [habitacao, sethabitacao] = useState(0);

    var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
    const [score, setscore] = useState(0);
    const insertGijon = () => {
      setscore(situacaofamiliar + situacaoeconomica + relacoessociais + contatofamilia + apoioredesocial + habitacao);
      var significado = '';
      if (score < 10) {
        significado = 'BOA SITUAÇÃO SOCIAL';
      } else if (score > 9 && score < 15) {
        significado = 'RISCO SOCIAL';
      } else {
        significado = 'PROBLEMA SOCIAL';
      }
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        data: moment(),
        cd_escala: 9,
        ds_escala: 'GIJÓN',
        valor_resultado: score,
        ds_resultado: significado,
        idprofissional: 0,
        status: 1,
      }
      axios.post(htmlghapinsertescala, obj).then(() => {
        // loadEscalas();
      })
    }
    const updateGijonValor = () => {
      axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data.rows;
        var id = x
          .filter(valor => valor.idevolucao == iddocumento && valor.idcampo == 205)
          .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.id);
        // atualizando registro.  
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          data: moment(),
          idcampo: 205,
          idopcao: 677,
          opcao: 'ESCALA - GIJON',
          valor: situacaofamiliar + situacaoeconomica + relacoessociais + contatofamilia + apoioredesocial + habitacao,
          idevolucao: iddocumento
        }
        console.log(obj);
        axios.post('http://192.168.100.6:3333/update_evolucao_valor/' + id, obj);
      });
    }

    // destacando botões selecionados nas escalas.
    const setActive = (escala, btn) => {
      var botoes = document.getElementById(escala).getElementsByClassName("red-button");
      for (var i = 0; i < botoes.length; i++) {
        botoes.item(i).className = "blue-button";
      }
      document.getElementById(btn).className = "red-button"
    }

    return (
      <div>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE GIJÓN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="green-button"
                onClick={() => { insertGijon(); updateGijonValor() }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div
            className="corpo">
            <div>
              <div className="scroll"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 5, height: '60vh' }}>
                <div className="title2center">SITUAÇÃO FAMILIAR</div>
                <div id="SITUACAO_FAMILIAR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="sf1"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(0); setActive("SITUACAO_FAMILIAR", "sf1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM A FAMÍLIA SEM DEPENDÊNCIA FÍSICA OU PSÍQUICA
                  </button>
                  <button id="sf2"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(1); setActive("SITUACAO_FAMILIAR", "sf2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM CONJUJE/ COMPANHEIRO DE SIMILARIDADE
                  </button>
                  <button id="sf3"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(2); setActive("SITUACAO_FAMILIAR", "sf3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM A FAMÍLIA E/OU CONJUGUE/COMPANHEIRO COM ALGUM GRAU DE DEPENDÊNCIA
                  </button>
                  <button id="sf4"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(3); setActive("SITUACAO_FAMILIAR", "sf4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE COM PESSOAS QUE NÃO SÃO FAMILIARES POR LAÇOS SANGUÍNEOS
                  </button>
                  <button id="sf5"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(4); setActive("SITUACAO_FAMILIAR", "sf5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE SOZINHO, MAS TEM FAMILIARES PRÓXIMOS
                  </button>
                  <button id="sf6"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(5); setActive("SITUACAO_FAMILIAR", "sf6") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VIVE SOZINHO, SEM FILHOS OU FAMILIARES PRÓXIMOS
                  </button>
                  <button id="sf7"
                    className="blue-button"
                    onClick={() => { setsituacaofamiliar(6); setActive("SITUACAO_FAMILIAR", "sf7") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    {"ESTÁ INSTITUCIONALIZADO (LONGA PERMANÊNCIA)"}
                  </button>
                </div>
                <div className="title2center">SITUAÇÃO ECONÔMICA</div>
                <div id="SITUACAO_ECONOMICA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="se1"
                    className="blue-button"
                    onClick={() => { setsituacaoeconomica(0); setActive("SITUACAO_ECONOMICA", "se1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    MAIS DE 3 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se2"
                    className="blue-button"
                    onClick={() => { setsituacaoeconomica(1); setActive("SITUACAO_ECONOMICA", "se2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    DE 2 A 3 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se3"
                    className="blue-button"
                    onClick={() => { setsituacaoeconomica(2); setActive("SITUACAO_ECONOMICA", "se3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    DE 1 A 2 SALÁRIOS MÍNIMOS
                  </button>
                  <button id="se4"
                    className="blue-button"
                    onClick={() => { setsituacaoeconomica(3); setActive("SITUACAO_ECONOMICA", "se4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    ABAIXO DE 1 SALÁRIO MÍNIMO
                  </button>
                  <button id="se5"
                    className="blue-button"
                    onClick={() => { setsituacaoeconomica(4); setActive("SITUACAO_ECONOMICA", "se5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SEM RENDIMENTO
                  </button>
                </div>
                <div className="title2center">RELAÇÕES SOCIAIS</div>
                <div id="RELACOES_SOCIAIS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="rl1"
                    className="blue-button"
                    onClick={() => { setrelacoessociais(0); setActive("RELACOES_SOCIAIS", "rl1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    RELAÇÕES SOCIAIS, VIDA SOCIAL ATIVA
                  </button>
                  <button id="rl2"
                    className="blue-button"
                    onClick={() => { setrelacoessociais(1); setActive("RELACOES_SOCIAIS", "rl2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    RELAÇÕES SOCIAIS SÓ COM FAMÍLIA E VIZINHOS, SAI DE CASA
                  </button>
                  <button id="rl3"
                    className="blue-button"
                    onClick={() => { setrelacoessociais(2); setActive("RELACOES_SOCIAIS", "rl3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    APENAS SE RELACIONA COM A FAMÍLIA OU VIZINHOS, SAI DE CASA
                  </button>
                  <button id="rl4"
                    className="blue-button"
                    onClick={() => { setrelacoessociais(3); setActive("RELACOES_SOCIAIS", "rl4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO SAI DE CASA, RECEBE FAMÍLIA OU VISITAS
                  </button>
                  <button id="rl5"
                    className="blue-button"
                    onClick={() => { setrelacoessociais(4); setActive("RELACOES_SOCIAIS", "rl5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO SAI DE CASA NEM RECEBE VISITAS
                  </button>
                </div>
                <div className="title2center">CONTATO COM A FAMÍLIA</div>
                <div id="CONTATO_FAMILIA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="cf1"
                    className="blue-button"
                    onClick={() => { setcontatofamilia(0); setActive("CONTATO_FAMILIA", "cf1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    QUINZENAL / SEMANAL / DIÁRIO
                  </button>
                  <button id="cf2"
                    className="blue-button"
                    onClick={() => { setcontatofamilia(1); setActive("CONTATO_FAMILIA", "cf2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    MENSAL
                  </button>
                  <button id="cf3"
                    className="blue-button"
                    onClick={() => { setcontatofamilia(2); setActive("CONTATO_FAMILIA", "cf3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    4 A 11 VEZES AO ANO
                  </button>
                  <button id="cf4"
                    className="blue-button"
                    onClick={() => { setcontatofamilia(3); setActive("CONTATO_FAMILIA", "cf4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    1 A 3 VEZES AO ANO
                  </button>
                  <button id="cf5"
                    className="blue-button"
                    onClick={() => { setcontatofamilia(4); setActive("CONTATO_FAMILIA", "cf5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    SEM CONTATO
                  </button>
                </div>
                <div className="title2center">APOIO DE REDE SOCIAL</div>
                <div id="REDE_SOCIAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="rs1"
                    className="blue-button"
                    onClick={() => { setapoioredesocial(0); setActive("REDE_SOCIAL", "rs1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    COM APOIO DE FAMILIAR OU DE VIZINHOS
                  </button>
                  <button id="rs2"
                    className="blue-button"
                    onClick={() => { setapoioredesocial(1); setActive("REDE_SOCIAL", "rs2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    VOLUNTARIADO SOCIAL, AJUDA DOMICILIÁRIA
                  </button>
                  <button id="rs3"
                    className="blue-button"
                    onClick={() => { setapoioredesocial(2); setActive("REDE_SOCIAL", "rs3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    NÃO TEM APOIO
                  </button>
                  <button id="rs4"
                    className="blue-button"
                    onClick={() => { setapoioredesocial(3); setActive("REDE_SOCIAL", "rs4") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    COM CRITÉRIOS PARA INGRESSO EM INSTITUIÇÃO GERIÁTRICA
                  </button>
                  <button id="rs5"
                    className="blue-button"
                    onClick={() => { setapoioredesocial(4); setActive("REDE_SOCIAL", "rs5") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    TEM CUIDADOS PERMANENTES
                  </button>
                </div>
                <div className="title2center">HABITAÇÃO</div>
                <div id="HABITAÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="hab1"
                    className="blue-button"
                    onClick={() => { sethabitacao(0); setActive("HABITAÇÃO", "hab1") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    ADEQUADA ÀS NECESSIDADES
                  </button>
                  <button id="hab2"
                    className="blue-button"
                    onClick={() => { sethabitacao(1); setActive("HABITAÇÃO", "hab2") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    BARREIRAS ARQUITETÔNICAS NA CASA/ENTRADA
                  </button>
                  <button id="hab3"
                    className="blue-button"
                    onClick={() => { sethabitacao(2); setActive("HABITAÇÃO", "hab3") }}
                    style={{ padding: 10, width: 200, minWidth: 200 }}>
                    UMIDADE, FRACAS CONDIÇÕES DE HIGIENE, AUSÊNCIA DE ÁGUA OU INFRAESTRUTURA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EvolucaoTexto idcampo={205} campo={'ESCALA DE GIJON'} obrigatorio={1} tipo={'card'} lenght={10} width={150} valor_escala={score}></EvolucaoTexto>

        <EvolucaoTexto idcampo={206} campo={'RESUMO DO PLANO TERAPÊUTICO PARA A ESPECIALIDADE:'} obrigatorio={1} tipo={"textarea"} length={10} width={'60vw'}></EvolucaoTexto>
      </div>
    );
  };

  function Form() {
    return (
      <div className="scroll"
        id="FORMULÁRIO - ANAMNESE SOCIAL"
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
            <div className="title2center" style={{ width: '100%', fontSize: 16, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE DO SERVIÇO SOCIAL</div>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>ANAMNESE SOCIAL REALIZADA COM:</div>
            <EvolucaoTexto idcampo={123} campo={'NOME DO ACOMPANHANTE'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={124} campo={'GRAU DE PARENTESCO'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={125} campo={'CONTATO DO ACOMPANHANTE'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={126} campo={'RELIGIÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoTexto idcampo={127} campo={'OUTRA RELIGIÃO'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoSelecaoSimples idcampo={128} campo={'GRAU DE INSTRUÇÃO'} obrigatorio={1}></EvolucaoSelecaoSimples>\
            <EvolucaoSelecaoSimples idcampo={129} campo={'ESTADO CIVIL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={130} campo={'POSSUI FILHOS'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={131} campo={'TRABALHA ATUALMENTE'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={132} campo={'POSSUI BENEFÍCIO'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={133} campo={'REPRESENTANTE LEGAL'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={134} campo={'TABAGISTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <EvolucaoSelecaoSimples idcampo={135} campo={'ETILISTA'} obrigatorio={1}></EvolucaoSelecaoSimples>
            <div className="title2center" style={{ width: '100%', fontSize: 14, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>{'COMPOSIÇÃO FAMILIAR (COM QUEM O PACIENTE RESIDE)'}</div>
            <EvolucaoTexto idcampo={136} campo={'NOME DO PARENTE DE REFERÊNCIA'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={137} campo={'GRAU DE PARENTESCO'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={138} campo={'IDADE DO PARENTE'} obrigatorio={1} tipo={'input'} lenght={3} width={150}></EvolucaoTexto>
            <EvolucaoTexto idcampo={139} campo={'ESTADO CIVIL DO PARENTE'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={140} campo={'OCUPAÇÃO DO PARENTE'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={141} campo={'CONTATO DO PARENTE'} obrigatorio={1} tipo={'input'} lenght={200} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={142} campo={'ENDEREÇO ATUAL'} obrigatorio={1} tipo={'input'} lenght={2000} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={143} campo={'CENTRO DE SAÚDE E EQUIPE DE REFERÊNCIA'} obrigatorio={1} tipo={'input'} lenght={2000} width={'60vw'}></EvolucaoTexto>
            <EvolucaoTexto idcampo={144} campo={'ENDEREÇO PÓS ALTA'} obrigatorio={1} tipo={'input'} lenght={2000} width={500}></EvolucaoTexto>
            <EvolucaoTexto idcampo={145} campo={'OBSERVAÇÕES - ANAMNESE DO SERVIÇO SOCIAL'} obrigatorio={1} tipo={'textarea'} lenght={2000} width={'60vw'}></EvolucaoTexto>
          </div>
          <Gijon></Gijon>
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
        let printdocument = document.getElementById("PRINTDOCUMENT - ANAMNESE - CRESS").innerHTML;
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
    <div style={{ display: tipodocumento == 'ANAMNESE - CRESS' && conselho == 'CRESS' && statusdocumento != null ? 'flex' : 'none' }}>
      <Form></Form>
      <div id='PRINTDOCUMENT - ANAMNESE - CRESS' style={{ display: 'none' }}>
        <PrintDocument></PrintDocument>
      </div>
    </div>
  )
}

export default AnamneseServicoSocial;