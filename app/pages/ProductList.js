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
  DeviceEventEmitter
} from 'react-native';

import DrawerLayout from 'react-native-drawer-layout';
import TimeAgo from 'react-native-timeago';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import * as mainAction from '../actions/main';
import LoadingView from '../components/LoadingView';
// import ReadingToolbar from '../components/ReadingToolbar';
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

let canLoadMore;
let page = 1;
let loadMoreTime = 0;


var { width, height } = Dimensions.get('window');


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      typeIds: []
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
    typeIds = [0, 12, 9, 2];
    typeIds.forEach((typeId) => {
            dispatch(mainAction.fetchArticles(false, true, typeId));
          });
    this.setState({
            typeIds
          });
    // InteractionManager.runAfterInteractions(() => {
    //   Storage.get('typeIds')
    //     .then((typeIds) => {
    //       if (!typeIds) {
    //         typeIds = [0, 12, 9, 2];
    //       }
    //       typeIds.forEach((typeId) => {
    //         dispatch(mainAction.fetchArticles(false, true, typeId));
    //       });
    //       this.setState({
    //         typeIds
    //       });
    //     });
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
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', padding: 5 }}
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
    console.log(article);
    return (
      <TouchableOpacity onPress={() => this.onPress(article)}>
        <View style={styles.containerItem}>
          <Image
            style={{ width: 88, height: 66, marginRight: 10 }}
            source={{ uri: article.contentImg }}
          />
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <Text style={styles.title}>
              {formatStringWithHtml(article.title)}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
              <Text
                style={{ flex: 1, fontSize: 14, color: '#87CEFA',
                  marginTop: 5, marginRight: 5 }}
              >
                {article.userName}
              </Text>
              <TimeAgo
                style={{ fontSize: 14, color: '#aaaaaa', marginTop: 5 }}
                time={article.date}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderContent(dataSource, typeId) {
    const { main } = this.props;
    if (main.loading) {
      return <LoadingView />;
    }
    const isEmpty = main.articleList[typeId] === undefined || main.articleList[typeId].length === 0;
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
              onRefresh={() => this.onRefresh(typeId)}
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
    console.log(isEmpty,typeId);
    return (
      <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={this.renderItem}
        style={styles.listView}
        // onEndReached={() => this.onEndReached(typeId)}
        // onEndReachedThreshold={10}
        // onScroll={this.onScroll}
        // renderFooter={this.renderFooter}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={main.isRefreshing}
        //     onRefresh={() => this.onRefresh(typeId)}
        //     title="Loading..."
        //     colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
        //   />
        // }
      />
    );
  }

  renderNavigationView() {
    return (
      <View style={[styles.container, { backgroundColor: '#fcfcfc' }]}>
        <View
          style={{ width: width / 5 * 3, height: 120,
            justifyContent: 'flex-end', paddingBottom: 10, backgroundColor: '#3e9ce9' }}
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
          onPress={() => this.onPressDrawerItem(0)}
        >
          
          <Text style={styles.drawerText}>
            行游
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(1)}
        >
          
          <Text style={styles.drawerText}>
            攻略
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(2)}
        >
         
          <Text style={styles.drawerText}>
            购物
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(3)}
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
          <View style={styles.head}>
            <Image
              style={[styles.image]}
              source={logoImg}
            />
          </View>
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
          {this.state.typeIds.map((typeId) => {
            const typeView = (
              <View
                key={typeId}
                tabLabel={CATEGORIES[typeId]}
                style={{ flex: 1 }}
              >
                {this.renderContent(this.state.dataSource.cloneWithRows(
                  main.articleList[typeId] === undefined ? [] : main.articleList[typeId]), typeId)}
              </View>);
            return typeView;
          })}
          </ScrollableTabView>
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
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  },
  listView: {
    backgroundColor: '#eeeeec'
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
  image:{
    width:width/5, 
    height:45, 
    alignSelf:'center',
    backgroundColor:'white'

  },
  head:{
    width:width, 
    backgroundColor:'white'

  }
});

Main.propTypes = propTypes;

export default Main;
