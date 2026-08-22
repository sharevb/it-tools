**kubectl** is the CLI for the Kubernetes API. Almost every command follows the same shape: `kubectl <verb> <resource> <name> [flags]` — `get pods`, `describe node web-1`, `delete deployment api`.

> 💡 Set up completion and an alias once and everything below gets shorter: `source <(kubectl completion bash)`, `alias k=kubectl`, `complete -o default -F __start_kubectl k`.

## ⚙️ Configuration & Context

```bash
# show the merged kubeconfig
kubectl config view

# read a single value out of it
kubectl config view -o jsonpath='{.clusters[*].name}'

# which cluster am I talking to?
kubectl config current-context

# list every context
kubectl config get-contexts

# switch clusters
kubectl config use-context <context>

# change the default namespace for this context
kubectl config set-context --current --namespace=<namespace>

# use a different kubeconfig for one command
KUBECONFIG=~/.kube/staging.yaml kubectl get nodes

# shell completion (bash; use 'zsh' or 'fish' as needed)
source <(kubectl completion bash)
```

## 🔍 Viewing & Finding Resources

```bash
# the everyday listing
kubectl get pods
kubectl get pods -o wide
kubectl get pods --all-namespaces

# every kind of resource in a namespace
kubectl get all -n <namespace>

# full definition, as stored by the API server
kubectl get pod <pod> -o yaml

# just the fields you care about
kubectl get pods -o custom-columns='NAME:.metadata.name,NODE:.spec.nodeName'

# pull one value out with JSONPath
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# filter by label, or by field
kubectl get pods -l app=nginx,tier=frontend
kubectl get pods --field-selector status.phase=Running

# sort the output
kubectl get services --sort-by=.metadata.name
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# watch changes as they happen
kubectl get pods -w

# events, newest last — the first place to look when something is stuck
kubectl get events --sort-by=.lastTimestamp

# the long-form story of one object
kubectl describe pod <pod>

# what resources exist, and what are their short names?
kubectl api-resources

# what fields does this kind have?
kubectl explain deployment.spec.template.spec.containers
```

## 🚀 Creating, Applying & Deleting

```bash
# apply a manifest, creating or updating as needed
kubectl apply -f ./manifest.yaml

# apply everything in a directory, recursively
kubectl apply -R -f ./k8s/

# apply a kustomize overlay
kubectl apply -k ./overlays/production

# generate a manifest instead of creating anything
kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml

# quick one-off objects
kubectl create deployment web --image=nginx:1.27
kubectl run debug --image=busybox -it --rm -- sh
kubectl expose deployment web --port=80 --target-port=8080 --type=ClusterIP

# see what an apply would change before doing it
kubectl diff -f ./manifest.yaml

# edit an object in your $EDITOR
kubectl edit deployment web

# change one field without an editor
kubectl patch deployment web -p '{"spec":{"replicas":4}}'

# delete
kubectl delete -f ./manifest.yaml
kubectl delete pod <pod> --grace-period=0 --force
```

## 📈 Scaling & Rollouts

```bash
# scale a deployment, or scale from the manifest
kubectl scale deployment web --replicas=3
kubectl scale --replicas=3 -f web.yaml

# only scale if it currently has 3 replicas
kubectl scale --current-replicas=3 --replicas=5 deployment/web

# horizontal autoscaling
kubectl autoscale deployment web --min=2 --max=10 --cpu-percent=70

# roll out a new image
kubectl set image deployment/web nginx=nginx:1.27

# watch the rollout
kubectl rollout status deployment/web

# rollout history, and going back
kubectl rollout history deployment/web
kubectl rollout undo deployment/web
kubectl rollout undo deployment/web --to-revision=2

# restart every pod of a deployment (picks up new config or secrets)
kubectl rollout restart deployment/web

# pause and resume a rollout
kubectl rollout pause deployment/web
kubectl rollout resume deployment/web
```

## 📜 Logs & Debugging

```bash
# logs of a pod
kubectl logs <pod>

# follow them
kubectl logs -f <pod>

# a specific container in a multi-container pod
kubectl logs -f <pod> -c <container>

# what the previous, crashed container printed
kubectl logs <pod> --previous

# recent output only
kubectl logs <pod> --since=10m --tail=100

# logs from every pod behind a label
kubectl logs -l app=web --all-containers --max-log-requests=10

# a shell inside a running container
kubectl exec -it <pod> -- sh
kubectl exec -it <pod> -c <container> -- bash

# a one-off command
kubectl exec <pod> -- env

# copy files in and out
kubectl cp <pod>:/var/log/app.log ./app.log
kubectl cp ./config.yaml <pod>:/etc/app/config.yaml

# reach a service or pod from your laptop
kubectl port-forward pod/<pod> 8080:80
kubectl port-forward svc/<service> 8080:80

# attach a debug container to a running pod (distroless-friendly)
kubectl debug -it <pod> --image=busybox --target=<container>

# a throwaway pod on a specific node
kubectl debug node/<node> -it --image=busybox

# resource usage (needs metrics-server)
kubectl top node
kubectl top pod
kubectl top pod <pod> --containers
```

## 🔐 Secrets & ConfigMaps

```bash
# create a secret from literals or files
kubectl create secret generic db-creds \
  --from-literal=username=jane \
  --from-literal=password=s3cr3t
kubectl create secret generic tls-key --from-file=./tls.key

# a registry pull secret
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io --docker-username=<user> --docker-password=<token>

# configmaps work the same way
kubectl create configmap app-config --from-file=./config.yaml
kubectl create configmap app-config --from-literal=LOG_LEVEL=debug

# read a secret back (values are base64)
kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d

# every key at once
kubectl get secret db-creds -o go-template='{{range $k,$v := .data}}{{$k}}={{$v | base64decode}}{{"\n"}}{{end}}'
```

## 🏷 Labels, Annotations & Namespaces

```bash
# add or change a label (--overwrite to replace an existing one)
kubectl label pod <pod> env=prod --overwrite

# remove a label
kubectl label pod <pod> env-

# annotations work the same way
kubectl annotate deployment web kubernetes.io/change-cause="bump to 1.27"

# show the labels in the listing
kubectl get pods --show-labels

# namespaces
kubectl get namespaces
kubectl create namespace staging
kubectl delete namespace staging
```

## 🖥 Nodes & Cluster

```bash
# nodes and their state
kubectl get nodes -o wide
kubectl describe node <node>

# stop scheduling new pods onto a node
kubectl cordon <node>

# evict the pods and prepare for maintenance
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data

# put it back into service
kubectl uncordon <node>

# keep pods off a node unless they tolerate the taint
kubectl taint nodes <node> key=value:NoSchedule

# where is the control plane?
kubectl cluster-info

# what API versions does the cluster serve?
kubectl api-versions

# am I allowed to do this?
kubectl auth can-i create deployments --namespace production
```

## 🧰 Handy One-Liners

```bash
# every pod that is not Running
kubectl get pods -A --field-selector=status.phase!=Running

# the ten pods that restarted most
kubectl get pods -A --sort-by='.status.containerStatuses[0].restartCount' | tail -10

# clean up evicted pods
kubectl get pods -A --field-selector=status.phase=Failed -o name | xargs -r kubectl delete

# which node is each pod on
kubectl get pods -o custom-columns='POD:.metadata.name,NODE:.spec.nodeName'

# images running in the cluster
kubectl get pods -A -o jsonpath='{.items[*].spec.containers[*].image}' | tr ' ' '\n' | sort -u

# run a command in several pods
for pod in $(kubectl get pods -l app=web -o name); do kubectl exec "$pod" -- hostname; done

# apply a manifest straight from a heredoc
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: demo
data:
  LOG_LEVEL: debug
EOF
```

## 📚 Resources

- [kubectl reference](https://kubernetes.io/docs/reference/kubectl/)
- [kubectl quick reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [Documentation home](https://kubernetes.io/docs/home/)
- [JSONPath support in kubectl](https://kubernetes.io/docs/reference/kubectl/jsonpath/)

Original cheat sheet: https://github.com/LeCoupa/awesome-cheatsheets
