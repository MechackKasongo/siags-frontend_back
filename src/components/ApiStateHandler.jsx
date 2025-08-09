import React, { useState, useEffect } from 'react';

/**
 * Composant réutilisable pour gérer les états de chargement, d'erreur et de succès des appels API.
 * Ce composant gère la logique d'état et d'affichage, vous permettant de vous
 * concentrer sur la logique métier dans votre composant parent.
 * * @param {object} props
 * @param {Function} props.apiCall - La fonction asynchrone qui effectue l'appel API. Elle doit retourner les données en cas de succès.
 * @param {Function} props.renderSuccess - La fonction qui rend le contenu en cas de succès. Elle reçoit les données de l'API en paramètre.
 * @param {string} [props.loadingMessage="Chargement en cours..."] - Le message à afficher pendant le chargement.
 * * Exemple d'utilisation dans un composant parent :
 * <ApiStateHandler
 * apiCall={myApiService.fetchData}
 * renderSuccess={(data) => <p>Données chargées : {data}</p>}
 * loadingMessage="Récupération des données..."
 * />
 */

export default function ApiStateHandler({ apiCall, renderSuccess, loadingMessage = "Chargement en cours..." }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fonction asynchrone pour exécuter l'appel API passé en prop
        const fetchData = async () => {
            try {
                const responseData = await apiCall();
                setData(responseData);
            } catch (err) {
                // Gérer les erreurs de l'API et mettre à jour l'état
                setError(err.message);
            } finally {
                // Indiquer que l'opération est terminée, peu importe le résultat
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiCall]); // Le tableau de dépendances garantit que le `useEffect` s'exécute si `apiCall` change

    // Affichage conditionnel basé sur l'état
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
                {/* Indicateur de chargement (spinner) */}
                <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 text-lg">{loadingMessage}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative p-8">
                <strong className="font-bold">Erreur :</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        );
    }

    if (data) {
        // Si les données sont présentes, rendre le composant de succès
        return renderSuccess(data);
    }

    return null;
}
