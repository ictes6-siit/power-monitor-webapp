$(function() {
	var date = new Date();
    var time = date.getTime();
	// See source code from the JSONP handler at https://github.com/highslide-software/highcharts.com/blob/master/samples/data/from-sql.php
	// $.getJSON('http://www.highcharts.com/samples/data/from-sql.php?callback=?', function(data) {
    $.getJSON('http://localhost:5050/rms/0/'+time, function(data) {
		
		// Add a null value for the end date 
		data = [].concat(data, [[100, 100, 100, time]]);
				
		// create the chart
		$('#chart2').highcharts('StockChart', {
			chart : {
				type: 'candlestick',
				zoomType: 'x'
			},

			navigator : {
				adaptToUpdatedData: false,
				series : {
					data : data
				}
			},

			scrollbar: {
				liveRedraw: false
			},
			
			title: {
				text: 'Overall Power Level Since the Begining of Time'
			},
			
			subtitle: {
				text: ''
			},
			
			rangeSelector : {
				buttons: [{
					type: 'minute',
					count: 1,
					text: '1min'
				},{
					type: 'minute',
					count: 30,
					text: '30min'
				},{
					type: 'hour',
					count: 1,
					text: '1h'
				}, {
					type: 'day',
					count: 1,
					text: '1d'
				}, {
					type: 'month',
					count: 1,
					text: '1m'
				}, {
					type: 'year',
					count: 1,
					text: '1y'
				}, {
					type: 'all',
					text: 'All'
				}],
				inputEnabled: true,
				selected : 2
			},
			
			xAxis : {
				events : {
					afterSetExtremes : afterSetExtremes
				},
				minRange:  1000 // one second
			},

			series : [{
				data : data,
				dataGrouping: {
					enabled: false
				}
			}]
		});
	});
});


/**
 * Load new data depending on the selected min and max
 */
function afterSetExtremes(e) {

	var currentExtremes = this.getExtremes(),
		range = e.max - e.min,
		chart = $('#chart2').highcharts();
		
	chart.showLoading('Loading data from server...');
    alert(Math.round(e.min)+' to '+Math.round(e.max));
    
	$.getJSON('http://localhost:5050/rms/'+Math.round(e.min)+'/'+Math.round(e.max), function(data) {
		
		chart.series[0].setData(data);
		chart.hideLoading();
	});
}
