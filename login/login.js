document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o envio do formulário

    const senhaCorreta = "inktalk123";
    const senhaDigitada = document.getElementById("senha").value;

    if (senhaDigitada === senhaCorreta) {
      // Redireciona para homepage.html que está dentro da pasta "homepage"
      window.location.href ="../homepage/homepage.html";

    } else {
      alert("Senha incorreta. Tente novamente.");
      document.getElementById("senha").value = "";
    }
  });
});
