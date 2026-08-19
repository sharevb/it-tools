**Docker Swarm Mode** is Docker's native clustering and orchestration solution. It lets you manage a group of Docker nodes as a single virtual system, enabling high availability, load balancing, and simplified deployment of containerized applications.

Key features:
- Built-in orchestration with a declarative service model
- Rolling updates and rollback
- Self-healing (failed replicas are rescheduled automatically)
- Secure node-to-node communication via mutual TLS
- Built-in secrets and config distribution

> ℹ️ Swarm does **not** auto-scale based on load. Replica counts are set manually with `docker service scale` or `--replicas`.

## 📌 Swarm Initialization

Initialize a new swarm on the current node (becomes the first manager):

```bash
docker swarm init
```

If the host has multiple network interfaces, specify which one to advertise on:

```bash
docker swarm init --advertise-addr <manager-ip>
```

Show the command another node needs to join as a worker:

```bash
docker swarm join-token worker
```

Show the command for joining as a manager:

```bash
docker swarm join-token manager
```

Join an existing swarm (run on the joining node, using the output of the commands above):

```bash
docker swarm join --token <token> <manager-ip>:2377
```

Rotate join tokens (invalidates the old ones):

```bash
docker swarm join-token --rotate worker
```

Leave the swarm (on a worker):

```bash
docker swarm leave
```

Force leave (on a manager — last manager must use `--force`):

```bash
docker swarm leave --force
```

## 👥 Node Management

List nodes in the swarm:

```bash
docker node ls
```

Inspect a node:

```bash
docker node inspect <node-name> --pretty
```

Promote a worker to manager:

```bash
docker node promote <node-name>
```

Demote a manager to worker:

```bash
docker node demote <node-name>
```

Drain a node (reschedule its tasks elsewhere, prevent new scheduling):

```bash
docker node update --availability drain <node-name>
```

Pause a node (keep running tasks, prevent new ones):

```bash
docker node update --availability pause <node-name>
```

Activate a drained or paused node:

```bash
docker node update --availability active <node-name>
```

Add a label to a node (for use with placement constraints):

```bash
docker node update --label-add env=production <node-name>
```

Remove a node from the swarm (after it has left or is unreachable):

```bash
docker node rm <node-name>
```

## 🧠 Manager Nodes

Manager nodes orchestrate tasks, maintain cluster state via Raft consensus, and handle API requests. You can run multiple managers for HA, but only one is the **leader** at any time.

> ⚠️ **Use an odd number of managers** (3, 5, or 7). Raft tolerates `(N-1)/2` failures — 3 managers tolerate 1 failure, 5 tolerate 2. More than 7 hurts performance.

Show Swarm and Raft state for the local node:

```bash
docker info
```

Inspect the current node (includes manager status if applicable):

```bash
docker node inspect self --pretty
```

Enable autolock (encrypts Raft logs; managers need a key to restart):

```bash
docker swarm update --autolock=true
```

Unlock a manager after restart:

```bash
docker swarm unlock
```

Show or rotate the unlock key:

```bash
docker swarm unlock-key
docker swarm unlock-key --rotate
```

## 📦 Service Management

Create a service:

```bash
docker service create --name <service-name> <image>
```

Create a service with a fixed number of replicas:

```bash
docker service create --name <service-name> --replicas <n> <image>
```

Create a global service (one task per node):

```bash
docker service create --name <service-name> --mode global <image>
```

List services:

```bash
docker service ls
```

Inspect a service:

```bash
docker service inspect <service-name> --pretty
```

Scale a service:

```bash
docker service scale <service-name>=<n>
```

Update a service (e.g. change image):

```bash
docker service update --image <new-image> <service-name>
```

Roll back the last update:

```bash
docker service rollback <service-name>
```

Follow logs from all tasks of a service:

```bash
docker service logs -f <service-name>
```

Remove a service:

```bash
docker service rm <service-name>
```

## 🔁 Replicas

Replicas define how many instances of a service should run across the swarm. Swarm distributes them across available nodes and reschedules them if they fail.

Set replicas at create time:

```bash
docker service create --replicas 5 --name myapp myimage
```

Change replica count later:

```bash
docker service scale myapp=10
```

## 🐝 Task & Container Management

In Swarm, a **task** is a single container slot managed by Swarm. A task maps to a running container on some node.

List tasks of a service (shows which node each runs on):

```bash
docker service ps <service-name>
```

List tasks running on a specific node:

```bash
docker node ps <node-name>
```

List containers on the current node:

```bash
docker container ls
```

Inspect a container:

```bash
docker container inspect <container-id>
```

## 🌐 Networking

### What is an overlay network?

An overlay network is a virtual network that spans multiple Docker hosts. It lets containers running on different nodes communicate as if they were on the same Layer 2 network, with built-in DNS-based service discovery and encrypted traffic between nodes.

Create an overlay network:

```bash
docker network create --driver overlay <network-name>
```

Create an encrypted overlay network (encrypts data plane between nodes):

```bash
docker network create --driver overlay --opt encrypted <network-name>
```

List networks:

```bash
docker network ls
```

Inspect a network (shows attached services and containers):

```bash
docker network inspect <network-name>
```

Attach a service to a network at create time:

```bash
docker service create --name <service-name> --network <network-name> <image>
```

Attach an existing service to an additional network:

```bash
docker service update --network-add <network-name> <service-name>
```

## 🔄 Rolling Updates & Rollback

Configure update behavior at service create or update time:

```bash
docker service create \
  --name web \
  --replicas 5 \
  --update-parallelism 2 \
  --update-delay 10s \
  --update-failure-action rollback \
  --update-monitor 30s \
  nginx:1.25
```

Trigger an update by changing the image:

```bash
docker service update --image nginx:1.26 web
```

Roll back to the previous spec:

```bash
docker service rollback web
```

Update flags worth knowing:

| Flag | Description |
|------|-------------|
| `--update-parallelism` | How many tasks to update at once |
| `--update-delay` | Delay between batches |
| `--update-failure-action` | `pause`, `continue`, or `rollback` on failure |
| `--update-monitor` | Time to watch each task for failure |
| `--update-order` | `stop-first` (default) or `start-first` |

## 🔐 Secrets

Secrets are encrypted at rest in the Raft log and mounted into containers as in-memory files under `/run/secrets/`.

Create a secret from a file:

```bash
docker secret create db_password ./db_password.txt
```

Create a secret from stdin:

```bash
echo "s3cr3t" | docker secret create db_password -
```

List secrets:

```bash
docker secret ls
```

Inspect a secret (does **not** reveal the value):

```bash
docker secret inspect db_password
```

Attach a secret to a service:

```bash
docker service create --name db --secret db_password postgres:16
```

Remove a secret (only if no service uses it):

```bash
docker secret rm db_password
```

## 🔑 Configs

Configs are like secrets but **not encrypted at rest** — meant for non-sensitive config files (nginx.conf, etc.).

Create a config:

```bash
docker config create my_nginx_conf ./nginx.conf
```

List configs:

```bash
docker config ls
```

Attach a config to a service at a specific path:

```bash
docker service create \
  --name web \
  --config source=my_nginx_conf,target=/etc/nginx/nginx.conf \
  nginx
```

Remove a config:

```bash
docker config rm my_nginx_conf
```

## 📚 Stacks

A **stack** is a group of related services deployed together from a Compose file. This is the standard production workflow for Swarm.

Deploy (or update) a stack:

```bash
docker stack deploy -c stack.yaml mystack
```

List stacks:

```bash
docker stack ls
```

List services in a stack:

```bash
docker stack services mystack
```

List tasks in a stack:

```bash
docker stack ps mystack
```

Remove a stack:

```bash
docker stack rm mystack
```

Stacks honor the `deploy:` block in Compose files (replicas, placement, restart policy, update config). `build:`, top-level `restart:`, and `depends_on:` are ignored.

## 🛠 Common Flags Reference

### `docker service create` / `update`

| Flag | Description |
|------|-------------|
| `--replicas` | Number of service replicas |
| `--mode` | `replicated` (default) or `global` |
| `--publish` | Port mapping (`<host>:<container>`) |
| `--mount` | Volume mounting |
| `--network` | Attach to a network |
| `--constraint` | Node placement rule (e.g. `node.role==worker`) |
| `--placement-pref` | Spread tasks (e.g. `spread=node.labels.zone`) |
| `--limit-cpu` / `--limit-memory` | Hard resource limits |
| `--reserve-cpu` / `--reserve-memory` | Reserved resources |
| `--secret` / `--config` | Attach a secret or config |
| `--env` / `--env-file` | Environment variables |
| `--restart-condition` | `none`, `on-failure`, or `any` |

### Update-specific flags

| Flag | Description |
|------|-------------|
| `--update-parallelism` | Tasks updated in parallel |
| `--update-delay` | Delay between update batches |
| `--update-failure-action` | `pause`, `continue`, `rollback` |
| `--update-order` | `stop-first` or `start-first` |

## 📄 Example: Production-style Web Service

```bash
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  --network webnet \
  --constraint 'node.role==worker' \
  --constraint 'node.labels.env==production' \
  --update-parallelism 1 \
  --update-delay 10s \
  --update-failure-action rollback \
  --limit-memory 512m \
  --reserve-memory 256m \
  nginx:1.25
```

## 📚 Resources

- [Swarm mode overview](https://docs.docker.com/engine/swarm/)
- [Swarm services](https://docs.docker.com/engine/swarm/services/)
- [Manage secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Manage configs](https://docs.docker.com/engine/swarm/configs/)
- [Stack file reference (Compose Spec `deploy:`)](https://docs.docker.com/compose/compose-file/deploy/)
