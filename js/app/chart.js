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
					var time = (new Date()).getTime()-50000;
                    //alert(new Date(time-10000));
						//source = 'http://toonja606.appspot.com/getdata/';
					var source = 'http://localhost:5050/rms';
                    console.log(time);
                    setInterval(function() {
                        //time = (new Date()).getTime()-500;
						$.ajax({
							url : source+"/"+time,
							success : function(data) {
								//console.log(data);
                                var length = data.rms.length;
                                var skip = length / 10;
                                var j;
								console.log("# of received record: "+length);
                                //console.log("Skip: "+skip);
								//console.log(data.rms[0].pu1);
                                if (length > 10) length = 10;
                                for (var i=0;i<length;i++)
                                {
                                    j=parseInt(i*skip); 
                                    var x = (new Date()).getTime(), // current time in UTC time
                                    pu1 = data.rms[j].pu1/255*100,
                                    pu2 = data.rms[j].pu2/255*100,
                                    pu3 = data.rms[j].pu3/255*100,
                                    avg = (pu1+pu2+pu3)/3;
                                    phase1.addPoint([x, pu1], false, true);
                                    phase2.addPoint([x, pu2], false, true);
                                    phase3.addPoint([x, pu3], false, true);
                                    average.addPoint([x, avg], false, true);
                                    chart.redraw();
                                }
							}
						});
                        time = (new Date()).getTime()-500;
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
            max: 100,
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
                return 	Highcharts.dateFormat('%e. %b %M:%S:', this.x)+d.getMilliseconds()+'<br/>'+
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0//Math.random()
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0//Math.random()
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0//Math.random()
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0//Math.random()
                    });
                }
                return data;
            })(),
        }]
    });
});