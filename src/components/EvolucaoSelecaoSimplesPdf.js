/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import axios from 'axios';
import Context from '../Context';

function EvolucaoSelecaoSimplesPdf() {

  const {
    iddocumento,
    camposopcoes,
    setcamposvalores,
    statusdocumento,
  } = useContext(Context)

  const [registros_atuais, setregistros_atuais] = useState([]);

  /*
  useEffect(() => {
    axios.get('http://192.168.100.6:3333/pool_evolucoes_valores/').then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setregistros_atuais([]);
      setregistros_atuais(x.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento));
      setcamposvalores(x.rows);
      console.log('RECUPERANDO VALOR DO DOCUMENTO');
      // setregistros_antigos([]);
      camposopcoes.filter(item => item.idcampo == idcampo && item.idevolucao == iddocumento).map(item => registros_atuais.push(item));
    })
  }, [statusdocumento]);
  */

  return (
    <div>
      <div id="pdf"
        style={{ display: statusdocumento == 100 ? 'flex' : 'none' }}
      >
        
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 10,
              margin: 2.5,
              borderRadius: 5, borderColor: 'black', borderStyle: 'solid', borderWidth: 1,
              backgroundColor: '#ffffff'
            }}>
            <Text
              style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, alignSelf: 'center', textAlign: 'center' }}>
              {'OI'}
              <Text style={{ fontFamily: 'Helvetica', fontSize: 8, alignSelf: 'center' }}> {'OI'}</Text>
            </Text>
          </View>
        
      </div>
    </div >
  );
}

export default EvolucaoSelecaoSimplesPdf;