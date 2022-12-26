import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import bell from '../images/bell.svg';

function AlertasPlanoTerapeutico() {
  // recuperando estados globais (Context.API).
  const {
    planoterapeutico,
    linhadecuidado,
    objetivos,
    idplanoterapeutico,
    metas,
    linhasdecuidado,
    opcoesobjetivos,
    hide, sethide,
    lastplanoterapeutico,
    arraycategoriaprofissional, setarraycategoriaprofissional,
    setselectedobjetivosecundario,
    setselectedobjetivo,
    setselectedcategoria,
    opcoesmetas,
  } = useContext(Context)

  const [idlinhadecuidado, setidlinhadecuidado] = useState(0); // id absoluto do registro (chave primária).
  const [id_linhadecuidado, setid_linhadecuidado] = useState(0); // designa o tipo de linha de cuidado.
  const [var_linhadecuidado, setvar_linhadecuidado] = useState('');

  var listcategoriaprofissional = [
    { id: 4, nome: 'ENFERMAGEM', cor: '#76D7C4' },
    { id: 32, nome: 'FARMÁCIA', cor: '#AED6F1' },
    { id: 5, nome: 'FISIOTERAPIA', cor: '#BB8FCE' },
    { id: 6, nome: 'FONOAUDIOLOGIA', cor: '#F1948A' },
    { id: 10, nome: 'PSICOLOGIA', cor: '#EDBB99' },
    { id: 1, nome: 'SERVIÇO SOCIAL', cor: '#F7DC6F' },
    { id: 11, nome: 'TERAPIA OCUPACIONAL', cor: '#AEB6BF' },
    { id: 9, nome: 'NUTRIÇÃO CLÍNICA', cor: 'grey' },
  ]

  var lista = [];
  const filtraScrollProfissionais = (idobjetivo) => {
    setselectedcategoria(0);
    lista = [];
    setTimeout(() => {
      opcoesmetas.filter(valor => valor.id_objetivo == idobjetivo).map(item => {
        lista.push(listcategoriaprofissional.filter(x => x.id == item.idespecialidade).pop());
      });
      var uniqueprofissionais = lista.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
      );
      setarraycategoriaprofissional(uniqueprofissionais);
    }, 500);
  }

  useEffect(() => {
    console.log('LOUCURA');
    // linhas de cuidado.
    if (linhadecuidado != '') {
      loadLinhasDeCuidado();
    }
    // eslint-disable-next-line
  }, [linhadecuidado, linhasdecuidado, id_linhadecuidado, idplanoterapeutico, planoterapeutico, lastplanoterapeutico, objetivos, metas]);

  const loadLinhasDeCuidado = () => {
    setid_linhadecuidado(idlinhadecuidado);
    setvar_linhadecuidado(linhadecuidado);
    console.log(var_linhadecuidado);
  }

  const selecaoAlerta = (item) => {
    console.log(item.idespecialidade);
    // identificando o objetivo secundário da meta selecionada no alerta.
    var objetivo = objetivos.filter(valor => valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1);
    setselectedobjetivosecundario(objetivo.map(item => item.id));
    setselectedobjetivo(item.idobjetivo);

    // identificando a categoria profissional da meta selecionada no alerta.
    filtraScrollProfissionais(item.idobjetivo);
    setTimeout(() => {
      setselectedcategoria(item.idespecialidade);
      // console.log('OBJETIVO: ' + JSON.stringify(objetivos.filter(valor => valor.idobjetivo == item.idobjetivo && valor.statusobjetivo == 1)));
      setTimeout(() => {
        var botoes = document.getElementById("scrollobjetivos").getElementsByClassName("red-button-objetivos animationobjetivos");
        for (var i = 0; i < botoes.length; i++) {
          botoes.item(i).className = "blue-button-objetivos animationobjetivos";
        }
        document.getElementById("objetivo" + objetivo.map(item => item.id)).className = "red-button-objetivos animationobjetivos";
        var botoes = document.getElementById("scroll das categorias profissionais.").getElementsByClassName("red-button");
        for (var i = 0; i < botoes.length; i++) {
          botoes.item(i).className = "blue-button";
        }
        document.getElementById("categoriaprofissional" + item.idespecialidade).className = "red-button";
      }, 700);
      // setselected_meta(item.id);
    }, 1000);
  }

  const checametas = (item) => {
    if (metas.filter(valor => valor.idplanoterapeutico == idplanoterapeutico && valor.idobjetivo == item.idobjetivo && valor.status < 2).length == 0) {
      return (
        <div className='green-button' style={{ padding: 10 }}>
          <div style={{ padding: 10 }}>{item.objetivo}</div>
        </div>
      )
    } else {
      return null;
    }
  }

  if (
    linhasdecuidado.filter(item => item.datatermino == null).length < 1 ||
    lastplanoterapeutico.length < 1 ||

    objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 1).length < 1 ||
    objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 2).length < 1 ||

    metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.status == 1 || item.status == 2)).length < 1 ||
    // metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && moment().diff(moment(item.dataestimada), 'days') > -1).length > 0 ||

    metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ||
    // metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().diff(moment(item.datachecagem), 'days') > -1).length > 0 ||

    metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0
  ) {
    return (
      <div
        // onMouseOut={() => sethide(0)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
          alignContent: 'center',
          position: 'absolute', top: 10, right: 10, zIndex: 20,
          // width: '12vw', minWidth: '12vw',
        }}
      >
        <div
          id="alertbutton1"
          className='red-button'
          style={{
            borderRadius: 50,
            width: 50, minWidth: 50, height: 50, minHeight: 50,
            alignSelf: 'center',
            zIndex: 3
          }}
          onClick={hide == 1 ? () => sethide(0) : () => sethide(1)}
        >
          <img
            alt=""
            src={bell}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div
          id="alertcontent1"
          className="red-button scroll"
          style={{
            display: hide == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: '#ec7063', margin: 0, marginTop: -25,
            padding: 10, paddingTop: 30, minWidth: '10vw', minHeight: '10vh', maxHeight: '50vh',
            borderStyle: 'solid',
            borderWidth: 5, borderColor: '#ec7063',
          }}>
          <div style={{ margin: 5, display: linhasdecuidado.filter(item => item.datatermino == null).length < 1 ? 'flex' : 'none' }}>
            {'DEFINIR LINHA DE CUIDADO.'}
          </div>
          <div style={{ margin: 5, display: lastplanoterapeutico.length < 1 ? 'flex' : 'none' }}>
            {'INICIAR PLANO TERAPÊUTICO.'}
          </div>
          <div style={{ margin: 5, display: objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 1).length < 1 ? 'flex' : 'none' }}>
            {'DEFINIR OBJETIVOS PRIMÁRIOS.'}
          </div>
          <div style={{ margin: 5, display: objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.statusobjetivo == 1 || item.statusobjetivo == 2) && item.tipoobjetivo == 2).length < 1 ? 'flex' : 'none' }}>
            {'DEFINIR OBJETIVOS SECUNDÁRIOS.'}
          </div>
          <div style={{ margin: 5, display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && (item.status == 1 || item.status == 2)).length < 1 ? 'flex' : 'none' }}>
            {'DEFINIR METAS.'}
          </div>

          <div id="## METAS INATIVAS ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ? 'flex' : 'none'
            }}>
              {'METAS INATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length}
            </div>
            <div className='scroll'
              style={{
                display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).length > 0 ? 'flex' : 'none',
                margin: 5,
                overflowY: 'scroll',
                height: '20vh',
                width: '20vw',
                paddingRight: 10,
              }}>
              {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 0).map(item => (
                <div
                  onClick={() => selecaoAlerta(item)}
                  style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                >
                  {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                </div>
              ))}
            </div>
          </div>
          <div id="## METAS ATIVAS ##" style={{ display: 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length > 0 ? 'flex' : 'none'
            }}>
              {'METAS ATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length}
            </div>
            <div className='scroll'
              style={{
                display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).length > 0 ? 'flex' : 'none',
                margin: 5,
                overflowY: 'scroll',
                height: '20vh',
                width: '20vw',
                paddingRight: 10,
              }}>
              {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') < 1).map(item => (
                <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                  onClick={() => selecaoAlerta(item)}
                >
                  {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                </div>
              ))}
            </div>
          </div>
          <div id="## METAS A VENCER ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length > 0 ? 'flex' : 'none' }}>
              {'METAS A VENCER: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length}
            </div>
            <div className='scroll'
              style={{
                margin: 5,
                overflowY: 'scroll',
                height: '20vh',
                width: '20vw',
                paddingRight: 10,
                display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).length > 0 ? 'flex' : 'none',
              }}>
              {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -3).map(item => (
                <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                  onClick={() => selecaoAlerta(item)}
                >
                  {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                </div>
              ))}
            </div>
          </div>
          <div id="## METAS VENCIDAS ##" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ margin: 5, alignSelf: 'center', display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0 ? 'flex' : 'none' }}>
              {'METAS VENCIDAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length}
            </div>
            <div className='scroll'
              style={{
                margin: 5,
                overflowY: 'scroll',
                height: '20vh',
                width: '20vw',
                paddingRight: 10,
                display: metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).length > 0 ? 'flex' : 'none',
              }}>
              {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1 && moment().startOf('day').diff(moment(item.dataestimada).startOf('day'), 'days') > -1).map(item => (
                <div style={{ borderRadius: 5, backgroundColor: '#ec7063', padding: 5, margin: 2.5 }}
                  onClick={() => selecaoAlerta(item)}
                >
                  {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - ' + item.meta}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
          alignContent: 'center',
          position: 'absolute', top: 10, right: 10, zIndex: 20,
        }}
      >
        <div
          id="alertbutton2"
          className='green-button'
          style={{
            borderRadius: 50,
            width: 50, minWidth: 50, height: 50, minHeight: 50,
            alignSelf: 'center',
            zIndex: 20
          }}
          onClick={hide == 1 ? () => sethide(0) : () => sethide(1)}
        >
          <img
            alt=""
            src={bell}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div
          id="alertcontent2"
          className="green-button scroll"
          style={{
            display: hide == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderStyle: 'solid',
            borderWidth: 5,
            backgroundColor: '#52be80', borderColor: '#52be80',
            margin: 0, marginTop: -25,
            padding: 10, paddingTop: 30, minWidth: '10vw', minHeight: '10vh', maxHeight: '65vh'
          }}>
          {'SEM ALERTAS.'}

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              margin: 5,
            }}>
              {'OBJETIVOS SECUNDÁRIOS FINALIZÁVEIS: ' + objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.tipoobjetivo == 2 && item.statusobjetivo == 1).length}
            </div>
            <div className='scroll'
              style={{
                margin: 5,
                overflowY: 'scroll',
                height: '40vh',
                width: '30vw',
                paddingRight: 10,
                alignSelf: 'center',
              }}>
              {objetivos.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.tipoobjetivo == 2 && item.statusobjetivo == 1).map(item => checametas(item))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              margin: 5,
            }}>
              {'METAS ATIVAS: ' + metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).length}
            </div>
            <div className='scroll'
              style={{
                margin: 5,
                overflowY: 'scroll',
                height: '40vh',
                width: '30vw',
                paddingRight: 10,
              }}>
              {metas.filter(item => item.idplanoterapeutico == idplanoterapeutico && item.status == 1).map(item => (
                <div className="green-button" style={{ borderRadius: 5, padding: 5, margin: 2.5 }}
                  onClick={() => selecaoAlerta(item)}
                >
                  {arraycategoriaprofissional.filter(valor => valor.id == item.idespecialidade).map(valor => valor.nome) + ' - '
                    + opcoesobjetivos.filter(valor => valor.id == item.idobjetivo).map(valor => valor.objetivo) + ' - '
                    + item.meta}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AlertasPlanoTerapeutico;