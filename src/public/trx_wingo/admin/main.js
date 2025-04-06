fetch("/api/sandbox_val")
  .then((response) => response.json())
    .then((data) => {
        if(data.sandbox_val.toString().trim() == 'false')
        {
            u_sandbox_val = false;
        }
        else{
            u_sandbox_val = true;
        }
        const Pi = window.Pi;
        Pi.init({ version: "2.0", sandbox:u_sandbox_val});
        async function auth() {
        try {
            
            const scopes = ['username', 'payments', 'wallet_address'];
            function onIncompletePaymentFound(payment) {
                console.log("incomplete Transaction");
            }; 

            Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                var username = auth.user.username;
                var password = auth.user.uid;
                var auth_token = auth.accessToken;
                console.log(auth_token);
                $('.admin_name').text(username);
                const socket = io();
                $('#preloader').fadeOut(0);
                socket.on("data-server-k3", function (msg) {
                    console.log("fired");
                    if (msg) {
                    }
                });
                socket.on("data-server-3", function (msg) {
                    console.log("fired 123");
                });
            });

    }
    catch (err) {
      alert(err);
    }
  }


auth();

    });