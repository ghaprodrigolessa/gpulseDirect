/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import moment, { min } from 'moment';
import Context from '../Context';

function DatePicker() {

  // recuperando estados globais (Context.API).
  const {
    viewdatepicker, setviewdatepicker,
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2
  } = useContext(Context)

  useEffect(() => {
    currentMonth();
    moment().format('DD/MM')
    sethour(moment().format('HH'));
    if (viewdatepicker != 0) {
      sethour(moment().format('HH'));
      setmin(moment().format('mm'));
      // document.getElementById("inputHour").value = moment().format('HH');
      // document.getElementById("inputMin").value = moment().format('mm');
    }
  }, [viewdatepicker])

  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  var month = moment().format('MM');
  var year = moment().format('YYYY');
  const [startdate] = useState(moment('01/' + month + '/' + year, 'DD/MM/YYYY'));
  // descobrindo o primeiro dia do calendário (último domingo do mês anteior).
  const firstSunday = (x, y) => {
    while (x.weekday() > 0) {
      x.subtract(1, 'day');
      y.subtract(1, 'day');
    }
    // se o primeiro domingo da array ainda cair no mês atual:
    if (x.month() == startdate.month()) {
      x.subtract(7, 'days');
      y.subtract(7, 'days');
    }
  }
  // criando array com 42 dias a partir da startdate.
  const setArrayDate = (x, y) => {
    arraydate = [x.format('DD/MM/YYYY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YYYY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }

  // selecionando uma data no datepicker.
  const selectDate = (value) => {
    if (viewdatepicker == 1) {
      setpickdate1(value);
    } else if (viewdatepicker == 2) {
      setpickdate2(value);
    } else {
      setviewdatepicker(0);
    }
  }

  const [hour, sethour] = useState('');
  const [min, setmin] = useState('');
  function TimeComponent() {
    var timeout = null;
    const fixHour = (valor) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (valor > 23 || valor < 0) {
          sethour('!');
        } else {
          sethour(valor);
        }
      }, 1000);
    };

    const fixMin = (valor) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (valor > 59 || valor < 0) {
          setmin('!');
        } else {
          setmin(valor);
        }
      }, 1000);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className='title2center'>HORA</div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <input
            autoComplete="off"
            className="input"
            placeholder="HH"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'HH')}
            onKeyUp={(e) => fixHour(e.target.value)}
            defaultValue={hour}
            title="HORAS."
            maxLength={2}
            style={{
              width: 100,
              height: 50,
            }}
            min={0}
            max={23}
            id="inputHour"
          ></input>
          <div className='title2center'>{' : '}</div>
          <input
            autoComplete="off"
            className="input"
            placeholder="MM"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'MM')}
            onKeyUp={(e) => fixMin(e.target.value)}
            defaultValue={min}
            title="MINUTOS."
            maxLength={2}
            style={{
              width: 100,
              height: 50,
            }}
            min={0}
            max={59}
            id="inputMin"
          ></input>
        </div>
        <button
          id="btnAdd"
          className="green-button"
          title="CONFIRMAR DATA E HORA."
          onClick={
            viewdatepicker == 1 ? () => { setpickdate1(pickdate1 + ' - ' + hour + ':' + min); setviewdatepicker(0) } :
              (e) => { setpickdate2(pickdate2 + ' - ' + hour + ':' + min); setviewdatepicker(0); e.stopPropagation(); }
          }
          style={{ marginTop: 10, alignSelf: 'center' }}
        >
          {'✔'}
        </button>
      </div >
    )
  }

  // renderização do datepicker.
  if (viewdatepicker != 0) {
    return (
      <div className="menucover"
        onClick={(e) => { setviewdatepicker(0); e.stopPropagation() }}
        style={{
          zIndex: 999, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="menucontainer"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'unset',
            zIndex: 99,
            margin: window.innerWidth < 400 ? 5 : 0,
            padding: 15,
            width: window.innerWidth > 400 ? '' : '95vw',
            height: window.innerWidth > 400 ? 500 : '95vh',
            borderRadius: 5,
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              width: '395',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
            }}>
              <button
                className="blue-button"
                onClick={(e) => { previousMonth(); e.stopPropagation(); }}
                id="previous"
                style={{
                  width: 50,
                  height: 50,
                  margin: 2.5,
                  color: '#ffffff',
                }}
                title={'MÊS ANTERIOR'}
              >
                {'◄'}
              </button>
              <p
                className="title2"
                style={{
                  width: 200,
                  fontSize: 16,
                  margin: 2.5
                }}>
                {startdate.format('MMMM').toUpperCase() + ' ' + startdate.year()}
              </p>
              <button
                className="blue-button"
                onClick={(e) => { nextMonth(); e.stopPropagation(); }}
                id="next"
                style={{
                  width: 50,
                  height: 50,
                  margin: 2.5,
                  color: '#ffffff',
                }}
                title={'PRÓXIMO MÊS'}
              >
                {'►'}
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
            }}>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>DOM</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEG</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>TER</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUA</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUI</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEX</p>
              <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SAB</p>
            </div>
            <div
              className="secondary"
              id="LISTA DE DATAS"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                margin: 0,
                padding: 5,
                width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
                height: window.innerWidth > 800 ? 340 : '',
                boxShadow: 'none'
              }}
            >
              {arraylist.map((item) => (
                <button
                  className={viewdatepicker == 1 && item == pickdate1 ? "red-button" : viewdatepicker == 2 && item == pickdate2 ? "red-button" : "blue-button"}
                  onClick={(e) => { selectDate(item); e.stopPropagation() }}
                  style={{
                    width: window.innerWidth > 800 ? 50 : 44,
                    minWidth: window.innerWidth > 800 ? 50 : 44,
                    height: 50,
                    margin: 2.5,
                    color: '#ffffff',
                    opacity: item.substring(3, 5) === moment(startdate).format('MM') ? 1 : 0.5,
                  }}
                  title={item}
                >
                  {item.substring(0, 2)}
                </button>
              ))}
            </div>
          </div>
          <TimeComponent></TimeComponent>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default DatePicker;
