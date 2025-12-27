import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Zap, Target, ArrowRight, Users, Award, AlertCircle, CheckCircle } from 'lucide-react';

const Objectif100k = () => {
  const [nomSite] = useState('LeBonFinancier.com');
  const [lienSite] = useState('https://lebonfinancier.com/');
  const [age, setAge] = useState(30);
  const [montantInitial, setMontantInitial] = useState(5000);
  const [versementMensuel, setVersementMensuel] = useState(500);
  const [frequenceVersement, setFrequenceVersement] = useState('mensuel');
  const [ajoutMensuel, setAjoutMensuel] = useState(50);
  const [rendementAnnuel, setRendementAnnuel] = useState(7);
  const [objectif] = useState(100000);
  const [profil, setProfil] = useState('equilibre');
  const [showComparaison, setShowComparaison] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const [resultat, setResultat] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pointBascule, setPointBascule] = useState(null);
  const [niveauCapital, setNiveauCapital] = useState(null);
  const [percentileAge, setPercentileAge] = useState(null);

  const frequences = {
    mensuel: { label: 'Mensuel', periode: 1, suffix: '/ mois' },
    trimestriel: { label: 'Trimestriel', periode: 3, suffix: '/ trimestre' },
    semestriel: { label: 'Semestriel', periode: 6, suffix: '/ semestre' },
    annuel: { label: 'Annuel', periode: 12, suffix: '/ an' }
  };

  const profils = {
    prudent: { nom: 'Prudent', rendement: 4, allocation: '40/60', volatilite: 'Faible' },
    equilibre: { nom: 'Équilibré', rendement: 7, allocation: '70/30', volatilite: 'Modérée' },
    dynamique: { nom: 'Dynamique', rendement: 9, allocation: '90/10', volatilite: 'Élevée' }
  };

  const niveauxCapital = {
    debutant: {
      seuil: 1000,
      titre: "🌱 Débutant",
      couleur: "from-green-600 to-emerald-600",
      conseils: [
        "Bravo pour ce premier pas ! L'important est de commencer.",
        "Automatisez vos versements mensuels pour créer une habitude.",
        "Visez d'abord un fonds d'urgence de 3 mois de dépenses.",
        "Privilégiez des supports simples comme les ETF World."
      ]
    },
    fondations: {
      seuil: 10000,
      titre: "🏗️ Fondations Solides",
      couleur: "from-blue-600 to-cyan-600",
      conseils: [
        "Excellente base ! Vous avez dépassé le cap psychologique des 10k.",
        "Diversifiez avec 2-3 ETF (World, Émergents, Small Caps).",
        "Augmentez vos versements de 5-10% chaque année si possible.",
        "Résistez à la tentation de retirer lors des corrections."
      ]
    },
    croissance: {
      seuil: 30000,
      titre: "📈 Phase de Croissance",
      couleur: "from-purple-600 to-pink-600",
      conseils: [
        "Vous entrez dans la zone d'accélération des intérêts composés.",
        "Envisagez d'ajouter des obligations pour stabiliser (10-20%).",
        "Les intérêts commencent à vraiment travailler pour vous.",
        "Rééquilibrez votre portefeuille 1-2 fois par an."
      ]
    },
    acceleration: {
      seuil: 60000,
      titre: "🚀 Accélération",
      couleur: "from-orange-600 to-red-600",
      conseils: [
        "Plus que 40k ! Les intérêts font maintenant le gros du travail.",
        "Maintenez le cap, la volatilité fait partie du jeu.",
        "Vos gains annuels dépassent probablement vos versements.",
        "Anticipez votre stratégie de sécurisation progressive."
      ]
    },
    objectif: {
      seuil: 100000,
      titre: "🎯 Objectif Atteint !",
      couleur: "from-yellow-600 to-amber-600",
      conseils: [
        "Félicitations ! 100k est un palier patrimonial majeur.",
        "Continuez sur votre lancée pour viser 250k, puis 500k.",
        "Sécurisez progressivement avec plus d'obligations.",
        "Envisagez de diversifier (immobilier, crypto, private equity)."
      ]
    }
  };

  const percentilesParAge = {
    "18-25": [
      { min: 0, max: 2000, percentile: 50, label: "Médiane" },
      { min: 2000, max: 5000, percentile: 70, label: "Au-dessus" },
      { min: 5000, max: 15000, percentile: 85, label: "Top 15%" },
      { min: 15000, max: Infinity, percentile: 95, label: "Top 5%" }
    ],
    "25-30": [
      { min: 0, max: 5000, percentile: 40, label: "En-dessous" },
      { min: 5000, max: 15000, percentile: 50, label: "Médiane" },
      { min: 15000, max: 35000, percentile: 70, label: "Au-dessus" },
      { min: 35000, max: 70000, percentile: 85, label: "Top 15%" },
      { min: 70000, max: Infinity, percentile: 95, label: "Top 5%" }
    ],
    "30-35": [
      { min: 0, max: 10000, percentile: 40, label: "En-dessous" },
      { min: 10000, max: 25000, percentile: 50, label: "Médiane" },
      { min: 25000, max: 60000, percentile: 70, label: "Au-dessus" },
      { min: 60000, max: 120000, percentile: 85, label: "Top 15%" },
      { min: 120000, max: Infinity, percentile: 95, label: "Top 5%" }
    ],
    "35-40": [
      { min: 0, max: 20000, percentile: 40, label: "En-dessous" },
      { min: 20000, max: 40000, percentile: 50, label: "Médiane" },
      { min: 40000, max: 90000, percentile: 70, label: "Au-dessus" },
      { min: 90000, max: 180000, percentile: 85, label: "Top 15%" },
      { min: 180000, max: Infinity, percentile: 95, label: "Top 5%" }
    ],
    "40-50": [
      { min: 0, max: 35000, percentile: 40, label: "En-dessous" },
      { min: 35000, max: 70000, percentile: 50, label: "Médiane" },
      { min: 70000, max: 150000, percentile: 70, label: "Au-dessus" },
      { min: 150000, max: 300000, percentile: 85, label: "Top 15%" },
      { min: 300000, max: Infinity, percentile: 95, label: "Top 5%" }
    ],
    "50+": [
      { min: 0, max: 50000, percentile: 40, label: "En-dessous" },
      { min: 50000, max: 100000, percentile: 50, label: "Médiane" },
      { min: 100000, max: 200000, percentile: 70, label: "Au-dessus" },
      { min: 200000, max: 400000, percentile: 85, label: "Top 15%" },
      { min: 400000, max: Infinity, percentile: 95, label: "Top 5%" }
    ]
  };

  useEffect(() => {
    calculerSimulation();
    determinerNiveauCapital();
    calculerPercentile();
  }, [montantInitial, versementMensuel, rendementAnnuel, ajoutMensuel, age, frequenceVersement]);

  const getTrancheAge = (age) => {
    if (age < 25) return "18-25";
    if (age < 30) return "25-30";
    if (age < 35) return "30-35";
    if (age < 40) return "35-40";
    if (age < 50) return "40-50";
    return "50+";
  };

  const calculerPercentile = () => {
    const tranche = getTrancheAge(age);
    const percentiles = percentilesParAge[tranche];
    const capitalActuel = montantInitial;

    for (let p of percentiles) {
      if (capitalActuel >= p.min && capitalActuel < p.max) {
        setPercentileAge(p);
        return;
      }
    }
  };

  const determinerNiveauCapital = () => {
    const capital = montantInitial;
    
    if (capital >= niveauxCapital.objectif.seuil) {
      setNiveauCapital(niveauxCapital.objectif);
    } else if (capital >= niveauxCapital.acceleration.seuil) {
      setNiveauCapital(niveauxCapital.acceleration);
    } else if (capital >= niveauxCapital.croissance.seuil) {
      setNiveauCapital(niveauxCapital.croissance);
    } else if (capital >= niveauxCapital.fondations.seuil) {
      setNiveauCapital(niveauxCapital.fondations);
    } else {
      setNiveauCapital(niveauxCapital.debutant);
    }
  };

  const calculerTrajectoire = (initial, versement, taux, debutDans = 0, frequence = 'mensuel') => {
    const tauxMensuel = Math.pow(1 + taux / 100, 1/12) - 1;
    const periodeVersement = frequences[frequence].periode;
    const versementParPeriode = versement;
    
    let capital = initial;
    let totalVerse = initial;
    let data = [];
    let mois = 0;
    let bascule = null;

    if (debutDans > 0) {
      for (let i = 0; i < debutDans; i++) {
        data.push({
          mois: i,
          annee: i / 12,
          capitalTotal: 0,
          capitalVerse: 0,
          interets: 0
        });
      }
      mois = debutDans;
      capital = initial;
      totalVerse = initial;
    }

    data.push({
      mois: mois,
      annee: mois / 12,
      capitalTotal: capital,
      capitalVerse: totalVerse,
      interets: 0
    });

    while (capital < objectif && mois < 600) {
      mois++;
      const interet = capital * tauxMensuel;
      capital += interet;
      
      if (mois % periodeVersement === 0) {
        capital += versementParPeriode;
        totalVerse += versementParPeriode;
      }

      if (mois % 6 === 0) {
        const interetsAnnuels = capital - totalVerse;
        const versementsAnnuels = (versementParPeriode * 12) / periodeVersement;
        
        if (!bascule && interetsAnnuels > versementsAnnuels && mois > 12) {
          bascule = mois / 12;
        }

        data.push({
          mois: mois,
          annee: mois / 12,
          capitalTotal: Math.round(capital),
          capitalVerse: Math.round(totalVerse),
          interets: Math.round(interetsAnnuels)
        });
      }

      if (capital >= objectif) {
        const annees = Math.floor(mois / 12);
        const moisRestants = mois % 12;
        const dateAtteinte = new Date();
        dateAtteinte.setMonth(dateAtteinte.getMonth() + mois + debutDans);

        return {
          moisTotal: mois,
          annees,
          moisRestants,
          dateAtteinte,
          capitalFinal: Math.round(capital),
          totalVerse: Math.round(totalVerse),
          totalInterets: Math.round(capital - totalVerse),
          pourcentageInterets: Math.round(((capital - totalVerse) / capital) * 100),
          data,
          pointBascule: bascule
        };
      }
    }

    return null;
  };

  const calculerSimulation = () => {
    const base = calculerTrajectoire(montantInitial, versementMensuel, rendementAnnuel, 0, frequenceVersement);
    setResultat(base);
    setChartData(base?.data || []);
    setPointBascule(base?.pointBascule);

    const plusAjout = calculerTrajectoire(montantInitial, versementMensuel + ajoutMensuel, rendementAnnuel, 0, frequenceVersement);
    const retard5ans = calculerTrajectoire(montantInitial, versementMensuel, rendementAnnuel, 60, frequenceVersement);
    
    setScenarios([
      {
        nom: 'Maintenant',
        description: 'Stratégie actuelle, démarrage immédiat',
        annees: base?.annees,
        mois: base?.moisRestants,
        couleur: '#3b82f6',
        diff: 0
      },
      {
        nom: `+${ajoutMensuel}€/mois`,
        description: `Même stratégie avec +${ajoutMensuel}€ par versement`,
        annees: plusAjout?.annees,
        mois: plusAjout?.moisRestants,
        couleur: '#10b981',
        diff: base && plusAjout ? base.moisTotal - plusAjout.moisTotal : 0,
        isGain: true
      },
      {
        nom: 'Départ différé (+5 ans)',
        description: 'Même stratégie, investissement démarré dans 5 ans',
        annees: retard5ans?.annees,
        mois: retard5ans?.moisRestants,
        couleur: '#ef4444',
        diff: retard5ans && base ? retard5ans.moisTotal - base.moisTotal : 0,
        isGain: false
      }
    ]);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    // L'utilisateur devra remplacer cette URL par son endpoint MailerLite
    // Pour l'instant, on simule l'envoi
    console.log('Email soumis:', email);
    console.log('Données du plan:', {
      dateAtteinte: formatDate(resultat.dateAtteinte),
      duree: `${resultat.annees} ans ${resultat.moisRestants} mois`,
      totalInvesti: resultat.totalVerse,
      gains: resultat.totalInterets,
      pourcentageInterets: resultat.pourcentageInterets,
      profil: profils[profil].nom,
      versement: versementMensuel,
      frequence: frequences[frequenceVersement].label
    });
    
    setEmailSent(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setShowEmailForm(false);
      setEmailSent(false);
      setEmail('');
    }, 3000);
  };

  if (!resultat) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-2xl">Calcul en cours...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <a href="https://lebonfinancier.com/" target="_blank" rel="noopener noreferrer" className="inline-block">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2 rounded-full mb-4 hover:scale-105 transition-transform cursor-pointer">
              <p className="text-white font-bold text-lg">{nomSite}</p>
            </div>
          </a>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Target className="w-12 h-12 text-sky-400" />
            Objectif 100k
          </h1>
          <p className="text-xl text-slate-300">
            À quelle date atteindrez-vous 100 000 € si vous commencez aujourd'hui ?
          </p>
        </div>

        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 md:p-12 mb-8 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-10 h-10 text-white" />
            <h2 className="text-3xl font-bold text-white">Vous atteignez 100 000 € en</h2>
          </div>
          <div className="text-6xl md:text-8xl font-black text-white mb-6">
            {formatDate(resultat.dateAtteinte)}
          </div>
          <div className="text-2xl text-sky-100 mb-8">
            Dans {resultat.annees} ans et {resultat.moisRestants} mois
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 inline-block">
            <p className="text-xl text-white font-semibold mb-2">
              💡 Le marché travaille pour vous
            </p>
            <p className="text-3xl font-bold text-yellow-300">
              {resultat.pourcentageInterets}% de votre capital provient des intérêts composés
            </p>
            <p className="text-white/80 mt-2">
              pas de votre effort d'épargne
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <p className="text-slate-300">Total Investi</p>
            </div>
            <p className="text-4xl font-bold text-white">{resultat.totalVerse.toLocaleString('fr-FR')} €</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-sky-400" />
              <p className="text-slate-300">Gains du Marché</p>
            </div>
            <p className="text-4xl font-bold text-white">{resultat.totalInterets.toLocaleString('fr-FR')} €</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <p className="text-slate-300">Capital Final</p>
            </div>
            <p className="text-4xl font-bold text-white">{resultat.capitalFinal.toLocaleString('fr-FR')} €</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowRight className="w-6 h-6" />
                Vos Paramètres
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Votre Âge</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border-2 border-sky-500/50 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-sky-400"
                  />
                  <p className="text-sm text-slate-400 mt-1">Tranche : {getTrancheAge(age)} ans</p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Capital Actuel</label>
                  <input
                    type="number"
                    value={montantInitial}
                    onChange={(e) => setMontantInitial(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border-2 border-sky-500/50 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-sky-400"
                  />
                  <p className="text-sm text-slate-400 mt-1">{montantInitial.toLocaleString('fr-FR')} €</p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Montant du Versement</label>
                  <input
                    type="number"
                    value={versementMensuel}
                    onChange={(e) => setVersementMensuel(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border-2 border-sky-500/50 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-sky-400"
                  />
                  <p className="text-sm text-slate-400 mt-1">{versementMensuel.toLocaleString('fr-FR')} €{frequences[frequenceVersement].suffix}</p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Fréquence de Versement</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(frequences).map(([key, freq]) => (
                      <button
                        key={key}
                        onClick={() => setFrequenceVersement(key)}
                        className={`p-3 rounded-xl transition-all text-sm font-medium ${
                          frequenceVersement === key
                            ? 'bg-sky-600 text-white border-2 border-sky-400'
                            : 'bg-slate-900/50 text-slate-300 border-2 border-slate-700/50 hover:bg-slate-800/70'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    💡 Équivalent annuel : {((versementMensuel * 12) / frequences[frequenceVersement].periode).toLocaleString('fr-FR')} €/an
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Test : Ajouter au versement</label>
                  <input
                    type="number"
                    value={ajoutMensuel}
                    onChange={(e) => setAjoutMensuel(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border-2 border-emerald-500/50 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-sm text-emerald-400 mt-1">
                    +{ajoutMensuel} € = {(versementMensuel + ajoutMensuel).toLocaleString('fr-FR')} €{frequences[frequenceVersement].suffix}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    Équivalent annuel : {(((versementMensuel + ajoutMensuel) * 12) / frequences[frequenceVersement].periode).toLocaleString('fr-FR')} €/an
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Rendement Annuel Espéré</label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={rendementAnnuel}
                    onChange={(e) => setRendementAnnuel(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(rendementAnnuel / 15) * 100}%, #334155 ${(rendementAnnuel / 15) * 100}%, #334155 100%)`
                    }}
                  />
                  <p className="text-center text-white text-2xl font-bold mt-2">{rendementAnnuel}%</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Profil d'Investissement</h3>
              
              <div className="space-y-3">
                {Object.entries(profils).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setProfil(key);
                      setRendementAnnuel(p.rendement);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      profil === key 
                        ? 'bg-sky-600 border-2 border-sky-400' 
                        : 'bg-slate-900/50 border-2 border-slate-700/50 hover:bg-slate-800/70'
                    }`}
                  >
                    <p className="text-white font-bold text-lg">{p.nom}</p>
                    <p className="text-sm text-slate-300">Actions/Obligations : {p.allocation}</p>
                    <p className="text-sm text-slate-400">Rendement : {p.rendement}% | Volatilité : {p.volatilite}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-2xl font-bold text-white mb-4">📈 Évolution de Votre Capital</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="annee" 
                    stroke="#cbd5e1"
                    label={{ value: 'Années', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }}
                  />
                  <YAxis 
                    stroke="#cbd5e1" 
                    tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9', borderRadius: '12px' }}
                    formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="capitalTotal" 
                    stroke="#0ea5e9" 
                    strokeWidth={4} 
                    name="Capital Total"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="capitalVerse" 
                    stroke="#64748b" 
                    strokeWidth={3} 
                    name="Capital Versé"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="flex justify-center gap-8 mt-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-sky-500 rounded"></div>
                  <span className="text-white text-sm font-medium">Capital Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-slate-500 rounded border-2 border-slate-500" style={{ borderStyle: 'dashed' }}></div>
                  <span className="text-white text-sm font-medium">Capital Versé</span>
                </div>
              </div>
              
              {pointBascule && (
                <div className="mt-4 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4">
                  <p className="text-amber-200 font-semibold">
                    🎯 Point de bascule atteint après {pointBascule.toFixed(1)} ans
                  </p>
                  <p className="text-sm text-amber-100 mt-1">
                    Vos intérêts annuels dépassent vos versements. Le marché travaille plus que vous !
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-2xl font-bold text-white mb-4">⚡ L'Effet du Temps et de l'Effort</h3>
              
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="nom" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" label={{ value: 'Années', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9', borderRadius: '12px' }}
                    formatter={(value, name, props) => [
                      `${value} ans ${props.payload.mois} mois`, 
                      props.payload.nom
                    ]}
                  />
                  <Bar dataKey="annees" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {scenarios.map((s, idx) => {
                  const totalMois = s.annees * 12 + s.mois;
                  const anneesAffichage = Math.floor(totalMois / 12);
                  const moisAffichage = totalMois % 12;
                  
                  return (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-sky-400 text-sm font-semibold mb-1">{s.nom}</p>
                      <p className="text-xs text-slate-400 mb-2 h-8">{s.description}</p>
                      <p className="text-2xl font-bold text-white">
                        {anneesAffichage > 0 && `${anneesAffichage} an${anneesAffichage > 1 ? 's' : ''}`}
                        {anneesAffichage > 0 && moisAffichage > 0 && ' '}
                        {moisAffichage > 0 && `${moisAffichage} mois`}
                      </p>
                      {s.diff !== 0 && (
                        <p className={`text-sm mt-1 font-semibold ${s.isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {s.isGain ? '-' : '+'}{Math.abs(Math.floor(s.diff / 12)) > 0 && `${Math.abs(Math.floor(s.diff / 12))} an${Math.abs(Math.floor(s.diff / 12)) > 1 ? 's' : ''}`}
                          {Math.abs(Math.floor(s.diff / 12)) > 0 && Math.abs(s.diff % 12) > 0 && ' '}
                          {Math.abs(s.diff % 12) > 0 && `${Math.abs(s.diff % 12)} mois`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {niveauCapital && (
          <div className={`bg-gradient-to-r ${niveauCapital.couleur} rounded-3xl p-8 mb-8 shadow-2xl`}>
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-12 h-12 text-white" />
              <div>
                <h2 className="text-3xl font-bold text-white">{niveauCapital.titre}</h2>
                <p className="text-white/90">Votre situation actuelle : {montantInitial.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Conseils Personnalisés
              </h3>
              <ul className="space-y-3">
                {niveauCapital.conseils.map((conseil, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white">
                    <span className="text-yellow-300 font-bold mt-1">→</span>
                    <span>{conseil}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8" />
              Comparaison par Âge
            </h3>
            <button
              onClick={() => setShowComparaison(!showComparaison)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
            >
              {showComparaison ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          {showComparaison && percentileAge && (
            <div>
              <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                <p className="text-slate-300 mb-2">Votre tranche d'âge : <span className="text-white font-bold">{getTrancheAge(age)} ans</span></p>
                <p className="text-slate-300 mb-4">Votre capital actuel : <span className="text-white font-bold">{montantInitial.toLocaleString('fr-FR')} €</span></p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="h-8 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full relative">
                      <div 
                        className="absolute top-0 h-8 w-1 bg-white"
                        style={{ left: `${percentileAge.percentile}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap">
                          {percentileAge.percentile}e percentile
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  percentileAge.percentile >= 85 ? 'bg-emerald-500/20 border border-emerald-500/50' :
                  percentileAge.percentile >= 50 ? 'bg-amber-500/20 border border-amber-500/50' :
                  'bg-rose-500/20 border border-rose-500/50'
                }`}>
                  <p className="text-white font-semibold text-lg">
                    {percentileAge.percentile >= 85 && `🏆 Excellent ! Vous êtes dans le top ${100 - percentileAge.percentile}% des épargnants de votre âge.`}
                    {percentileAge.percentile >= 50 && percentileAge.percentile < 85 && '👍 Bien ! Vous êtes au-dessus de la moyenne.'}
                    {percentileAge.percentile < 50 && '💪 Vous pouvez progresser ! Augmentez vos versements mensuels.'}
                  </p>
                </div>
              </div>

              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white mb-1">📊 Méthodologie</p>
                  <p>Ces percentiles sont des estimations basées sur des données d'épargne moyenne en France. Ils servent d'indication générale et non de vérité statistique absolue. L'important est votre progression personnelle.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">🎓 Recevez Votre Plan Personnalisé</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Téléchargez votre scénario Objectif 100k en PDF avec votre trajectoire détaillée, 
            des conseils adaptés à votre profil et un plan d'action concret.
          </p>
          
          {!showEmailForm ? (
            <button 
              onClick={() => setShowEmailForm(true)}
              className="bg-white text-sky-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl hover:scale-105"
            >
              📥 Télécharger Mon Plan Gratuit
            </button>
          ) : (
            <div className="max-w-md mx-auto">
              {!emailSent ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                    <label className="block text-white text-left mb-2 font-medium">
                      Votre email pour recevoir le plan PDF
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.fr"
                      required
                      className="w-full bg-white border-2 border-sky-300 rounded-xl px-4 py-3 text-slate-900 text-lg focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-xs text-white/70 mt-2 text-left">
                      🔒 Vos données sont sécurisées. Pas de spam, désinscription en 1 clic.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-lg"
                    >
                      Envoyer le Plan 📨
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-500/20 border-2 border-emerald-400 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                    <p className="text-2xl font-bold text-white">Plan envoyé !</p>
                  </div>
                  <p className="text-white/90">
                    Vérifiez votre boîte mail {email}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <a href="https://lebonfinancier.com/" target="_blank" rel="noopener noreferrer" className="block mt-6">
            <p className="text-white/70 text-sm hover:text-white transition-colors">{nomSite} - Votre partenaire financier</p>
          </a>
        </div>

        <div className="text-center text-slate-400 text-sm space-y-2">
          <p>⚠️ Cet outil est un simulateur éducatif créé par {nomSite}. Il ne constitue pas un conseil en investissement.</p>
          <p>Les performances passées ne garantissent pas les performances futures. Investir comporte des risques de perte en capital.</p>
        </div>
      </div>
    </div>
  );
};

export default Objectif100k;