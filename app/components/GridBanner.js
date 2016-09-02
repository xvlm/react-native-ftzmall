import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';

import WebContainer from "../containers/WebContainer";

let { width, height } = Dimensions.get('window');

// {this.props.dataSource.map((article) => {
//                     const bannerView = (
//                         <View
//                             key={id}
//                             style={{ flex: 1 }}
//                             >
//                             {this.renderItem(article) }
//                         </View>);
//                     id++;
//                     return bannerView;
//                 }) }

export default class GridBanner extends Component {

    render() {
        let id = 0;
        return (
            <View>
                <View style={styles.banner}>
                    {this.renderItem(this.props.dataSource[0]) }
                    {this.renderItem(this.props.dataSource[1]) }
                </View>
                <View style={styles.banner}>
                    {this.renderItem(this.props.dataSource[2]) }
                    {this.renderItem(this.props.dataSource[3]) }
                </View>
            </View>
        )
    }

    goUrl(href) {
        const { navigator } = this.props;
        navigator.push({
            component: WebContainer,
            name: "WebContainer",
            href: href
        });

    }

    renderItem(article) {
        const { navigator } = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.goUrl(article.href) }
                >
                <View style={styles.containerItem}>
                    <Image
                        style={styles.base}
                        resizeMode={Image.resizeMode.contain}
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

        alignItems: 'center',
        justifyContent: 'center',
       
    },
    banner: {
        flexDirection: 'row',
        width: width,
        backgroundColor: '#FFFFFF',
    },
    base: {
        width: width / 2,
        height: width / 2,
    }
});
