$(function () {
    
    var date = new Date();
    
    $('#chart2').highcharts('StockChart', {
        chart: {
            // type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            // marginTop: 30,
            zoomType: 'x',
            events: {
                load: function() {
                    // set up the updating of the chart each second
                    var phase1 = this.series[1];
                    var phase2 = this.series[2];
                    var phase3 = this.series[3];
                    var average = this.series[0];
                    var chart = this;
                    // alert('Test Reference: '+ (this.series[0]==$('#chart2').highcharts().series[0]));
					var time = (new Date()).getTime();
                    var pu1=100,pu2=100,pu3=100,avg=100;
                    var latestTime = time;
                    var time2;
                    var dummyTime = time;
                    // alert(new Date(time-10000));
                    // var source = 'http://toonja606.appspot.com/getdata';
					var source = 'http://localhost:5050/rms.json?count=200&asc=false';
                    chart.showLoading('Loading data from server...');
                    $.ajax({
                        url : source,
                        success : function(data) {
                            var length = data.results.rms.length;
                            console.log("# of received record: "+length + "from time" + latestTime);
                            var time = data.results.rms[0].timestamp;
                            for (var i=length-1;i>=0;i--)
                            {
                                time2 = data.results.rms[i].timestamp;
                                latestTime = time2;
                                dummyTime = time2;
                                pu1 = data.results.rms[i].pu1;
                                if (pu1<=100) pu1 = 100-pu1;
                                pu2 = data.results.rms[i].pu2;
                                if (pu2<=100) pu2 = 100-pu2;
                                pu3 = data.results.rms[i].pu3;
                                if (pu3<=100) pu3 = 100-pu3;
                                // console.log("Time");
                                avg = (pu1+pu2+pu3)/3;
                                phase1.addPoint([time2, pu1], false, false);
                                phase2.addPoint([time2, pu2], false, false);
                                phase3.addPoint([time2, pu3], false, false);
                                average.addPoint([time2, avg], false, false);
                            }
                            chart.redraw();
                            console.log('graph plot!');
                            alert('Loading complete. Click OK to continue');
                            chart.hideLoading();
                        }
                    });
                }
            }
        },
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1m'
            }, {
                count: 5,
                type: 'minute',
                text: '5m'
            }, {
                count: 30,
                type: 'minute',
                text: '30m'
            }, {
                count: 1,
                type: 'hour',
                text: '1H'
            }, {
                count: 1,
                type: 'day',
                text: '1D'
            },{
                count: 7,
                type: 'day',
                text: '7D'
            },{
                count: 1,
                type: 'month',
                text: '1M'
            },{
                count: 3,
                type: 'month',
                text: '3M'
            },{
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            // selected: 8,
            // inputDateFormat: '%Y-%m-%d,%H:%M:%S.%L',
            // inputEditDateFormat: '%Y-%m-%d,%H:%M:%S.%L',
            // inputBoxWidth: 180,
            // inputDateParser: function(value) {
                // value = value.split(/[-,:\.]/);
                // return Date.UTC(
                    // parseInt(value[0]),
                    // parseInt(value[1]) - 1,
                    // parseInt(value[2]),
                    // parseInt(value[3]),
                    // parseInt(value[4]),
                    // parseInt(value[5]),
                    // parseInt(value[6])
                // );
            // }
        },
        // scrollbar: {
            // enabled: true
        // },
        title: {
            text: 'Overall Power Level Since the Begining of Time until '+ date.toDateString()
        },

        subtitle: {
            text: ''
        },

        // navigator : {
            // adaptToUpdatedData: false,
            // series : {
                // data : []//data
            // }
        // },
        
        // navigation: {
            // buttonOptions: {
                // align: 'right',
                // y: -10
            // }
        // },
        scrollbar: {   
            liveRedraw: false
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b',
            },
            labels: {
                align: 'left',
                x: 3,
                y: -3,
                /*
                 formatter: function() {
                 var d = new Date(this.value);
                 return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds();
                 }
                 */
            },
            events : {
                afterSetExtremes : function (e) {
                    var range = e.max - e.min,
                        chart = $('#chart2').highcharts(),
                        source = 'http://localhost:5050/rms.json?start='+Math.round(e.min)+'&end='+Math.round(e.max);
                    // var phase1 = chart.series[1];
                    // var phase2 = chart.series[2];
                    // var phase3 = chart.series[3];
                    // var average = chart.series[0];
                    var phase1 = [];
                    var phase2 = [];
                    var phase3 = [];
                    var average = [];
                    var pu1=100,pu2=100,pu3=100,avg=100;
                    chart.showLoading('Loading data from server...');
                    // alert(Math.round(e.min)+' to '+Math.round(e.max));
                    console.log('setExtremes called');
                    // for(var i=0;i<4;i++)
                    // {
                        // chart.series[i].setData([]);
                    // }
                    // console.log(phase1);
                    console.log(source);
                    $.ajax({
                        url : source,
                        success : function(data) {
                            data = data.results.rms;
                            var length = data.length;
                            alert('new data length: ' + length );
                            for(var i=0;i<length;i++){
                                time2 = data[i].timestamp;
                                latestTime = time2;
                                dummyTime = time2;
                                pu1 = data[i].pu1;
                                if (pu1<=100) pu1 = 100-pu1;
                                pu2 = data[i].pu2;
                                if (pu2<=100) pu2 = 100-pu2;
                                pu3 = data[i].pu3;
                                if (pu3<=100) pu3 = 100-pu3;
                                avg = (pu1+pu2+pu3)/3;
                                // phase1.addPoint([time2, pu1], false, false);
                                // phase2.addPoint([time2, pu2], false, false);
                                // phase3.addPoint([time2, pu3], false, false);
                                // average.addPoint([time2, avg], false, false);
                                phase1.push([time2, pu1]);
                                phase2.push([time2, pu2]);
                                phase3.push([time2, pu3]);
                                average.push([time2, avg]);
                            }
                            chart.series[1].setData(phase1);
                            chart.series[2].setData(phase2);
                            chart.series[3].setData(phase3);
                            chart.series[0].setData(average);
                        }
                    });  
                    // chart.redraw();
                    chart.hideLoading();
                }
            },
            // minRange: 60 * 1000 //one minute
        },

        yAxis: { // left y axis
            min: 0,
            max: 120,
            title: {
                text: '% task'
            },
            labels: {
                align: 'left',
                x: 3,
                y: 16,
                // formatter: function() {
                    // return Highcharts.numberFormat(this.value, 0);
                // }
            },
        },

        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom'
        },

      
        // plotOptions: {
            // series: {
                // cursor: 'pointer',
                // point: {
                    // events: {
                        // click: function() {
                            // hs.htmlExpand(null, {
                                // pageOrigin: {
                                    // x: this.pageX,
                                    // y: this.pageY
                                // },
                                // headingText: this.series.name,
                                // maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                    // this.y +' visits',
                                // width: 200
                            // });
                        // }
                    // }
                // },
                // marker: {
                    // lineWidth: 1
                // }
            // }
        // },
        series: [{
            name: 'Average',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                // generate an array of random data
                var data = [];
                return data;
            })()
        },{
            name: 'Phase 1',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                // generate an array of random data
                var data = [];
                return data;
            })(),
        }, {
            name: 'Phase 2',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                // generate an array of random data
                var data = [];
                return data;
            })(),
        }, {
            name: 'Phase 3',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                var data = [];
                return data;
            })(),
        }]
    });
});
