/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';

// importando documentos estruturados.
import axios from 'axios';
import Context from '../Context';
import deletar from '../images/deletar.svg';
import Toast from '../components/Toast';
import moment from 'moment';

function Signature() {
  const {
    signature, setsignature,
    iduser, idpaciente, idatendimento,
    iddocumento, tipodocumento,
    conselho, datadocumento, setviewdocumento,
    setiddocumento, setstatusdocumento,
    setlistghapevolucoes, setarraylistghapevolucoes
  } = useContext(Context)

  // endereço da API signature.
  var htmlsignature = 'http://localhost:3001'

  // gerando chaves PRIVADA E PÚBLICA (PENDÊNCIA! preciso receber a chave pública do CARTÓRIO MV e o usuário tem que inputar sua chave privada).
  let privateKey = '';
  let publicKey = '';
  const generateKeys = () => {
    axios.get(htmlsignature + '/generate-key-pair').then((response) => {
      privateKey = response.data.privateKey;
      publicKey = response.data.publicKey;
      signDocument();
    });
  }

  // gerando a assinatura digital do documento.
  let assinatura = null;
  const signDocument = () => {
    var obj = {
      privateKey: privateKey,
      data: null
    };
    axios.post(htmlsignature + '/signsimple', obj).then((response) => {
      console.log('ASSINATURA: ' + JSON.stringify(response.data.signature));
      assinatura = response.data.signature;
      verifyDocument();
    });
  }

  // verificando o documento assinado.
  const verifyDocument = () => {
    var obj = {
      data: null,
      publicKey: publicKey,
      signature: assinatura
    }
    axios.post(htmlsignature + '/verify', obj).then((response) => {
      console.log('DOCUMENTO VÁLIDO: ' + response.data.verify);
      if (response.data.verify == true) {
        toast(1, '#52be80', 'DOCUMENTO ASSINADO COM SUCESSO.', 3000);
        updateEvolucao();
        setTimeout(() => {
          setsignature(0);
        }, 3000);
      } else {
        toast(1, '#ec7063', 'ASSINATURA INVÁLIDA.', 3000);
      }
    });
  }

  // salvando o documento com assinatura válida.
  // assinando ou suspendendo uma evolução (conforme parâmetro).
  var htmlupdateevolucao = process.env.REACT_APP_API_CLONE_UPDATEEVOLUCAO;
  var htmlghapevolucoes = process.env.REACT_APP_API_CLONE_EVOLUCOES;
  const updateEvolucao = () => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: datadocumento,
      evolucao: tipodocumento,
      idprofissional: iduser,
      status: 1, // documento assinado.
      conselho: conselho,
    };
    console.log(obj);
    axios.post(htmlupdateevolucao + iddocumento, obj).then(() => {
      axios.get(htmlghapevolucoes + idpaciente).then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        x = response.data;
        y = x.rows;
        setlistghapevolucoes(y.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento));
        setarraylistghapevolucoes(y.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).filter(item => item.conselho == conselho && item.evolucao == tipodocumento));
        setiddocumento(0);
        setstatusdocumento(0);
        setviewdocumento(0);
        setsignature(0);
      });
    });
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

  return (
    <div className="menucover" style={{ display: signature == 1 ? 'flex' : 'none' }}>
      <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      <div className="menucontainer">
        <div id="cabeçalho" className="cabecalho">
          <div>{'ASINAR DOCUMENTO'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="red-button" onClick={(e) => { setsignature(0); e.stopPropagation() }}>
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
          </div>
        </div>
        <div className="corpo" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', zIndex: 90 }}>
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
          }}>
            <button
              className="green-button" style={{ margin: 5, width: 200, minWidth: 200 }}>
              ACESSAR CERTIFICADO</button>
            <button
              className="green-button" style={{ margin: 5, width: 200, minWidth: 200 }}
              onClick={() => updateEvolucao()}
              // onClick={() => generateKeys()}
            >
              ASSINAR
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Signature;
