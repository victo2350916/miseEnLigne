import sql from "../config/db_pg.js";

const AfficherListeTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT * FROM taches WHERE utilisateur_id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat.rows);
        });
    });
}

const SelectionnerId = (cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT id FROM utilisateurs WHERE cle_api = $1";
        let params = [cle_api];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows);
        });
    });
}

const SelectionnerTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT titre, description, complete, date_debut, date_echeance FROM taches WHERE id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows);
        });
    });
}

const SelectionnerSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT titre, complete FROM sous_taches WHERE tache_id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const AjouterTache = (utilisateur_id, titre, description, date_debut, date_echeance) => {
    return new Promise((resolve, reject) => {
        const requete = "INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES ($1, $2, $3, $4, $5, false)";
        let params = [utilisateur_id, titre, description, date_debut, date_echeance];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ModifierTache = (titre, description, date_debut, date_echeance, complete, id) => {
    return new Promise((resolve, reject) => {
        const requete = "UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4, complete = $5 WHERE id = $6";
        let params = [titre, description, date_debut, date_echeance, complete, id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const verfierTacheExiste = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT * FROM taches WHERE id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ModifierEtatTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = "UPDATE taches SET complete = $1 WHERE id = $2";
        let params = [complete, id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}


const SupprimerTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete1 = "DELETE FROM sous_taches WHERE tache_id = $1"
        let params = [id];

        sql.query(requete1, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            const requete = "DELETE FROM taches WHERE id = $1";

            sql.query(requete, params, (erreur, resultat) => {
                if (erreur) {
                    console.log('Erreur sqlState : ' + erreur);
                    console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                    reject(erreur);
                }
                
                resolve(resultat.rows);
                
            });
        });
    });
}

const AjouterSousTache = (tache_id, titre) => {
    return new Promise((resolve, reject) => {
        const requete = "INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, false)";
        let params = [tache_id, titre];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ModifierSousTache = (id, titre, complete) => {
    return new Promise((resolve, reject) => {
        const requete = "UPDATE sous_taches SET titre = $1, complete = $2 WHERE id = $3";
        let params = [titre, complete, id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const VerifierSousTacheId = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT * FROM sous_taches WHERE id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ModifierEtatSousTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = "UPDATE sous_taches SET complete = $1 WHERE id = $2";
        let params = [complete, id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const SupprimerSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "DELETE FROM sous_taches WHERE id = $1";
        let params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const AjouterUtilisateur = (nom, prenom, courriel, motDePasse, cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = "INSERT INTO utilisateurs (nom, prenom, courriel, cle_api, password) VALUES ($1, $2, $3, $4, $5)";

        let params = [nom, prenom, courriel, cle_api, motDePasse];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const GenererCleApi = () => {
    const cle = Math.floor(100000 + Math.random() * 900000);
    return cle.toString();
}

const RetournerCleApi = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT cle_api FROM utilisateurs WHERE courriel = $1";

        let params = [courriel];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const VerifierMotDePasse = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT password FROM utilisateurs WHERE courriel = $1";

        let params = [courriel];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ModifierCleApi = (courriel, nouvelleCle) => {
    return new Promise((resolve, reject) => {
        const requete = "UPDATE utilisateurs SET cle_api = $1 WHERE courriel = $2";

        let params = [nouvelleCle, courriel];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            
            resolve(resultat.rows);
        });
    });
}

const ValidationCle = async (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT * FROM utilisateurs WHERE cle_api = $1";
        const params = [cleApi];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows.length > 0);
        });
    });
};


export default {
    AfficherListeTache,
    SelectionnerId,
    SelectionnerTache,
    SelectionnerSousTache,
    AjouterTache,
    ModifierTache,
    verfierTacheExiste,
    ModifierEtatTache,
    SupprimerTache,
    AjouterSousTache,
    ModifierSousTache,
    VerifierSousTacheId,
    ModifierEtatSousTache,
    SupprimerSousTache,
    AjouterUtilisateur,
    GenererCleApi,
    RetournerCleApi,
    VerifierMotDePasse,
    ModifierCleApi
}

export { ValidationCle };