function coordinate(myWindow, myData, myZoom) {

    //调用iframe中内部方法, 必须用外部的window对象！！
    if (myWindow)
    {
        var obj = analysisOper.getClientSize();
        var widths = obj.width;
        var heights = obj.height;
        $(".map").css({float: "left", width: widths - 330, height: heights - 60, marginLeft: 0 + "px"});
        $(".sidebar").css({float: "right", width: 260, height: heights - 60});
        myWindow.frames.myFrame.contentWindow.fillBar(myData);
    }

    $("#map").empty();

    var geoCoordMap = {
        "北京市": [116.407170, 39.904690],
        "东城区": [116.416370, 39.928550],
        "西城区": [116.366110, 39.912310],
        "丰台区": [116.286160, 39.858560],
        "石景山区": [116.222990, 39.905690],
        "海淀区": [116.298450, 39.959330],
        "门头沟区": [116.101460, 39.940480],
        "房山区": [116.142940, 39.747880],
        "顺义区": [116.654770, 40.130120],
        "昌平区": [116.231280, 40.220770],
        "大兴区": [116.341590, 39.726840],
        "怀柔区": [116.631770, 40.316000],
        "平谷区": [117.121410, 40.140620],
        "密云区": [116.843170, 40.376250],
        "延庆区": [115.975030, 40.456780],
        "天津市": [117.199370, 39.085100],
        "河西区": [117.223360, 39.109540],
        "南开区": [117.150110, 39.138150],
        "河北区": [117.196740, 39.147840],
        "红桥区": [117.151610, 39.167340],
        "东丽区": [117.314280, 39.086520],
        "西青区": [117.007390, 39.141110],
        "津南区": [117.357100, 38.937500],
        "北辰区": [117.135440, 39.223930],
        "武清区": [117.044120, 39.383260],
        "宝坻区": [117.309830, 39.717550],
        "滨海新区": [117.710710, 39.003200],
        "宁河区": [117.824780, 39.330910],
        "静海区": [116.974280, 38.947370],
        "蓟州区": [117.408290, 40.045770],
        "河北省": [114.469790, 38.035990],
        "石家庄市": [114.514300, 38.042760],
        "裕华区": [114.531220, 38.006100],
        "藁城区": [114.846760, 38.021660],
        "鹿泉区": [114.313440, 38.085870],
        "栾城区": [114.648390, 37.900250],
        "井陉县": [114.145320, 38.032250],
        "正定县": [114.570960, 38.146180],
        "行唐县": [114.552940, 38.438480],
        "灵寿县": [114.382650, 38.308640],
        "高邑县": [114.611480, 37.614930],
        "深泽县": [115.200940, 38.184170],
        "赞皇县": [114.385920, 37.665790],
        "无极县": [114.976380, 38.179150],
        "平山县": [114.186050, 38.259980],
        "元氏县": [114.525470, 37.766460],
        "辛集市": [115.217920, 37.943160],
        "晋州市": [115.044100, 38.033560],
        "新乐市": [114.683840, 38.343380],
        "唐山市": [118.180580, 39.630480],
        "路南区": [118.154740, 39.625270],
        "路北区": [118.201270, 39.624290],
        "古冶区": [118.458850, 39.716120],
        "开平区": [118.261740, 39.671320],
        "丰南区": [118.085050, 39.574870],
        "丰润区": [118.162060, 39.832690],
        "曹妃甸区": [118.460230, 39.273130],
        "滦南县": [118.674140, 39.503940],
        "乐亭县": [118.912520, 39.425640],
        "迁西县": [118.314600, 40.141530],
        "玉田县": [117.738810, 39.900500],
        "遵化市": [117.965670, 40.189240],
        "迁安市": [118.700730, 39.998360],
        "秦皇岛市": [119.599640, 39.935450],
        "海港区": [119.610630, 39.934500],
        "山海关区": [119.776060, 39.978920],
        "北戴河区": [119.484580, 39.835070],
        "抚宁区": [119.244440, 39.876340],
        "青龙满族自治县": [118.950120, 40.406920],
        "昌黎县": [119.162880, 39.712840],
        "卢龙县": [118.892940, 39.891800],
        "邯郸市": [114.539180, 36.625560],
        "邯山区": [114.483760, 36.600000],
        "丛台区": [114.493390, 36.618530],
        "肥乡区": [114.800020, 36.548110],
        "永年区": [114.490950, 36.777710],
        "临漳县": [114.619680, 36.334800],
        "成安县": [114.669990, 36.444140],
        "大名县": [115.147880, 36.285580],
        "鸡泽县": [114.878200, 36.920310],
        "广平县": [114.948500, 36.483450],
        "馆陶县": [115.306290, 36.535290],
        "曲周县": [114.944850, 36.779180],
        "武安市": [114.203760, 36.696710],
        "邢台市": [114.504430, 37.070550],
        "邢台县": [114.544890, 37.086270],
        "临城县": [114.498980, 37.444300],
        "内丘县": [114.512070, 37.286780],
        "柏乡县": [114.693630, 37.482440],
        "隆尧县": [114.770310, 37.350250],
        "南和县": [114.683760, 37.004900],
        "宁晋县": [114.919320, 37.619800],
        "巨鹿县": [115.037810, 37.221070],
        "新河县": [115.242140, 37.528670],
        "广宗县": [115.142610, 37.074630],
        "平乡县": [115.030070, 37.063190],
        "清河县": [115.667180, 37.039930],
        "临西县": [115.501040, 36.870820],
        "南宫市": [115.408660, 37.357950],
        "沙河市": [114.503320, 36.855160],
        "保定市": [115.464590, 38.873960],
        "竞秀区": [115.458750, 38.877570],
        "莲池区": [115.497150, 38.883530],
        "满城区": [115.322170, 38.948920],
        "清苑区": [115.489890, 38.765260],
        "徐水区": [115.655860, 39.018650],
        "涞水县": [115.713780, 39.394280],
        "阜平县": [114.195310, 38.849150],
        "定兴县": [115.807900, 39.263150],
        "高阳县": [115.778840, 38.700070],
        "容城县": [115.861640, 39.042850],
        "涞源县": [114.694240, 39.360180],
        "望都县": [115.155640, 38.709000],
        "安新县": [115.935640, 38.935350],
        "曲阳县": [114.745010, 38.622310],
        "顺平县": [115.135430, 38.837590],
        "博野县": [115.464390, 38.457660],
        "涿州市": [115.974390, 39.485290],
        "定州市": [114.990250, 38.516260],
        "安国市": [115.326640, 38.418450],
        "高碑店市": [115.873730, 39.326580],
        "张家口市": [114.887550, 40.824440],
        "宣化区": [115.099230, 40.608450],
        "下花园区": [115.287510, 40.502400],
        "万全区": [114.740550, 40.766990],
        "崇礼区": [115.282610, 40.974570],
        "张北县": [114.719870, 41.158620],
        "康保县": [114.600350, 41.852280],
        "沽源县": [115.688650, 41.669640],
        "尚义县": [113.969190, 41.075990],
        "阳原县": [114.150570, 40.103660],
        "怀安县": [114.385640, 40.674300],
        "怀来县": [115.517780, 40.415380],
        "涿鹿县": [115.219620, 40.380030],
        "赤城县": [115.831660, 40.912950],
        "承德市": [117.963400, 40.951500],
        "双滦区": [117.800240, 40.959130],
        "承德县": [118.173820, 40.768530],
        "兴隆县": [117.500760, 40.417270],
        "滦平县": [117.332860, 40.941450],
        "隆化县": [117.738970, 41.313810],
        "丰宁满族自治县": [116.645910, 41.208940],
        "宽城满族自治县": [118.485350, 40.611390],
        "围场满族蒙古族自治县": [117.760160, 41.938460],
        "平泉市": [118.702020, 41.018400],
        "沧州市": [116.838690, 38.304410],
        "运河区": [116.831910, 38.310770],
        "东光县": [116.537100, 37.888280],
        "海兴县": [117.497850, 38.143250],
        "盐山县": [117.230250, 38.058300],
        "肃宁县": [115.829970, 38.422770],
        "南皮县": [116.707740, 38.037800],
        "吴桥县": [116.391540, 37.627700],
        "孟村回族自治县": [117.104180, 38.053410],
        "泊头市": [116.578280, 38.083640],
        "任丘市": [116.099540, 38.711640],
        "黄骅市": [117.330120, 38.371390],
        "河间市": [116.099000, 38.445480],
        "廊坊市": [116.683760, 39.537750],
        "安次区": [116.685720, 39.503110],
        "广阳区": [116.710510, 39.522800],
        "固安县": [116.298520, 39.438250],
        "永清县": [116.499040, 39.321780],
        "香河县": [117.006450, 39.761420],
        "大城县": [116.654230, 38.704690],
        "文安县": [116.458480, 38.873280],
        "大厂回族自治县": [116.989510, 39.886650],
        "霸州市": [116.391700, 39.125810],
        "三河市": [117.078220, 39.982460],
        "衡水市": [115.670540, 37.738860],
        "桃城区": [115.674660, 37.735160],
        "冀州区": [115.579380, 37.550850],
        "枣强县": [115.724180, 37.513370],
        "武邑县": [115.887510, 37.801860],
        "武强县": [115.982530, 38.041200],
        "饶阳县": [115.725600, 38.235300],
        "安平县": [115.519120, 38.234470],
        "故城县": [115.965810, 37.347480],
        "阜城县": [116.144370, 37.868850],
        "深州市": [115.560010, 38.000220],
        "朝阳区": [116.4495620000, 39.9263730000],
        "通州区": [116.6634130000, 39.9160190000],
        "和平区": [117.2214670000, 39.1233900000],
        "河东区": [117.2584140000, 39.1344870000],
        "长安区": [114.5456130000, 38.0432570000],
        "桥西区": [114.4674240000, 38.0103810000],
        "新华区": [114.4694360000, 38.0571200000]
    };
    var dataArray = new Array(), levelArray = new Array();

    var convertData = function (data) {
        var res = [];
        if (!data)
            return res;
        for (var id in data) {
            var geoCoord = geoCoordMap[id];
            if (geoCoord) {
                dataArray.push(data[id][3]);
                res.push({
                    name: id,
                    value: geoCoord.concat(data[id][3])
                });
            }
        }
        console.log("dataArray:" + dataArray);
        if (dataArray.length > 5)
            levelArray = ss.jenks(dataArray, 3);
        else
            levelArray = dataArray;
        return res;
    };

    if (!myZoom) {
        myZoom = 6;
    }

    var Maps = new HMap('map', {
        controls: {
            loading: false,
            zoomSlider: true,
            fullScreen: false
        },
        view: {
            center: [12964000, 4853400],
            //extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],
            projection: 'EPSG:102100',
            tileSize: 256,
            zoom: myZoom // resolution
        },
        baseLayers: [
            {
                layerName: 'vector',
                isDefault: true,
                layerType: 'TileXYZ',
                tileGrid: {
                    tileSize: 256,
                    //extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],
                    origin: [-2.0037508342787E7, 2.0037508342787E7],
                    resolutions: [
                        156543.03392800014,
                        78271.51696399994,
                        39135.75848200009,
                        19567.87924099992,
                        9783.93962049996,
                        4891.96981024998,
                        2445.98490512499,
                        1222.992452562495,
                        611.4962262813797,
                        305.74811314055756,
                        152.87405657041106,
                        76.43702828507324,
                        38.21851414253662,
                        19.10925707126831,
                        9.554628535634155,
                        4.77731426794937,
                        2.388657133974685
                    ]
                },
                layerUrl: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
            }
        ]
    });

    var option = {
        title: {
            text: '协同布局',
            x: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + params.value[2];
            }
        },
        visualMap: {
            type: 'piecewise',
            pieces: [
                {gte: 0, lt: 0.2},
                {gte: 0.2, lt: 0.5},
                {gte: 0.5},
            ],
            show: false,
            calculable: true,
            inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            outOfRange: {
                color: ['#54a3ba', '#ebc736', '#d93e5d']
            },
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: 'data',
                type: 'scatter',
                data: convertData(myData),
                symbolSize: function(val)
                {
                    return 10 + getLevel(val[2], levelArray) * 8;
                },
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                }
            }
        ]
    };

    var echartslayer = new ol3Echarts(option);

    echartslayer.appendTo(Maps.getMap());
}

function getLevel(value, levelArray)
{
    for (i = 0; i < levelArray.length - 1; i++)
    {
        if (value >= levelArray[i] && value < levelArray[i+1])
        {
            console.log(value, levelArray, i);
            return i;
        }
    }
    return i;
}