import axios from "axios";

const output = document.getElementById("output");

window.loadOffers = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/offers?from=PAR&to=TYO&limit=1"
    );
    output.textContent = JSON.stringify(res.data, null, 2);
  } catch (err) {
    output.textContent = "Erreur lors du chargement des offres: " + err.message;
  }
};

window.loadReco = async () => {
  try {
    const res = await axios.get("http://localhost:3000/reco?city=PAR&k=1");
    output.textContent = "Recommandations : " + JSON.stringify(res.data);
  } catch (err) {
    output.textContent =
      "Erreur lors du chargement des recommandations: " + err.message;
  }
};

window.login = async () => {
  try {
    const res = await axios.post("http://localhost:3000/login", {
      userId: "u42",
    });
    output.textContent =
      "Token : " +
      res.data.token +
      " (expire dans " +
      res.data.expires_in +
      "s)";
  } catch (err) {
    output.textContent = "Erreur de connexion: " + err.message;
  }
};

document.getElementById("offerForm").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    from: form.from.value,
    to: form.to.value,
    provider: form.provider.value,
    price: Number(form.price.value),
    currency: form.currency.value,
    legs: JSON.parse(form.legs.value),
  };
  const res = await fetch("http://localhost:3000/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  document.getElementById("offerResult").textContent = JSON.stringify(
    result,
    null,
    2
  );
};
