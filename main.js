let web3;

document.getElementById("tbutton").addEventListener("click", async () => {
  const torus = new Torus();
  await torus.init();
  await torus.login();
  web3 = new Web3(torus.provider);
  const accounts = await web3.eth.getAccounts();
  alert("Logged in with address: " + accounts[0]);
});
