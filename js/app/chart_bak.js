$(function () {

    $('#chart').highcharts('StockChart', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginTop: 30,
            zoomType: '',
            events: {
                load: function() {
                    // set up the updating of the chart each second
                    var phase1 = this.series[1];
                    var phase2 = this.series[2];
                    var phase3 = this.series[3];
                    var average = this.series[0];
                    var chart = this;
                    var pu1=100,pu2=100,pu3=100,avg=100,x=0;
                    var d = new Date();
					var time = (new Date()).getTime();
                    var latestTime = time;
                    var source = 'http://power-monitor-cloud.appspot.com/rms';
					// var source = 'http://localhost:5050/rms';
                    d.setTime(latestTime);
                    console.log(latestTime);
                    setInterval(function() {
						$.ajax({
							url : source+"/"+time,
							success : function(data) {
								//console.log(data);
                                var length = data.results.rms.length;
                                // var length = data.rms.length;
                                d.setTime(time);
                                console.log(source+"/"+time);
								console.log("# of received record: "+length + " from time: " + d);
                                // console.log(" pu1 = "+pu1+" pu2 = "+pu2+" pu3 = "+pu3+" avg = "+avg);
                                if (length == 0)
                                {
                                    // for (var i=0;i<3;i++)
                                    // {
                                        // time = (new Date()).getTime()+25200000;
                                        // x = time;
                                        // d.setTime(x);
                                        // console.log(d);
                                        // pu1 = Math.random() * 100,
                                        // pu2 = Math.random() * 100,
                                        // pu3 = Math.random() * 100,
                                        // avg = (pu1+pu2+pu3)/3;
                                        // phase1.addPoint([x, pu1], false, true);
                                        // phase2.addPoint([x, pu2], false, true);
                                        // phase3.addPoint([x, pu3], false, true);
                                        // average.addPoint([x, avg], false, true);
                                        // chart.redraw();
                                    // }
                                    
                                }
                                else
                                {
                                    for (var i=0;i<length;i++)
                                    {
                                        //var x = (new Date()).getTime(), // current time in UTC time
                                        time = data.results.rms[i].timestamp+25200000;
                                        if(x>=time)
                                        {
                                            time++;
                                            continue;
                                        }
                                        x=time;
                                        d.setTime(x);
                                        console.log(d);
                                        pu1 = 100-data.results.rms[i].pu1;//255*100,
                                        pu2 = 100-data.results.rms[i].pu2;//255*100,
                                        pu3 = 100-data.results.rms[i].pu3;//255*100,
                                        // pu1 = 100-data.rms[i].pu1;//255*100,
                                        // pu2 = 100-data.rms[i].pu2;//255*100,
                                        // pu3 = 100-data.rms[i].pu3;//255*100,
                                        avg = (pu1+pu2+pu3)/3;
                                        console.log(" time = "+(new Date()).setTime(x));
                                        phase1.addPoint([x, pu1], false, true);
                                        phase2.addPoint([x, pu2], false, true);
                                        phase3.addPoint([x, pu3], false, true);
                                        average.addPoint([x, avg], false, true);
                                        chart.redraw();
                                    }
                                }
							}   
						});
                    }, 500);
                }
            }
        },
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                count: 30,
                type: 'minute',
                text: '30M'
            }, {
                count: 1,
                type: 'hour',
                text: '1H'
            }, {
                count: 1,
                type: 'day',
                text: '1D'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: true,
            selected: 0,
            inputDateFormat: '%Y-%m-%d,%H:%M:%S.%L',
            inputEditDateFormat: '%Y-%m-%d,%H:%M:%S.%L',
            inputBoxWidth: 180,
            inputDateParser: function(value) {
                value = value.split(/[-,:\.]/);
                return Date.UTC(
                    parseInt(value[0]),
                    parseInt(value[1]) - 1,
                    parseInt(value[2]),
                    parseInt(value[3]),
                    parseInt(value[4]),
                    parseInt(value[5]),
                    parseInt(value[6])
                );
            }
        },
        scrollbar: {
            enabled: true
        },
        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        navigation: {
            buttonOptions: {
                align: 'right',
                y: -10
            }
        },

        xAxis: {
            title: {
                text: 'Time'
            },
            type: 'datetime',
            //tickInterval: 1000, // one week
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
        },

        yAxis: { // left y axis
            min: 0,
            max: 120,
            title: {
                text: '% RMS'
            },
            labels: {
                align: 'left',
                x: 3,
                y: 16,
                formatter: function() {
                    return Highcharts.numberFormat(this.value, 0);
                }
            },
        },

        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom'
        },

        tooltip: {
            formatter: function() {
                var d = new Date(this.x);
                return 	Highcharts.dateFormat('%e. %b %H:%M:%S:', this.x)+d.getMilliseconds()+'<br/>'+
                    '<b style="color:'+ this.points[0].series.color +'">'+ this.points[0].series.name +' - '+ this.points[0].y.toFixed(2) +' %'+'</b><br/>'+
                    '<b style="color:'+ this.points[1].series.color +'">'+ this.points[1].series.name +' - '+ this.points[1].y.toFixed(2) +' %'+'</b><br/>'+
                    '<b style="color:'+ this.points[2].series.color +'">'+ this.points[2].series.name +' - '+ this.points[2].y.toFixed(2) +' %'+'</b><br/>'+
                    '<b style="color:'+ this.points[3].series.color +'">'+ this.points[3].series.name +' - '+ this.points[3].y.toFixed(2) +' %'+'</b><br/>';
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            hs.htmlExpand(null, {
                                pageOrigin: {
                                    x: this.pageX,
                                    y: this.pageY
                                },
                                headingText: this.series.name,
                                maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                    this.y +' visits',
                                width: 200
                            });
                        }
                    }
                },
                marker: {
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Average',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime()+25200000,
                    i;

                for (i = -199; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 100//Math.random()
                    });
                }
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
                var data = [],
                    time = (new Date()).getTime()+25200000,
                    i;

                for (i = -199; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 100//Math.random()
                    });
                }
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
                var data = [],
                    time = (new Date()).getTime()+25200000,
                    i;

                for (i = -199; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 100//Math.random()
                    });
                }
                return data;
            })(),
        }, {
            name: 'Phase 3',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime()+25200000,
                    i;

                for (i = -199; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 100//Math.random()
                    });
                }
                return data;
            })(),
        }]
    });
});