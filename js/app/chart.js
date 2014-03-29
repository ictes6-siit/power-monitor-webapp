$(function () {

    Highcharts.Data.prototype.dateFormats['YYYY-MM-DDTHH:mm:ss.sssZ'] = {
        regex: '^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})Z$',
        parser: function (match) {
            return Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6], match[7]);
        }
    };

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
                    var average = this.series[0]
                    var chart = this;
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            pu1 = Math.random() * 100,
                            pu2 = Math.random() * 100,
                            pu3 = Math.random() * 100,
                            avg = (pu1+pu2+pu3)/3;
                        phase1.addPoint([x, pu1], false, true);
                        phase2.addPoint([x, pu2], false, true);
                        phase3.addPoint([x, pu3], false, true);
                        average.addPoint([x, avg], false, true);
                        chart.redraw();
                    }, 1000);
                }
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