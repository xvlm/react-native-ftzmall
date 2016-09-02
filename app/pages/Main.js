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
  DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import DrawerLayout from 'react-native-drawer-layout';
import TimeAgo from 'react-native-timeago';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import * as mainAction from '../actions/main';
import LoadingView from '../components/LoadingView';
import GridBanner from '../components/GridBanner';
import CarouselBanner from '../components/CarouselBanner';
import ProuctList from '../components/ProuctList';

// import mainingToolbar from '../components/mainingToolbar';
// import About from '../pages/About';
// import Feedback from '../pages/Feedback';
// import CategoryContainer from '../containers/CategoryContainer';
// import { toastShort } from '../utils/ToastUtil';
// import Storage from '../utils/Storage';
import { CATEGORIES } from '../constants/Alias';
// import WebViewPage from '../pages/WebViewPage';
import { formatStringWithHtml } from '../utils/FormatUtil';

require('moment/locale/zh-cn');

// const homeImg = require('../img/home.png');
// const categoryImg = require('../img/category.png');
// const inspectionImg = require('../img/inspection.png');
// const infoImg = require('../img/info.png');
// const menuImg = require('../img/menu.png');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  main: PropTypes.object.isRequired
};
const logoImg = require('../img/logo-1.png');


let { width, height } = Dimensions.get('window');
let canLoadMore;
let page = 1;
let loadMoreTime = 0;




class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "home",
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      typeIds: [],
      adImageText: [],
      adBrand: [],
      adProduct: []
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderNavigationView = this.renderNavigationView.bind(this);
    this.onIconClicked = this.onIconClicked.bind(this);
    this.onScroll = this.onScroll.bind(this);
    canLoadMore = false;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    DeviceEventEmitter.addListener('changeCategory', (typeIds) => {
      typeIds.forEach((typeId) => {
        dispatch(mainAction.fetchArticles(false, true, typeId));
      });
      this.setState({
        typeIds
      });
    });
    // InteractionManager.runAfterInteractions(() => {
    // Storage.get('typeIds')
    // .then((typeIds) => {
    // if (!typeIds) {
    adImageText = [180101, 180103];//180105, 180106,
    // }
    adImageText.forEach((adid) => {
      dispatch(mainAction.fetchImageText(false, true, adid));
    });
    adBrand = [180103];//180105, 180106,
    adBrand.forEach((adid) => {
      dispatch(mainAction.fetchBrand(false, true, adid));
    });
    adProduct = [180104, 180105];//,, 180106
    adProduct.forEach((adid) => {
      dispatch(mainAction.fetchProduct(false, true, adid));
    });

    this.setState({
      adBrand, adProduct
    });
    // });
    // });
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
    if (main.loading) {
      return <LoadingView />;
    }

    // var isEmpty = this.state.adids.length === 0;
    // this.state.adids.forEach((adid) => {
    // console.log(adid,main.articleList[adid]);
    var isEmpty = main.articleList[180101] === undefined || main.articleList[180101].length === 0;
    // });
    console.log(main.articleList, isEmpty);
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
        <CarouselBanner dataSource={main.articleList[180101]} {...this.props}/>
        {main.articleList[180103] === undefined || main.articleList[180103].length === 0 ? null : <GridBanner dataSource={main.articleList[180103]} {...this.props}/>}
        {main.articleList[180104] === undefined || main.articleList[180104].length === 0 ? null : <ProuctList title="每日必买" dataSource={main.articleList[180104]} {...this.props}/>}
        {main.articleList[180105] === undefined || main.articleList[180105].length === 0 ? null : <ProuctList title="全球精选" dataSource={main.articleList[180105]} {...this.props}/>}

      </ScrollView>
    );
  }

  renderNavigationView() {
    return (
      <View style={[styles.container, { backgroundColor: '#fcfcfc' }]}>
        <View
          style={{
            width: Dimensions.get('window').width / 5 * 3, height: 120,
            justifyContent: 'flex-end', paddingBottom: 10, backgroundColor: '#3e9ce9'
          }}
          >
          <Text style={{ fontSize: 20, textAlign: 'left', color: '#fcfcfc', marginLeft: 10 }}>
            行游宝
          </Text>
          <Text style={{ fontSize: 20, textAlign: 'left', color: '#fcfcfc', marginLeft: 10 }}>
            让旅行更精彩
          </Text>
        </View>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(0) }
          >

          <Text style={styles.drawerText}>
            行游
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(1) }
          >

          <Text style={styles.drawerText}>
            攻略
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(2) }
          >

          <Text style={styles.drawerText}>
            购物
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(3) }
          >

          <Text style={styles.drawerText}>
            关于
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { main, navigator } = this.props;
    return (
      <View style={styles.container}>
        <TabNavigator tabBarStyle={{ height: 50,backgroundColor:"#FFFFFF" }} >
          <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title="首页"
            renderIcon={() => <Image style={styles.img} source={require('../img/tab_home_normal.png') } />}
            renderSelectedIcon={() => <Image style={styles.img} source={require('../img/tab_home_selected.png') } />}
           
            onPress={() => this.setState({ selectedTab: 'home' }) }>
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
              <ScrollableTabView
                renderTabBar={() =>
                  <DefaultTabBar
                    underlineHeight={2}
                    tabStyle={{ paddingBottom: 0 }}
                    textStyle={{ fontSize: 16 }}
                    />
                }
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineColor="#3e9ce9"
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"

                >
                <View
                  key={0}
                  tabLabel={CATEGORIES[0]}
                  style={{ flex: 1 }}
                  >
                  {this.renderContent() }
                </View>

                <View
                  key={1}
                  tabLabel={CATEGORIES[1]}
                  style={{ flex: 1 }}
                  >
                  <Text>{CATEGORIES[1]}</Text>
                </View>
                <View
                  key={2}
                  tabLabel={CATEGORIES[2]}
                  style={{ flex: 1 }}
                  >
                  <Text>{CATEGORIES[2]}</Text>
                </View>
                <View
                  key={3}
                  tabLabel={CATEGORIES[3]}
                  style={{ flex: 1 }}
                  >
                  <Text>{CATEGORIES[3]}</Text>
                </View>
                <View
                  key={4}
                  tabLabel={CATEGORIES[4]}
                  style={{ flex: 1 }}
                  >
                  <Text>{CATEGORIES[4]}</Text>
                </View>
                <View
                  key={5}
                  tabLabel={CATEGORIES[5]}
                  style={{ flex: 1 }}
                  >
                  <Text>{CATEGORIES[5]}</Text>
                </View>
              </ScrollableTabView>
            </View>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'cart'}
            title="购物车"
            renderIcon={() => <Image style={styles.img} source={require('../img/tab_shopping_cart_normal.png') } />}
            renderSelectedIcon={() => <Image style={styles.img} source={require('../img/tab_shopping_cart_selected.png') } />}
            onPress={() => this.setState({ selectedTab: 'cart' }) }>
            <View><Text>我是第额当然个选项卡，直接书写出的视图!</Text></View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="会员"
            renderIcon={() => <Image style={styles.img} source={require('../img/tab_my_center_normal.png') } />}
            renderSelectedIcon={() => <Image style={styles.img} source={require('../img/tab_my_center_selected.png') } />}
            onPress={() => this.setState({ selectedTab: 'profile' }) }>
            <View><Text>我是第额当然个选项卡，直接书写出的视图!</Text></View>
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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

Main.propTypes = propTypes;

export default Main;
