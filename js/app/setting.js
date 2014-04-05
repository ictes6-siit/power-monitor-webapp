$(function () {

    // email modal
    $('#emailModal').on('show.bs.modal', function () {
        $.ajax({
            type: 'GET',
            url: "http://power-monitor-cloud.appspot.com/email",
            success: function(emailSetting){
                var emailList = [];
                var tmp_query = '';

                emailList = emailSetting.results.email;
                var updater = function(item) {
                    tmp_query = item;
                    var emailData = null;
                    for(var i = 0; i < emailList.length; i++) {
                        if(emailList[i].email.toLowerCase() == item) {
                            loadSavedData(emailList[i]);
                            break;
                        }
                    }

                    return item;
                };
                var matcher = function(item) {
                    // on query changed
                    if(tmp_query != this.query) {
                        var isEqual = false;
                        var emailData = null;
                        for(var i = 0; i < emailList.length; i++) {
                            if(emailList[i].email.toLowerCase() == this.query.toLowerCase()) {
                                isEqual = true;
                                loadSavedData(emailList[i]);
                                break;
                            }
                        }

                        tmp_query = this.query;
                    }

                    return ~item.toLowerCase().indexOf(this.query.toLowerCase());
                };

                var emailNameList = [];
                for(i = 0; i < emailList.length; i++) {
                    emailNameList.push(emailList[i].email);
                }
                var options = {
                    source: emailNameList,
                    minLength: 0,
                    matcher: matcher,
                    updater: updater
                };
                $('#txtEmail').typeahead(options);

                function loadSavedData(emailData) {
                    $('#txtTotalSag').val(emailData.sag);
                    $('#txtPerSecond').val(emailData.time);
                    $('#chkEnabled').prop('checked', emailData.enabled);
                }
            },
            timeout: 5000, //in milliseconds
            error: function(x, t, m) {
                if(t==="timeout") {
                    alert("got timeout");
                } else {
                    alert(t);
                }
            }
        });

        $.validate({
            form: '#formSetting',
            validateOnBlur : false,
            onSuccess : function($form) {
                var email = $('#txtEmail').val();
                var totalSag = $('#txtTotalSag').val();
                var perSecond = $('#txtPerSecond').val();
                var enabled = $('#chkEnabled').prop('checked');
                console.log(email + totalSag + perSecond + enabled);

                $('#btnSaveChange').button('loading');
                // update email setting
                var data = { email: email, sag: totalSag, time: perSecond, enabled: enabled};
                $.ajax({
                    type: "POST",
                    url: "http://power-monitor-cloud.appspot.com/email",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    timeout: 5000, //in milliseconds
                    success: function(data){
                        showalert('#alertBox', 'success', '<strong>Email Configuration Successful !</strong> ' +
                            'You will receive the message after the occurrence of sag according to your specified settings');
                        $('#emailModal').modal('hide');
                    },
                    error: function(x, t, m) {
                        showalert('#alertBox', 'danger', '<strong>Saving settings failed !</strong> ' +
                            'Please try again later.');
                        $('#emailModal').modal('hide');
                    }
                }).always(function () {
                    $('#btnSaveChange').button('reset')
                });

                return false;
            }
        });

        $('#btnSaveChange').on('click', function(evt) {
            var $form = $('#formSetting').on('submit', function() {
                return false;
            });
            $form.trigger('submit');
        });
        $('#btnReset').on('click', function() {
            $('#formSetting')[0].reset();
        });
    });

    function showalert(id, alerttype, message) {

        $(id).html(
            '<div id="alertdiv" class="alert alert-' +  alerttype + ' fade in">' +
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                message +
            '</div>');

        setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
            $(".alert").alert('close');
        }, 10000);
    }
});