# Kubernetes

* PDF：https://sematext.com/kubernetes-cheat-sheet/
* 官网：https://kubernetes.io/
* 文档：https://kubernetes.io/docs/home

## 客户端配置

* 在 bash 中设置自动补全；需先安装 bash-completion 包
```
source <(kubectl completion bash)
```

* 查看 Kubernetes 配置
```
kubectl config view
```

* 通过 jsonpath 查看特定配置项
```
kubectl config view -o jsonpath='{.users[?(@.name == "k8s")].user.password}'
```

* 为 `foo.kuberntes.com` 设置凭据
```
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword
```

* 设置当前命名空间
```
kubectl config set-context --current --namespace=namespace_name
```

## 查看、查找资源

* 列出命名空间中的所有服务
```
kubectl get services
```

* 以宽格式列出所有命名空间中的所有 Pod
```
kubectl get pods -o wide --all-namespaces
```

* 以 json（或 yaml）格式列出所有 Pod
```
kubectl get pods -o json
```

* 查看资源详情（node、pod、svc）
```
kubectl describe nodes my-node
```

* 按名称列出服务
```
kubectl get services --sort-by=.metadata.name
```

* 按重启次数列出 Pod
```
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'
```

* 对 frontend-v1 进行滚动更新
```
kubectl rolling-update frontend-v1 -f frontend-v2.json
```

* 将名为 'foo' 的副本集扩缩容至 3 个
```
kubectl scale --replicas=3 rs/foo
```

* 将 "foo.yaml" 中指定的资源扩缩容至 3 个
```
kubectl scale --replicas=3 -f foo.yaml
```

* 在每个 Pod / 副本中执行命令
```
for i in 0 1; do kubectl exec foo-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html'; done
```

## 管理资源

* 获取 Pod 或服务的文档说明
```
kubectl explain pods,svc
```

* 创建资源（如 Pod、服务或守护进程集）
```
kubectl create -f ./my-manifest.yaml
```

* 对资源应用配置
```
kubectl apply -f ./my-manifest.yaml
```

* 启动单个 Nginx 实例
```
kubectl run nginx --image=nginx
```

* 创建包含多个键的 Secret
```
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
 name: mysecret
type: Opaque
data:
 password: $(echo "s33msi4" | base64)
 username: $(echo "jane"| base64)
EOF
```

* 删除资源
```
kubectl delete -f ./my-manifest.yaml
```

## 监控与日志

* 从 GitHub 仓库部署 Heapster
```
kubectl create -f deploy/kube-config/standalone/
```

* 显示节点指标
```
kubectl top node
```

* 显示 Pod 指标
```
kubectl top pod
```

* 显示指定 Pod 及其容器的指标
```
kubectl top pod pod_name --containers
```

* 导出 Pod 日志（stdout）
```
kubectl logs pod_name
```

* 流式查看 Pod 容器日志（stdout，多容器场景）
```
kubectl logs -f pod_name -c my-container
```

## 与运行中的 Pod 交互

* 在 Pod 中执行命令
```
kubectl exec pod_name -- command_name
```

* 在多容器的 Pod 中执行命令
```
kubectl exec pod_name -c container_name -- command_name
```

* 获取 Pod 的终端
```
kubectl exec -it pod_name /bin/sh
```

* 获取多容器 Pod 中某个容器的终端
```
kubectl exec -it pod_name -c container_name /bin/sh
```

### 致谢

https://raw.githubusercontent.com/LeCoupa/awesome-cheatsheets/refs/heads/master/tools/kubernetes.md
