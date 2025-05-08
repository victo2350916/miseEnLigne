import express from "express";
import { GetListeTaches, GetTacheEtSousTache, AjouterTache, ModifierTache, ModifierEtatTache, SupprimerTache, AjouterSousTache, ModifierSousTache, ModifierEtatSousTache, SupprimerSousTache, AjouterUtilisateur, RetournerCleApi } from "../controllers/listetache.controller.js";
import authentification from "../middlewares/authentification.middleware.js";

const router = express.Router();

router.get('/liste', authentification, GetListeTaches);
router.get('/tache', authentification, GetTacheEtSousTache);
router.post('/tache', authentification, AjouterTache);
router.put('/tache', authentification, ModifierTache);
router.patch('/tache', authentification, ModifierEtatTache);
router.delete('/tache', authentification, SupprimerTache);
router.post('/soustache', authentification, AjouterSousTache);
router.put('/soustache', authentification, ModifierSousTache);
router.patch('/soustache', authentification, ModifierEtatSousTache);
router.delete('/soustache', authentification, SupprimerSousTache);
router.post('/utilisateur', AjouterUtilisateur);
router.get('/utilisateur', RetournerCleApi);

export default router;