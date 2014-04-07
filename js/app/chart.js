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

                    var pu1,pu2,pu3,avg;
                    var latestTime = null;
                    var source = 'http://power-monitor-cloud.appspot.com/rms';
                    setInterval(function() {
						$.ajax({
							url : source + ((latestTime != null) ? ('/' + latestTime) : ''),
							success : function(data) {
                                for (var i = 0; i < data.results.rms.length; i++)
                                {
                                    var newTime = data.results.rms[i].timestamp;
                                    pu1 = data.results.rms[i].pu1;
                                    if (pu1 <= 100) pu1 = 100 - pu1;
                                    pu2 = data.results.rms[i].pu2;
                                    if (pu2 <= 100) pu2 = 100 - pu2;
                                    pu3 = data.results.rms[i].pu3;
                                    if (pu3 <= 100) pu3 = 100 - pu3;
                                    avg = (pu1 + pu2 + pu3) / 3;
                                    phase1.addPoint([newTime, pu1], false, true);
                                    phase2.addPoint([newTime, pu2], false, true);
                                    phase3.addPoint([newTime, pu3], false, true);
                                    average.addPoint([newTime, avg], false, true);
                                    chart.redraw();

                                    latestTime = newTime + 1;
                                }
							}
						});
                    }, 1000);
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
            inputEnabled: false,
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
            text: 'Realtime Power Monitoring System'
        },

        subtitle: {
            text: 'Data is updated every 1 second'
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
                text: '% task'
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
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
                    time = (new Date()).getTime(),
                    i;

                for (i = -99; i <= 0; i++) {
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