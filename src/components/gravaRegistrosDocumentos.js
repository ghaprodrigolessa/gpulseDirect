import axios from "axios";
import moment from 'moment';
import { gravaResumoPlanoTerapeutico } from './gravaResumoPlanoTerapeutico';

export const gravaRegistrosDocumentos = (
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
) => {

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
    axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj);
  }

  axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
    var x = [0, 1];
    x = response.data.rows;
    setregistros_antigos(x.filter(item => item.idevolucao < iddocumento));
    if (statusdocumento == -2) {
      console.log('COPIA VALOR DA EVOLUÇÃO SELECIONADA');
      camposusados.map(item => x.filter(valor => valor.idcampo == item && valor.idevolucao == idselecteddocumento).map(item => copiaValor(item)));
      gravaResumoPlanoTerapeutico(idpaciente, idatendimento, iddocumento, objetivos, metas);
      setTimeout(() => {
        axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
          var x = [0, 1];
          x = response.data.rows;
          setregistros_atuais(x.filter(item => item.idevolucao == iddocumento));
          setstatusdocumento(0);
        });
      }, 1000);
    } else if (statusdocumento == -1 && iddocumento != 0 && x.filter(item => item.idevolucao == iddocumento).length == 0) {
      console.log('CRIANDO PRIMEIROS VALORES');
      gravaResumoPlanoTerapeutico(idpaciente, idatendimento, iddocumento, objetivos, metas);
      camposusados.map(item => camposopcoes.filter(valor => valor.idcampo == item).map(item => insertValor(item, item.idcampo, item.id, null)));
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