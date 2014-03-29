$(function () {

    // email modal
    $('#emailModal').on('show.bs.modal', function () {
        $.ajax({
            type: 'GET',
            url: "http://demo7412509.mockable.io/email",
            success: function(emailSetting){
                var emailList = [];
                var tmp_query = '';

                for(var i = 0; i < emailSetting.records.length; i++) {
                    emailList.push(emailSetting.records[i].email);
                }
                var updater = function(item) {
                    tmp_query = item;
                    loadSavedData();
                    return item;
                };
                var matcher = function(item) {
                    // on query changed
                    if(tmp_query != this.query) {
                        var isEqual = false;
                        for(var i = 0; i < emailList.length; i++) {
                            if(emailList[i].toLowerCase() == this.query.toLowerCase()) {
                                isEqual = true;
                                break;
                            }
                        }
                        if(isEqual) {
                            loadSavedData();
                        }

                        tmp_query = this.query;
                    }

                    return ~item.toLowerCase().indexOf(this.query.toLowerCase());
                };
                var options = {
                    source: emailList,
                    minLength: 0,
                    matcher: matcher,
                    updater: updater
                };
                $('#txtEmail').typeahead(options);

                function loadSavedData() {
                    var emailData = null;
                    for(var i = 0; i < emailSetting.records.length; i++) {
                        if(tmp_query == emailSetting.records[i].email) {
                            emailData = emailSetting.records[i];
                            break;
                        }
                    }
                    if(emailData != null) {
                        $('#txtTotalSag').val(emailData.totalSag);
                        $('#txtPerSecond').val(emailData.perSecond);
                        $('#chkEnabled').prop('checked', emailData.enabled);
                    }
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

                // update email setting
                $.ajax({
                    type: "POST",
                    url: "www.google.com",
                    data: { email: email, totalSag: totalSag, perSecond: perSecond, enabled: enabled},
                    success: function(){

                    },
                    dataType: "json",
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
                });

                return false;
            }
        });

        $('#saveChange').on('click', function(evt) {
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