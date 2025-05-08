import { ValidationCle } from "../models/listetache.model.js";

const authentification = (req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    const cleApi = req.headers.authorization;
    ValidationCle(cleApi)
    .then(resultat => {
        if(!resultat) {
            return res.status(401).json({ message: "Clé API invalide" });
        } else {
            next();
        }
    })
    .catch(erreur => {
        return res.status(500).json({ message: "Erreur lors de la validation de la clé api" })
    });    
}

export default authentification;