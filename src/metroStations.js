// Comprehensive dataset of Paris Metro (lines 1-14), key RER stations, and tram stations.
// Coordinates sourced from publicly known OpenStreetMap / IDFM data.
// Each station appears only once even if served by multiple lines.

export const METRO_STATIONS = [
  // ─── Line 1 ───
  { name: "La Défense", lat: 48.8919, lon: 2.2381 },
  { name: "Esplanade de La Défense", lat: 48.8877, lon: 2.2501 },
  { name: "Pont de Neuilly", lat: 48.8848, lon: 2.2593 },
  { name: "Les Sablons", lat: 48.8812, lon: 2.2720 },
  { name: "Porte Maillot", lat: 48.8781, lon: 2.2823 },
  { name: "Argentine", lat: 48.8757, lon: 2.2898 },
  { name: "Charles de Gaulle-Étoile", lat: 48.8738, lon: 2.2950 },
  { name: "George V", lat: 48.8720, lon: 2.3008 },
  { name: "Franklin D. Roosevelt", lat: 48.8689, lon: 2.3099 },
  { name: "Champs-Élysées-Clemenceau", lat: 48.8676, lon: 2.3139 },
  { name: "Concorde", lat: 48.8656, lon: 2.3211 },
  { name: "Tuileries", lat: 48.8641, lon: 2.3332 },
  { name: "Palais Royal-Musée du Louvre", lat: 48.8622, lon: 2.3365 },
  { name: "Louvre-Rivoli", lat: 48.8609, lon: 2.3407 },
  { name: "Châtelet", lat: 48.8584, lon: 2.3471 },
  { name: "Hôtel de Ville", lat: 48.8574, lon: 2.3514 },
  { name: "Saint-Paul", lat: 48.8553, lon: 2.3609 },
  { name: "Bastille", lat: 48.8531, lon: 2.3691 },
  { name: "Gare de Lyon", lat: 48.8443, lon: 2.3735 },
  { name: "Reuilly-Diderot", lat: 48.8472, lon: 2.3864 },
  { name: "Nation", lat: 48.8483, lon: 2.3960 },
  { name: "Porte de Vincennes", lat: 48.8472, lon: 2.4104 },
  { name: "Saint-Mandé", lat: 48.8462, lon: 2.4186 },
  { name: "Bérault", lat: 48.8453, lon: 2.4283 },
  { name: "Château de Vincennes", lat: 48.8443, lon: 2.4404 },

  // ─── Line 2 ───
  { name: "Porte Dauphine", lat: 48.8717, lon: 2.2770 },
  { name: "Victor Hugo", lat: 48.8697, lon: 2.2856 },
  // Charles de Gaulle-Étoile already listed
  { name: "Ternes", lat: 48.8783, lon: 2.2984 },
  { name: "Courcelles", lat: 48.8795, lon: 2.3043 },
  { name: "Monceau", lat: 48.8808, lon: 2.3094 },
  { name: "Villiers", lat: 48.8817, lon: 2.3157 },
  { name: "Rome", lat: 48.8821, lon: 2.3218 },
  { name: "Place de Clichy", lat: 48.8835, lon: 2.3275 },
  { name: "Blanche", lat: 48.8839, lon: 2.3327 },
  { name: "Pigalle", lat: 48.8822, lon: 2.3374 },
  { name: "Anvers", lat: 48.8829, lon: 2.3443 },
  { name: "Barbès-Rochechouart", lat: 48.8838, lon: 2.3497 },
  { name: "La Chapelle", lat: 48.8844, lon: 2.3596 },
  { name: "Stalingrad", lat: 48.8841, lon: 2.3658 },
  { name: "Jaurès", lat: 48.8825, lon: 2.3704 },
  { name: "Colonel Fabien", lat: 48.8784, lon: 2.3703 },
  { name: "Belleville", lat: 48.8722, lon: 2.3764 },
  { name: "Couronnes", lat: 48.8696, lon: 2.3805 },
  { name: "Ménilmontant", lat: 48.8667, lon: 2.3832 },
  { name: "Père Lachaise", lat: 48.8631, lon: 2.3867 },
  { name: "Philippe Auguste", lat: 48.8583, lon: 2.3895 },
  { name: "Alexandre Dumas", lat: 48.8563, lon: 2.3942 },
  { name: "Avron", lat: 48.8519, lon: 2.3980 },
  // Nation already listed

  // ─── Line 3 ───
  { name: "Pont de Levallois-Bécon", lat: 48.8973, lon: 2.2808 },
  { name: "Anatole France", lat: 48.8924, lon: 2.2854 },
  { name: "Louise Michel", lat: 48.8889, lon: 2.2884 },
  { name: "Porte de Champerret", lat: 48.8856, lon: 2.2926 },
  { name: "Pereire", lat: 48.8847, lon: 2.2980 },
  { name: "Wagram", lat: 48.8838, lon: 2.3056 },
  { name: "Malesherbes", lat: 48.8828, lon: 2.3108 },
  // Villiers already listed
  { name: "Europe", lat: 48.8788, lon: 2.3222 },
  { name: "Saint-Lazare", lat: 48.8756, lon: 2.3253 },
  { name: "Havre-Caumartin", lat: 48.8731, lon: 2.3286 },
  { name: "Opéra", lat: 48.8707, lon: 2.3319 },
  { name: "Quatre-Septembre", lat: 48.8694, lon: 2.3364 },
  { name: "Bourse", lat: 48.8686, lon: 2.3411 },
  { name: "Sentier", lat: 48.8674, lon: 2.3470 },
  { name: "Réaumur-Sébastopol", lat: 48.8662, lon: 2.3525 },
  { name: "Arts et Métiers", lat: 48.8654, lon: 2.3563 },
  { name: "Temple", lat: 48.8668, lon: 2.3612 },
  { name: "République", lat: 48.8674, lon: 2.3636 },
  { name: "Parmentier", lat: 48.8652, lon: 2.3746 },
  { name: "Rue Saint-Maur", lat: 48.8640, lon: 2.3804 },
  // Père Lachaise already listed
  { name: "Gambetta", lat: 48.8652, lon: 2.3985 },
  { name: "Porte de Bagnolet", lat: 48.8634, lon: 2.4096 },
  { name: "Gallieni", lat: 48.8637, lon: 2.4158 },

  // ─── Line 3bis ───
  // Gambetta already listed
  { name: "Pelleport", lat: 48.8685, lon: 2.4015 },
  { name: "Saint-Fargeau", lat: 48.8717, lon: 2.4046 },
  { name: "Porte des Lilas", lat: 48.8770, lon: 2.4069 },

  // ─── Line 4 ───
  { name: "Porte de Clignancourt", lat: 48.8975, lon: 2.3444 },
  { name: "Simplon", lat: 48.8942, lon: 2.3468 },
  { name: "Marcadet-Poissonniers", lat: 48.8913, lon: 2.3497 },
  { name: "Château Rouge", lat: 48.8870, lon: 2.3493 },
  // Barbès-Rochechouart already listed
  { name: "Gare du Nord", lat: 48.8800, lon: 2.3553 },
  { name: "Gare de l'Est", lat: 48.8765, lon: 2.3588 },
  { name: "Château d'Eau", lat: 48.8726, lon: 2.3560 },
  { name: "Strasbourg-Saint-Denis", lat: 48.8692, lon: 2.3542 },
  // Réaumur-Sébastopol already listed
  { name: "Étienne Marcel", lat: 48.8632, lon: 2.3491 },
  { name: "Les Halles", lat: 48.8622, lon: 2.3454 },
  // Châtelet already listed
  { name: "Cité", lat: 48.8554, lon: 2.3463 },
  { name: "Saint-Michel", lat: 48.8534, lon: 2.3440 },
  { name: "Odéon", lat: 48.8521, lon: 2.3388 },
  { name: "Saint-Germain-des-Prés", lat: 48.8540, lon: 2.3336 },
  { name: "Saint-Sulpice", lat: 48.8511, lon: 2.3310 },
  { name: "Saint-Placide", lat: 48.8470, lon: 2.3267 },
  { name: "Montparnasse-Bienvenüe", lat: 48.8431, lon: 2.3243 },
  { name: "Vavin", lat: 48.8423, lon: 2.3285 },
  { name: "Raspail", lat: 48.8390, lon: 2.3306 },
  { name: "Denfert-Rochereau", lat: 48.8337, lon: 2.3326 },
  { name: "Mouton-Duvernet", lat: 48.8316, lon: 2.3303 },
  { name: "Alésia", lat: 48.8282, lon: 2.3271 },
  { name: "Porte d'Orléans", lat: 48.8233, lon: 2.3254 },
  { name: "Mairie de Montrouge", lat: 48.8186, lon: 2.3196 },
  { name: "Barbara", lat: 48.8130, lon: 2.3137 },
  { name: "Bagneux-Lucie Aubrac", lat: 48.8074, lon: 2.3085 },

  // ─── Line 5 ───
  { name: "Bobigny-Pablo Picasso", lat: 48.9064, lon: 2.4497 },
  { name: "Bobigny-Pantin-Raymond Queneau", lat: 48.8968, lon: 2.4283 },
  { name: "Église de Pantin", lat: 48.8930, lon: 2.4120 },
  { name: "Hoche", lat: 48.8914, lon: 2.4032 },
  { name: "Porte de Pantin", lat: 48.8882, lon: 2.3925 },
  { name: "Ourcq", lat: 48.8870, lon: 2.3862 },
  { name: "Laumière", lat: 48.8852, lon: 2.3793 },
  // Jaurès already listed
  // Stalingrad already listed
  // Gare du Nord already listed
  // Gare de l'Est already listed
  { name: "Jacques Bonsergent", lat: 48.8708, lon: 2.3611 },
  // République already listed
  { name: "Oberkampf", lat: 48.8648, lon: 2.3680 },
  { name: "Richard-Lenoir", lat: 48.8608, lon: 2.3719 },
  { name: "Bréguet-Sabin", lat: 48.8564, lon: 2.3711 },
  // Bastille already listed
  { name: "Quai de la Rapée", lat: 48.8463, lon: 2.3663 },
  { name: "Gare d'Austerlitz", lat: 48.8424, lon: 2.3657 },
  { name: "Saint-Marcel", lat: 48.8381, lon: 2.3610 },
  { name: "Campo-Formio", lat: 48.8358, lon: 2.3579 },
  { name: "Place d'Italie", lat: 48.8311, lon: 2.3559 },

  // ─── Line 6 ───
  // Charles de Gaulle-Étoile already listed
  { name: "Kléber", lat: 48.8713, lon: 2.2933 },
  { name: "Boissière", lat: 48.8694, lon: 2.2900 },
  { name: "Trocadéro", lat: 48.8630, lon: 2.2869 },
  { name: "Passy", lat: 48.8576, lon: 2.2858 },
  { name: "Bir-Hakeim", lat: 48.8539, lon: 2.2891 },
  { name: "Dupleix", lat: 48.8506, lon: 2.2935 },
  { name: "La Motte-Picquet-Grenelle", lat: 48.8490, lon: 2.2988 },
  { name: "Cambronne", lat: 48.8477, lon: 2.3037 },
  { name: "Sèvres-Lecourbe", lat: 48.8454, lon: 2.3094 },
  { name: "Pasteur", lat: 48.8427, lon: 2.3127 },
  // Montparnasse-Bienvenüe already listed
  { name: "Edgar Quinet", lat: 48.8409, lon: 2.3255 },
  // Raspail already listed
  // Denfert-Rochereau already listed
  { name: "Saint-Jacques", lat: 48.8330, lon: 2.3375 },
  { name: "Glacière", lat: 48.8310, lon: 2.3436 },
  { name: "Corvisart", lat: 48.8297, lon: 2.3508 },
  // Place d'Italie already listed
  { name: "Nationale", lat: 48.8328, lon: 2.3630 },
  { name: "Chevaleret", lat: 48.8348, lon: 2.3684 },
  { name: "Quai de la Gare", lat: 48.8367, lon: 2.3731 },
  { name: "Bercy", lat: 48.8400, lon: 2.3793 },
  { name: "Dugommier", lat: 48.8389, lon: 2.3893 },
  { name: "Daumesnil", lat: 48.8397, lon: 2.3963 },
  { name: "Bel-Air", lat: 48.8415, lon: 2.4005 },
  { name: "Picpus", lat: 48.8453, lon: 2.4015 },
  // Nation already listed

  // ─── Line 7 ───
  { name: "La Courneuve-8 Mai 1945", lat: 48.9207, lon: 2.4105 },
  { name: "Fort d'Aubervilliers", lat: 48.9144, lon: 2.4065 },
  { name: "Aubervilliers-Pantin-Quatre Chemins", lat: 48.9039, lon: 2.3924 },
  { name: "Porte de la Villette", lat: 48.8976, lon: 2.3856 },
  { name: "Corentin Cariou", lat: 48.8946, lon: 2.3824 },
  { name: "Crimée", lat: 48.8910, lon: 2.3770 },
  { name: "Riquet", lat: 48.8884, lon: 2.3732 },
  // Stalingrad already listed
  { name: "Louis Blanc", lat: 48.8811, lon: 2.3647 },
  { name: "Château-Landon", lat: 48.8787, lon: 2.3618 },
  // Gare de l'Est already listed
  { name: "Poissonnière", lat: 48.8770, lon: 2.3489 },
  { name: "Cadet", lat: 48.8754, lon: 2.3435 },
  { name: "Le Peletier", lat: 48.8746, lon: 2.3399 },
  { name: "Chaussée d'Antin-La Fayette", lat: 48.8730, lon: 2.3339 },
  // Opéra already listed
  { name: "Pyramides", lat: 48.8660, lon: 2.3341 },
  // Palais Royal-Musée du Louvre already listed
  { name: "Pont Neuf", lat: 48.8586, lon: 2.3420 },
  // Châtelet already listed
  { name: "Pont Marie", lat: 48.8537, lon: 2.3571 },
  { name: "Sully-Morland", lat: 48.8511, lon: 2.3614 },
  { name: "Jussieu", lat: 48.8461, lon: 2.3545 },
  { name: "Place Monge", lat: 48.8430, lon: 2.3521 },
  { name: "Censier-Daubenton", lat: 48.8406, lon: 2.3519 },
  { name: "Les Gobelins", lat: 48.8357, lon: 2.3530 },
  // Place d'Italie already listed
  { name: "Tolbiac", lat: 48.8265, lon: 2.3576 },
  { name: "Maison Blanche", lat: 48.8222, lon: 2.3583 },
  { name: "Porte d'Italie", lat: 48.8190, lon: 2.3594 },
  { name: "Porte de Choisy", lat: 48.8197, lon: 2.3651 },
  { name: "Porte d'Ivry", lat: 48.8212, lon: 2.3710 },
  { name: "Pierre et Marie Curie", lat: 48.8157, lon: 2.3764 },
  { name: "Mairie d'Ivry", lat: 48.8110, lon: 2.3835 },
  { name: "Le Kremlin-Bicêtre", lat: 48.8101, lon: 2.3620 },
  { name: "Villejuif-Léo Lagrange", lat: 48.8042, lon: 2.3620 },
  { name: "Villejuif-Paul Vaillant-Couturier", lat: 48.7960, lon: 2.3683 },
  { name: "Villejuif-Louis Aragon", lat: 48.7873, lon: 2.3680 },

  // ─── Line 7bis ───
  // Louis Blanc already listed
  // Jaurès already listed
  { name: "Bolivar", lat: 48.8805, lon: 2.3745 },
  { name: "Buttes Chaumont", lat: 48.8781, lon: 2.3815 },
  { name: "Botzaris", lat: 48.8793, lon: 2.3892 },
  { name: "Place des Fêtes", lat: 48.8769, lon: 2.3929 },
  { name: "Pré Saint-Gervais", lat: 48.8801, lon: 2.3986 },

  // ─── Line 8 ───
  { name: "Balard", lat: 48.8363, lon: 2.2785 },
  { name: "Lourmel", lat: 48.8387, lon: 2.2824 },
  { name: "Boucicaut", lat: 48.8409, lon: 2.2876 },
  { name: "Félix Faure", lat: 48.8427, lon: 2.2920 },
  { name: "Commerce", lat: 48.8445, lon: 2.2940 },
  // La Motte-Picquet-Grenelle already listed
  { name: "École Militaire", lat: 48.8556, lon: 2.3063 },
  { name: "La Tour-Maubourg", lat: 48.8572, lon: 2.3102 },
  { name: "Invalides", lat: 48.8608, lon: 2.3146 },
  // Concorde already listed
  { name: "Madeleine", lat: 48.8699, lon: 2.3242 },
  // Opéra already listed
  { name: "Richelieu-Drouot", lat: 48.8718, lon: 2.3384 },
  { name: "Grands Boulevards", lat: 48.8714, lon: 2.3432 },
  { name: "Bonne Nouvelle", lat: 48.8706, lon: 2.3486 },
  // Strasbourg-Saint-Denis already listed
  // République already listed
  { name: "Filles du Calvaire", lat: 48.8633, lon: 2.3659 },
  { name: "Saint-Sébastien-Froissart", lat: 48.8607, lon: 2.3669 },
  { name: "Chemin Vert", lat: 48.8574, lon: 2.3684 },
  // Bastille already listed
  { name: "Ledru-Rollin", lat: 48.8514, lon: 2.3764 },
  { name: "Faidherbe-Chaligny", lat: 48.8497, lon: 2.3837 },
  // Reuilly-Diderot already listed
  { name: "Montgallet", lat: 48.8441, lon: 2.3897 },
  // Daumesnil already listed
  { name: "Michel Bizot", lat: 48.8373, lon: 2.4019 },
  { name: "Porte Dorée", lat: 48.8355, lon: 2.4060 },
  { name: "Porte de Charenton", lat: 48.8334, lon: 2.4013 },
  { name: "Liberté", lat: 48.8283, lon: 2.4072 },
  { name: "Charenton-Écoles", lat: 48.8214, lon: 2.4133 },
  { name: "École Vétérinaire de Maisons-Alfort", lat: 48.8150, lon: 2.4211 },
  { name: "Maisons-Alfort-Stade", lat: 48.8085, lon: 2.4342 },
  { name: "Maisons-Alfort-Les Juilliottes", lat: 48.8024, lon: 2.4453 },
  { name: "Créteil-L'Échat", lat: 48.7963, lon: 2.4494 },
  { name: "Créteil-Université", lat: 48.7899, lon: 2.4509 },
  { name: "Créteil-Préfecture", lat: 48.7798, lon: 2.4592 },
  { name: "Pointe du Lac", lat: 48.7686, lon: 2.4636 },

  // ─── Line 9 ───
  { name: "Pont de Sèvres", lat: 48.8297, lon: 2.2310 },
  { name: "Billancourt", lat: 48.8322, lon: 2.2385 },
  { name: "Marcel Sembat", lat: 48.8337, lon: 2.2434 },
  { name: "Porte de Saint-Cloud", lat: 48.8381, lon: 2.2569 },
  { name: "Exelmans", lat: 48.8424, lon: 2.2598 },
  { name: "Michel-Ange-Auteuil", lat: 48.8477, lon: 2.2636 },
  { name: "Jasmin", lat: 48.8527, lon: 2.2681 },
  { name: "Ranelagh", lat: 48.8557, lon: 2.2700 },
  { name: "La Muette", lat: 48.8586, lon: 2.2740 },
  { name: "Rue de la Pompe", lat: 48.8635, lon: 2.2783 },
  // Trocadéro already listed
  { name: "Iéna", lat: 48.8641, lon: 2.2936 },
  { name: "Alma-Marceau", lat: 48.8647, lon: 2.3006 },
  // Franklin D. Roosevelt already listed
  { name: "Saint-Philippe du Roule", lat: 48.8720, lon: 2.3107 },
  { name: "Miromesnil", lat: 48.8738, lon: 2.3154 },
  { name: "Saint-Augustin", lat: 48.8753, lon: 2.3203 },
  // Havre-Caumartin already listed
  // Chaussée d'Antin-La Fayette already listed
  // Richelieu-Drouot already listed
  // Grands Boulevards already listed
  // Bonne Nouvelle already listed
  // Strasbourg-Saint-Denis already listed
  // République already listed
  // Oberkampf already listed
  { name: "Saint-Ambroise", lat: 48.8613, lon: 2.3735 },
  { name: "Voltaire", lat: 48.8579, lon: 2.3800 },
  { name: "Charonne", lat: 48.8555, lon: 2.3918 },
  { name: "Rue des Boulets", lat: 48.8523, lon: 2.3940 },
  // Nation already listed
  { name: "Buzenval", lat: 48.8520, lon: 2.4014 },
  { name: "Maraîchers", lat: 48.8529, lon: 2.4068 },
  { name: "Porte de Montreuil", lat: 48.8535, lon: 2.4114 },
  { name: "Robespierre", lat: 48.8564, lon: 2.4234 },
  { name: "Croix de Chavaux", lat: 48.8575, lon: 2.4361 },
  { name: "Mairie de Montreuil", lat: 48.8624, lon: 2.4427 },

  // ─── Line 10 ───
  { name: "Boulogne-Pont de Saint-Cloud", lat: 48.8406, lon: 2.2279 },
  { name: "Boulogne-Jean Jaurès", lat: 48.8421, lon: 2.2380 },
  { name: "Michel-Ange-Molitor", lat: 48.8451, lon: 2.2614 },
  { name: "Chardon-Lagache", lat: 48.8455, lon: 2.2667 },
  { name: "Mirabeau", lat: 48.8468, lon: 2.2728 },
  { name: "Église d'Auteuil", lat: 48.8476, lon: 2.2700 },
  { name: "Porte d'Auteuil", lat: 48.8480, lon: 2.2588 },
  // Michel-Ange-Auteuil already listed
  { name: "Javel-André Citroën", lat: 48.8461, lon: 2.2784 },
  { name: "Charles Michels", lat: 48.8465, lon: 2.2860 },
  { name: "Avenue Émile Zola", lat: 48.8471, lon: 2.2951 },
  // La Motte-Picquet-Grenelle already listed
  { name: "Ségur", lat: 48.8475, lon: 2.3083 },
  { name: "Duroc", lat: 48.8471, lon: 2.3164 },
  { name: "Vaneau", lat: 48.8489, lon: 2.3214 },
  { name: "Sèvres-Babylone", lat: 48.8510, lon: 2.3268 },
  { name: "Mabillon", lat: 48.8527, lon: 2.3349 },
  // Odéon already listed
  { name: "Cluny-La Sorbonne", lat: 48.8509, lon: 2.3447 },
  { name: "Maubert-Mutualité", lat: 48.8499, lon: 2.3492 },
  { name: "Cardinal Lemoine", lat: 48.8469, lon: 2.3514 },
  // Jussieu already listed
  // Gare d'Austerlitz already listed

  // ─── Line 11 ───
  // Châtelet already listed
  // Hôtel de Ville already listed
  { name: "Rambuteau", lat: 48.8613, lon: 2.3533 },
  // Arts et Métiers already listed
  // République already listed
  { name: "Goncourt", lat: 48.8699, lon: 2.3707 },
  // Belleville already listed
  { name: "Pyrénées", lat: 48.8741, lon: 2.3851 },
  { name: "Jourdain", lat: 48.8755, lon: 2.3896 },
  // Place des Fêtes already listed
  { name: "Télégraphe", lat: 48.8757, lon: 2.3989 },
  // Porte des Lilas already listed
  { name: "Mairie des Lilas", lat: 48.8796, lon: 2.4162 },

  // ─── Line 12 ───
  { name: "Front Populaire", lat: 48.9065, lon: 2.3652 },
  { name: "Porte de la Chapelle", lat: 48.8978, lon: 2.3593 },
  { name: "Marx Dormoy", lat: 48.8909, lon: 2.3598 },
  // Marcadet-Poissonniers already listed
  { name: "Jules Joffrin", lat: 48.8925, lon: 2.3442 },
  { name: "Lamarck-Caulaincourt", lat: 48.8894, lon: 2.3390 },
  { name: "Abbesses", lat: 48.8844, lon: 2.3386 },
  // Pigalle already listed
  { name: "Saint-Georges", lat: 48.8785, lon: 2.3374 },
  { name: "Notre-Dame-de-Lorette", lat: 48.8764, lon: 2.3381 },
  { name: "Trinité-d'Estienne d'Orves", lat: 48.8763, lon: 2.3329 },
  // Saint-Lazare already listed
  // Madeleine already listed
  // Concorde already listed
  { name: "Assemblée Nationale", lat: 48.8610, lon: 2.3190 },
  { name: "Solférino", lat: 48.8583, lon: 2.3227 },
  { name: "Rue du Bac", lat: 48.8557, lon: 2.3256 },
  // Sèvres-Babylone already listed
  { name: "Rennes", lat: 48.8487, lon: 2.3278 },
  { name: "Notre-Dame-des-Champs", lat: 48.8453, lon: 2.3288 },
  // Montparnasse-Bienvenüe already listed
  { name: "Falguière", lat: 48.8440, lon: 2.3188 },
  // Pasteur already listed
  { name: "Volontaires", lat: 48.8409, lon: 2.3096 },
  { name: "Vaugirard", lat: 48.8393, lon: 2.3014 },
  { name: "Convention", lat: 48.8372, lon: 2.2966 },
  { name: "Porte de Versailles", lat: 48.8320, lon: 2.2878 },
  { name: "Corentin Celton", lat: 48.8268, lon: 2.2795 },
  { name: "Mairie d'Issy", lat: 48.8246, lon: 2.2734 },

  // ─── Line 13 ───
  { name: "Asnières-Gennevilliers-Les Courtilles", lat: 48.9306, lon: 2.2838 },
  { name: "Les Agnettes", lat: 48.9232, lon: 2.2862 },
  { name: "Gabriel Péri", lat: 48.9166, lon: 2.2948 },
  { name: "Mairie de Saint-Ouen", lat: 48.9120, lon: 2.3337 },
  { name: "Garibaldi", lat: 48.9067, lon: 2.3319 },
  { name: "Porte de Saint-Ouen", lat: 48.8973, lon: 2.3284 },
  { name: "Guy Môquet", lat: 48.8929, lon: 2.3277 },
  { name: "La Fourche", lat: 48.8872, lon: 2.3257 },
  // Place de Clichy already listed
  { name: "Liège", lat: 48.8796, lon: 2.3271 },
  // Saint-Lazare already listed
  // Miromesnil already listed
  // Champs-Élysées-Clemenceau already listed
  // Invalides already listed
  { name: "Varenne", lat: 48.8566, lon: 2.3149 },
  { name: "Saint-François-Xavier", lat: 48.8510, lon: 2.3143 },
  // Duroc already listed
  // Montparnasse-Bienvenüe already listed
  { name: "Gaîté", lat: 48.8385, lon: 2.3222 },
  { name: "Pernety", lat: 48.8342, lon: 2.3182 },
  { name: "Plaisance", lat: 48.8316, lon: 2.3136 },
  { name: "Porte de Vanves", lat: 48.8275, lon: 2.3053 },
  { name: "Malakoff-Plateau de Vanves", lat: 48.8226, lon: 2.2983 },
  { name: "Malakoff-Rue Étienne Dolet", lat: 48.8149, lon: 2.2970 },
  { name: "Châtillon-Montrouge", lat: 48.8105, lon: 2.3017 },

  // ─── Line 14 ───
  { name: "Saint-Denis-Pleyel", lat: 48.9318, lon: 2.3435 },
  // Mairie de Saint-Ouen already listed
  { name: "Porte de Clichy", lat: 48.8945, lon: 2.3136 },
  { name: "Pont Cardinet", lat: 48.8873, lon: 2.3153 },
  // Saint-Lazare already listed
  // Madeleine already listed
  // Pyramides already listed
  // Châtelet already listed
  // Gare de Lyon already listed
  // Bercy already listed
  { name: "Cour Saint-Émilion", lat: 48.8334, lon: 2.3871 },
  { name: "Bibliothèque François Mitterrand", lat: 48.8299, lon: 2.3765 },
  { name: "Olympiades", lat: 48.8271, lon: 2.3676 },
  { name: "Aéroport d'Orly", lat: 48.7262, lon: 2.3652 },

  // ─── Key RER Stations ───
  { name: "Châtelet-Les Halles", lat: 48.8612, lon: 2.3467 },
  // Gare du Nord already listed (Metro)
  // Gare de Lyon already listed (Metro)
  { name: "Saint-Michel-Notre-Dame", lat: 48.8531, lon: 2.3445 },
  { name: "Luxembourg", lat: 48.8463, lon: 2.3400 },
  { name: "Port-Royal", lat: 48.8399, lon: 2.3368 },
  // Denfert-Rochereau already listed
  { name: "Cité Universitaire", lat: 48.8204, lon: 2.3384 },
  // Nation already listed
  { name: "Auber", lat: 48.8724, lon: 2.3295 },
  // Charles de Gaulle-Étoile already listed
  // La Défense already listed
  { name: "Musée d'Orsay", lat: 48.8607, lon: 2.3254 },
  // Invalides already listed
  { name: "Pont de l'Alma", lat: 48.8624, lon: 2.3017 },
  { name: "Champ de Mars-Tour Eiffel", lat: 48.8561, lon: 2.2901 },
  { name: "Avenue Foch", lat: 48.8713, lon: 2.2758 },
  { name: "Avenue Henri Martin", lat: 48.8658, lon: 2.2726 },
  // Bibliothèque François Mitterrand already listed
  { name: "Haussmann-Saint-Lazare", lat: 48.8755, lon: 2.3276 },
  { name: "Magenta", lat: 48.8807, lon: 2.3571 },
  { name: "Marne-la-Vallée-Chessy", lat: 48.8674, lon: 2.7827 },

  // ─── Tram T1 (partial, within Paris area) ───
  { name: "Gare de Saint-Denis", lat: 48.9346, lon: 2.3457 },
  { name: "Basilique de Saint-Denis", lat: 48.9365, lon: 2.3590 },
  { name: "Marché de Saint-Denis", lat: 48.9360, lon: 2.3540 },
  { name: "Courneuve-8 Mai 1945 (T1)", lat: 48.9214, lon: 2.4097 },
  { name: "Bobigny-Pablo Picasso (T1)", lat: 48.9058, lon: 2.4496 },
  { name: "Drancy-Avenir", lat: 48.9255, lon: 2.4433 },
  { name: "Les Cosmonautes", lat: 48.9204, lon: 2.4337 },
  { name: "Hôpital Avicenne", lat: 48.9149, lon: 2.4214 },
  { name: "Gaston Roulaud", lat: 48.9173, lon: 2.4151 },

  // ─── Tram T2 (La Défense area) ───
  { name: "La Défense (T2)", lat: 48.8924, lon: 2.2381 },
  { name: "Puteaux", lat: 48.8835, lon: 2.2345 },
  { name: "Faubourg de l'Arche", lat: 48.8963, lon: 2.2416 },
  { name: "Suresnes-Longchamp", lat: 48.8727, lon: 2.2204 },
  { name: "Les Moulineaux", lat: 48.8301, lon: 2.2590 },
  { name: "Parc de Saint-Cloud", lat: 48.8441, lon: 2.2212 },
  { name: "Musée de Sèvres", lat: 48.8286, lon: 2.2258 },
  { name: "Brimborion", lat: 48.8246, lon: 2.2277 },
  { name: "Issy-Val de Seine", lat: 48.8242, lon: 2.2597 },
  { name: "Jacques-Henri Lartigue", lat: 48.8265, lon: 2.2548 },
  { name: "Les Coteaux", lat: 48.8175, lon: 2.2666 },
  { name: "Porte de Versailles (T2)", lat: 48.8321, lon: 2.2870 },

  // ─── Tram T3a (South Paris, Pont du Garigliano → Porte de Vincennes) ───
  { name: "Pont du Garigliano", lat: 48.8384, lon: 2.2709 },
  { name: "Balard (T3a)", lat: 48.8358, lon: 2.2783 },
  { name: "Porte de Versailles (T3a)", lat: 48.8319, lon: 2.2880 },
  { name: "Georges Brassens", lat: 48.8280, lon: 2.3005 },
  { name: "Porte de Vanves (T3a)", lat: 48.8270, lon: 2.3053 },
  { name: "Didot", lat: 48.8244, lon: 2.3152 },
  { name: "Jean Moulin", lat: 48.8225, lon: 2.3220 },
  { name: "Porte d'Orléans (T3a)", lat: 48.8228, lon: 2.3254 },
  { name: "Montsouris", lat: 48.8213, lon: 2.3355 },
  { name: "Cité Universitaire (T3a)", lat: 48.8199, lon: 2.3387 },
  { name: "Stade Charléty-Porte de Gentilly", lat: 48.8182, lon: 2.3479 },
  { name: "Poterne des Peupliers", lat: 48.8196, lon: 2.3595 },
  { name: "Porte d'Italie (T3a)", lat: 48.8189, lon: 2.3602 },
  { name: "Porte de Choisy (T3a)", lat: 48.8196, lon: 2.3656 },
  { name: "Porte d'Ivry (T3a)", lat: 48.8213, lon: 2.3718 },
  { name: "Porte de Charenton (T3a)", lat: 48.8307, lon: 2.3967 },
  { name: "Porte Dorée (T3a)", lat: 48.8353, lon: 2.4058 },
  { name: "Porte de Vincennes (T3a)", lat: 48.8469, lon: 2.4113 },
  { name: "Montempoivre", lat: 48.8390, lon: 2.4060 },
  { name: "Alexandra David-Néel", lat: 48.8248, lon: 2.3842 },
  { name: "Baron Le Roy", lat: 48.8326, lon: 2.3921 },

  // ─── Tram T3b (East/North Paris, Porte de Vincennes → Porte d'Asnières) ───
  { name: "Porte de Vincennes (T3b)", lat: 48.8475, lon: 2.4110 },
  { name: "Porte de Montreuil (T3b)", lat: 48.8537, lon: 2.4116 },
  { name: "Porte de Bagnolet (T3b)", lat: 48.8636, lon: 2.4098 },
  { name: "Porte des Lilas (T3b)", lat: 48.8768, lon: 2.4068 },
  { name: "Porte de Pantin (T3b)", lat: 48.8879, lon: 2.3922 },
  { name: "Porte de la Villette (T3b)", lat: 48.8972, lon: 2.3856 },
  { name: "Porte de la Chapelle (T3b)", lat: 48.8979, lon: 2.3599 },
  { name: "Porte de Clignancourt (T3b)", lat: 48.8977, lon: 2.3441 },
  { name: "Porte de Saint-Ouen (T3b)", lat: 48.8976, lon: 2.3289 },
  { name: "Porte de Clichy (T3b)", lat: 48.8945, lon: 2.3132 },
  { name: "Porte d'Asnières", lat: 48.8943, lon: 2.3019 },
  { name: "Angélique Compoint", lat: 48.8958, lon: 2.3183 },
  { name: "Épinettes-Pouchet", lat: 48.8951, lon: 2.3078 },
  { name: "Porte Pouchet", lat: 48.8977, lon: 2.3072 },
  { name: "Ella Fitzgerald-Grands Voisins", lat: 48.8988, lon: 2.3446 },
  { name: "Canal Saint-Denis", lat: 48.8984, lon: 2.3734 },
  { name: "Adrienne Bolland", lat: 48.8858, lon: 2.3985 },
  { name: "Marie de Miribel", lat: 48.8715, lon: 2.4096 },
  { name: "Delphine Seyrig", lat: 48.8582, lon: 2.4115 },
  { name: "Porte du Pré-Saint-Gervais", lat: 48.8804, lon: 2.3999 },
  { name: "Hébert", lat: 48.8976, lon: 2.3520 },

  // ─── Tram T7 (south Paris suburbs) ───
  { name: "Villejuif-Louis Aragon (T7)", lat: 48.7871, lon: 2.3678 },
  { name: "Laplace", lat: 48.7840, lon: 2.3650 },
  { name: "Auguste Delaune", lat: 48.7800, lon: 2.3632 },
  { name: "Domaine Chérioux", lat: 48.7823, lon: 2.3560 },

  // ─── Tram T8 (north) ───
  { name: "Saint-Denis-Porte de Paris", lat: 48.9300, lon: 2.3566 },
  { name: "Gare d'Épinay-sur-Seine", lat: 48.9534, lon: 2.3096 },
  { name: "Villetaneuse-Université", lat: 48.9556, lon: 2.3445 },
];
