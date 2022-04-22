
# Ford Universe V2 (Back)


Ce dépôt contient la partie back du blog Ford Universe.  
L'objectif de cette refonte est de rendre le code plus maintenable et
de le rendre Open Source.
## Badges


[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC_BY--NC--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Installation

Cloner le dépôt avec git

```bash
  git clone https://github.com/VictorSpitale/ford-blog-api-v2.git
```

Ou Github CLI

```bash
  gh repo clone VictorSpitale/ford-blog-api-v2
```

## Configuration

### Base de données (MongoDB)
- Créer un compte [MongoDB](https://www.mongodb.com/fr-fr/cloud/atlas/register) gratuitement
- Suivre le [tutoriel](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) pour créer un cluster MongoDB
### Google Cloud Storage
    Uniquement nécessaire si vous voulez tester la création d'article et la mise à jour de photo de profil utilisateur
- Connecter un compte Google à [Google Cloud Platform](https://console.cloud.google.com/getting-started)
- Créer un nouveau projet
- Activer la facturation sur votre compte
- Créer un bucket sur le service Cloud Storage
- Activer l'autorisation : "Publique sur Internet" à ce bucket
- Créer un fichier JSON content les accès à votre compte de service Google en suivant ces [instructions](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=fr#iam-service-account-keys-create-console)
### Google OAuth
    Uniquement nécessaire pour permettre la connexion avec des comptes Google
- Suivre ces [instructions](https://docs.retool.com/docs/google-oauth-credentials)
### Mailing
- Créer un compte mail dédié à l'envoi de mails
- Désactiver les protections du compte ou créer un mot de passe d'application si disponible
### Redis
- Créer un compte gratuitement sur [Redis](https://app.redislabs.com/#/login)
- Créer un utilisateur dans "Data Access Control"
- Créer une base de données dans "Databases"

**ATTENTION :**
- 
Si vous utilisez Google Cloud Storage, changez le lien vers le fichier json content vos clés de service Google et le nom de votre projet dans le fichier : **src/cloud/google.service.ts** ligne 15/16.

Configurer les variables d'environnement .env

| Nom                 | Exemple                                     | Instructions                                                 |
|---------------------|---------------------------------------------|--------------------------------------------------------------|
| DB_PASSWORD         | password                                    | Mot de passe du cluster MongoDB                              | 
| DB_USER             | username                                    | Nom d'utilisateur MongoDB                                    | 
| DB_URI              | mongodb0.example.com:27017                  | Url de connexion vers la base de données MongoDB             | 
| DB_CLUSTER_NAME     | mycluster                                   | Nom du cluster de production                                 | 
| DB_NAME             | database                                    | Nom de la base de données de production                      | 
| DB_TEST_NAME        | test_database                               | Nom de la base de données utilisée pour les tests e2e        | 
| DB_DEV_NAME         | dev_database                                | Nom de la base de données utilisée en phase de développement | 
| JWT_SECRET          | secret_key                                  | Clé secrète utilisée pour générer les tokens d'accès         | 
| BUCKET_NAME         | bucket_name                                 | Nom du bucket Google Storage                                 | 
| GOOLE_CLIENT_ID     | google_client_id                            | Nom du client Google pour OAuth                              | 
| GOOGLE_SECRET       | google_secret                               | Clé secrète Google pour OAuth                                | 
| GOOGLE_CALLBACK_URL | http://url_du_back/api/auth/google/redirect | Url de redirection après l'authentification                  | 
| CLIENT_URL          | client_url                                  | Url du client front                                          | 
| MAIL_USERNAME       | mail_username                               | Nom de l'adresse email utilisé pour le mailing               | 
| MAIL_PASSWORD       | mail_password                               | Mot de passe du compte mail                                  | 
| MAIL_TO             | contact_mail_to                             | Adresse destinataire de la page contact                      | 
| REDIS_HOST          | host                                        | Url vers la base de données Redis                            | 
| REDIS_PORT          | port                                        | Port de la base de données Redis                             | 
| REDIS_USERNAME      | username                                    | Nom d'utilisateur créé sur Redis                             | 
| REDIS_PASSWORD      | password                                    | Mot de passe de l'utilisateur créé sur Redis                 | 

## Lancer le projet


Installer les dépendences

```bash
  npm install
```

Lancer le serveur de développement


```bash
  npm run start:dev
```


Lancer le serveur de production


```bash
  npm run start
```


Lancer les tests e2e


```bash
  npm run test:e2e
```





## Stack technique

**Client:** NextJS, React, TailwindCSS, ReduxToolkit, Axios, ReactSelect

**Server:** Node, NestJS, Redis, Nodemailer, Google OAuth

**CI/CD:** Google Cloud Run, Google Cloud Storage, Vercel


## Auteur

- [@VictorSpitale](https://www.github.com/VictorSpitale)


![Logo](https://storage.googleapis.com/fordblog.appspot.com/email/forduniverse.png)

