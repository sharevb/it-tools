**Docker Swarm mode** is Docker's native clustering and orchestration solution. It turns a group of Docker hosts into a single virtual system with high availability, load balancing and a declarative deployment model — using the CLI you already know.

- Built-in orchestration with a declarative service model
- Rolling updates and one-command rollback
- Self-healing: failed replicas are rescheduled automatically
- Secure node-to-node communication over mutual TLS, rotated automatically
- Secrets and configs distributed straight from the cluster store

> ℹ️ Swarm does **not** auto-scale on load. Replica counts are set manually with `--replicas` or `docker service scale`.

## 🧱 Concepts

| Term        | What it is                                                        |
|-------------|-------------------------------------------------------------------|
| **Node**    | A Docker engine that joined the swarm — a *manager* or a *worker* |
| **Manager** | Keeps cluster state via Raft, schedules tasks, serves the API     |
| **Worker**  | Runs tasks only; has no view of the cluster state                 |
| **Service** | The declaration of what should run (image, replicas, ports, …)    |
| **Task**    | One container slot of a service, scheduled onto a node            |
| **Stack**   | A group of services deployed together from a Compose file         |

## 📌 Swarm Initialization

```bash
# initialize a swarm; this node becomes the first manager
docker swarm init

# pick the interface to advertise on multi-homed hosts
docker swarm init --advertise-addr <manager-ip>

# address pool for the overlay networks
docker swarm init --default-addr-pool 10.20.0.0/16

# print the command a worker needs to join
docker swarm join-token worker

# print the command a manager needs to join
docker swarm join-token manager

# run on the joining node
docker swarm join --token <token> <manager-ip>:2377

# rotate a token, invalidating the old one
docker swarm join-token --rotate worker

# leave the swarm (on a worker)
docker swarm leave

# leave on a manager, or on the last node
docker swarm leave --force

# keep fewer terminated tasks per service
docker swarm update --task-history-limit 5

# lifetime of the node certificates
docker swarm update --cert-expiry 720h

# rotate the swarm certificate authority
docker swarm ca --rotate
```

### 🔌 Ports that must be open between nodes

| Port                   | Protocol  | Used for                             |
|------------------------|-----------|--------------------------------------|
| `2377`                 | TCP       | Cluster management (managers only)   |
| `7946`                 | TCP + UDP | Node discovery and gossip            |
| `4789`                 | UDP       | Overlay network data plane (VXLAN)   |
| IP protocol `50` (ESP) | —         | Only with encrypted overlay networks |

## 👥 Node Management

```bash
# list the nodes of the swarm
docker node ls

# filter by role, id, name, label, membership
docker node ls --filter role=manager

# readable summary of one node
docker node inspect <node> --pretty

# a single field via a Go template
docker node inspect -f '{{.Status.State}}' <node>

# worker  → manager
docker node promote <node>

# manager → worker
docker node demote <node>

# move tasks off and stop scheduling new ones
docker node update --availability drain <node>

# keep running tasks, schedule nothing new
docker node update --availability pause <node>

# bring a drained or paused node back
docker node update --availability active <node>

# label a node for placement constraints
docker node update --label-add env=production <node>

# remove a label again
docker node update --label-rm env <node>

# tasks running on a node
docker node ps <node>

# remove a node that already left
docker node rm <node>

# remove an unreachable node
docker node rm --force <node>
```

> 💡 Drain a node before maintenance (`--availability drain`), then set it back to `active`. Swarm reschedules the tasks for you.

## 🧠 Manager Nodes & Raft

Managers orchestrate tasks, maintain the cluster state through Raft consensus and serve the API. Several managers give you high availability, but only one is the **leader** at a time.

> ⚠️ **Use an odd number of managers** (3, 5 or 7). Raft tolerates `(N-1)/2` failures — 3 managers survive 1 loss, 5 survive 2. Beyond 7 the consensus overhead outweighs the benefit.

```bash
# swarm and Raft state of the local node
docker info

# details of the current node, manager status included
docker node inspect self --pretty

# encrypt the Raft logs at rest
docker swarm update --autolock=true

# unlock a manager after a restart
docker swarm unlock

# show the current unlock key
docker swarm unlock-key

# rotate it
docker swarm unlock-key --rotate
```

## 📦 Service Management

```bash
# create a service
docker service create --name <service> <image>

# create a service with a fixed replica count
docker service create --name <service> --replicas <n> <image>

# create a global service: one task on every node
docker service create --name <service> --mode global <image>

# list services
docker service ls

# filter the list
docker service ls --filter name=<service>

# readable service definition
docker service inspect <service> --pretty

# tasks and the nodes they run on
docker service ps <service>

# change the replica count
docker service scale <service>=<n>

# scale several services at once
docker service scale <svc-a>=3 <svc-b>=5

# roll out a new image
docker service update --image <new-image> <service>

# redistribute tasks without changing anything
docker service update --force <service>

# go back to the previous definition
docker service rollback <service>

# follow the logs of every task
docker service logs -f <service>

# recent output only
docker service logs --tail 100 --since 10m <service>

# remove a service
docker service rm <service>
```

### Changing a running service

```bash
# add or replace an environment variable
docker service update --env-add KEY=value <service>

# remove one
docker service update --env-rm KEY <service>

# publish another port
docker service update --publish-add 8080:80 <service>

# stop publishing it
docker service update --publish-rm 8080 <service>

# attach a volume
docker service update --mount-add type=volume,src=data,dst=/data <service>

# detach it again, by target path
docker service update --mount-rm /data <service>

# add a placement constraint
docker service update --constraint-add 'node.labels.env==prod' <service>

# at most one task per node
docker service update --replicas-max-per-node 1 <service>

# change the resource limits
docker service update --limit-memory 512m --reserve-memory 256m <service>
```

## 🔁 Replicas & Modes

Replicas define how many instances of a service run across the swarm. Swarm spreads them over the available nodes and reschedules them when a task or a node fails.

| Mode           | Flag                          | Behaviour                                         |
|----------------|-------------------------------|---------------------------------------------------|
| Replicated     | `--mode replicated` (default) | Run exactly `--replicas` tasks, anywhere they fit |
| Global         | `--mode global`               | Exactly one task per eligible node                |
| Replicated job | `--mode replicated-job`       | Run `--replicas` tasks **to completion**          |
| Global job     | `--mode global-job`           | Run one task to completion on every node          |

```bash
# five tasks
docker service create --replicas 5 --name myapp myimage

# scale the same service up to ten
docker service scale myapp=10

# one per node
docker service create --mode global --name agent myimage

# batch job: 20 tasks in total, 4 running at a time
docker service create --mode replicated-job --replicas 20 \
  --max-concurrent 4 --name migrate myimage
```

## 🐝 Tasks & Containers

A **task** is a single container slot managed by Swarm; it maps to one container on one node and is never moved — a failed task is replaced by a new one.

```bash
# tasks of a service, with their node
docker service ps <service>

# full error messages — start debugging here
docker service ps --no-trunc <service>

# hide the terminated tasks
docker service ps -f "desired-state=running" <service>

# tasks on one node
docker node ps <node>

# containers on the current node
docker container ls

# low-level details of one container
docker container inspect <container-id>
```

| Task state               | Meaning                                                     |
|--------------------------|-------------------------------------------------------------|
| `NEW` / `PENDING`        | Accepted, waiting for a node that satisfies the constraints |
| `ASSIGNED` / `PREPARING` | Sent to a node, image being pulled                          |
| `STARTING` / `RUNNING`   | The container is starting or up                             |
| `COMPLETE`               | A job task finished successfully                            |
| `FAILED`                 | The container exited with an error                          |
| `SHUTDOWN`               | Stopped on purpose (update, drain, scale down)              |
| `REJECTED`               | The node refused the task (missing image, bad mount)        |
| `ORPHANED`               | The node has been unreachable too long                      |

## 🎯 Placement

```bash
docker service create --constraint 'node.role==worker' --name web nginx

docker service create --constraint 'node.labels.env==production' --name api myimage

docker service create --placement-pref 'spread=node.labels.zone' --name web nginx

docker service create --replicas-max-per-node 1 --name web nginx
```

| Expression                                | Matches                                           |
|-------------------------------------------|---------------------------------------------------|
| `node.role`                               | `manager` or `worker`                             |
| `node.hostname`                           | The node's hostname                               |
| `node.id`                                 | The node's ID                                     |
| `node.labels.<key>`                       | A label set with `docker node update --label-add` |
| `engine.labels.<key>`                     | A label set in the engine's `daemon.json`         |
| `node.platform.os` / `node.platform.arch` | `linux`, `windows` / `amd64`, `arm64`             |

## 🌐 Networking

An **overlay network** is a virtual network spanning multiple Docker hosts. Containers on different nodes talk as if they were on the same L2 segment, with DNS-based service discovery built in.

```bash
# create an overlay network
docker network create --driver overlay <network>

# encrypt the data plane too
docker network create --driver overlay --opt encrypted <network>

# let standalone containers join
docker network create --driver overlay --attachable <network>

# list networks
docker network ls

# attached services and containers
docker network inspect <network>

# attach at creation time
docker service create --name <service> --network <network> <image>

# attach an existing service
docker service update --network-add <network> <service>

# detach it again
docker service update --network-rm <network> <service>
```

### Publishing ports

```bash
# routing mesh (ingress)
docker service create --publish 8080:80 --name web nginx

# host port, no mesh
docker service create --publish mode=host,target=80,published=8080 --name web nginx
```

| Mode                | Behaviour                                                                  |
|---------------------|----------------------------------------------------------------------------|
| `ingress` (default) | Every node accepts the port and load-balances to the tasks                 |
| `host`              | The port is published only on nodes running a task — no mesh, no extra hop |

## 🔄 Rolling Updates & Rollback

```bash
docker service create \
  --name web \
  --replicas 5 \
  --update-parallelism 2 \
  --update-delay 10s \
  --update-failure-action rollback \
  --update-monitor 30s \
  nginx:1.25

# trigger the rolling update
docker service update --image nginx:1.26 web

# return to the previous definition
docker service rollback web
```

| Flag                      | Description                                                                                                                  |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `--update-parallelism`    | How many tasks are updated at once (`0` = all)                                                                               |
| `--update-delay`          | Pause between batches                                                                                                        |
| `--update-failure-action` | `pause` (default), `continue` or `rollback`                                                                                  |
| `--update-monitor`        | How long a task is watched before it counts as healthy                                                                       |
| `--update-order`          | `stop-first` (default) or `start-first`                                                                                      |
| `--rollback-parallelism`  | Same knobs for the rollback path (`--rollback-delay`, `--rollback-monitor`, `--rollback-failure-action`, `--rollback-order`) |

## 🩺 Health Checks

Swarm reschedules a task as soon as its health check fails, so an update never marks a broken image as healthy.

```bash
docker service create \
  --name api \
  --health-cmd 'curl -f http://localhost:8080/health || exit 1' \
  --health-interval 10s \
  --health-timeout 3s \
  --health-retries 3 \
  --health-start-period 30s \
  myimage
```

## 🔐 Secrets

Secrets are encrypted in the Raft log and mounted into the container as in-memory files under `/run/secrets/`.

```bash
# create from a file
docker secret create db_password ./db_password.txt

# create from stdin
echo "s3cr3t" | docker secret create db_password -

# list secrets
docker secret ls

# metadata only — never the value
docker secret inspect db_password

# attach a secret; it appears at /run/secrets/db_password
docker service create --name db --secret db_password postgres:16

# ...or mount it at a custom path with a fixed mode
docker service create --name db \
  --secret source=db_password,target=/run/secrets/pg_pw,mode=0400 postgres:16

# only possible when no service uses it
docker secret rm db_password
```

Rotating a secret — create the new one, swap it, then drop the old one:

```bash
echo "n3w-s3cr3t" | docker secret create db_password_v2 -

docker service update \
  --secret-rm db_password \
  --secret-add source=db_password_v2,target=db_password \
  db

docker secret rm db_password
```

## 🔑 Configs

Configs work like secrets but are **not encrypted at rest** — use them for non-sensitive files such as `nginx.conf`.

```bash
# create a config
docker config create my_nginx_conf ./nginx.conf

# list configs
docker config ls

# metadata and the stored content
docker config inspect my_nginx_conf

# mount a config at a specific path
docker service create \
  --name web \
  --config source=my_nginx_conf,target=/etc/nginx/nginx.conf \
  nginx

# swap in a new version of the config
docker service update \
  --config-rm my_nginx_conf \
  --config-add source=my_nginx_conf_v2,target=/etc/nginx/nginx.conf \
  web

# only when no service uses it
docker config rm my_nginx_conf
```

## 📚 Stacks

A **stack** is a group of related services deployed together from a Compose file — the standard production workflow for Swarm.

```bash
# deploy or update a stack
docker stack deploy -c stack.yaml mystack

# pass your registry credentials along
docker stack deploy -c stack.yaml --with-registry-auth mystack

# remove services no longer in the file
docker stack deploy -c stack.yaml --prune mystack

# list stacks
docker stack ls

# services of a stack
docker stack services mystack

# tasks of a stack
docker stack ps mystack

# tasks of a stack, with full error messages
docker stack ps --no-trunc mystack

# print the merged, resolved file
docker stack config -c stack.yaml

# remove the whole stack
docker stack rm mystack
```

Stacks honour the `deploy:` block of the Compose file (replicas, placement, resources, restart policy, update config). `build:`, top-level `restart:` and `depends_on:` are ignored.

## 🧯 Troubleshooting

```bash
# the error column tells you why a task died
docker service ps --no-trunc <service>

# application output of every task
docker service logs --tail 200 <service>

# is a node Down or Unreachable?
docker node ls

# what was actually deployed
docker service inspect --pretty <service>

# live stream of orchestration events
docker events --filter type=service
```

| Symptom                              | Usual cause                                                                          |
|--------------------------------------|--------------------------------------------------------------------------------------|
| Task stuck in `PENDING`              | No node satisfies the constraints, ports, or resource reservations                   |
| `no suitable node`                   | Placement constraint or `--replicas-max-per-node` cannot be met                      |
| Task loops `FAILED` → `STARTING`     | The container exits immediately — read `docker service logs`                         |
| `REJECTED` with an image error       | The image is missing on that node; use `--with-registry-auth` for private registries |
| Service unreachable from other nodes | Ports `7946`/`4789` blocked, or the services are not on the same overlay network     |

## 🛠 Common Flags Reference

### `docker service create` / `docker service update`

| Flag                                 | Description                                                      |
|--------------------------------------|------------------------------------------------------------------|
| `--replicas`                         | Number of tasks for a replicated service                         |
| `--mode`                             | `replicated` (default), `global`, `replicated-job`, `global-job` |
| `--publish`                          | Port mapping (`<published>:<target>`, or `mode=host,...`)        |
| `--mount`                            | Attach a volume or bind mount                                    |
| `--network`                          | Attach to an overlay network                                     |
| `--constraint`                       | Placement rule, e.g. `node.role==worker`                         |
| `--placement-pref`                   | Spread tasks, e.g. `spread=node.labels.zone`                     |
| `--replicas-max-per-node`            | Cap the tasks of this service per node                           |
| `--limit-cpu` / `--limit-memory`     | Hard resource limits                                             |
| `--reserve-cpu` / `--reserve-memory` | Resources reserved for scheduling                                |
| `--secret` / `--config`              | Attach a secret or a config                                      |
| `--env` / `--env-file`               | Environment variables                                            |
| `--restart-condition`                | `none`, `on-failure` or `any` (default)                          |
| `--health-cmd` and friends           | Override the image health check                                  |
| `--with-registry-auth`               | Forward registry credentials to the nodes                        |

## 📄 Example: Production-style Web Service

```bash
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  --network webnet \
  --constraint 'node.role==worker' \
  --constraint 'node.labels.env==production' \
  --placement-pref 'spread=node.labels.zone' \
  --update-parallelism 1 \
  --update-delay 10s \
  --update-failure-action rollback \
  --update-order start-first \
  --limit-memory 512m \
  --reserve-memory 256m \
  --restart-condition any \
  nginx:1.25
```

## 📚 Resources

- [Swarm mode overview](https://docs.docker.com/engine/swarm/)
- [Swarm services](https://docs.docker.com/engine/swarm/services/)
- [Manage secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Manage configs](https://docs.docker.com/engine/swarm/configs/)
- [Stack file reference (Compose Spec `deploy:`)](https://docs.docker.com/reference/compose-file/deploy/)
- [`docker service create` CLI reference](https://docs.docker.com/reference/cli/docker/service/create/)
