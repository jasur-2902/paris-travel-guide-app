import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LANG_STORAGE_KEY = 'paris-trip-lang';

const translations = {
  en: {
    // Header
    'header.title': 'Paris Trip Planner',
    'header.addressPlaceholder': 'Enter your base address in France...',
    'header.myLocation': 'My location',
    'header.useMyLocation': 'Use my current location',
    'header.addActivity': 'Add Activity',
    'header.exportCsv': 'Export CSV',

    // Tabs
    'tabs.table': 'Table',
    'tabs.itinerary': 'Itinerary',
    'tabs.map': 'Map',

    // Hidden
    'hidden.count': '{count} hidden',
    'hidden.hide': 'Hide',
    'hidden.show': 'Show',

    // Notifications
    'notify.transitUpdated': 'Transit times updated for your location.',
    'notify.transitError': 'Could not calculate transit times: {error}. Default times are shown.',
    'notify.selectFrance': 'Please select an address in France.',
    'notify.geoNotSupported': 'Geolocation is not supported by your browser.',
    'notify.outsideFrance': 'Your current location is outside France. Please enter a French address manually.',
    'notify.locationDenied': 'Location access denied. Please allow location access in your browser settings.',
    'notify.locationUnavailable': 'Could not determine your location. Please enter an address manually.',
    'notify.locationTimeout': 'Location request timed out. Please try again or enter an address manually.',
    'notify.locationError': 'Could not get your location. Please enter an address manually.',

    // Footer
    'footer.transitFrom': '*Estimated transit times (metro + walking) from {address}.',
    'footer.enterAddress': '*Enter your base address above to calculate transit times.',

    // View mode
    'view.simple': 'Simple',
    'view.full': 'Full',
    'view.toggle': 'Switch view mode',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.darkMode': 'Appearance',
    'settings.setLocation': 'Set base location',

    // Dark mode
    'dark.toggle': 'Toggle dark mode',
    'dark.light': 'Light',
    'dark.dark': 'Dark',

    // Table
    'table.filter': 'Filter by activity or type...',
    'table.doneShown': '{done} done / {shown} shown',
    'table.date': 'Date',
    'table.activity': 'Activity',
    'table.type': 'Type',
    'table.metro': 'Metro',
    'table.days': 'Days',
    'table.hours': 'Hours',
    'table.price': 'Price',
    'table.transit': 'Transit',
    'table.actions': 'Actions',
    'table.noResults': 'No activities found matching your search.',
    'table.closedOnDay': 'Closed on this day (open {days})',
    'table.checkVenue': 'Check venue for exact open days',
    'table.openMaps': 'Open in Google Maps',
    'table.addNote': 'Add note',
    'table.editNote': 'Edit note',
    'table.deleteCustom': 'Delete custom activity',
    'table.hide': 'Hide activity',
    'table.unhide': 'Unhide activity',
    'table.notesPlaceholder': 'Add notes about this activity...',
    'table.custom': 'Custom',

    // Planner
    'planner.noPlanned': 'No dates planned yet. Assign dates in the Table view to see your itinerary here.',
    'planner.unscheduled': 'Unscheduled',
    'planner.done': 'done',
    'planner.drag': 'Drag to reorder',
    'planner.remove': 'Remove from this day',
    'planner.addNote': 'Add a note...',
    'planner.closedWarning': 'Likely closed on this day (open {days})',
    'planner.checkVenue': 'Open on select days only — check venue',
    'planner.yourBase': 'Your base',

    // Map
    'map.indoor': 'Indoor',
    'map.outdoor': 'Outdoor',
    'map.mix': 'Mix',
    'map.done': 'Done',
    'map.yourBase': 'Your base',
    'map.planned': 'Planned',
    'map.openMaps': 'Open in Google Maps',
    'map.dayRoutes': 'Dashed lines = planned day routes',

    // Budget
    'budget.spent': 'Spent',
    'budget.planned': 'Planned',
    'budget.total': 'Total',
    'budget.budget': 'Budget',
    'budget.setBudget': 'Set budget',
    'budget.remaining': 'Remaining',
    'budget.save': 'Save',
    'budget.cancel': 'Cancel',

    // Modal
    'modal.title': 'Add Custom Activity',
    'modal.name': 'Activity Name *',
    'modal.namePlaceholder': 'e.g. Local Wine Bar',
    'modal.type': 'Type',
    'modal.daysOpen': 'Days Open',
    'modal.hours': 'Hours',
    'modal.hoursPlaceholder': 'e.g. 10:00 - 22:00',
    'modal.price': 'Price (EUR)',
    'modal.pricePlaceholder': '0 for free',
    'modal.address': 'Address *',
    'modal.addressPlaceholder': 'Search for an address in France...',
    'modal.cancel': 'Cancel',
    'modal.add': 'Add Activity',
    'modal.nameRequired': 'Activity name is required.',
    'modal.addressRequired': 'Please search and select an address.',
    'modal.selectFrance': 'Please select a location in France.',

    // CSV
    'csv.status': 'Status',
    'csv.plannedDate': 'Planned Date',
    'csv.done': 'Done',
    'csv.toDo': 'To Do',
    'csv.daysOpen': 'Days Open',
    'csv.transit': 'Est. Transit',
    'csv.location': 'Location',
    'csv.notes': 'Notes',

    // Weather
    'weather.forecast': 'Weather',
    'weather.clearSky': 'Clear sky',
    'weather.mainlyClear': 'Mainly clear',
    'weather.partlyCloudy': 'Partly cloudy',
    'weather.overcast': 'Overcast',
    'weather.foggy': 'Foggy',
    'weather.drizzle': 'Drizzle',
    'weather.freezingDrizzle': 'Freezing drizzle',
    'weather.rain': 'Rain',
    'weather.freezingRain': 'Freezing rain',
    'weather.snow': 'Snow',
    'weather.rainShowers': 'Rain showers',
    'weather.snowShowers': 'Snow showers',
    'weather.thunderstorm': 'Thunderstorm',
    'weather.thunderstormHail': 'Thunderstorm w/ hail',
    'weather.unknown': 'Unknown',
  },
  es: {
    'header.title': 'Planificador de Viaje a París',
    'header.addressPlaceholder': 'Ingresa tu dirección base en Francia...',
    'header.myLocation': 'Mi ubicación',
    'header.useMyLocation': 'Usar mi ubicación actual',
    'header.addActivity': 'Agregar actividad',
    'header.exportCsv': 'Exportar CSV',

    'tabs.table': 'Tabla',
    'tabs.itinerary': 'Itinerario',
    'tabs.map': 'Mapa',

    'hidden.count': '{count} ocultos',
    'hidden.hide': 'Ocultar',
    'hidden.show': 'Mostrar',

    'notify.transitUpdated': 'Tiempos de tránsito actualizados para tu ubicación.',
    'notify.transitError': 'No se pudieron calcular los tiempos: {error}. Se muestran tiempos predeterminados.',
    'notify.selectFrance': 'Por favor selecciona una dirección en Francia.',
    'notify.geoNotSupported': 'La geolocalización no es compatible con tu navegador.',
    'notify.outsideFrance': 'Tu ubicación actual está fuera de Francia. Ingresa una dirección francesa manualmente.',
    'notify.locationDenied': 'Acceso a ubicación denegado. Permite el acceso en la configuración de tu navegador.',
    'notify.locationUnavailable': 'No se pudo determinar tu ubicación. Ingresa una dirección manualmente.',
    'notify.locationTimeout': 'Solicitud de ubicación agotada. Intenta de nuevo o ingresa una dirección manualmente.',
    'notify.locationError': 'No se pudo obtener tu ubicación. Ingresa una dirección manualmente.',

    'footer.transitFrom': '*Tiempos de tránsito estimados (metro + a pie) desde {address}.',
    'footer.enterAddress': '*Ingresa tu dirección base arriba para calcular tiempos de tránsito.',

    'view.simple': 'Simple',
    'view.full': 'Completa',
    'view.toggle': 'Cambiar modo de vista',

    'settings.title': 'Ajustes',
    'settings.language': 'Idioma',
    'settings.darkMode': 'Apariencia',
    'settings.setLocation': 'Establecer ubicación base',

    'dark.toggle': 'Alternar modo oscuro',
    'dark.light': 'Claro',
    'dark.dark': 'Oscuro',

    'table.filter': 'Filtrar por actividad o tipo...',
    'table.doneShown': '{done} hechos / {shown} mostrados',
    'table.date': 'Fecha',
    'table.activity': 'Actividad',
    'table.type': 'Tipo',
    'table.metro': 'Metro',
    'table.days': 'Días',
    'table.hours': 'Horario',
    'table.price': 'Precio',
    'table.transit': 'Tránsito',
    'table.actions': 'Acciones',
    'table.noResults': 'No se encontraron actividades que coincidan con tu búsqueda.',
    'table.closedOnDay': 'Cerrado este día (abierto {days})',
    'table.checkVenue': 'Consulta el lugar para días exactos de apertura',
    'table.openMaps': 'Abrir en Google Maps',
    'table.addNote': 'Agregar nota',
    'table.editNote': 'Editar nota',
    'table.deleteCustom': 'Eliminar actividad personalizada',
    'table.hide': 'Ocultar actividad',
    'table.unhide': 'Mostrar actividad',
    'table.notesPlaceholder': 'Agrega notas sobre esta actividad...',
    'table.custom': 'Personal',

    'planner.noPlanned': 'No hay fechas planificadas. Asigna fechas en la vista de Tabla para ver tu itinerario aquí.',
    'planner.unscheduled': 'Sin programar',
    'planner.done': 'hechos',
    'planner.drag': 'Arrastra para reordenar',
    'planner.remove': 'Quitar de este día',
    'planner.addNote': 'Agrega una nota...',
    'planner.closedWarning': 'Probablemente cerrado este día (abierto {days})',
    'planner.checkVenue': 'Abierto solo en días selectos — consulta el lugar',
    'planner.yourBase': 'Tu base',

    'map.indoor': 'Interior',
    'map.outdoor': 'Exterior',
    'map.mix': 'Mixto',
    'map.done': 'Hecho',
    'map.yourBase': 'Tu base',
    'map.planned': 'Planificado',
    'map.openMaps': 'Abrir en Google Maps',
    'map.dayRoutes': 'Líneas punteadas = rutas diarias planificadas',

    'budget.spent': 'Gastado',
    'budget.planned': 'Planeado',
    'budget.total': 'Total',
    'budget.budget': 'Presupuesto',
    'budget.setBudget': 'Fijar presupuesto',
    'budget.remaining': 'Restante',
    'budget.save': 'Guardar',
    'budget.cancel': 'Cancelar',

    'modal.title': 'Agregar actividad personalizada',
    'modal.name': 'Nombre de la actividad *',
    'modal.namePlaceholder': 'ej. Bar de vinos local',
    'modal.type': 'Tipo',
    'modal.daysOpen': 'Días abiertos',
    'modal.hours': 'Horario',
    'modal.hoursPlaceholder': 'ej. 10:00 - 22:00',
    'modal.price': 'Precio (EUR)',
    'modal.pricePlaceholder': '0 para gratis',
    'modal.address': 'Dirección *',
    'modal.addressPlaceholder': 'Busca una dirección en Francia...',
    'modal.cancel': 'Cancelar',
    'modal.add': 'Agregar actividad',
    'modal.nameRequired': 'El nombre de la actividad es obligatorio.',
    'modal.addressRequired': 'Busca y selecciona una dirección.',
    'modal.selectFrance': 'Selecciona una ubicación en Francia.',

    'csv.status': 'Estado',
    'csv.plannedDate': 'Fecha planificada',
    'csv.done': 'Hecho',
    'csv.toDo': 'Pendiente',
    'csv.daysOpen': 'Días abiertos',
    'csv.transit': 'Tránsito est.',
    'csv.location': 'Ubicación',
    'csv.notes': 'Notas',

    'weather.forecast': 'Clima',
    'weather.clearSky': 'Cielo despejado',
    'weather.mainlyClear': 'Mayormente despejado',
    'weather.partlyCloudy': 'Parcialmente nublado',
    'weather.overcast': 'Nublado',
    'weather.foggy': 'Niebla',
    'weather.drizzle': 'Llovizna',
    'weather.freezingDrizzle': 'Llovizna helada',
    'weather.rain': 'Lluvia',
    'weather.freezingRain': 'Lluvia helada',
    'weather.snow': 'Nieve',
    'weather.rainShowers': 'Chubascos',
    'weather.snowShowers': 'Nevadas',
    'weather.thunderstorm': 'Tormenta',
    'weather.thunderstormHail': 'Tormenta con granizo',
    'weather.unknown': 'Desconocido',
  },
  fr: {
    'header.title': 'Planificateur de Voyage à Paris',
    'header.addressPlaceholder': 'Entrez votre adresse de base en France...',
    'header.myLocation': 'Ma position',
    'header.useMyLocation': 'Utiliser ma position actuelle',
    'header.addActivity': 'Ajouter une activité',
    'header.exportCsv': 'Exporter CSV',

    'tabs.table': 'Tableau',
    'tabs.itinerary': 'Itinéraire',
    'tabs.map': 'Carte',

    'hidden.count': '{count} masqués',
    'hidden.hide': 'Masquer',
    'hidden.show': 'Afficher',

    'notify.transitUpdated': 'Temps de trajet mis à jour pour votre position.',
    'notify.transitError': 'Impossible de calculer les temps de trajet : {error}. Les temps par défaut sont affichés.',
    'notify.selectFrance': 'Veuillez sélectionner une adresse en France.',
    'notify.geoNotSupported': 'La géolocalisation n\'est pas prise en charge par votre navigateur.',
    'notify.outsideFrance': 'Votre position actuelle est hors de France. Veuillez entrer une adresse française manuellement.',
    'notify.locationDenied': 'Accès à la position refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.',
    'notify.locationUnavailable': 'Impossible de déterminer votre position. Veuillez entrer une adresse manuellement.',
    'notify.locationTimeout': 'Demande de position expirée. Réessayez ou entrez une adresse manuellement.',
    'notify.locationError': 'Impossible d\'obtenir votre position. Veuillez entrer une adresse manuellement.',

    'footer.transitFrom': '*Temps de trajet estimés (métro + marche) depuis {address}.',
    'footer.enterAddress': '*Entrez votre adresse de base ci-dessus pour calculer les temps de trajet.',

    'view.simple': 'Simple',
    'view.full': 'Complète',
    'view.toggle': 'Changer le mode de vue',

    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'settings.darkMode': 'Apparence',
    'settings.setLocation': 'Définir l\'adresse de base',

    'dark.toggle': 'Basculer le mode sombre',
    'dark.light': 'Clair',
    'dark.dark': 'Sombre',

    'table.filter': 'Filtrer par activité ou type...',
    'table.doneShown': '{done} faits / {shown} affichés',
    'table.date': 'Date',
    'table.activity': 'Activité',
    'table.type': 'Type',
    'table.metro': 'Métro',
    'table.days': 'Jours',
    'table.hours': 'Horaires',
    'table.price': 'Prix',
    'table.transit': 'Trajet',
    'table.actions': 'Actions',
    'table.noResults': 'Aucune activité ne correspond à votre recherche.',
    'table.closedOnDay': 'Fermé ce jour (ouvert {days})',
    'table.checkVenue': 'Vérifiez le lieu pour les jours d\'ouverture exacts',
    'table.openMaps': 'Ouvrir dans Google Maps',
    'table.addNote': 'Ajouter une note',
    'table.editNote': 'Modifier la note',
    'table.deleteCustom': 'Supprimer l\'activité personnalisée',
    'table.hide': 'Masquer l\'activité',
    'table.unhide': 'Afficher l\'activité',
    'table.notesPlaceholder': 'Ajoutez des notes sur cette activité...',
    'table.custom': 'Perso',

    'planner.noPlanned': 'Aucune date planifiée. Assignez des dates dans la vue Tableau pour voir votre itinéraire ici.',
    'planner.unscheduled': 'Non planifié',
    'planner.done': 'faits',
    'planner.drag': 'Glisser pour réorganiser',
    'planner.remove': 'Retirer de ce jour',
    'planner.addNote': 'Ajouter une note...',
    'planner.closedWarning': 'Probablement fermé ce jour (ouvert {days})',
    'planner.checkVenue': 'Ouvert certains jours seulement — vérifiez le lieu',
    'planner.yourBase': 'Votre base',

    'map.indoor': 'Intérieur',
    'map.outdoor': 'Extérieur',
    'map.mix': 'Mixte',
    'map.done': 'Fait',
    'map.yourBase': 'Votre base',
    'map.planned': 'Planifié',
    'map.openMaps': 'Ouvrir dans Google Maps',
    'map.dayRoutes': 'Lignes pointillées = itinéraires journaliers',

    'budget.spent': 'Dépensé',
    'budget.planned': 'Prévu',
    'budget.total': 'Total',
    'budget.budget': 'Budget',
    'budget.setBudget': 'Définir le budget',
    'budget.remaining': 'Restant',
    'budget.save': 'Enregistrer',
    'budget.cancel': 'Annuler',

    'modal.title': 'Ajouter une activité personnalisée',
    'modal.name': 'Nom de l\'activité *',
    'modal.namePlaceholder': 'ex. Bar à vin local',
    'modal.type': 'Type',
    'modal.daysOpen': 'Jours d\'ouverture',
    'modal.hours': 'Horaires',
    'modal.hoursPlaceholder': 'ex. 10:00 - 22:00',
    'modal.price': 'Prix (EUR)',
    'modal.pricePlaceholder': '0 pour gratuit',
    'modal.address': 'Adresse *',
    'modal.addressPlaceholder': 'Rechercher une adresse en France...',
    'modal.cancel': 'Annuler',
    'modal.add': 'Ajouter l\'activité',
    'modal.nameRequired': 'Le nom de l\'activité est requis.',
    'modal.addressRequired': 'Veuillez rechercher et sélectionner une adresse.',
    'modal.selectFrance': 'Veuillez sélectionner un lieu en France.',

    'csv.status': 'Statut',
    'csv.plannedDate': 'Date prévue',
    'csv.done': 'Fait',
    'csv.toDo': 'À faire',
    'csv.daysOpen': 'Jours d\'ouverture',
    'csv.transit': 'Trajet est.',
    'csv.location': 'Lieu',
    'csv.notes': 'Notes',

    'weather.forecast': 'Météo',
    'weather.clearSky': 'Ciel dégagé',
    'weather.mainlyClear': 'Plutôt dégagé',
    'weather.partlyCloudy': 'Partiellement nuageux',
    'weather.overcast': 'Couvert',
    'weather.foggy': 'Brouillard',
    'weather.drizzle': 'Bruine',
    'weather.freezingDrizzle': 'Bruine verglaçante',
    'weather.rain': 'Pluie',
    'weather.freezingRain': 'Pluie verglaçante',
    'weather.snow': 'Neige',
    'weather.rainShowers': 'Averses',
    'weather.snowShowers': 'Averses de neige',
    'weather.thunderstorm': 'Orage',
    'weather.thunderstormHail': 'Orage avec grêle',
    'weather.unknown': 'Inconnu',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    try { localStorage.setItem(LANG_STORAGE_KEY, newLang); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key, params) => {
    let str = translations[lang]?.[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  }, [lang]);

  const locale = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'fr', label: 'Français', flag: 'FR' },
];
