/**
 *
 * Copyright 2016-present maining
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
import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
  DrawerLayoutAndroid,
  Image,
  Dimensions,
  Platform,
  View,
  WebView,
  DeviceEventEmitter,
} from 'react-native';

import * as mainAction from '../actions/main';
import LoadingView from '../components/LoadingView';
import GridBanner from '../components/GridBanner';
import CarouselBanner from '../components/CarouselBanner';
import ProuctList from '../components/ProuctList';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  main: PropTypes.object.isRequired
};

let { width, height } = Dimensions.get('window');
let canLoadMore;
let page = 1;
let loadMoreTime = 0;




class TabPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      adProduct: []
    };
    this.renderItem = this.renderItem.bind(this);
    this.onScroll = this.onScroll.bind(this);
    canLoadMore = false;
  }

  componentDidMount() {
    const { dispatch, main } = this.props;
    var isEmpty = main.articleList[8085820] === undefined || main.articleList[8085820].length === 0;
    if (isEmpty) {
      adProduct = [8085820, 8085821, 8085822, 8085823, 8085824, 8085830];
      adProduct.forEach((adid) => {
        dispatch(mainAction.fetchProduct(false, true, adid));
      });
    }
    //   private static final int AD_8085820 = 8085820;//大牌奶粉
    // private static final int AD_8085821 = 8085821;//进口纸尿裤
    // private static final int AD_8085822 = 8085822;//宝宝美食
    // private static final int AD_8085823 = 8085823;//营养保健
    // private static final int AD_8085824 = 8085824;//洗护用品
    // private static final int AD_8085830 = 8085830;//妈妈专区
  }

  componentWillReceiveProps(nextProps) {
    const { main } = this.props;
    if (main.isLoadMore && !nextProps.main.isLoadMore && !nextProps.main.isRefreshing) {
      if (nextProps.main.noMore) {
        toastShort('没有更多数据了');
      }
    }
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('changeCategory');
  }

  onRefresh(typeId) {
    const { dispatch } = this.props;
    canLoadMore = false;
    dispatch(mainAction.fetchArticles(true, false, typeId));
  }

  onPress(article) {
    const { navigator } = this.props;
    navigator.push({
      component: WebViewPage,
      name: 'WebViewPage',
      article
    });
  }

  onPressDrawerItem(index) {
    const { navigator } = this.props;
    this.drawer.closeDrawer();
    switch (index) {
      case 1:
        navigator.push({
          component: CategoryContainer,
          name: 'Category'
        });

        break;
      case 2:
        navigator.push({
          component: Feedback,
          name: 'Feedback'
        });
        break;
      case 3:
        navigator.push({
          component: About,
          name: 'About'
        });
        break;
      default:
        break;
    }
  }

  onIconClicked() {
    this.drawer.openDrawer();
  }

  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  onEndReached(typeId) {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      page++;
      const { dispatch } = this.props;
      dispatch(mainAction.fetchArticles(false, false, typeId, true, page));
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
    }
  }

  renderFooter() {
    const { main } = this.props;
    if (main.isLoadMore) {
      return (
        <View
          style={{
            flex: 1, flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', padding: 5
          }}
          >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={{ textAlign: 'center', fontSize: 16, marginLeft: 10 }}>
            数据加载中……
          </Text>
        </View>
      );
    }
    return null;
  }

  renderItem(article) {
    return (
      <TouchableOpacity style={styles.containerItem} onPress={() => this.onPress(article) }>
        <Image
          resizeMode={Image.resizeMode.contain}
          source={{ uri: article.imageUrl }}
          />
      </TouchableOpacity>
    );
  }

  renderContent() {
    const { main } = this.props;


    // var isEmpty = this.state.adids.length === 0;
    // this.state.adids.forEach((adid) => {
    // console.log(adid,main.articleList[adid]);
    var isEmpty = main.articleList[8085820] === undefined || main.articleList[8085820].length === 0;
    // });

    if (isEmpty) {
      return (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}
          contentContainerStyle={styles.no_data}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={main.isRefreshing}
              onRefresh={() => this.onRefresh(typeId) }
              title="Loading..."
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
              />
          }
          >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>
              目前没有数据，请刷新重试……
            </Text>
          </View>
        </ScrollView>
      );
    }
    let id = 0;
    return (
      <ScrollView style={styles.listView}>
        <ProuctList dataSource={main.articleList[8085820]} {...this.props}/>
        {main.articleList[8085821] === undefined || main.articleList[8085821].length === 0 ? null : <ProuctList title="每日必买" dataSource={main.articleList[8085821]} {...this.props}/>}
        {main.articleList[8085822] === undefined || main.articleList[8085822].length === 0 ? null : <ProuctList title="每日必买" dataSource={main.articleList[8085822]} {...this.props}/>}
        {main.articleList[8085823] === undefined || main.articleList[8085823].length === 0 ? null : <ProuctList title="全球精选" dataSource={main.articleList[8085823]} {...this.props}/>}
        {main.articleList[8085824] === undefined || main.articleList[8085824].length === 0 ? null : <ProuctList title="全球精选" dataSource={main.articleList[8085824]} {...this.props}/>}
        {main.articleList[8085830] === undefined || main.articleList[8085830].length === 0 ? null : <ProuctList title="全球精选" dataSource={main.articleList[8085830]} {...this.props}/>}
      </ScrollView>
    );
  }


  render() {
    const { main, navigator } = this.props;
    let tabBarHeight = 50;
    console.log(this.state.selectedTopTab);
    return (
      <View style={styles.container}>
        {this.renderContent() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  banner: {
    flexDirection: 'row',
    width: width,
    backgroundColor: '#aaaaaa',
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  },
  listView: {
    height: height,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  no_data: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },
  drawerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  drawerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    textAlign: 'center',
    color: 'black'
  },
  grid: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  head: {
    width: width,
    backgroundColor: 'white'

  },
  image: {
    width: width / 5,
    height: 45,
    alignSelf: 'center',
    backgroundColor: 'white'

  },
  img: {
    width: 28,
    height: 28,
  }
});


export default TabPage;
