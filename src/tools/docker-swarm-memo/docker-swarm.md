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
docker swarm init                                    # initialize a swarm; this node becomes the first manager
docker swarm init --advertise-addr <manager-ip>      # pick the interface to advertise on multi-homed hosts
docker swarm init --default-addr-pool 10.20.0.0/16   # address pool for the overlay networks
docker swarm join-token worker                       # print the command a worker needs to join
docker swarm join-token manager                      # print the command a manager needs to join
docker swarm join --token <token> <manager-ip>:2377  # run on the joining node
docker swarm join-token --rotate worker              # rotate a token, invalidating the old one
docker swarm leave                                   # leave the swarm (on a worker)
docker swarm leave --force                           # leave on a manager, or on the last node
docker swarm update --task-history-limit 5           # keep fewer terminated tasks per service
docker swarm update --cert-expiry 720h               # lifetime of the node certificates
docker swarm ca --rotate                             # rotate the swarm certificate authority
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
docker node ls                                        # list the nodes of the swarm
docker node ls --filter role=manager                  # filter by role, id, name, label, membership
docker node inspect <node> --pretty                   # readable summary of one node
docker node inspect -f '{{.Status.State}}' <node>     # a single field via a Go template
docker node promote <node>                            # worker  → manager
docker node demote <node>                             # manager → worker
docker node update --availability drain <node>        # move tasks off and stop scheduling new ones
docker node update --availability pause <node>        # keep running tasks, schedule nothing new
docker node update --availability active <node>       # bring a drained or paused node back
docker node update --label-add env=production <node>  # label a node for placement constraints
docker node update --label-rm env <node>              # remove a label again
docker node ps <node>                                 # tasks running on a node
docker node rm <node>                                 # remove a node that already left
docker node rm --force <node>                         # remove an unreachable node
```

> 💡 Drain a node before maintenance (`--availability drain`), then set it back to `active`. Swarm reschedules the tasks for you.

## 🧠 Manager Nodes & Raft

Managers orchestrate tasks, maintain the cluster state through Raft consensus and serve the API. Several managers give you high availability, but only one is the **leader** at a time.

> ⚠️ **Use an odd number of managers** (3, 5 or 7). Raft tolerates `(N-1)/2` failures — 3 managers survive 1 loss, 5 survive 2. Beyond 7 the consensus overhead outweighs the benefit.

```bash
docker info                          # swarm and Raft state of the local node
docker node inspect self --pretty    # details of the current node, manager status included
docker swarm update --autolock=true  # encrypt the Raft logs at rest
docker swarm unlock                  # unlock a manager after a restart
docker swarm unlock-key              # show the current unlock key
docker swarm unlock-key --rotate     # rotate it
```

## 📦 Service Management

```bash
docker service create --name <service> <image>                 # create a service
docker service create --name <service> --replicas <n> <image>  # ...with a fixed replica count
docker service create --name <service> --mode global <image>   # ...one task on every node
docker service ls                                              # list services
docker service ls --filter name=<service>                      # filter the list
docker service inspect <service> --pretty                      # readable service definition
docker service ps <service>                                    # tasks and the nodes they run on
docker service scale <service>=<n>                             # change the replica count
docker service scale <svc-a>=3 <svc-b>=5                       # scale several services at once
docker service update --image <new-image> <service>            # roll out a new image
docker service update --force <service>                        # redistribute tasks without changing anything
docker service rollback <service>                              # go back to the previous definition
docker service logs -f <service>                               # follow the logs of every task
docker service logs --tail 100 --since 10m <service>           # recent output only
docker service rm <service>                                    # remove a service
```

### Changing a running service

```bash
docker service update --env-add KEY=value <service>        # add or replace an environment variable
docker service update --env-rm KEY <service>               # remove one
docker service update --publish-add 8080:80 <service>      # publish another port
docker service update --publish-rm 8080 <service>          # stop publishing it
docker service update --mount-add type=volume,src=data,dst=/data <service>
docker service update --mount-rm /data <service>
docker service update --constraint-add 'node.labels.env==prod' <service>
docker service update --replicas-max-per-node 1 <service>  # at most one task per node
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
docker service create --replicas 5 --name myapp myimage   # five tasks
docker service scale myapp=10                             # ...now ten
docker service create --mode global --name agent myimage  # one per node

# batch job: 20 tasks in total, 4 running at a time
docker service create --mode replicated-job --replicas 20 \
  --max-concurrent 4 --name migrate myimage
```

## 🐝 Tasks & Containers

A **task** is a single container slot managed by Swarm; it maps to one container on one node and is never moved — a failed task is replaced by a new one.

```bash
docker service ps <service>                             # tasks of a service, with their node
docker service ps --no-trunc <service>                  # full error messages — start debugging here
docker service ps -f "desired-state=running" <service>  # hide the terminated tasks
docker node ps <node>                                   # tasks on one node
docker container ls                                     # containers on the current node
docker container inspect <container-id>                 # low-level details of one container
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
docker network create --driver overlay <network>                    # create an overlay network
docker network create --driver overlay --opt encrypted <network>    # encrypt the data plane too
docker network create --driver overlay --attachable <network>       # let standalone containers join
docker network ls                                                   # list networks
docker network inspect <network>                                    # attached services and containers
docker service create --name <service> --network <network> <image>  # attach at creation time
docker service update --network-add <network> <service>             # attach an existing service
docker service update --network-rm <network> <service>              # detach it again
```

### Publishing ports

```bash
docker service create --publish 8080:80 --name web nginx                             # routing mesh (ingress)
docker service create --publish mode=host,target=80,published=8080 --name web nginx  # host port, no mesh
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

docker service update --image nginx:1.26 web  # trigger the rolling update
docker service rollback web                   # return to the previous definition
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
docker secret create db_password ./db_password.txt  # create from a file
echo "s3cr3t" | docker secret create db_password -  # create from stdin
docker secret ls                                    # list secrets
docker secret inspect db_password                   # metadata only — never the value
docker service create --name db --secret db_password postgres:16
docker service create --name db \
  --secret source=db_password,target=/run/secrets/pg_pw,mode=0400 postgres:16
docker secret rm db_password                        # only possible when no service uses it
```

Rotating a secret — create the new one, swap it, then drop the old one:

```bash
echo "n3w-s3cr3t" | docker secret create db_password_v2 -
docker service update --secret-rm db_password --secret-add source=db_password_v2,target=db_password db
docker secret rm db_password
```

## 🔑 Configs

Configs work like secrets but are **not encrypted at rest** — use them for non-sensitive files such as `nginx.conf`.

```bash
docker config create my_nginx_conf ./nginx.conf  # create a config
docker config ls                                 # list configs
docker config inspect my_nginx_conf              # metadata and the stored content
docker service create \
  --name web \
  --config source=my_nginx_conf,target=/etc/nginx/nginx.conf \
  nginx
docker service update --config-rm my_nginx_conf --config-add source=my_nginx_conf_v2,target=/etc/nginx/nginx.conf web
docker config rm my_nginx_conf                   # only when no service uses it
```

## 📚 Stacks

A **stack** is a group of related services deployed together from a Compose file — the standard production workflow for Swarm.

```bash
docker stack deploy -c stack.yaml mystack                       # deploy or update a stack
docker stack deploy -c stack.yaml --with-registry-auth mystack  # pass your registry credentials along
docker stack deploy -c stack.yaml --prune mystack               # remove services no longer in the file
docker stack ls                                                 # list stacks
docker stack services mystack                                   # services of a stack
docker stack ps mystack                                         # tasks of a stack
docker stack ps --no-trunc mystack                              # ...with full error messages
docker stack config -c stack.yaml                               # print the merged, resolved file
docker stack rm mystack                                         # remove the whole stack
```

Stacks honour the `deploy:` block of the Compose file (replicas, placement, resources, restart policy, update config). `build:`, top-level `restart:` and `depends_on:` are ignored.

## 🧯 Troubleshooting

```bash
docker service ps --no-trunc <service>     # the error column tells you why a task died
docker service logs --tail 200 <service>   # application output of every task
docker node ls                             # is a node Down or Unreachable?
docker service inspect --pretty <service>  # what was actually deployed
docker events --filter type=service        # live stream of orchestration events
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
