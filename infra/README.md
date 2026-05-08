# Infrastructure Frenchy Tiny Houses

Configurations versionnées de l'infrastructure de prod (nginx, plus tard
systemd / certbot timers / etc).

> **Source de vérité** : ce dossier. Les fichiers déposés dans
> `/etc/nginx/sites-available/` du VPS sont des copies — ne **jamais** les
> éditer en place.

## Vhosts nginx

- `nginx/frenchytinyhouses.conf` — vhost public
- `nginx/invest.frenchytinyhouses.conf` — vhost investisseurs (Basic Auth)

## Procédure d'installation initiale (une fois)

### 1 — DNS

Pointer ces enregistrements vers l'IP du VPS (chez le registrar du domaine
`frenchytinyhouses.fr`) :

| Hôte                     | Type | Cible    |
| ------------------------ | ---- | -------- |
| `frenchytinyhouses.fr`   | A    | <IP VPS> |
| `www`                    | A    | <IP VPS> |
| `invest`                 | A    | <IP VPS> |

Vérifier la propagation : `dig +short frenchytinyhouses.fr` doit renvoyer
l'IP du VPS (peut prendre quelques minutes à quelques heures).

### 2 — Installer nginx + certbot

Sur le VPS :

```bash
apt update && apt install -y nginx certbot python3-certbot-nginx apache2-utils
```

(`apache2-utils` fournit `htpasswd`.)

### 3 — Créer le fichier htpasswd pour la zone investisseurs

```bash
htpasswd -c /etc/nginx/htpasswd-invest invest
```

Saisir le mot de passe deux fois. C'est ce login (`invest`) + ce mot de passe
qui seront partagés aux investisseurs prospects.

Pour le rotater plus tard, même commande sans le `-c` (il écrasera juste
l'utilisateur existant).

### 4 — Déployer les vhosts

Depuis `/var/www/frenchytinyhouses/` (le repo cloné) :

```bash
cp infra/nginx/frenchytinyhouses.conf       /etc/nginx/sites-available/
cp infra/nginx/invest.frenchytinyhouses.conf /etc/nginx/sites-available/

ln -sf /etc/nginx/sites-available/frenchytinyhouses.conf       /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/invest.frenchytinyhouses.conf /etc/nginx/sites-enabled/

# Désactiver le site default si présent
rm -f /etc/nginx/sites-enabled/default

# Test syntaxe puis reload
nginx -t && systemctl reload nginx
```

À ce stade le site répond en HTTP : `curl -I http://frenchytinyhouses.fr`
doit retourner `200 OK`.

### 5 — Activer HTTPS (Let's Encrypt)

```bash
certbot --nginx \
  -d frenchytinyhouses.fr \
  -d www.frenchytinyhouses.fr \
  -d invest.frenchytinyhouses.fr \
  --agree-tos --email contact@frenchytinyhouses.fr --no-eff-email --redirect
```

Certbot va :
- obtenir les certificats
- modifier les vhosts pour ajouter les blocs `listen 443 ssl` et la redirection
  HTTP → HTTPS
- installer un timer systemd qui renouvelle automatiquement avant expiration

Vérifier ensuite : `certbot renew --dry-run` doit dire `Congratulations, all
simulated renewals succeeded`.

### 6 — Vérification finale

```bash
curl -I https://frenchytinyhouses.fr/
curl -I https://invest.frenchytinyhouses.fr/        # → 401 sans creds
curl -I -u invest:<MDP> https://invest.frenchytinyhouses.fr/   # → 302 vers /investisseurs/
```

## Procédure de mise à jour de la config nginx

Quand on modifie un `.conf` dans `infra/nginx/` :

```bash
cd /var/www/frenchytinyhouses
git pull
cp infra/nginx/*.conf /etc/nginx/sites-available/
nginx -t && systemctl reload nginx
```

(Note : si certbot a ajouté des blocs TLS dans les fichiers de
`/etc/nginx/sites-available/`, un simple `cp` les écrasera. Soit on
re-relance certbot après — il détecte que les certs existent et n'ajoute que
les blocs manquants — soit on factorise le TLS dans un snippet à inclure.
Pour l'instant : on relance certbot après chaque màj de vhost.)

## Procédure de mise à jour du build

```bash
cd /var/www/frenchytinyhouses
git pull
npm install
npm run build
```

Pas besoin de reload nginx — il sert le contenu de `dist/` à chaque requête.

Cette procédure sera automatisée en Phase 1c partie 2 via GitHub Actions.
