function Contato($form, ip){
    var $campoNome = $form.querySelector(".form-nome");
    var $campoEmail = $form.querySelector(".form-email");

    return $campoNome.value && $campoEmail.value && {
        nome: $campoNome.value
        ,email:$campoEmail.value
        ,ip: ip
        ,data: new Date().toString()
    } || null
}

function limpaFormContato($form){
    var $campoNome = $form.querySelector(".form-nome");
    var $campoEmail = $form.querySelector(".form-email");

    $campoNome.value=""
    $campoEmail.value=""
}

function alertaErro($form, msg){
var $espacoAlertaSucesso = $form.querySelector(".form-alertaSucesso")
$espacoAlertaSucesso.style.display = "none"

var $espacoAlertaErro = $form.querySelector(".form-alertaErro")
$espacoAlertaErro.style.display = "block"
$espacoAlertaErro.textContent = msg
}

function alertaSucesso($form, msg){
var $espacoAlertaErro = $form.querySelector(".form-alertaErro")
$espacoAlertaErro.style.display = "none"
var $espacoAlertaSucesso = $form.querySelector(".form-alertaSucesso")

$espacoAlertaSucesso.style.display = "block"
$espacoAlertaSucesso.textContent = msg
}

(function(){
    var leadDB = firebase.database().ref("/leads");

    var ipPromise = fetch("//freegeoip.net/json/")
        .then(function(res) { return res.json()})
        .then(function(json){
            return json.ip
        })

    var $formsContato = document.querySelectorAll(".formContato")

    Array.prototype.forEach.call($formsContato, function($formContato){
        $formContato.addEventListener("submit", function(event){
            event.preventDefault() //para não recarregar
            ipPromise
                .then(function(ip){
                    var contatoComIP = Contato($formContato, ip)
                    if(contatoComIP){
                        leadDB
                            .push(contatoComIP)
                            .then(function(){
                                limpaFormContato($formContato)
                                alertaSucesso($formContato, "Registrado com sucesso")
                            })
                            .catch(function(e){
                                console.log(e)
                                alertaErro($formContato, "Não foi possível registrar")
                            })

                    } else {
                        alertaErro($formContato, "Em branco")
                    }
                })
                .catch(function(){
                    var contatoSemIP = Contato($formContato)
                    leadDB.push(contatoSemIP)
                })
        })
    })


 })()
