function ExternalSayHello()
{
	var time = (new Date()).getTime();
	var url = 'http://toonja606.appspot.com/getdata/'+time;
	alert(url);
}