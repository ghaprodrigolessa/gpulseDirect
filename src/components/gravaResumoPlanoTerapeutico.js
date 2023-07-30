import axios from "axios";
import moment from "moment-timezone";

export const gravaResumoPlanoTerapeutico = (idpaciente, idatendimento, iddocumento, objetivos, metas) => {

    // verificando se já existe um campo de resumo do plano terapêutico para o documento:
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/' + idatendimento).then((response) => {
        console.log('CARREGANDO VALORES DE CAMPOS');
        var x = [0, 1];
        var y = [0, 1];
        x = response.data;
        y = x.rows;
        if (y.filter(item => item.idcampo == 206).length > 0) {
            console.log('CAMPO DE RESUMO DE PLANO TERAPÊUTICO JÁ EXISTE. NADA A FAZER');
        } else {
            console.log('### REGISTRANDO RESUMO DO PLANO TERAPÊUTICO ###');
            let resumo =
                'OBJETIVOS SECUNDÁRIOS ATIVOS:'
                +
                objetivos.filter(item => item.statusobjetivo == 1 && item.tipoobjetivo == 2).map(item => '\n' + item.objetivo) +
                '\n\n'
                +
                'METAS ATIVAS:'
                +
                metas.filter(item => item.status == 0).map(item => '\n' + item.meta);
            console.log(resumo);
            var obj = {
                idpct: idpaciente,
                idatendimento: idatendimento,
                data: moment(),
                idcampo: 206,
                idopcao: 678,
                opcao: 'RESUMO PLANO TERAPÊUTICO',
                valor: resumo,
                idevolucao: iddocumento
            }
            console.log(obj);
            axios.post('http://192.168.100.6:3333/insert_evolucao_valor', obj);
        }
    })
}