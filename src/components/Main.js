require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';

//let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//只执行一次的函数适用这种自执行函数（即时函数）的写法
imageDatas = (function genImageURL(imageDatasArr){
  //"use strict";
  for(var i = 0, len = imageDatasArr.length; i < len; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>

    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
