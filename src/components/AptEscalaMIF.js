/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import save from '../images/salvar.svg';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';

// MIF:
// dependência completa < 19;
// 19 a 60 = dependência modificada (asistência em até 50% das tarefas);
// 61 a 103 = dependência modificada (asistência em até 25% das tarefas);
// 104 a 126 = independente total ou modificado;

function AptEscalaMIF({ viewescalamif }) {
  // recuperando estados globais (Context.API).
  const {
    idatendimento
  } = useContext(Context)
  var html = 'https://pulsarapp-server.herokuapp.com';

  const [data, setdata] = useState(moment().format('DD/MM/YYYY'));
  const [valor, setvalor] = useState('100%');
  const [tipomif, settipomif] = useState(0);

  const [alimentacao, setalimentacao] = useState(0);
  const [higienepessoal, sethigienepessoal] = useState(0);
  const [banho, setbanho] = useState(0);
  const [vestirsuperior, setvestirsuperior] = useState(0);
  const [vestirinferior, setvestirinferior] = useState(0);
  const [sanitario, setsanitario] = useState(0);
  const [urina, seturina] = useState(0);
  const [fezes, setfezes] = useState(0);
  const [transferencialeito, settransferencialeito] = useState(0);
  const [transferenciasanitario, settransferenciasanitario] = useState(0);
  const [transferenciachuveiro, settransferenciachuveiro] = useState(0);
  const [locomocao, setlocomocao] = useState(0);
  const [escadas, setescadas] = useState(0);
  const [compreensao, setcompreensao] = useState(0);
  const [expressao, setexpressao] = useState(0);
  const [interacao, setinteracao] = useState(0);
  const [resolucaoproblemas, setresolucaoproblemas] = useState(0);
  const [memoria, setmemoria] = useState(0);

  // crud.
  const [listaMIF, setlistaMIF] = useState([])
  const loadMIF = () => {
    axios.get(html + "/mif").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistaMIF(x.filter(item => item.idatendimento == idatendimento));
    });
  }

  const selectMIF = (item) => {
    setdata(item.data);
    setvalor(item.valor);
  }

  const insertMIF = () => {
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YYYY HH:mm'),
      tipomif: 1,
      alimentacao: alimentacao,
      higienepessoal: higienepessoal,
      banho: banho,
      vestirsuperior: vestirsuperior,
      vestirinferior: vestirinferior,
      sanitario: sanitario,
      urina: urina,
      fezes: fezes,
      transferencialeito: transferencialeito,
      transferenciasanitario: transferenciasanitario,
      transferenciachuveiro: transferenciachuveiro,
      locomocao: locomocao,
      escadas: escadas,
      compreensao: compreensao,
      expressao: expressao,
      interacao: interacao,
      resolucaoproblemas: resolucaoproblemas,
      memoria: memoria,
    }
    axios.post(html + '/insertmif', obj).then(() => {
    });
  }

  const updatePPS = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      // ...
    }
    axios.post(html + '/updatemif/' + item.id, obj).then(() => {
    });
  }

  const deleteMIF = (item) => {
    axios.get(html + "/deletemif/'" + item.id + "'").then(() => {
    });
  }

  // componentes da escala.
  function ListaMIF() {
    return (
      <div className="scroll">
        {listaMIF.map(item => (
          <div className="row">
            <button onClick={() => selectMIF(item)}>{item.data}</button>
          </div>
        ))}
      </div>
    )
  }

  function CuidadosPessoais() {
    return (
      <div id="CUIDADOS PESSOAIS">
        <div className="title2center">
          ALIMENTAÇÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ width: '13%' }} className={alimentacao == 7 ? "red-button" : "blue-button"} onClick={() => setalimentacao(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 6 ? "red-button" : "blue-button"} onClick={() => setalimentacao(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 5 ? "red-button" : "blue-button"} onClick={() => setalimentacao(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 4 ? "red-button" : "blue-button"} onClick={() => setalimentacao(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 3 ? "red-button" : "blue-button"} onClick={() => setalimentacao(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 2 ? "red-button" : "blue-button"} onClick={() => setalimentacao(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={alimentacao == 1 ? "red-button" : "blue-button"} onClick={() => setalimentacao(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          HIGIENE PESSOAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={higienepessoal == 7 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 6 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 5 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 4 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 3 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 2 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={higienepessoal == 1 ? "red-button" : "blue-button"} onClick={() => sethigienepessoal(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          BANHO
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={banho == 7 ? "red-button" : "blue-button"} onClick={() => setbanho(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={banho == 6 ? "red-button" : "blue-button"} onClick={() => setbanho(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={banho == 5 ? "red-button" : "blue-button"} onClick={() => setbanho(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={banho == 4 ? "red-button" : "blue-button"} onClick={() => setbanho(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={banho == 3 ? "red-button" : "blue-button"} onClick={() => setbanho(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={banho == 2 ? "red-button" : "blue-button"} onClick={() => setbanho(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={banho == 1 ? "red-button" : "blue-button"} onClick={() => setbanho(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          VESTIR-SE, PARTE SUPERIOR
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={vestirsuperior == 7 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 6 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 5 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 4 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 3 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 2 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={vestirsuperior == 1 ? "red-button" : "blue-button"} onClick={() => setvestirsuperior(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          VESTIR-SE, PARTE INFERIOR
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={vestirinferior == 7 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 6 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 5 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 4 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 3 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 2 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={vestirinferior == 1 ? "red-button" : "blue-button"} onClick={() => setvestirinferior(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          USO DO VASO SANITÁRIO
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={sanitario == 7 ? "red-button" : "blue-button"} onClick={() => setsanitario(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={sanitario == 6 ? "red-button" : "blue-button"} onClick={() => setsanitario(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={sanitario == 5 ? "red-button" : "blue-button"} onClick={() => setsanitario(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={sanitario == 4 ? "red-button" : "blue-button"} onClick={() => setsanitario(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={sanitario == 3 ? "red-button" : "blue-button"} onClick={() => setsanitario(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={sanitario == 2 ? "red-button" : "blue-button"} onClick={() => setsanitario(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={sanitario == 1 ? "red-button" : "blue-button"} onClick={() => setsanitario(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>
      </div>
    )
  }

  function ControleEsfincteriano() {
    return (
      <div id="CONTROLE ESFINCTERIANO">
        <div className="title2center">
          CONTROLE DE URINA
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={urina == 7 ? "red-button" : "blue-button"} onClick={() => seturina(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={urina == 6 ? "red-button" : "blue-button"} onClick={() => seturina(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={urina == 5 ? "red-button" : "blue-button"} onClick={() => seturina(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={urina == 4 ? "red-button" : "blue-button"} onClick={() => seturina(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={urina == 3 ? "red-button" : "blue-button"} onClick={() => seturina(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={urina == 2 ? "red-button" : "blue-button"} onClick={() => seturina(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={urina == 1 ? "red-button" : "blue-button"} onClick={() => seturina(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>
        <div className="title2center">
          CONTROLE DE FEZES
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={fezes == 7 ? "red-button" : "blue-button"} onClick={() => setfezes(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={fezes == 6 ? "red-button" : "blue-button"} onClick={() => setfezes(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={fezes == 5 ? "red-button" : "blue-button"} onClick={() => setfezes(5)}>
            SUPERVISÃO / PREPARAÇÃO
          </button>
          <button style={{ width: '13%' }} className={fezes == 4 ? "red-button" : "blue-button"} onClick={() => setfezes(4)}>
            CONTATO MÍNIMO (100%)
          </button>
          <button style={{ width: '13%' }} className={fezes == 3 ? "red-button" : "blue-button"} onClick={() => setfezes(3)}>
            ASSISTÊNCIA MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={fezes == 2 ? "red-button" : "blue-button"} onClick={() => setfezes(2)}>
            ASSISTÊNCIA MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={fezes == 1 ? "red-button" : "blue-button"} onClick={() => setfezes(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>
      </div>
    )
  }

  function Mobilidade() {
    return (
      <div id="MOBILIDADE">

        <div id="TRANSFERÊNCIA">
          <div className="title2center">
            TRANSFERÊNCIA PARA O LEITO
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button style={{ width: '13%' }} className={transferencialeito == 7 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(7)}>
              INDEPENDÊNCIA COMPLETA
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 6 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(6)}>
              INDEPENDÊCIA MODIFICADA
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 5 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(5)}>
              SUPERVISÃO / PREPARAÇÃO
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 4 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(4)}>
              CONTATO MÍNIMO (100%)
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 3 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(3)}>
              ASSISTÊNCIA MODERADA (75%)
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 2 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(2)}>
              ASSISTÊNCIA MÁXIMA (50%)
            </button>
            <button style={{ width: '13%' }} className={transferencialeito == 1 ? "red-button" : "blue-button"} onClick={() => settransferencialeito(1)}>
              ASSISTÊNCIA TOTAL (25%)
            </button>
          </div>

          <div className="title2center">
            TRANSFERÊNCIA PARA O VASO SANITÁRIO
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button style={{ width: '13%' }} className={transferenciasanitario == 7 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(7)}>
              INDEPENDÊNCIA COMPLETA
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 6 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(6)}>
              INDEPENDÊCIA MODIFICADA
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 5 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(5)}>
              SUPERVISÃO / PREPARAÇÃO
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 4 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(4)}>
              CONTATO MÍNIMO (100%)
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 3 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(3)}>
              ASSISTÊNCIA MODERADA (75%)
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 2 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(2)}>
              ASSISTÊNCIA MÁXIMA (50%)
            </button>
            <button style={{ width: '13%' }} className={transferenciasanitario == 1 ? "red-button" : "blue-button"} onClick={() => settransferenciasanitario(1)}>
              ASSISTÊNCIA TOTAL (25%)
            </button>
          </div>

          <div className="title2center">
            TRANSFERÊNCIA PARA O CHUVEIRO
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 7 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(7)}>
              INDEPENDÊNCIA COMPLETA
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 6 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(6)}>
              INDEPENDÊCIA MODIFICADA
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 5 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(5)}>
              SUPERVISÃO / PREPARAÇÃO
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 4 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(4)}>
              CONTATO MÍNIMO (100%)
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 3 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(3)}>
              ASSISTÊNCIA MODERADA (75%)
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 2 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(2)}>
              ASSISTÊNCIA MÁXIMA (50%)
            </button>
            <button style={{ width: '13%' }} className={transferenciachuveiro == 1 ? "red-button" : "blue-button"} onClick={() => settransferenciachuveiro(1)}>
              ASSISTÊNCIA TOTAL (25%)
            </button>
          </div>
        </div>

        <div id="LOCOMOÇÃO">
          <div className="title2center">
            LOCOMOÇÃO (ANDANDO OU CADEIRANTE)
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button style={{ width: '13%' }} className={locomocao == 7 ? "red-button" : "blue-button"} onClick={() => setlocomocao(7)}>
              INDEPENDÊNCIA COMPLETA
            </button>
            <button style={{ width: '13%' }} className={locomocao == 6 ? "red-button" : "blue-button"} onClick={() => setlocomocao(6)}>
              INDEPENDÊCIA MODIFICADA
            </button>
            <button style={{ width: '13%' }} className={locomocao == 5 ? "red-button" : "blue-button"} onClick={() => setlocomocao(5)}>
              EXCEÇÃO/SUPERVISÃO
            </button>
            <button style={{ width: '13%' }} className={locomocao == 4 ? "red-button" : "blue-button"} onClick={() => setlocomocao(4)}>
              CONTATO MÍNIMO (100%)
            </button>
            <button style={{ width: '13%' }} className={locomocao == 3 ? "red-button" : "blue-button"} onClick={() => setlocomocao(3)}>
              ASSISTÊNCIA MODERADA (75%)
            </button>
            <button style={{ width: '13%' }} className={locomocao == 2 ? "red-button" : "blue-button"} onClick={() => setlocomocao(2)}>
              ASSISTÊNCIA MÁXIMA (50%)
            </button>
            <button style={{ width: '13%' }} className={locomocao == 7 ? "red-button" : "blue-button"} onClick={() => setlocomocao(1)}>
              ASSISTÊNCIA TOTAL (25%)
            </button>
          </div>

          <div className="title2center">
            LOCOMOÇÃO (ESCADAS)
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button style={{ width: '13%' }} className={escadas == 7 ? "red-button" : "blue-button"} style={{ width: '13%' }} className={escadas == 7 ? "red-button" : "blue-button"} onClick={() => setescadas(7)}>
              INDEPENDÊNCIA COMPLETA
            </button>
            <button style={{ width: '13%' }} className={escadas == 6 ? "red-button" : "blue-button"} onClick={() => setescadas(6)}>
              INDEPENDÊCIA MODIFICADA
            </button>
            <button style={{ width: '13%' }} className={escadas == 5 ? "red-button" : "blue-button"} onClick={() => setescadas(5)}>
              EXCEÇÃO/SUPERVISÃO
            </button>
            <button style={{ width: '13%' }} className={escadas == 4 ? "red-button" : "blue-button"} onClick={() => setescadas(4)}>
              CONTATO MÍNIMO (100%)
            </button>
            <button style={{ width: '13%' }} className={escadas == 3 ? "red-button" : "blue-button"} onClick={() => setescadas(3)}>
              ASSISTÊNCIA MODERADA (75%)
            </button>
            <button style={{ width: '13%' }} className={escadas == 2 ? "red-button" : "blue-button"} onClick={() => setescadas(2)}>
              ASSISTÊNCIA MÁXIMA (50%)
            </button>
            <button style={{ width: '13%' }} className={escadas == 1 ? "red-button" : "blue-button"} onClick={() => setescadas(1)}>
              ASSISTÊNCIA TOTAL (25%)
            </button>
          </div>
        </div>
      </div>
    )
  }

  function Comunicacao() {
    return (
      <div id="COMUNICAÇÃO">

        <div className="title2center">
          COMPREENSÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={compreensao == 7 ? "red-button" : "blue-button"} onClick={() => setcompreensao(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={compreensao == 6 ? "red-button" : "blue-button"} onClick={() => setcompreensao(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={compreensao == 5 ? "red-button" : "blue-button"} onClick={() => setcompreensao(5)}>
            FACILITAÇÃO POTENCIAL (100%)
          </button>
          <button style={{ width: '13%' }} className={compreensao == 4 ? "red-button" : "blue-button"} onClick={() => setcompreensao(4)}>
            FACILITAÇÃO MÍNIMA (90%)
          </button>
          <button style={{ width: '13%' }} className={compreensao == 3 ? "red-button" : "blue-button"} onClick={() => setcompreensao(3)}>
            FACILITAÇÃO MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={compreensao == 2 ? "red-button" : "blue-button"} onClick={() => setcompreensao(2)}>
            FACILITAÇÃO MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={compreensao == 1 ? "red-button" : "blue-button"} onClick={() => setcompreensao(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          EXPRESSÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={expressao == 7 ? "red-button" : "blue-button"} onClick={() => setexpressao(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={expressao == 6 ? "red-button" : "blue-button"} onClick={() => setexpressao(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={expressao == 5 ? "red-button" : "blue-button"} onClick={() => setexpressao(5)}>
            FACILITAÇÃO POTENCIAL (100%)
          </button>
          <button style={{ width: '13%' }} className={expressao == 4 ? "red-button" : "blue-button"} onClick={() => setexpressao(4)}>
            FACILITAÇÃO MÍNIMA (90%)
          </button>
          <button style={{ width: '13%' }} className={expressao == 3 ? "red-button" : "blue-button"} onClick={() => setexpressao(3)}>
            FACILITAÇÃO MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={expressao == 2 ? "red-button" : "blue-button"} onClick={() => setexpressao(2)}>
            FACILITAÇÃO MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={expressao == 1 ? "red-button" : "blue-button"} onClick={() => setexpressao(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>
      </div>
    )
  }

  function ConhecimentoSocial() {
    return (
      <div id="CONHECIMENTO SOCIAL">

        <div className="title2center">
          INTERAÇÃO SOCIAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={interacao == 7 ? "red-button" : "blue-button"} onClick={() => setinteracao(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={interacao == 6 ? "red-button" : "blue-button"} onClick={() => setinteracao(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={interacao == 5 ? "red-button" : "blue-button"} onClick={() => setinteracao(5)}>
            SUPERVISÃO (100%)
          </button>
          <button style={{ width: '13%' }} className={interacao == 4 ? "red-button" : "blue-button"} onClick={() => setinteracao(4)}>
            ORIENTAÇÃO MÍNIMA (90%)
          </button>
          <button style={{ width: '13%' }} className={interacao == 3 ? "red-button" : "blue-button"} onClick={() => setinteracao(3)}>
            ORIENTAÇÃO MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={interacao == 2 ? "red-button" : "blue-button"} onClick={() => setinteracao(2)}>
            ORIENTAÇÃO MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={interacao == 1 ? "red-button" : "blue-button"} onClick={() => setinteracao(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          RESOLUÇÃO DE PROBLEMAS
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 7 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 6 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 5 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(5)}>
            SUPERVISÃO (100%)
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 4 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(4)}>
            ORIENTAÇÃO MÍNIMA (90%)
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 3 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(3)}>
            ORIENTAÇÃO MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 2 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(2)}>
            ORIENTAÇÃO MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={resolucaoproblemas == 1 ? "red-button" : "blue-button"} onClick={() => setresolucaoproblemas(1)}>
            ORIENTAÇÃO TOTAL (25%)
          </button>
        </div>

        <div className="title2center">
          MEMÓRIA
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button style={{ width: '13%' }} className={memoria == 7 ? "red-button" : "blue-button"} onClick={() => setmemoria(7)}>
            INDEPENDÊNCIA COMPLETA
          </button>
          <button style={{ width: '13%' }} className={memoria == 6 ? "red-button" : "blue-button"} onClick={() => setmemoria(6)}>
            INDEPENDÊCIA MODIFICADA
          </button>
          <button style={{ width: '13%' }} className={memoria == 5 ? "red-button" : "blue-button"} onClick={() => setmemoria(5)}>
            SUPERVISÃO (90%)
          </button>
          <button style={{ width: '13%' }} className={memoria == 4 ? "red-button" : "blue-button"} onClick={() => setmemoria(4)}>
            FACILITAÇÃO MÍNIMA (100%)
          </button>
          <button style={{ width: '13%' }} className={memoria == 3 ? "red-button" : "blue-button"} onClick={() => setmemoria(3)}>
            FACILITAÇÃO MODERADA (75%)
          </button>
          <button style={{ width: '13%' }} className={memoria == 2 ? "red-button" : "blue-button"} onClick={() => setmemoria(2)}>
            FACILITAÇÃO MÁXIMA (50%)
          </button>
          <button style={{ width: '13%' }} className={memoria == 1 ? "red-button" : "blue-button"} onClick={() => setmemoria(1)}>
            ASSISTÊNCIA TOTAL (25%)
          </button>
        </div>
      </div>
    )
  }

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewescalamif);
  useEffect(() => {
    if (viewescalamif !== 0) {
      setviewcomponent(viewescalamif);
    } else {
    }
  }, [viewescalamif])

  const updateValor = () => {
    setvalor(
      alimentacao + higienepessoal + banho + vestirsuperior + vestirinferior +
      sanitario + urina + fezes + transferencialeito + transferenciasanitario +
      transferenciachuveiro + locomocao + escadas + compreensao + expressao +
      interacao + resolucaoproblemas + memoria
    )
  }

  return (
    <div className="menucover fade-in"
      style={{ zIndex: 9, display: viewcomponent == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="menucontainer">
        <div id="cabeçalho" className="cabecalho">
          <div className="title5">{'ESCALA MIF: ' + valor + '%'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="red-button" onClick={() => setviewcomponent(0)}>
              <img
                alt=""
                src={deletar}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
            <button className="green-button"
              onMouseOver={() => updateValor()}
              onClick={() => { updateValor(); insertMIF() }}
            >
              <img
                alt=""
                src={save}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
          </div>
        </div>
        <div className="corpo" style={{ height: '80vh', width: '85vw' }}>
          <div className="scroll">
            <div className="title4">CUIDADOS PESSOAIS</div>
            <CuidadosPessoais></CuidadosPessoais>
            <div className="title4" style={{ margin: 0, marginTop: 15 }}>CONTROLE ESFINCTERIANO</div>
            <ControleEsfincteriano></ControleEsfincteriano>
            <div className="title4" style={{ margin: 0, marginTop: 15 }}>MOBILIDADE</div>
            <Mobilidade></Mobilidade>
            <div className="title4" style={{ margin: 0, marginTop: 15 }}>COMUNICAÇÃO</div>
            <Comunicacao></Comunicacao>
            <div className="title4" style={{ margin: 0, marginTop: 15 }}>CONHECIMENTO SOCIAL</div>
            <ConhecimentoSocial></ConhecimentoSocial>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AptEscalaMIF;