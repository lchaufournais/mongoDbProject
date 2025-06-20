import axios from "axios"

const output = document.getElementById("output")
const offerResult = document.getElementById("offerResult")
const offerFilters = document.getElementById("offerFilters")
const form = document.getElementById("formContainer")
const recos = document.getElementById("recoFilters")


function clearOutput() {
  output.innerHTML = ""
}

function clearSelectFilerOffer(){
  offerFilters.classList.add('hidden')
}

function clearSelectFilerReco(){
  recos.classList.add('hidden')
}

function clearOfferResult(){
  form.classList.add('hidden')
}

async function login() {
  clearOutput()
  clearSelectFilerOffer()
  clearOfferResult()
  clearSelectFilerReco()
  try {
    const res = await axios.post("http://localhost:3000/login", { userId: "u42" })
    output.innerHTML = `
      <h2 class="text-lg font-semibold text-blue-700">Connexion réussie</h2>
      <p><strong>Token :</strong> <code class="bg-gray-100 px-2 py-1 rounded">${res.data.token}</code></p>
      <p><strong>Expire dans :</strong> ${res.data.expires_in} secondes</p>
    `
  } catch (err) {
    output.innerHTML = `<p class="text-red-600">Erreur de connexion : ${err.message}</p>`
  }
}

async function loadOffers() {
  clearOutput()
  clearSelectFilerReco()
  const from = document.getElementById("selectFrom").value
  const to = document.getElementById("selectTo").value

  if (!from || !to) {
    output.innerHTML = `<p class="text-red-600">Veuillez sélectionner un départ et une destination.</p>`
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/offers?from=${from}&to=${to}&limit=10`)
    const offers = res.data

    if (!offers.length) {
      output.innerHTML = `<p class="text-gray-600">Aucune offre trouvée pour ${from} → ${to}.</p>`
      return
    }

    const tableRows = offers.map(offer => `
     <tr class="border-b hover:bg-gray-100 cursor-pointer" onclick="loadOfferDetails('${offer._id}')">
        <td class="px-4 py-2">${offer.from}</td>
        <td class="px-4 py-2">${offer.to}</td>
        <td class="px-4 py-2">${offer.provider}</td>
        <td class="px-4 py-2">${offer.price} ${offer.currency}</td>
        <td class="px-4 py-2">${offer.legs?.length || 0}</td>
        <td class="px-4 py-2">${offer.hotel?.name || '—'}</td>
        <td class="px-4 py-2">${offer.activity?.title || '—'}</td>
      </tr>
    `).join("")

    output.innerHTML = `
      <h2 class="text-lg font-semibold text-green-700">Offres ${from} → ${to}</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-gray-300 rounded">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">De</th>
              <th class="px-4 py-2 text-left">À</th>
              <th class="px-4 py-2 text-left">Fournisseur</th>
              <th class="px-4 py-2 text-left">Prix</th>
              <th class="px-4 py-2 text-left">Vols</th>
              <th class="px-4 py-2 text-left">Hôtel</th>
              <th class="px-4 py-2 text-left">Activité</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `
  } catch (err) {
    output.innerHTML = `<p class="text-red-600">Erreur lors du chargement des offres : ${err.message}</p>`
  }
}

async function loadReco() {
  clearOutput()
  clearSelectFilerOffer()
  const city = document.getElementById("selectRecoCity")?.value || "PAR"

  if (!city) {
    output.innerHTML = `<p class="text-red-600">Veuillez sélectionner une ville.</p>`
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/reco?city=${city}&k=3`)
    const cities = res.data

    if (!cities.length) {
      output.innerHTML = `<p class="text-gray-600">Aucune recommandation trouvée.</p>`
      return
    }

    const listItems = cities.map(city => `
      <li class="bg-purple-100 text-purple-800 px-4 py-2 rounded mb-2">${city.city} (score: ${city.score ?? "?"})</li>
    `).join("")

    output.innerHTML = `
      <h2 class="text-lg font-semibold text-purple-700">Recommandations depuis ${city}</h2>
      <ul class="list-none">${listItems}</ul>
    `
  } catch (err) {
    output.innerHTML = `<p class="text-red-600">Erreur lors du chargement des recommandations : ${err.message}</p>`
  }
}

async function addOffer(e) {
  e.preventDefault()
  clearOutput()
  clearSelectFilerOffer()
  clearSelectFilerReco()
  offerResult.innerHTML = ""

  const form = e.target
  const from = form.from.value
  const to = form.to.value
  const provider = form.provider.value
  const price = Number(form.price.value)
  const currency = form.currency.value
  let legs

  try {
    legs = JSON.parse(form.legs.value)
    if (!Array.isArray(legs)) throw new Error("Le champ 'legs' doit être un tableau JSON.")
  } catch (err) {
    offerResult.innerHTML = `<p class="text-red-600">Erreur de format pour le champ 'legs' : ${err.message}</p>`
    return
  }

  try {
    const res = await axios.post("http://localhost:3000/offers", {
      from, to, provider, price, currency, legs
    })

    offerResult.innerHTML = `
      <h2 class="text-lg font-semibold text-yellow-700">Offre créée</h2>
      <pre class="bg-gray-100 p-4 rounded text-sm">${JSON.stringify(res.data, null, 2)}</pre>
    `
    form.reset()
  } catch (err) {
    offerResult.innerHTML = `<p class="text-red-600">Erreur lors de la création de l'offre : ${err.message}</p>`
  }
}

async function loadOfferDetails(id) {
  try {
    const res = await axios.get(`http://localhost:3000/offers/${id}`)
    const offer = res.data

    const content = `
      <h2 class="text-xl font-bold mb-2 text-blue-700">Détail de l'offre</h2>
      <p><strong>De :</strong> ${offer.from}</p>
      <p><strong>À :</strong> ${offer.to}</p>
      <p><strong>Fournisseur :</strong> ${offer.provider}</p>
      <p><strong>Prix :</strong> ${offer.price} ${offer.currency}</p>
      <p><strong>Vols :</strong> ${JSON.stringify(offer.legs)}</p>
      <p><strong>Hôtel :</strong> ${offer.hotel?.name || '—'}</p>
      <p><strong>Activité :</strong> ${offer.activity?.title || '—'}</p>
      <p><strong>Offres similaires :</strong></p>
      <ul class="list-disc ml-4">
        ${offer.relatedOffers?.map(id => `<li>${id}</li>`).join("") || "<li>Aucune</li>"}
      </ul>
    `

    const modal = document.getElementById("modal")
    const modalContent = document.getElementById("modalContent")
    modalContent.innerHTML = content
    modal.classList.remove("hidden")
  } catch (err) {
    alert("Erreur lors du chargement de l'offre : " + err.message)
  }
}

window.loadOfferDetails = loadOfferDetails
window.login = login
window.loadOffers = loadOffers
window.loadReco = loadReco
window.addOffer = addOffer
