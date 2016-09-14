import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    ListView,
    Image,
    PixelRatio
} from 'react-native';

let { width, height } = Dimensions.get('window');

export default class CarouselBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    }

    render() {
        console.log(this.props.dataSource);
        return (
            <View style={{width:width}}>
                <ListView
                    initialListSize={1}
                    horizontal={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.props.dataSource)}
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
            </View>
        )
    }

    renderItem(article) {
        console.log(article);
        return (
            <TouchableOpacity  >
                <View style={styles.containerItem}>
                    <Image
                        style={styles.containerItem}
                        resizeMode={Image.resizeMode.cover}
                        source={{ uri: article.imageUrl }}
                        />
                </View>
            </TouchableOpacity>
        );
    }
}

const returnSize = 45;
const styles = StyleSheet.create({
    containerItem: {
        flex: 1,
        width: width,
        height: 300*(width*PixelRatio.get())/(640*PixelRatio.get()),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eaeaea'
    },
    banner: {
        flexDirection: 'row',
        width: width,
        backgroundColor: '#aaaaaa',
    }
});
