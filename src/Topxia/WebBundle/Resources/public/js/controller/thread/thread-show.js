define(function(require, exports, module) {

            var Notify = require('common/bootstrap-notify');
            var Validator = require('bootstrap.validator');
            require('common/validator-rules').inject(Validator);
            require('ckeditor');
            var Share = require('../../util/share.js');

            function checkUrl(url) {
                var hrefArray = new Array();
                hrefArray = url.split('#');
                hrefArray = hrefArray[0].split('?');
                return hrefArray[1];
            }


            exports.run = function() {
                     Share.create({
                selector: '.share',
                icons: 'itemsAll',
                display: ''
        });

        if($('#post-thread-form').length>0){
        var editor =  CKEDITOR.replace('post_content', {
            toolbar: 'Simple',
            filebrowserImageUploadUrl: $('#post_content').data('imageUploadUrl')
        });
        var validator_post_content = new Validator({
            element: '#post-thread-form',
            failSilently: true,
            autoSubmit: false,
            onFormValidated: function(error){
                if (error) {
                    return false;
                }
                $('#post-thread-btn').button('submiting').addClass('disabled');

                $.ajax({
                url : $("#post-thread-form").attr('post-url'),
                data:$("#post-thread-form").serialize(),
                cache : false, 
                async : false,
                type : "POST",
                dataType : 'text',
                success : function (url){
                    if(url){
                        if(url=="/login"){
                            window.location.href=url;
                            return ;
                        }
                        href=window.location.href;
                        var olderHref=checkUrl(href);
                        if(checkUrl(url)==olderHref){
                            window.location.reload();
                        }else{
                            window.location.href=url;
                        }
                    }
                    else{
                            window.location.reload();
                    }                        
                }
                });          
            }
        });
        validator_post_content.addItem({
            element: '[name="content"]',
            required: true,
            rule: 'minlength{min:2} visible_character'            
        });

        validator_post_content.on('formValidate', function(elemetn, event) {
            editor.updateElement();
        });
        }
                    $('[data-role=confirm-btn]').click(function() {
                        var $btn = $(this);
                        if (!confirm($btn.data('confirmMessage'))) {
                            return false;
                        }
                        $.post($btn.data('url'), function() {
                            var url = $btn.data('afterUrl');
                            if (url) {
                                window.location.href = url;
                            } else {
                                window.location.reload();
                            }
                        });
                    });

                    $('.thread-post-list').on('click', '.thread-post-action', function() {

                        var userName = $(this).data('user');

                        editor.focus();
                        editor.insertHtml('@' + userName + '&nbsp;');

                    });

                    $(".thread-post-list").on('click', '[data-action=post-delete]', function() {
                        if (!confirm("您真的要删除该回帖吗？")) {
                            return false;
                        }
                        var $btn = $(this);
                        $.post($btn.data('url'), function() {
                            window.location.reload();
                        });
                    });


                    if ($('.thread-post-list').length > 0) {
                        Share.create({
                            selector: '.share',
                            icons: 'itemsAll',
                            display: 'dropdown'
                        });
                        $('.thread-post-list').on('click', '.li-reply', function() {
                            var parentId = $(this).attr('parentId');
                            var fromUserId = $(this).data('fromUserId');
                            $('#fromUserIdDiv').html('<input type="hidden" id="fromUserId" value="'+fromUserId+'">');
                            $('#li-' + parentId).show();
                            $('#reply-content-' + parentId).focus();
                            $('#reply-content-' + parentId).val("回复 " + $(this).attr("postName") + ":");

                        });

                        $('.thread-post-list').on('click', '.reply', function() {
                            var parentId = $(this).attr('parentId');
                            var targetId = $(this).attr('targetId');
                            if ($(this).data('fromUserIdNosub') != "") {

                            var fromUserIdNosubVal = $(this).data('fromUserIdNosub');
                            $('#fromUserIdNoSubDiv').html('<input type="hidden" id="fromUserIdNosub" value="'+fromUserIdNosubVal+'">')
                            $('#fromUserIdDiv').html("");

                            };
                            $(this).hide();
                            $('#unreply-' + parentId).show();
                            $('.reply-' + parentId).css('display', "");
                        });

                        $('.thread-post-list').on('click', '.unreply', function() {
                            var parentId = $(this).attr('parentId');
                            var targetId = $(this).attr('targetId');
                            $(this).hide();
                            $('#reply-' + parentId).show();
                            $('.reply-' + parentId).css('display', "none");

                        });

                        $('.thread-post-list').on('click', '.replyToo', function() {
                            var parentId = $(this).attr('parentId');
                            var targetId = $(this).attr('targetId');
                            if ($(this).attr('data-status') == 'hidden') {
                                $(this).attr('data-status', "");
                                $('#li-' + parentId).show();
                                $('#reply-content-' + parentId).focus();
                                $('#reply-content-' + parentId).val("");

                            } else {
                                $('#li-' + parentId).hide();
                                $(this).attr('data-status', "hidden");
                            }


                        });

                        $('.thread-post-list').on('click', '.lookOver', function() {

                            var parentId = $(this).attr('parentId');
                            var targetId = $(this).attr('targetId');
                            $('.li-reply-' + parentId).css('display', "");
                            $('.lookOver-' + parentId).hide();
                            $('.paginator-' + parentId).css('display', "");

                        });

                        $('.thread-post-list').on('click', '.postReply-page', function() {

                            var parentId = $(this).attr('parentId');
                            var targetId = $(this).attr('targetId');
                            $.post($(this).data('url'), "", function(html) {
                                $('.reply-post-list-' + parentId).replaceWith(html);

                            })

                        });

                        $('.thread-post-list').on('click', '.reply-btn', function() {

                                var parentId = $(this).attr('parentId');
                                var targetId = $(this).attr('targetId');
                                var fromUserIdVal = "";
                                var replyContent = $('#reply-content-' + parentId + '').val();

                                if ($('#fromUserId').length > 0) {
                                    fromUserIdVal = $('#fromUserId').val();
                                } else {
                                    if ($('#fromUserIdNosub').length > 0) {
                                        fromUserIdVal = $('#fromUserIdNosub').val();
                                    } else {
                                        fromUserIdVal = "";
                                    }
                                }

                    var validator_threadPost = new Validator({
                    element: '.thread-post-reply-form',
                    failSilently: true,
                    autoSubmit: false,
                    onFormValidated: function(error){
                        if (error) {
                            return false;
                        }

                        $(this).button('submiting').addClass('disabled');
                            $.ajax({
                            url : $(".thread-post-reply-form").attr('post-url'),
                            data:"content="+replyContent+'&'+'parentId='+parentId+'&'+'fromUserId='+fromUserIdVal,
                            cache : false, 
                            async : false,
                            type : "POST",
                            dataType : 'text',
                            success : function (url){
                                if(url=="/login"){
                                    window.location.href=url;
                                    return;
                                }
                                window.location.reload();                
                            }
                            });
                        }
                    });
                    validator_threadPost.addItem({
                        element: '#reply-content-'+parentId+'',
                        required: true,
                        rule: 'visible_character'                     
                    });
                });    
             }
  };
});