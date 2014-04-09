$(function () {
    
    var date = new Date();
    alert('Loading.....');
    var source = 'http://localhost:5050/rms.json?count=2000&asc=false';
    $.getJSON(source, function(data) {
        alert('Done');
        var phase = new Array(4);
        for(var i=0;i<4;i++)
            phase[i] = new Array();
        var pu1=100,pu2=100,pu3=100,avg=100;
        data = data.results.rms;
        var length = data.length;
        for(var i=length-1;i>=0;i--){
            time2 = data[i].timestamp;
            pu1 = data[i].pu1;
            if (pu1<=100) pu1 = 100-pu1;
            pu2 = data[i].pu2;
            if (pu2<=100) pu2 = 100-pu2;
            pu3 = data[i].pu3;
            if (pu3<=100) pu3 = 100-pu3;
            avg = (pu1+pu2+pu3)/3;
            phase[1].push([time2, pu1]);
            phase[2].push([time2, pu2]);
            phase[3].push([time2, pu3]);
            phase[0].push([time2, avg]);
        }
        $('#chart2').highcharts('StockChart', {
            chart: {
                // type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                // marginTop: 30,
                zoomType: 'x',
            },
            navigator : {
				adaptToUpdatedData: false,
				series : {
					data : phase[0]
				}
			},
            scrollbar: {
				liveRedraw: false
			},
            title: {
                text: 'Overall Power Level Since the Begining of Time until '+ date.toDateString()
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
                },
                events : {
                    afterSetExtremes : afterSetExtremes
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
                },
            },

            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom'
            },

            series: [{
                name: 'Average',
                lineWidth: 4,
                marker: {
                    radius: 4
                },
                data: phase[0]
            },{
                name: 'Phase 1',
                lineWidth: 4,
                marker: {
                    radius: 4
                },
                data: phase[1]
            }, {
                name: 'Phase 2',
                lineWidth: 4,
                marker: {
                    radius: 4
                },
                data: phase[2]
            }, {
                name: 'Phase 3',
                lineWidth: 4,
                marker: {
                    radius: 4
                },
                data: phase[3]
            }]
        });
    });
        
    
});

function afterSetExtremes (e) {
    var range = e.max - e.min,
        chart = $('#chart2').highcharts(),
        source = 'http://localhost:5050/rms.json?start='+Math.round(e.min)+'&end='+Math.round(e.max);
    var phase1 = [];
    var phase2 = [];
    var phase3 = [];
    var average = [];
    var pu1=100,pu2=100,pu3=100,avg=100;
    chart.showLoading('Loading data from server...');
    // alert(Math.round(e.min)+' to '+Math.round(e.max));
    console.log('setExtremes called');
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
    chart.hideLoading();
}