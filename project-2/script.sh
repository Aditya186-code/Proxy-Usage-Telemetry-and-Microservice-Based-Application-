#!/bin/bash
set -e

# 1️⃣ Namespace
kubectl apply -f namespace.yaml

# 2️⃣ ConfigMaps and Secrets
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f init-sql-configmap.yaml

# 3️⃣ PersistentVolumeClaims
kubectl apply -f postgres-pvc.yaml
kubectl apply -f redis-pvc.yaml

# 4️⃣ Databases
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
kubectl apply -f db-init-job.yaml

# 5️⃣ Backend Services
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
kubectl apply -f worker-deployment.yaml
kubectl apply -f worker-service.yaml

# 6️⃣ Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# 7️⃣ Ingress
kubectl apply -f ingress.yaml

# 8️⃣ Horizontal Pod Autoscalers
kubectl apply -f api-hpa.yaml
kubectl apply -f worker-hpa.yaml
kubectl apply -f frontend-hpa.yaml

echo "✅ All resources applied successfully!"
