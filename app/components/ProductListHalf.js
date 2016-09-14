import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
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

export default class ProductListHalf extends Component {
    render() {
        let id = 0;
        return (
            <View>
                <View style={{ width: width, height: 50, backgroundColor: '#EFEFEF', justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontSize: 18, color: "#ed145b" }}>{this.props.title === null ? '每日必买' : this.props.title}</Text>
                </View>
                {this.props.dataSource.map((article) => {
                    const bannerView = (
                        <View
                            key={id}
                            style={{ flex: 1 ,width: width/2}}

                            >
                            {this.renderItem(article) }
                        </View>);
                    id++;
                    return bannerView;
                }) }
            </View>
        )
    }

    goUrl(productId) {
        href = "http://m.ftzmall.com/product/app.html?id=" + productId ;
        const { navigator } = this.props;
        navigator.push({
            component: WebContainer,
            name: "WebContainer",
            href: href
        });

    }

    renderItem(article) {
        const { navigator } = this.props;
        //pic 610*339
        return (
            <View style={styles.containerItem}>
                <TouchableOpacity
                    onPress={() => this.goUrl(article.productId) }
                    >
                    <Image
                        style={{ width: width, height: 339*(width*PixelRatio.get())/(610*PixelRatio.get()) }}
                        resizeMode={Image.resizeMode.contain}
                        source={{ uri: article.productImage }}
                        />
                </TouchableOpacity>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 18, color: "#000000" }}>{article.title}</Text>
                    <Text style={{ fontSize: 10 }}>{article.description}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 11, textAlign: 'left' }}>国内参考价: ￥{article.listPrice}</Text>
                            <Text style={{ fontSize: 20, textAlign: 'left', color: "#ed145b" }}>￥{article.offerPrice}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.goUrl(article.productId) }
                            >
                            <View style={{ flex: 1, }} style={{width:100,borderColor: '#ed145b',    borderWidth: 1,borderRadius:5}}>
                                <Text style={{ width:100,fontSize: 18, textAlign: 'center', color: "#ed145b", alignSelf: 'flex-end' }}>去看看</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }
}

const returnSize = 45;
const styles = StyleSheet.create({
    containerItem: {
        flex: 1,
        width: width/2,
        
        alignSelf: 'center'
    },
    banner: {
        flexDirection: 'row',
        width: width,
        backgroundColor: '#FFFFFF',
    },

});
