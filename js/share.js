$(function () {
    (function (window, document) {
        // 轮播图部分
        var slider_ul = document.getElementById('slider_ul');
        slider_(slider_ul, 3000);

        // 判断手机格式是否正确
        var $phoneNumber = $('#phoneNumber');
        var $phoneNumber_hint = $('#phoneNumber_hint');
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        $phoneNumber.on('input', function () {
            $phoneNumber_hint.css('visibility', 'visible');
            phoneFlag(this.value);
        });
        var text_true = "手机格式正确";
        var text_false = "请输入11位手机号";

        function phoneFlag(Number) {
            if (!phoneReg.test(Number)) {
                $phoneNumber_hint.css('color', '#f00');
                $phoneNumber_hint.text(text_false);
            } else {
                $phoneNumber_hint.css('color', '#21cc5a');
                $phoneNumber_hint.text(text_true);
            }
        }

        //60秒再次发送
        var $get_verify = $('#get_verify');
        var $label_getVerify = $('#label_getVerify');
        $get_verify.on('click', function () {
            get_Verify($phoneNumber.val());
            $get_verify.attr('disabled', true);
            $label_getVerify.css('background-color', '#ccc');
            var num = 60;
            var timer = setInterval(function () {
                num--;
                $label_getVerify.text(num + '秒再次发送');
                if (num < 0) {
                    num = 60;
                    clearInterval(timer);
                    $get_verify.attr('disabled', false);
                    $label_getVerify.text('获取验证码');
                    $label_getVerify.css('background-color', '#4cc3ff');
                }
            }, 1000);

        });
        var $feedback_info = $('#feedback_info'), timer_text = null;
        // 点击隐藏验证信息提示
        $("#feedback_close").on('click', function () {
            $(this).parent().stop().fadeOut(2000);
        });
        function feedbackText(text) {
            $feedback_info.text(text).parent('.feedback').show();
            timer_text = setTimeout(function () {
                $feedback_info.parent('.feedback').fadeOut(2000);
            }, 3000);
        }

        // 获取验证码
        function get_Verify(phoneNumber) {
            var phoneNumber = $phoneNumber.val();
            $.ajax({
                type: 'post',
                dataType: 'jsonp',
                url: 'http://www.yunjiajie.vip/wode/sendCheck2?',
                data: 'phoneNumber=' + phoneNumber + '&type=登录',
                success: function () {
                    feedbackText('已发送短信至手机');
                },
                error: function () {
                    feedbackText('获取验证码失败');
                }
            });
        }
        // 输入验证码登录
        $('#register').on('click', function () {
            register();
        });
        function register() {
            var phoneNumber = $('#phoneNumber').val();
            var verify = $('#verify').val();
            var $register = $('#register');
            var data = 'phoneNumber=' + phoneNumber + '&type=登录&number=' + verify;
            $.ajax({
                type: 'post',
                dataType: 'jsonp',
                jsonpCallback: 'asd',
                url: 'http://www.yunjiajie.vip/wode/login2?' + data,
                success: function (data) {
                    if (data[0] === '过期') {
                        feedbackText('验证码过期');
                    } else if (data[0] === '错误') {
                        feedbackText('验证码错误');
                    } else if (data[0] === '已注册') {
                        feedbackText('该用户已注册');
                    }
                    else if (data[0] === '成功') {
                        feedbackText(' 注册成功');
                    } else {
                        feedbackText('未知错误');
                    }
                },
                error: function () {
                    feedbackText('验证码无效');
                }
            });
        }

    })(window, document);

});




