require('normalize.css/normalize.css');
require('../css/App.css');

import React from 'react';
import ReactDOM from 'react-dom';


//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//只执行一次的函数适用这种自执行函数（即时函数）的写法
imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0, len = imageDatasArr.length; i < len; i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内的随机值
function getRangeRandom(low, high){
  return Math.floor(Math.random() * (high - low) + low);
}

var ImgFigure = React.createClass({
  render: function(){

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
      // styleObj.position = 'absolute';
    }

    // console.log(styleObj);

    return(
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

var GalleryByReactApp = React.createClass({

  //各个位置点（定义时先初始化为0，后面再重新初始化赋值）
  Constant: {
    centerPos:{
      left: 0,
      right: 0
    },
    hPosRange: { //水平方向的取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange:{ //垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  },

  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   * */
  rearrange: function(centerIndex){

    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取1个或不取
        topImgSpliceIndex = 0,

        //取出要布局居中的图片的状态信息
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    //居中centerIndex的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    imgsArrangeTopArr.forEach(function(value, index){



      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    });

    //布局左右两侧的图片
    for(var i = 0, len = imgsArrangeArr.length, k = len / 2; i < len; i++){
      var hPosRangeLORX = null;

      //前半部分布局左边，后半部分布局右边
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      };
    }


    //将取出的图片信息合并回去
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0 ,imgsArrangeCenterArr[0]);

    //触发重新渲染
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },

  getInitialState: function(){
    return {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          }
        }*/
      ]
    };
  },

  //组件加载后，为每张图片计算其位置的范围
  componentDidMount: function(){

    //首先拿到stage大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);

    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);


    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //console.log(this);  //warning no-console

    //计算左 右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  },


  render: function(){

    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index){

      if(!this.state.imgsArrangeArr[index]){

        // console.log("this.state.imgsArrangeArr[index] == null");

        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        };
      }


      imgFigures.push(<ImgFigure data={value}  key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);


    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>

    );
  }
});
// React.render(<GalleryByReactApp />, document.getElementById('content'));
/*
GalleryByReactApp.defaultProps = {
};*/

export default GalleryByReactApp;
