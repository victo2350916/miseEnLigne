import listeTacheModel from "../models/listetache.model.js";
import json from "express";
import bcrypt from 'bcrypt';
const costFactor = 10;

const GetListeTaches = async (req, res) => {
    try {
        let cle_api = req.headers.authorization;

        let resultat = await listeTacheModel.SelectionnerId(cle_api);

        let id = resultat[0].id;

        let taches = await listeTacheModel.AfficherListeTache(id);

        if (taches.length === 0) {
            return res.status(404).json({message: "Erreur, il n'y a pas de tâches dans le système."});
        }
        res.status(200).json(taches);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `Échec lors de la récupération des tâches.`});
    }
}

const GetTacheEtSousTache = async (req, res) => {
    try {
        let id = req.query.id;

        if (!id || id.length === 0) {
            return res.status(400).json({message: "Erreur, vous devez fournir un ID dans votre requête."});
        }

        let tache = await listeTacheModel.SelectionnerTache(id);

        if (tache.length === 0) {
            return res.status(404).json({message: "Erreur, il n'y a aucune tâche associée au ID fournit."})
        }

        let sousTaches = await listeTacheModel.SelectionnerSousTache(id);

        let resultat = {
            tache: tache[0],
            sousTaches: []
        }

        if (sousTaches.length === 0) {
            return res.status(200).json(resultat);
        }

        resultat = {
            tache: tache[0],
            sousTaches: sousTaches
        }

        res.status(200).json(resultat);
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Échec lors de la récupération de la tâche."})
    }
}

const AjouterTache = async (req, res) => {
    try {
        if (!req.body || !req.body.titre || !req.body.description || !req.body.date_debut || !req.body.date_echeance) {
            return res.status(400).json({ message: "Erreur, vous devez fournir un corps dans la requête contenant un titre, une description, une date de début et une date d'échéance." });
        }

        let {titre, description, date_debut, date_echeance} = req.body;

        let utilisateur_id = await listeTacheModel.SelectionnerId(cle_api);

        utilisateur_id = utilisateur_id[0].id;

        await listeTacheModel.AjouterTache(utilisateur_id, titre, description, date_debut, date_echeance);

        let resultat = {
            message: "Tâche ajoutée avec succès!",
            donnees: {
                titre: titre,
                description: description,
                date_debut: date_debut,
                date_echeance: date_echeance,
                complete: "false"
            }

        }

        return res.status(201).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur lors de l'ajout de la tâche."});
    }
}

const ModifierTache = async (req, res) => {
    try {
        if (!req.body || !req.body.titre || !req.body.description || !req.body.date_debut || !req.body.date_echeance || req.body.complete === undefined || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un titre, une description, une date de début, une date d'échéance, un état et un ID."});
        }

        let {titre, description, date_debut, date_echeance, complete, id} = req.body;

        let idExiste = await listeTacheModel.verfierTacheExiste(id);

        if (idExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de tâche avec le ID: ${id}`});
        }

        await listeTacheModel.ModifierTache(titre, description, date_debut, date_echeance, complete, id);

        let resultat = {
            message: "La mise à jour de la tâche a été effectuée avec succès!",
            donnees: {
                titre: titre,
                description: description,
                date_debut: date_debut,
                date_echeance: date_echeance,  
                complete: complete
            }
        }

        return res.status(200).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur interne lors de la mise à jour de la tâche."});
    }
}

const ModifierEtatTache = async (req, res) => {
    try {
        if (!req.body || req.body.complete === undefined || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un état et un ID."});
        }

        let {complete, id} = req.body;


        let idExiste = await listeTacheModel.verfierTacheExiste(id);

        if (idExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de tache avec le ID: ${id}`});
        }

        await listeTacheModel.ModifierEtatTache(id, complete);

        let resultat = {
            message: "La mise à jour de l'état a été effectuée avec succès!",
            etat: complete
        }

        return res.status(200).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur interne lors de la mise à jour de l'état."});
    }
}

const SupprimerTache = async (req, res) => {
    try {
        if (!req.body || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un ID."});
        }

        let {id} = req.body;

        let idExiste = await listeTacheModel.verfierTacheExiste(id);

        if (idExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de tache avec le ID: ${id}`});
        }

        await listeTacheModel.SupprimerTache(id);

        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: `Erreur interne lors de la suppression de la tâche avec le ID ${id}`});
    }
}

const AjouterSousTache = async (req, res) => {
    try {
        if (!req.body || !req.body.tache_id || !req.body.titre) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un ID de tâche et un titre."});
        }

        let {tache_id, titre} = req.body;

        let verfierTacheExiste = await listeTacheModel.verfierTacheExiste(tache_id);

        if (verfierTacheExiste.length === 0) {
            return res.status(404).json({message: `Il n'y a pas de tâche avec le ID: ${tache_id}`});
        }

        await listeTacheModel.AjouterSousTache(tache_id, titre);

        let resultat = {
            message: "Sous-tâche ajoutée avec succès!",
            donnees: {
                tache_id: tache_id,
                titre: titre,
                complete: "false"
            }
        }

        return res.status(201).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur interne lors de l'ajout de la sous-tâche."});
    }
}

const ModifierSousTache = async (req, res) => {
    try {
        if (!req.body || !req.body.titre || req.body.complete === undefined || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un titre, un état et un ID."});
        }

        let {titre, complete, id} = req.body;

        let sousTacheIdExiste = await listeTacheModel.VerifierSousTacheId(id);

        if (sousTacheIdExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de sous-tâche avec le ID: ${id}`});
        }

        await listeTacheModel.ModifierSousTache(id, titre, complete);

        let resultat = {
            message: "La mise à jour de la sous-tâche a été effectuée avec succès!",
            donnees: {
                id: id,
                titre: titre,
                etat:  complete
            }
        }

        return res.status(200).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur interne lors de la mise à jour de la sous-tâche."});
    }
}

const ModifierEtatSousTache = async (req, res) => {
    try {
        if (!req.body || req.body.complete === undefined || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un état et un ID."});
        }

        let {complete, id} = req.body;

        let idExiste = await listeTacheModel.VerifierSousTacheId(id);

        if (idExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de sous-tâche avec le ID: ${id}`});
        }

        await listeTacheModel.ModifierEtatSousTache(id, complete);

        let resultat = {
            message: "La mise à jour de l'état a été effectuée avec succès!",
            etat: complete
        }

        return res.status(200).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur interne lors de la mise à jour de l'état."});
    }
}

const SupprimerSousTache = async (req, res) => {
    try {
        if (!req.body || !req.body.id) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un ID."});
        }

        let {id} = req.body;

        let idExiste = await listeTacheModel.VerifierSousTacheId(id);

        if (idExiste.length === 0) {
            return res.status(404).json({message: `Erreur, il n'y a pas de sous-tâche avec le ID: ${id}`});
        }

        await listeTacheModel.SupprimerSousTache(id);

        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: `Erreur interne lors da la suppression de la sous-tâche avec le ID ${id}`});
    }
}

const AjouterUtilisateur = async (req, res) => {
    try {
        if (!req.body || !req.body.nom || !req.body.prenom || !req.body.courriel || !req.body.motDePasse) {
            return res.status(400).json({message: "Erreur, vous devez fournir un corps dans la requête contenant un nom, un prenom, un courriel et un mot de passe."});
        }

        let {nom, prenom, courriel, motDePasse} = req.body;

        let cle_api = listeTacheModel.GenererCleApi();

        let motDePasseHash = await bcrypt.hash(motDePasse, costFactor)

        await listeTacheModel.AjouterUtilisateur(nom, prenom, courriel, motDePasseHash, cle_api);

        let resultat = {
            message: "Utilisateur ajouté avec succès!",
            donnees: {
                nom: nom,
                prenom: prenom,
                courriel: courriel,
                motDePasse: motDePasse,
                cle_api: cle_api
            }

        }

        return res.status(201).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur lors de la création de l'utilisateur."});
    }
}

const RetournerCleApi = async (req, res) => {
    try {
        let {courriel, motDePasse, changerCleApi} = req.query;

        if (!courriel || !motDePasse) {
            return res.status(400).json({message: "Erreur, vous devez fournir un courriel et un mot de passe."});
        }

        let motDePasseVerifier = await listeTacheModel.VerifierMotDePasse(courriel);

        if (motDePasseVerifier.length === 0) {
            return res.status(404).json({message: "Erreur, mauvais courriel ou mot de passe."});
        }

        let motDePasseValide = await bcrypt.compare(motDePasse, motDePasseVerifier[0].password)

        if (!motDePasseValide) {
            return res.status(404).json({message: "Erreur, mauvais courriel ou mot de passe."});
        }

        if (changerCleApi == 1) {
            let nouvelleCle = listeTacheModel.GenererCleApi();
            await listeTacheModel.ModifierCleApi(courriel, nouvelleCle);
        }

        let cle_api = await listeTacheModel.RetournerCleApi(courriel);

        let resultat = {
            message: `Voici votre clé API: ${cle_api[0].cle_api}`
        }

        return res.status(200).json(resultat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur lors de la récupération de la clé API."});
    }
}

export {
    GetListeTaches,
    GetTacheEtSousTache,
    AjouterTache,
    ModifierTache,
    ModifierEtatTache,
    SupprimerTache,
    AjouterSousTache,
    ModifierSousTache,
    ModifierEtatSousTache,
    SupprimerSousTache,
    AjouterUtilisateur,
    RetournerCleApi
}