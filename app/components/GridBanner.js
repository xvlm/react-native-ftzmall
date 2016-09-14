import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    Platform,
    Image,
    PixelRatio
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
            //4 pic 360*180
            <View style={styles.gridBannerContainer}>
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

                <Image
                    style={styles.base}
                    resizeMode={Image.resizeMode.strech}
                    source={{ uri: article.imageUrl }}
                    />

            </TouchableOpacity>
        );
    }
}

const returnSize = 45;
const styles = StyleSheet.create({
    gridBannerContainer: {
        
        alignItems: 'center',
        justifyContent: 'center',

    },
    banner: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',

    },
    base: {
        width: width / 2,
        height: 180*(width/2*PixelRatio.get())/(360*PixelRatio.get()),
        borderWidth: 1,
        
        borderColor: '#f0f0f0',
    }
});
