// Importation du client Prisma
import { PrismaClient } from "@prisma/client";

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction principale asynchrone
async function main() {
    try {
        // Création d'un nouvel utilisateur avec les données spécifiées
        const user = await prisma.user.create({
            data: {
                firstName: "admin",
                lastName: "admin",
                email: "admin@admin.com"
            }
        });

        // Affichage de l'utilisateur créé
        console.log("Utilisateur créé :", user);
    } catch (error) {
        // Gestion des erreurs
        console.error("Erreur lors de la création de l'utilisateur :", error);
    } finally {
        // Fermeture de la connexion Prisma
        await prisma.$disconnect();
    }
}

main();
