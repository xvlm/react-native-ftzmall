/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import {
  Dimensions,
  Image,
  View,
  PixelRatio,
} from 'react-native';

import MainContainer from '../containers/MainContainer';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const splashImg = require('../img/welcome_logo.png');

class Splash extends React.Component {
  componentDidMount() {
    const { navigator } = this.props;
    this.timer = setTimeout(() => {
      navigator.resetTo({
        component: MainContainer,
        name: 'Main'
      });
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={{flex:1,justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={{width:maxWidth-20,height: 229*(maxWidth*PixelRatio.get())/(387*PixelRatio.get())-20,alignSelf: 'center',}}
        source={splashImg}
      />
      </View>
    );
  }
}

export default Splash;
